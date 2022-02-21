1. ldbc datagen生成数据时出现不合理的内存的访问例外，可以尝试Hadoop版本2.6，然后jdk版本不要用太高。
2. ldbc datagen生成数据时停止不动可能的原因：没有联网，参数文件设置错误，似乎注释不是用#号，然后等待时间稍稍长一点点，因为一开始的过程可能比较慢。
3. ssh（所里电脑）无法打开teamviewer解决方法： 
```ps -aux | grep teamviewer
teamviewer -daemon stop
teamviewer -daemon start
teamviewer -info print id
teamviewer --passwd mypasswd
```
即先停止再重新启动。
4. 报错说missing parameter只需在对应配置文件.properties加上对应参数即可。无法连接上数据库可能是配置文件中的账户和密码不对。