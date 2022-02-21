1. 新建一个数据库命令: 
```
$ sudo -u postgresql psql;
postgresql=# create user stitch with createdb createrole createuser login;
postgresql=# ALTER ROLE stitch WITH SUPERUSER;
postgresql=# create database hashtest owner stitch;
postgresql=# \q
```
2. copy(\\copy)脚本编写时最好不要换行。
3. 上一条不再需要，使用copy出现permission denied问题方案：将要读写的文件夹赋予postgres用户读写的权利，具体命令为： 进入root用户执行：`chown -R postgres:postgres /home/fg/test/`
4. 上一条若有问题，则把文件夹权限改为777。