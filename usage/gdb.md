gdb本质是将一个将一个进程绑定为自己的子进程，然后接收操作系统或者用户的各种信号，可以读取该子进程的指令空间、数据空间、堆栈和寄存器的值，从而达到单步调试的效果。因此可以gdb直接执行程序，也可以用`gdb attach pid`将另外一个进程进行绑定，变为自己的子进程吗，这一般用于服务端程序调试。（[gdb底层原理](https://zhuanlan.zhihu.com/p/336922639 "gdb底层原理")）

1. core文件生成设置：
```perl
	sysctl -w "kernel.core_pattern=/home/fugang/core_files/core-%e-%p-%t" >/dev/null  
	# 修改/etc/sysctl.conf
	kernel.core_pattern = /home/fugang/core_files/core-%e-%p-%t
```
设置`ulimit -c unlimited`，可将该设置添加到/etc/profile中
以下是参数列表:
```perl
    %p - insert pid into filename 添加pid
    %u - insert current uid into filename 添加当前uid
    %g - insert current gid into filename 添加当前gid
    %s - insert signal that caused the coredump into the filename 添加导致产生core的信号
    %t - insert UNIX time that the coredump occurred into filename 添加core文件生成时的unix时间
    %h - insert hostname where the coredump happened into filename 添加主机名
    %e - insert coredumping executable name into filename 添加命令名
```

#### 参考资料
1. [gdb调试](https://www.cnblogs.com/arnoldlu/p/9633254.html#core_gdb)