MySQL日志学习
注：本文档仅用于个人学习
1 概述
 redo log记录了对实际数据文件的物理变更(数据文件的什么位置数据做了如何的变更)，InnoDB也是采用了WAL(日志优先落盘)，也就是说在实际数据文件的修改落盘之前redo日志已经落盘，从而来保证事务的持久性。Undo日志用来保证事务的原子性和MVCC，所有的undo操作产生的数据文件的变更也会记录到redo日志中。
2 Redo log结构
redo Log以顺序的方式写入文件，当全部文件写满的时候则回到第一个文件相应的起始位置进行覆盖写（但在做redo checkpoint时，也会更新第一个日志文件的头部checkpoint标记，所以严格来讲也不算顺序写），在InnoDB内部，逻辑上Redo Log被看作一个文件，对应一个space id (InnoDB通过space的概念来组织物理存储，包括不同的表，数据字典，redo，undo等)。

尽管Redo Log有多个文件，但每个文件的组成结构是一样的，只是有一些数据只会存在第一个Log文件(ib_logfile0)的文件头中, 例如Buffer Pool flush checkpoint信息只会写在第一个log文件的文件头中。

redo log的总的写入量叫LSN（Log Secquence Numer）日志序列号，这个redo log变更实际写入到实际数据文件中的数量叫checkpoint LSN，表示的是有多少变更已经实际写入到了相应的数据文件中。 一旦数据库崩溃InnoDB开始恢复数据的时候，先读取checkpoint，然后从checkpoint所指示的LSN读取其之后的Redo日志进行数据恢复，从而减少Crash Recovery的时间。
checkpoint信息只是存储在第一个log文件头中。同时我们看到日志头中有2个checkpoint block域。InnoDB是采用2个checkpoint了轮流写的方式来保证checkpoint的安全（并不是一次写2份checkpoint, 而是轮流写）即使某次checkpoint block写失败了，那么崩溃恢复的时候从上一次记录的checkpoint点开始恢复也能正确的恢复数据库事务。
2.1  Checkpoint 结构
Checkpoint block储存概览：


各字段含义：
- Checkpoint Number: 可以理解为checkpoint域写盘的次数，每次写盘递增1，同时这个值取模2可以实现2个checkpoint域轮流写。
- Checkpoint LSN: 该字段标示小于这个Checkpoint LSN的日志记录都已经写入到了实际的数据文件中，Crash Recovery系统从Checkpoint LSN之后的第一个MTR记录开始进行数据恢复。
- Checkpoint Offset: Checkpoint LSN对应在Log files中的文件偏移量，这个用来对LSN和Offset之间转换进行校准。
- Buf Size: MySQL系统内只对该字段执行了写入，并为进行读取然后进行相应的处理。它标识的是系统当前Log buffer的大小。
- Left Bytes: 目前没有任何含义，仅仅是用来填充占位，以便让这个block达到512字节大小。但在这里最后4个字节用来存放该checkpoint域的Checksum。
2.2 Log Block的存储格式
Log Block的存储格式：


各字段含义：
- Log Block Number: Log Block的编号，从1开始递增，达到最大值(0x3FFFFFFF+1)后再继续从1开始。
- Data length: 写入到当前block的字节数，包含头部12字节的大小。
- First Record offset: 本Block内第一个mtr记录的起始偏移量。
- Log Block Checkpoint number: 该block所处在的checkpoint no。
- Log Records: 一个block内可以存储多条mtr记录，同样一个mtr记录可以跨越多个block。
每产生一个mtr记录就将其append到log buffer中去，当log buffer落盘的时候会获取固定大小的数据写入到block的数据域。当然，如果buffer中剩余的数据不足以填满一个block的数据域，也会将其写入到一个新的block中，不足的数据自动补齐，block header中的data length字段会指出有效数据的数量。
2.3 MTR
MTR即Mini-transaction的缩写，字面意思小事务，相对逻辑事务而言，我们把它称作物理事务。属于InnoDB存储引擎的底层模块。主要用于锁和日志信息。InnoDB内部的上层模块会将事务操作转换成若干的MTR物理事务。
每一个MTR操作会产生一条Redo Record, 下一小节我们会介绍一下Redo 记录的格式。
用一句通俗的话来讲，一条Redo记录表示的是对哪个数据文件(space id)的哪一页(page)的页内某个偏移量(offset)位置做了什么改变(value)。下图是一条MTR记录的通用格式：


各字段含义：
- Type: MTR记录的类型
- Space ID: 该MTR记录修改了哪个数据文件
- Page Number:  该MTR记录修改了哪一页
- Record Payload: 根据Type的不同，Payload内容格式也不相同，大小也不相同
以Type为MLOG_COMP_REC_INSERT大致的存储结构为例，Payload格式为：


具体有那些Type可以参考 mtr0types.h 这个头文件。
3 log_sys子系统线程模型
MySQL 8.0里面，redo log是无锁全异步设计，其流程架构图如下所示：


如上图所示，redo log的异步工作线程为4个，分别是：log_writer, log_flusher, log_flush_notifier, log_write_notifier。log_flush_notifier/log_write_notifier为图中log notifier线程组，另2个异步辅助线程log_checkpointer,log_close。
- log_writer：负责将日志从log buffer写入磁盘，并推进write_lsn(原子数据)
- log_flusher：负责fsync，并推进flushed_to_disk_lsn(原子数据)
- log_write_notifier：监听write_lsn，唤醒等待log落盘的用户线程（根据flush_log_at_trx_commit设置，用户commit操作会等待write_lsn推进）（flush_log_at_trx_commit取值参考innodb_flush_log_at_trx_commit和sync_binlog参数详解）
- log_flush_notifier：监听flushed_to_disk_lsn，唤醒等待log fsync的用户线程。
- log_closer：
  - 在正常退出时清理所有redo_log相关lsn\log buffer相关数据结构；
  - 定期清理recent_closer的过老数据（recent_closer所用之后详述）
- log_checkpointer：定期做checkpoint检查，根据flush list刷dirty page情况推进check point，释放log buffer等
注：log_writer是将log buffer写到os的page cache，log flusher调用fsync将os cache中内容写到disk。与数据脏页的刷新无关，数据脏页的刷盘由buffer pool的后台线程处理。
4 DB Engine日志子模块架构变化
关于Data layers的变化：
- 和 LogStore/PageStore 对接后，Log files 没有了，REDO日志通过调用 LogStore 提供的接口写入到远程存储池；
关于Background redo log threads的变化：
- Log flusher 和 Log flush_notifier 这2个线程没有了。
  - REDO日志写入到LogStore后，LogStore组件的内部线程自己会去做flush工作，所以不需要再搞一个 Log flusher 线程；
  - 推进 flushed_to_disk_lsn 并通知用户线程的工作在LogStore提供的异步callback函数内完成，所以不再需要 Log flush_notifier 线程；
- Log checkpointer 线程没有了，因为检查点工作卸载到存储层（PageStore）了。
5 关于FLUSH LISTS
先简单了解一下 [6]，为了管理buffer pool，每个buffer pool instance 使用如下几个链表来管理：
- LRU链表包含所有读入内存的数据页；
- Flush_list包含被修改过的脏页；
- unzip_LRU包含所有解压页；
- Free list上存放当前空闲的block。
另外为了避免查询数据页时扫描LRU，还为每个buffer pool instance维护了一个page hash，通过space id 和page no可以直接找到对应的page。
Buffer pool中的page被修改后，不是立刻写入磁盘，而是由后台线程Page Cleaner定时写入，和大多数数据库系统一样，脏页的写盘遵循日志先行WAL原则，因此在每个block上都记录了一个最近被修改时的lsn，写数据页时需要确保当前写入日志文件的redo不低于这个lsn。
在ByteNDB的语境下，没有了刷脏页，也没有了检查点推进，看起来没有了保留FLUSH LISTS的必要性，但是：
- 尽管Page Cleaner线程不再需要将脏页写入磁盘，但仍然需要将遵循脏页的日志先行WAL原则，以及将脏页标记为干净，方便缓冲区淘汰；
- 去掉FLUSH LISTS意味着Page Cleaner后台线程也没有存在的必要，缓冲区的页面淘汰机制需要进行对应改造；
综合考虑，NDB设计认为去掉FLUSH LISTS代价较大（相对保留而言），但收益不明显，所以暂时先不去掉。
6 关于ShutDown
实例关闭分为两种，一种是正常shutdown（非fast shutdown），实例重启时无需apply日志，另外一种是异常shutdown，包括实例crash以及fast shutdown。
当正常shutdown实例时，会将所有的脏页都刷到磁盘，并做一次完全同步的checkpoint；同时将最后的lsn写到系统表ibdata的第一个page中（函数fil_write_flushed_lsn）。在重启时，可以根据该lsn来判断这是不是一次正常的shutdown，如果不是就需要去做崩溃恢复逻辑。
我的疑惑 
Log buffer是什么？一条条redo log record
Write Ahead Buffer又是什么？
  - 防止出现小IO造成的read on write（写入某个page需要先读再写，多一次IO）问题，小IO时，后面填充0，然后写入，这样page已经在cache中，后续修改不需要IO。
关于空洞：
全局sn，根据sn为每一个mtr在log buffer中预留位置，所以不会相互干扰，但是因为并行插入有快有慢，所以导致空洞。
Recent_Written/Closed 里面是什么？？？([5]写的最清楚)
  - 循环数组，下表为lsn，数组内容为lsn长度，lsn全局递增，不同线程并发写的时候可能造成空洞，lsnM = tail（），因此用这两个结构来表示lsnM之前已经全部写到log buffer（脏页已经全部添加到flush list中去）。用于推进write_lsn和flush_to_disk_lsn。
  - Log buffer允许空洞，written来保证iblogfile的完整写入。
  - closed为了安全的进行checkpoint，选择所有Buffer Pool的flush_list中最旧的一个lsn, 减去recent_closed的长度，可以确认是一个安全的checkpoint_lsn。
lsn和sn的区别为是否根据OS_FILE_LOG_BLOCK_SIZE(512字节)对齐。
附：参考资料
[1] InnoDB内核技术分享之日志子系统 
[2] MySQL · 特性分析 · 8.0 对WAL的设计修改
[3] InnoDB 的 Redo Log 分析 - Leviathan
[4] ByteNDB DBEngine组件日志子模块设计 
[5] MySQL 8.0 Innodb 无锁化设计的日志系统
