1. 一台公网服务器（阿里云等）和一台内网服务器。
2. 下载frp程序，地址：[frps程序](https://github.com/fatedier/frp/releases)。 然后分别上传到公网服务器和内网服务器
3. 公网服务器配置：解压软件包进入目录，编辑frps.ini文件，最简单配置如下： 
```perl
 # frps.ini
[common]
bind_port = 7000
```
启动frps：`./frps -c ./frps.ini`

4. 内网服务器配置：修改frpc.ini（注意是frpc.ini不是frps.ini）如下： 
```perl
# frpc.ini
[common]
server_addr = x.x.x.x //公网服务器ip
server_port = 7000
[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
```
启动：`./frpc -c ./frpc.ini`（注意文件名不要错）

5. 公网服务器设置frps服务自启动：`sudo vim /lib/systemd/system/frps.service` 然后输入如下内容：
```perl
[Unit]
Description=fraps service
After=network.target syslog.target
Wants=network.target
[Service]
Type=simple
#启动服务的命令（此处写你的frps的实际安装目录）
ExecStart=/your/path/frps -c /your/path/frps.ini
[Install]
WantedBy=multi-user.target
  ```
 然后就启动frps：`sudo systemctl start frps`然后打开自启动：`sudo systemctl enable frps`然后还可重启，停止，查看状态。具体可百度frp后台启动。
6. 连接：`ssh -oPort=xxxx xxx@公网ip`
7. vscode免密码所示连接: 任意地方打开git bash，若是没有执行过`ssh-keygen`命令则执行，一路回车就行，然后执行 `ssh-copy-id -i /c/Users/fugan/.ssh/id_rsa.hub -oPort=xxx xxxx@ip `即可。
8. 可能出现的问题:
	- 内网服务器frpc连接失败：可能是公网服务器端口没有在安全规则里面（阿里云可以去控制台添加）或者可能是内网服务器没有连上外网或者可能是命令的文件名不对，自己检查一下
	- 更换机器后，出现`[ssh] start error: proxy name [ssh] is already in use`错误，只需修改frpc.ini中的ssh为其他名字即可。