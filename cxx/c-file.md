1. fopen(), fread(), fwrite()(stdio.h) 一般用于读写二进制文件
	`FILE * fopen ( const char * filename, const char * mode );`
	filename为文件名，mode包含"r","w","a"分别表示只读，只写，只追加，若后面加上"+"，则表示可读写。
	`size_t fread ( void * ptr, size_t size, size_t count, FILE * stream );`
	`size_t fwrite ( const void * ptr, size_t size, size_t count, FILE * stream );`
	ptr指向读或者写的内存指针，size为每个数据的大小，如sizeof(int)，count为数据的数量，stream为文件指针
	`int fseek(FILE *stream, long int offset, int whence);`
	参数 whence 为下列其中一种:
    + SEEK_SET 文件的开头移动offset。
    + SEEK_CUR 以目前的读写位置往后增加offset。
    + SEEK_END 文件的末尾移动offset。 当whence值为SEEK_CUR或SEEK_END时, 参数offset允许负值的出现.  
	当调用成功时则返回0, 若有错误则返回-1, errno会存放错误代码.
	附加说明：fseek()不像lseek()会返回读写位置, 因此必须使用ftell()来取得目前读写的位置.
	将读写位置移动到文件开头：fseek(fp, 0, SEEK_SET);
	将读写位置移动到文件尾时：fseek(fp, 0, SEEK_END);
	将读写位置动到离文件开头100字节处：fseek(fp,100L, SEEK_SET);
	将读写指针移动到离文件当前位置100字节处：fseek(fp,100L, SEEK_CUR);
	将读写指针退回到离文件结尾100字节处：fseek(fp, -100L, SEEK_END);
	`void rewind ( FILE * stream );`
	读写位置重置到文件开头
	`int fflush ( FILE * stream );`
	fflush有时候很有用
	
2. freopen()(stdio.h)
	`FILE * freopen ( const char * filename, const char * mode, FILE * stream );`
	实现重定向，把预定义的标准流文件定向到由filename指定的文件中。标准流文件具体是指stdin、stdout和stderr。其中stdin是标准输入流，默认为键盘；stdout是标准输出流，默认为屏幕；stderr是标准错误流，一般把屏幕设为默认，例如：
	```
	freopen("debug\\in.txt","r",stdin); //输入重定向，输入数据将从in.txt文件中读取 
	freopen("debug\\out.txt","w",stdout); //输出重定向，输出数据将保存在out.txt文件中
	while(scanf("%d %d",&a,&b)!=EOF) 
	printf("%d\n",a+b);
	```
	scanf从in.txt读取输入，printf输出会写到out.txt中去。
3. open()(sys/types.h, sys/stat.h, fcntl.h)是最底层的调用
	`int open(const char * pathname, int flags);`
	`int open(const char * pathname, int flags, mode_t mode);`
	read(), write()头文件为(unistd.h)
	`ssize_t read(int fd, void * buf, size_t count);`
	read()会把参数fd 所指的文件传送count个字节到buf指针所指的内存中。若参数count为0，则read()不会有作用并返回0。返回值为实际读取到的字节数，如果返回0，表示已到达文件尾或是无可读取的数据，此外**文件读写位置会随读取到的字节移动**。当有错误发生时则返回-1，错误代码存入errno中，而文件读写位置则无法预期。
	`ssize_t write (int fd, const void * buf, size_t count);`
	write()会把参数buf所指的内存写入count个字节到参数fd所指的文件内。当然，**文件读写位置也会随之移动**。如果顺利write()会返回实际写入的字节数。当有错误发生时则返回-1，错误代码存入errno中。
	`off_t lseek(int fd, off_t offset, int whence);` 头文件(sys/types.h，unistd.h)
	欲将读写位置移到文件开头时:lseek(int fildes, 0, SEEK_SET);
	欲将读写位置移到文件尾时:lseek(int fildes, 0, SEEK_END);
	想要取得目前文件位置时:lseek(int fildes, 0, SEEK_CUR);
	当调用成功时则返回目前的读写位置, 也就是距离文件开头多少个字节。 若有错误则返回-1, errno会存放错误代码。
	
4. printf
	`int fprintf ( FILE * stream, const char * format, ... );` 头文件(stdio.h)
	数据按指定格式写入到文本文件中。例如：
	```
	fprintf(stdout, "%d %f %x \n", j, k, i);
	fprintf (pFile, "Name %d [%-10.10s]\n",n+1,name);
	```
	这里%-10s中的-10表示位宽为10个字符，不够用空格补齐，多于10则剪掉，用于对齐，加-为左对齐，不加为右对齐，后面的.10不懂啥意思。
	`int sprintf ( char * str, const char * format, ... );`
	和上面类似，只不过sprintf是格式化到str指向的字符串。返回值为写入str的字节数，结束字符'\0'不计入内。
	`int snprintf ( char * s, size_t n, const char * format, ... );`
	同sprintf，只不过最多写n个字节。注意这里的n是包括'\0'的，上面sprintf也类似，即会在字符串最后添加'\0'，因此在编程的时候注意分配空间是否需要加1，保证不会出现内存泄漏的问题。返回值为写入str的字节数，包括结束字符'\0'。
	另外还有vprintf(), vfprintf(), vsprintf(), vsnprintf()，他们是相应函数的更底层的实现。
5. scanf
	`int fscanf ( FILE * stream, const char * format, ... );`
	和scanf类似，只不过fscanf是从文件中读取输入。注意：[]表示只读取中括号内的字符，[^]表示不读取中括号内的字符，值得注意的是%[^]s将不会跳过前面的空白符。%20s表示最多读取20个字符。
	`int sscanf ( const char * s, const char * format, ...);`
	从字符串读取输入。
6. get
	`char * fgets ( char * str, int num, FILE * stream );`
	从文件中读取一行内容到str指向的字符串中，遇到换行符或者读取num-1个字符时，或者到达文件尾时停止。每次读取成功返回对应的字符串str，失败或者到文件尾返回NULL。
	`char * gets ( char * str );`
	和fgets不同，gets从stdin中读取字符，遇到换行符或者EOF终止符停止，读取到的字符存储到str中，最后会加上'\0'，和scanf不同的是，scanf遇到空格，制表符，换行符，EOF就会停止读取，gets会一直读取。但是最好使用fgets读取，因为fgets可以限制最多读取的字符数，而gets不行，因此需要保证str指向的内存足够大，很容易出错。
	另外还有fgetc(), getchar, fputc(), putchar()这里就不总结了。