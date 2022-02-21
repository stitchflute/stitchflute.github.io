## Linux使用
1. linux新建用户并设置密码：
```perl
$ adduser test --home=/home
$ passwd test
```
2. iptables: (参考：[iptables命令](https://www.jianshu.com/p/6994fbe833e7 "iptables命令"))
```perl
iptables -I INPUT -s 123.45.6.7 -j DROP       #屏蔽单个IP的命令
iptables -I INPUT -s 123.0.0.0/8 -j DROP      #封整个段即从123.0.0.1到123.255.255.254的命令
iptables -I INPUT -s 124.45.0.0/16 -j DROP    #封IP段即从123.45.0.1到123.45.255.254的命令
iptables -I INPUT -s 123.45.6.0/24 -j DROP    #封IP段即从123.45.6.1到123.45.6.254的命令是
iptables -D INPUT -s 123.45.6.7 -j DROP		#删除该条规则
```
3. 关于nohup：
/dev/null属于字符特殊文件，它属于空设备，是一个特殊的设备文件，它会丢弃一切写入其中的数据，写入它的内容都会永远丢失，而且没有任何可以读取的内容。它就像一个黑洞，我们一般会把/dev/null当成一个垃圾站，不要的东西丢进去。比如来清除文件中的内容。
Linux的重定向：
	- 0：表示标准输入；
	- 1：标准输出,在一般使用时，默认的是标准输出；
	- 2：表示错误信息输出。
	`./program >/dev/null 2>log`表示将program的错误信息输出到log文件，其他信息丢进/dev/null。
	`./program >/dev/null 2>&1`表示将program的错误信息重定向到标准输出，其他信息丢进/dev/null
4. ubuntu开机启动程序设置：search: Startup Applications然后添加即可
5. 编辑定时任务：`crontab -e`，命令格式为时间+命令
时间为：分 时 日 月 周，"*" 取值范围内的所有数字， "/" 每过多少个数字，"-" 从X到Z，","散列数字
	```perl
	* * * * * myCommand # 每1分钟执行一次myCommand
	3,15 * * * * myCommand # 每小时的第3和第15分钟执行
	3,15 8-11 * * * myCommand # 在上午8点到11点的第3和第15分钟执行
	3,15 8-11 */2  *  * myCommand # 每隔两天的上午8点到11点的第3和第15分钟执行
	30 21 * * * myCommand # 每晚的21:30执行
	0 */1 * * * myCommand # 每一小时执行
	0 23-7/1 * * * myCommand # 晚上11点到早上7点之间，每隔一小时执行
	```
6. 下面命令：
```perl
cat /etc/resolv.conf # 查看dns地址
ipconfig /all # windows可以查看dns地址
curl ifconfig.me # 查看公网ip
netstat -rn # 查看网关
sudo ln -s 原文件名(如gcc-7) 新文件名(如gcc) # 新建软链接，软连接和硬链接的区别在于，软链接新建了一个文件，而硬链接使用的是原来的文件只不过通过类似引用计数的方式来管理。
```

## Shell
1. “#!”是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行。
	`#!/bin/sh`
	`#!/usr/bin/python3`
	`#!/usr/bin/php`
2. 执行是直接用test.sh，linux系统会去PATH里寻找有没有叫test.sh的，所以写成test.sh是会找不到命令的，要用./test.sh告诉系统说，就在当前目录找。
3. 引用变量名加花括号是为了帮助解释器识别变量的边界，如${skill}Script，若不加花括号则会将skillScript当做一个变量。
4. 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的，单引号字串中不能出现单引号（对单引号使用转义符后也不行）。而双引号里可以有变量以及转义字符。
5. `[`实际上是一个可执行程序，在/usr/bin目录下：`/usr/bin/[`, 所以`[`前后需要加空格。
6. 文件包含可以用`source`或者`.`，可以引用其他shell文件。

## grep使用
1. 如下述所示：
```perl
grep dbpath -r ./
grep dbpath filename
history | grep ssh
cat filename | grep ^dbpath
find ./ -name log* | xargs rm -r # grep好像不能用\*, find好像可以
wc -l *.h # 统计代码行数
ls -l | grep time | awk '{printf %s , $column}' | xargs rm # rm 利用 ls -l, grep, awk 命令删除指定时间创建的文件或者目录，awk把文件逐行的读入，以空格为默认分隔符将每行切片
```
2. sed命令：`sed -i s/Person.id|Person.id/Person.id|friend.id/g 1.out`

## gcc升级：
1. 执行下述命令即可，强两步或许不需要。
```perl
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install gcc-7 g++-7
cd /usr/bin
ls |grep gcc
sudo ln -s gcc-7 gcc
sudo ln -s g++-7 g++
```