（环境:轻量应用服务器，应用镜像）

1. 在数据库中备份文件，并下载；

2. 新服务器进入数据管理DMS->自建库，输入ip，端口，账户(root)，密码(提前获得的)，之后登录，记录出错信息中的ip，之后连接上服务器启动mysql(`sudo /usr/local/mysql/bin/mysql -uroot -p` 密码为提前获得的密码)，进入mysql后执行`GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'yourpassword' WITH GRANT OPTION;`(将其中的%换为刚刚记录的ip，然后password设为自己的想设的密码)，之后执行`FLUSH PRIVILEGES;` 刷新先前的修改，然后退出即可；(修改mysql登录密码: `set password for root@localhost = password('新密码');`）

3. 然后登录刚刚的自建库，导入之前备份的数据库文件；

4. 将备份中网站文件中的`wordpress`文件夹内容拷贝至新服务器中的WordPress文件夹下(应该是`htdocs/`)，并修改`wp-config.php`中的`db_name，user_name，password`。然后修改`/usr/etc/apache/conf/httpd.conf`中`www/htdocs/`下面的`AllowOverride None`为`AllowOverride ALL`然后保存退出，然后重启apache(`sudo /usr/local/apache/bin/apachectl restart`)；

5. 新服务器解析域名，然后浏览器打开ip/wp-login.php即可。

6. 如果不能上传多媒体文件，需要给wp-content/uploads权限: `chmod -R 777 uploads/`

参考[阿里服务器新建库操作过程](https://blog.csdn.net/weixin_40862011/article/details/86260700 "阿里服务器新建库操作过程")