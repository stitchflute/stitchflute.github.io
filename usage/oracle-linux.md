### Linux上再装一个oraclelinux

1. 使用ultraISO制作启动盘：

    1. 打开iso文件
    2. 启动->写入磁盘映像

2. 若有空余的盘，使用空余的盘，否则将已有盘的分区重设

    ```shell
    sudo parted /dev/sdb
    ```

    不要创建分区，而是将多余空间留出来，假如sdb有4T的空间，可以创建一个0-3T的分区来存储系统，剩下的1T留出来用来装另一个系统。
	
    注意分区更新之后需要更新/etc/fstab文件中的信息，该文件会在系统启动的时候自动挂载相应的分区，需要确保正确，否则重启之后会无法启动，进入emergency mode
    
	若进入emergency mode则将/etc/fstab中有问题的磁盘的相关内容删掉，再systemctl reboot即可

3. 分区分配好之后，重启进入bios，从U盘启动，选择install oracle linux

    1. 若启动过程中出现dracut init queue的错误，需要在启动时install oracle linux选项上按e修改信息
        - 将init.stage2=hd:Label..........修改为init.stage2=hd:/dev/sdd4 nomodeset quiet，然后ctrl+x启动，这里的/dev/sdd4是U盘挂载的位置，需要预先确认好

    2. 然后启动安装，中间可以自己配置根目录，也可以选择自动
    3. 安装完成重启即可
	
#### 参考资料
1. [解决dracut-initqueue timeout问题](https://blog.csdn.net/qq_40907977/article/details/103137452 "解决dracut-initqueue timeout问题")
2. [parted命令使用](https://www.cnblogs.com/wholj/p/10924129.html "parted命令使用")