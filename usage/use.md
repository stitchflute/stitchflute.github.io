ssh免密登录：客户机执行:
```perl
ssh-keygen -t rsa
ssh-copy-id server@ip`
```
ssh服务器失败，需要删除key：`ssh-keygen -R +你的服务器端的ip地址`
若需要某台机器能够clone 项目，需要先将机器上的ssh key添加到gitlab上去

windows的ssh免密登录，将C:\Users\stitch\.ssh\id_rsa.pub中的内容复制到服务器上的.ssh/authorized_keys中即可


使用豆瓣源：`pip install -i https://pypi.doubanio.com/simple/ --trusted-host pypi.doubanio.com django`
末尾加上： `-i http://pypi.douban.com/simple/`

ctrl + ESC = win
win： Fn+F10
键盘背光：F10
ctrl+s:命令行暂停不能输入
ctrl+q(p):解除暂停
ctrl+z挂起后的任务可以通过终端输入fg回去
键盘insert键切换输入为覆盖模式
声明结构体指针后，若用bzero初始化需要先分配空间

知网账号：zky311053 密码：123456

进入WordPress后台：浏览器地址输入：`域名/wp-admin`


**连接gitlab:**
1. Using ssh tunnel on one terminal
`$ ssh -L 3128:localhost:3128 grape-out`
2. Set the http_proxy on the other terminal
`$ export http_proxy=http://localhost:3128`
3. Use firefox to visit gitlab
`$ firefox`
4. http://10.12.0.2/

**linux翻墙：**
安装ShadowSocks-Qt5
`sudo add-apt-repository ppa:hzwhuang/ss-qt5`
`cd /etc/apt/sources.list.d/`
`sudo vim hzwhuang-ubuntu-ss-qt5-bionic.list`(18.04需要修改bionic为xenial，后者为16.04版本号）
`sudo apt-get update`(若是出现release情况，则删除对应ppa文件即可如hzwhuang-ubuntu-ss-qt5-bionic.list)
`sudo apt-get install shadowsocks-qt5`
启动：
`ss-qt5`

网络设置->手动->Socks代理设置:127.0.0.1 端口号1080
无法同步google书签解决方法:
1、打开 chrome://flags/#account-consistency，把高亮的设置改为 disable，重启 Chrome
2、成功导入后可在将其设置为default**

**12306和ICT：**
	链接：[https://pan.baidu.com/s/19VLKYGkgSfOiXbyduKTCrA](https://pan.baidu.com/s/19VLKYGkgSfOiXbyduKTCrA)
	提取密码：tkva

**linux 设置静态ip以及虚拟机和主机互ping设置：**
(环境：ubuntu16.04, VirtualBox, ict内网(10.12.0.x)): 

1. 设置网络为NAT模式，修改全局设定中网络的网段和主机一样(管理->全局设定->网络 点击加号编辑并保存) 2. 修改/etc/network/interfaces文件：
	```
	# interfaces(5) file used by ifup(8) and ifdown(8)
	auto lo
	iface lo inet loopback
	
	auto enp0s3
	iface enp0s3 inet static
	address 10.12.0.207
	netmask 255.255.255.0
	gateway 10.12.0.254
	dns-nameserver 159.226.39.1
	dns-nameserver 127.0.0.1
	```

	这里要注意:address要和主机在同一网段，gateway和dns要确保正确，否则不能上网，修改前先看好(查看方法可参考[查看网关和dns地址](http://www.stitchvivion.com/%e5%b8%b8%e7%94%a8%e6%93%8d%e4%bd%9c/))

3. 重启网络服务:`sudo /etc/init.d/networking restart`
4. 然后重启虚拟机。 
5. 以上设置应该是已经修改了静态ip并且能上网，但主机无法ping通虚拟机，若需要，则设置网络为桥接模式即可（Windows设置端口转发即可）。 

注意：若不能ssh，则需要安装ssh server：`apt install openssh-server`

**github pages自定义域名：**

* 域名添加解析：

  * A记录，

  * ip地址选择下面的任意一个即可

    * 185.199.108.153

    - 185.199.109.153

    - 185.199.110.153

    - 185.199.111.153

- github pages设置里面的pages一栏添加自定义域名（example.com)，检查通过说明添加成功