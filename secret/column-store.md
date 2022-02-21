列式存储调研-更新
1. 出发点
- NDB支持列式存储，对数据进行压缩，节约存储成本；
- NDB高效支持AP型的query。
2. 任务
调研业界TP+AP的系统，了解其原理，存储，架构等内容，思考是否能借鉴其思想，将其移植到NDB中来。
主要调研系统包括：
- ClickHouse
- TiFlash for TiDB
- CSTORE for TXSQL
- AnalyticDB/SqlServer使用行列混存，也可以作为一个参考
3. 主要内容
3.1 压缩方法
ColumnStore默认使用snappy压缩，ClickHouse默认使用lz4压缩，压缩比lz4和snappy相当，但是解压缩速率lz4更好，此外，数据有序的情况下，lz4压缩比更高。ClickHouse还支持ZSTD压缩，该方法压缩率相比于lz4更高，但是解压缩速度较慢。
3.2 ColumnStore
MariaDB下的分布式开源列式存储引擎，每列一个文件[1,2]
参考ByteNDB for MySQL引入列存引擎的一些思考
- Partitions 用来实际存储一列。在 MariaDB ColumnStore 中，Partition 是多个 Segment 组成的逻辑概念，默认1个 Partition 有4个 Sement。
- Segment 是实际的存储文件，每个 Segment 包含一定数量的 Extents，默认是2个。
- Extent 是8388608个列数据的集合。每个 Extent由Blocks 组成。
- Block 存储8Kbytes 数据，是实际磁盘 I/O 的最小单位。
ColumnStore会维护Extent Map，记录每个extent的最大最小值，从而优化查询效率。
3.2 ClickHouse
3.2.1 概述 
ClickHouse是一款开源列式存储分析型数据库，支持极致的数据存储压缩率和查询性能[3, 6, 7]。
支持分布式和并行查询，使用向量化计算引擎。
支持建立主键索引以及二级索引。
支持备份和恢复。
不支持事务。
3.2.2 ClickHouse的MergeTree引擎
ClickHouse拥有多种表引擎类型，在这众多的表引擎中，MergeTree是比较有代表性的引擎之一，被广泛使用。MergeTree采用列式存储，类似LSM Tree的架构组织数据。导入数据不经过WAL，数据导入时被划分为多个Part，每个Part对应一个目录。Part中包含各个列的数据，每个列都有独立的文件。后台会调度合并任务，将多个小的Part合并成更大的Part，类似LSM Tree的合并过程。 Part中包含几类文件：
4. 数据文件（.bin），每一列的数据都分别存储在数据文件，一般以主键排序。数据文件中划分为若干个Block，Block是列存文件的压缩单元，BlockSize在64KB～1MB之间，可设置。每个Block又会包含若干个索引Granularity，每个Granule默认包含8192条数据，用于索引定位。
5. 索引文件（.idx），索引文件又分为主键索引和二级索引：
  - MergeTree的主键索引与传统数据库的主键索引有所不同，MergeTree的主键索引只负责排序，但是不会去重。主键索引文件中，存储的是每一个Granularity中起始行的主键值，可以在扫描过程中过滤部分Granularity。
  - MergeTree的二级索引文件中可以存储Granularity的minmax、set、bloom_filter、ngrambf_v1等信息。其中minmax类似ColumnStore的Extent Map结构。
6. Mark文件（.mrk），由于索引文件是对Granularity进行索引，类似于逻辑索引。Mark文件记录Granularity在数据文件中的物理偏移，类似于将逻辑索引转换成物理索引。

- ClickHouse可以指定分区键将数据分区存储。
- 对于单条插入的数据，会进行缓存，超过时间或者数据量后再发送给MergeTree引擎。
- ClickHouse目前已支持有限的UPDATE和DELETE，Experimental Window Functions。
- MergeTree对于批量导入支持较好，对OLTP级事务更新仅有限支持。MergeTree存储引擎对数据实时可见要求非常高的场景是不太友好的。

3.2.3 ClickHouse的查询
查询的时候，首先根据分区键排除不相关的分区，然后根据主键索引得到一个和过滤条件相关的MarkRange。MarkRange可能包含多个Granule，然后去扫描对应的Granule。
对于非主键索引，则根据相应的二级索引（minmax）过滤掉不符条件的数据块，然后在符合条件的块中进行扫描。
对于多列的数据扫描，采用多线程技术来执行。
3.3 TiDB的列式存储引擎TiFlash
3.3.1 TiDB HTAP的特点
下图是TiDB的HTAP架构，包含两种存储节点TiKV和TiFlash。TiKV为行式存储，TiFlash为列式存储。TiFlash通过raft协议从TiKV节点实时同步数据，拥有毫秒级别的延迟，以及非常优秀的数据分析性能。它支持实时同步TiKV 的数据更新，以及支持在线 DDL。TiDB把TiFlash作为Raft Learner融合进TiDB的raft体系，将两种节点整合在一个数据库集群中，上层统一通过TiDB节点查询，使得TiDB成为一款真正的 HTAP 数据库。

TiFlash优势在于：[8]
7. 基于可更新列式存储Delta Tree设计，在提供高速更新能力的同时，提供高效的批量读取性能；
8. 配合基于ClickHouse的极致向量化计算引擎，更少的废指令，SIMD加速；
9. TiFlash无缝融入整个TiDB的Multi-Raft体系，通过Raft Learner进行数据复制，通过这种方式TiFlash的稳定性并不会对TiKV产生影响，例如 TiFlash 节点宕机或者网络延迟，TiKV 仍然可以继续运行无碍且不会因此产生抖动。与此同时，该复制协议允许在读时进行极轻量的校对以确保数据一致性。另外，TiFlash可以与TiKV一样的方式进行在线扩容缩容，且能自动容错以及负载均衡；
10. 由于TiFlash的列存复制设计，用户可以选择单独使用与 TiKV 不同的另一组节点存放列存数据，可以强制使用行存或者列存，也可由TiDB智能选择使用行存或者列存。
3.3.2 Delta Tree存储引擎
TiFlash的列式存储引擎Delta Tree参考了B+ Tree和LSM Tree的设计思想。Delta Tree将数据按照主键划分为Range分区，每个分区称为Segment。Segment通过B+ Tree作为索引。也就是说，B+ Tree索引的叶子节点为Segment。每一个Segment的数据大约在150万行左右。Segment支持Split，Merge
在Segment内部采用类似LSM Tree的分层存储方式，不过采用固定两层的LSM Tree，分别为Delta层和Stable层。Delta层保存增量数据部分，其中，新写入的数据写入Delta Cache中，与LSM Tree的MemTable类似。当Delta Cache写满后，其中的数据刷入Delta层的Pack（每一个Pack通常包含8K行或者以上的数据，Pack也是IO单位和索引过滤单位）中，类似LSM Tree的L0层。Stable层类似于LSM Tree的L1层，其中的数据以主键和版本号排序。Delta层的Pack和Stable层需要做全量合并，得到新的Stable层数据。当Segment中的数据量超过阈值，就会做类似B+ Tree叶子节点的分裂操作，分裂成两个Segment。同时，如果相邻的Segment中的数据量都比较小，也会将相邻的Segment合并成一个Segment。


Delta Layer和Stable Layer在磁盘的存储方式并不一致，前者使用PageStorage (PS)存储，后者使用DTFile存储（详见[10])。
Delta Tree通过Segment分区，Delta Index，批量copy Stable Layer层的数据的方式可以减少读放大，加速读查询。
TiFlash面向OLAP场景，支持OLTP场景下的更新操作，可以采用TiDB的Raft Log作为WAL日志回放出事务更新操作；同时，也支持批量数据写入。与TiKV一样，TiFlash采用MVCC实现事务隔离，TiFlash中的数据包含版本号字段作为事务的时间戳。
3.3 TXSQL 列式存储引擎CSTORE
3.3.1 CSTORE架构

如上图所示，CSTORE是TXSQL为了支持分析型场景而推出的一个列式存储引擎。通过CSTORE，用户可以完成大型数据的查询与分析，可以适用于历史存档数据、日志数据、大数据、更新不频繁的OLTP数据和数据仓库和分析处理，数据处理量达到PB级别。
3.3.2 CSTORE设计的一些细节
- 列式存储，每列一个文件，同一列数据分为多个Data Group，Data Group包含固定的行，每一个Data Group满了之后，进行压缩存储。
- CSTORE为每列的数据建立了稀疏索引，索引云信息可能包括每个Data Group中的最大值、最小值、SUM值、空值个数、NULL个数、记录条数等。
- CSTORE采用晚期物化查询，将物化操作尽量推后，中间结果采用位图表示命中的记录，从而解决了大数据量下查询的内存消耗问题。
目前的设计是将INNODB作为主机，CSTORE作为备机。CSTORE通过MySQL的主从复制接入，通过采用基于生产者/消费者模型、多线程技术、数据合并技术等，将主备延时极大降低。
3.4 AnalyticDB
AnalyticDB存储层采用Lambda架构，数据分为基线数据和增量数据两部分。基线数据中包含索引和数据两部分，增量数据中不包含索引。基线数据采用行列混存的结构，意图兼具行存和列存的优势。具体来说，对于每张表，每k行的数据组成一个Row Group。Row Group中的数据连续存放在磁盘中。整个Row Group中，又将数据按照列（聚集列）分别顺序存放。AnalyticDB会对每列构建一份元数据，用于维护列数据的统计信息（包括Cardinality、Sum和Min/Max等）、字典数据（采用字典编码）以及物理映射等。AnalyticDB默认会对每一列数据建立索引，索引中的Key是列的值，Value是值出现的所有行号集合，采用后台异步构建模式。由于增量数据部分没有索引，随着数据的不断实时写入，增量数据的查询性能会越来越慢。AnalyticDB采用后台任务来合并基线数据和增量数据形成一个新的基线数据，并基于新的基线数据构建全量索引。

AnalyticDB支持实时的Insert、Update和Delete操作。Delete操作采用逻辑删除的方式，使用bitset标记被删除的数据行，在后台的合并任务中会把被逻辑删除的数据做真正的物理删除操作。Update操作被转换为Delete + Insert操作。AnalyticDB采用MVCC多版本控制实现事务隔离，当数据发生Delete或者Update时，AnalyticDB会产生一个新版本的bitset，此时正在运行的查询可以继续使用老版本的bitset，不会被写入阻塞。
3.5 SqlServer
SQL Server从SQL Server 2012开始涉及AP场景，当初只是提供了Read-Only Columnstore Index。从SQL Server 2016开始，SQL Server引入了三方面的改进，本文主要分析基于In-memory OLTP Hekaton的列存索引这一个方面。在SQL Server Hekaton中，列存是作为行存的索引存在，也就是说可以针对行存中的部分列做列存索引。因此，在做OLTP行存事务处理时，数据也会实时同步更新到列存中。对于列存索引，也是分为增量部分和基线部分。数据插入列存时，首先进入增量部分，后台会根据数据的冷热程度（数据更新的频繁程度），将冷数据合并到基线部分，而热数据会留在增量部分。基线部分数据采用行列混合存储形式，每个Row Group作为一个压缩单元，Row Group内是列式存储。数据在从增量部分合并到基线部分时会分配RowID，通过RowID可以做基线数据的逻辑删除操作。

与Hekaton的行存使用相同的日志实时做事务处理，使用MVCC实现事务隔离。
4 不同系统的优劣势分析
通用列式存储：数据支持分区存储，每列一个文件，按照最小IO单位压缩存储，在每列上记录元信息，记录每个最小块的min, max, sum等信息，加速查询以及方便聚合操作。
System
存储
索引
数据更新
压缩
ColumnStore
通用列式存储
记录每列元信息
支持事务和批量导入
snappy压缩，压缩比6-10倍
ClickHouse
MergeTree存储引擎，分层结构，可以按照主键排序存储
主键索引+二级索引，主键记录每个最小块等起始值，非主键记录最大最小值
支持有限的update/delete，支持批量导入
lz4压缩和zstd压缩，压缩比10倍左右
TiFlash
分区称为segments，segment类似B+树组织，segment内部使用Delta Tree存储引擎，两层结构
主键索引
支持事务，批量导入
通用压缩，具体压缩方法未知
CSTORE
通用列式存储
记录每列元信息
支持事务，批量导入
通用压缩，具体压缩方法未知，压缩比9倍左右
ADB/SqlServer
行列混存，固定数量行存在一起，内部按列存储
记录元信息
支持事务
具体压缩方法未知


System
Advantages
Disadvantages
ColumnStore
兼容mysql，支持较完整的增删查改操作，压缩率在6-10倍左右。
查询性能一般（但远远优于mysql）。
ClickHouse
较好的查询性能和较高的压缩率，向量化计算，查询性能相比于 ColumnStore可达到10倍左右的提升，压缩比可达10倍左右，支持主键索引和二级索引。
不支持事务，暂不支持Windows Functions，支持类似SQL的join，但性能较差。

TiFlash
较好的查询和实时更新性能，查询性能相比于ColumnStore有数倍的提升。智能的行列存选择。支持TiDB事务。
为TiDB服务，不兼容mysql，写入依赖于TiKV，不能直接写入，复制有延迟。压缩率未知。暂未开源。

CSTORE
主从异步复制延时很低。较高的压缩率，压缩率在9倍左右。兼容mysql。
未开源。查询性能一般。
ADB/SqlServer
行列混存，兼具行存和列存的优势
行列混存，仍然有额外的IO开销，AP性能无法和纯列存相比

5 NDB+列存
目前来看，若要在NDB上增加列存的支持，移植ColumnStore是较为简单的，因为他很大程度上兼容mysql的API，虽然他的性能可能无法和其他列存系统相比。
ClickHouse的查询性能和压缩比均比较高，但是要移植到NDB可能会很困难，因为他有自己的一套实现，和mysql不兼容。
此外，列存引擎如何添加到NDB中也有两种方式，一种直接将数据保存在列存中，另外一种是类似主从复制的思想，数据先加载到主节点，然后复制到列存从节点。查询时根据情况选择是从行存还是列存去取数据。
目前的想法是：可以先试一试ColumnStore，之后如果可能的话，或许可以在ColumbStore里面增加一些优化，比如借鉴ClickHouse的MergeTree思想或者TiFlash的DeltaTree思想，向量化计算，或者使用其他的压缩算法等等。
附：参考资料
[1] ColumnStore Storage Architecture
[2] ByteNDB for MySQL引入列存引擎的一些思考 
[3] ClickHouse特性
[4] ClickHouse changelog
[5] ClickHouse Window Functions
[6] ClickHouse内核分析-MergeTree的存储结构和查询加速
[7] MergeTree原理解析
[8] TiDB HTAP的特点
[9] TiFlash架构与原理
[10] TiDB 的列式存储引擎是如何实现的
[11] TiFlash benchmark
[12] CDB for MySQL 8.0列存引擎CSTORE介绍
[13]TXSQL(TencentDB for MySQL) 8.0特性介绍
[14] DataBase · 引擎特性 · OLAP/HTAP列式存储引擎概述
