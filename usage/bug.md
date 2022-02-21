1. 执行时出现`terminate called after throwing an instance of 'std::system_error'`，可能是因为编译时没有加-lpthread
2. papi 安装问题 Trouble adding PAPI_TOT_CYC。解决办法：执行下面的命令即可（命令的含义应该是可以让任何人访问性能计数器（Performance Counter））
```shell
sudo sh -c 'echo -1 >/proc/sys/kernel/perf_event_paranoid'
```