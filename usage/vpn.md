使用shadowsocks：
1. vultr服务器： 购买ssh连接后修改root的密码
2. 服务器安装shadowsocks： 
```perl
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh 
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```
3. (要使用ipv6需要将ss配置文件(一般位于/etc/shadowsocks-python/目录下)中的server(0.0.0.0)一行修改为::，然后重启服务器或者重启ss)
4. 然后客户端(可在github下载)连接即可

详参考：[轻松在 VPS 搭建 Shadowsocks 翻墙](https://www.diycode.cc/topics/738)或者使用v2ray： 
1. 服务器安装v2ray：
```perl
wget -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/V2ray.Fun/master/install.sh 
bash install.sh（github搜索V2ray.Fun）
```
2. 浏览器输入服务器ip:port如111.111.111.111:1234，可进入配置页
3. 客户端下载V2rayN: [v2rayN](https://github.com/2dust/v2rayN/releases)然后连接即可

详参考：[V2RayN简单使用教程](https://blog.sharkyzh.cn/post/50d46b4d.html)遇到的问题： 
1. 电脑ipv6无网络访问权限：打开 https://support.microsoft.com/en-us/kb/929852下载工具【Re-enable IPv6 on nontunnel interfaces and on IPv6 tunnel interfaces】，然后win+R输入regedit展开注册表HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services；删除Tcpip6、TCPIP6TUNNEL ；然后运行下载的工具，重启电脑即可。(详见：[ipv6无网络访问权限](https://answers.microsoft.com/en-us/windows/forum/windows_10-networking/ipv6-no-network-access-windows-10-1703/748a5c80-cca1-4332-90bc-0c7211e16121) 或者 [ipv6无网络访问权限](http://www.w10zj.com/Win10xy/Win10xf_4156.html))
2. 如何判断服务器ip是否被封：打开 [ip测试](https://tools.ipip.net/ping.php)，输入ip并选择中国和香港，然后点击ping查看结果。参考：[判断ip是否被封](https://www.vultrcn.com/4.html)
3. linux系统用shadowsocks连接VPS失败的话可能是设置中network->Network Proxy设置为自动了，改为手动就ok了。(**Http Proxy:** 8080 **Socks Host:** 127.0.0.1:1080 **Ignore Hosts:** localhost, 127.0.0.0/8, ::1)