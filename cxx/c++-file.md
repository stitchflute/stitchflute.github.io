1. ifstream：常用方法
	```cpp
	ifstream in("test.txt");
    if (!in.is_open()){
		cout << "Error opening file";
		exit (1);
	}
	string str;
    while( getline(in,str)){
        cout << str << endl;
    }
	```
	或者
	```cpp
	char buffer[256];
	while((!in.eof()){
        in.getline (buffer,100);  // 读取最多99个字符('\0')，保存在buffer中，读到换行符或者终止符。
		// in.getline (buffer,100, 'c');  // 相比于上面，多了个若读到字符c，也结束。
		cout << buffer << endl;
    }
	```
2. ofstream：常用方法
	```cpp
	ofstream out("test.txt");
    if (!out.is_open()){
		cout << "Error opening file";
		exit (1);
	}
	int i = 0;
    while(i < 100){
        cout<<"i = " << i << endl;
		i++;
    }
	```
3. c++读取二进制文件需要用到ifstream和ofstream的read和write方法，以后用到了再说吧。