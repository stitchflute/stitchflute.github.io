## MonetDB安装和简单使用
### 安装（Ubuntu）
按照官网的安装步骤执行即可：https://www.monetdb.org/downloads/deb/
1. 创建文件/etc/apt/sources.list.d/monetdb.list并添加下面的内容：
    ```perl
	deb https://dev.monetdb.org/downloads/deb/ suite monetdb
    deb-src https://dev.monetdb.org/downloads/deb/ suite monetdb
	```
   其中suite需要替换成相应的系统版本号，可执行命令`lsb_release -cs`获得
2. 执行下面命令来安装
    ```perl
	wget --output-document=- https://www.monetdb.org/downloads/MonetDB-GPG-KEY | sudo apt-key add -
    sudo apt update
    sudo apt install monetdb5-sql monetdb-client
    ```
3. 启动
    ```perl
    sudo systemctl enable monetdbd
    sudo systemctl start monetdbd
    ```
4. 执行下面的命令来允许任何用户都可以使用monetdb
    ```perl
    sudo usermod -a -G monetdb $USER
    ```
    需要log out并重新登录才能生效
	
### 简单使用
```perl
monetdbd create /path/to/mydbfarm # 创建dbfarm
monetdbd start /path/to/mydbfarm # 这里如果出现port 50000 already in use的情况，只需修改下端口号（monetdbd set port=50001 /path/to/mydbfarm）再重新start即可
monetdb create voc # 创建数据库
monetdb release voc # 解锁数据库
mclient -u monetdb -d voc # 连接数据库
```