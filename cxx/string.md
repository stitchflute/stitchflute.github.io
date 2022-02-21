1. C语言-头文件string.h
	`int strcmp ( const char * str1, const char * str2 );`
	相等返回0，str1\<str2返回负值，大于返回正值。
	`char * strcat ( char * dest, const char * src );`
	src字符串添加到dest的尾部，dest原来的'\0'会被替换掉，最后结尾会增加新的'\0'，注意src和的dest所指向的内存空间不能重叠，且dest要有足够的空间来存储字符串。
	`char * strcpy ( char * dest, const char * src );`
	将src指向字符串复制到dest，注意dest要有足够的空间，且内存空间不能重叠。复制遇到'\0'结束。'\0'也会复制。
	`char * strncpy（char * dest，const char * src，size_t count）;`
	将src指向字符串复制到dest，最多复制count个字符，注意count小于strlen(src)时，会直接复制count个字符到dest，不会在dest后面补'\0'，若大于strlen(src)，则会在后面补'\0'，直到写入count个字符为止，因此用这个时要确保正确。
	`char *strstr(const char *haystack, const char *needle)`
	该函数返回在haystack中第一次出现needle字符串的位置指针，如果未找到则返回NULL。
	```
	char *str1=strstr("1234xyz","34");
	printf("%s\n", str1);
	```
	上述代码打印的是34xyz。
	`size_t strspn(const char *str1, const char *str2)`
	该函数返回 str1 中第一个不在字符串 str2 中出现的字符下标。
	`size_t strcspn(const char *str1, const char *str2)`
	该函数返回 str1 开头连续都不含字符串 str2 中字符的字符数。
2. atoi(), strtol()等一系列函数的使用(stdlib.h)
	`long long int atoll ( const char * str );`
	`long long int strtoll (const char* str, char** endptr, int base);`
	strtol可以通过返回值判断是否转换正确，并且可以设置进制，似乎相对好一点。
3. C++之string类型：
	懒得弄了，放个链接吧：https://www.cplusplus.com/reference/string/string/