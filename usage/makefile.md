1. makefile不要乱用tab，只有命令所在的行才能且只能以tab开头！
2. .d是链接依赖文件，可以直接打开查看。
3. make命令如果不指定目标，则默认为makefile中第一个目标。
4. 一些自动变量:
```perl
$<：第一个依赖文件
$@：目标
$^：所有不重复的依赖文件，以空格分开
```

5. 赋值：
	- "?=" 表示如果变量没被赋值过，则为其赋值
	- "+=" 表示为变量添加等号后面的值
	- "="与":="都是赋值操作，但二者有区别：
		- "="是说make命令会将整个Makefile展开后，再决定变量的值，即变量的值将会是整个makefile中最后被指定的值。
		- 而":="表示变量在赋值时就先设置为该值，而不是整个makefile展开后的最终值，后面如果再有赋值，则会将前面的赋值覆盖，使用新的值。
```perl
		x = a
		A := $(x)
		B = $(x)
		x = c
		最后A的值为a，B的值为c
```

6. -M选项说明：
```perl
	-M: 生成文件的依赖关系，同时也把一些标准库的头文件包含了进来。注意：该选项默认打开了 -E 选项， -E 参数的用处是使得编译器在预处理结束时就停止编译。
	-MM: 生成文件的依赖关系，和 -M 类似，但不包含标准库的头文件。
	-MF File: 当使用了 “-M” 或者 “-MM” 选项时，则把依赖关系写入名为 “File” 的文件中。若同时也使用了 “-MD” 或 “-MMD”，“-MF” 将覆写输出的依赖文件的名称。
	-MT: 在生成的依赖文件中，指定依赖规则中的目标。
```

7. 贴一份我的Makefile：
```perl
	######### Makefile COMMON ########
	CC = g++
	# c++标准
	CBASE = -std=c++11

	# 需要链接的库
	# LIBS += -lpapi
	LIBS += -mavx2
	# LIBS += -mavx512f

	# 生成的可执行文件名
	PROC = main
	# 源文件路径 空格 可以继续添如 src src1 src2
	SRC_DIR = ./src/hostr
	# c还是cpp
	SUFFIX = cpp

	# debug
	DBG_DIR = debug
	#.o文件存放路径
	DBG_OBJ_DIR = debug/obj
	#.d文件存放路径
	DBG_DEP_DIR = debug/dep

	#release
	REL_DIR = release
	#.o文件存放路径
	REL_OBJ_DIR = release/obj
	#.d文件存放路径
	REL_DEP_DIR = release/dep

	CPPFLAGS = $(CBASE) $(LIBS)
	# 预处理选项(要包含的.h文件的路径，如果有的话)
	INCLUDES = $(foreach dir, $(SRC_DIR), -I$(dir))
	CPPFLAGS += $(INCLUDES)
	# 链接库的路径(如果有的话)
	LDFLAGS = -L.
	LDFLAGS += $(CPPFLAGS)

	# 获取所有的源文件，这里只有.目录
	CPPS = $(foreach dir,$(SRC_DIR), $(wildcard $(dir)/*.$(SUFFIX)))

	# debug版本编译
	# 生成可执行文件路径
	DBG_PROC = $(DBG_DIR)/$(PROC)
	# 所有的.o文件
	DBG_OBJS = $(patsubst  %.$(SUFFIX), $(DBG_OBJ_DIR)/%.o, $(notdir $(CPPS)))
	# 所有的.d文件
	DBG_DEPS = $(patsubst  %.$(SUFFIX), $(DBG_DEP_DIR)/%.d, $(notdir $(CPPS)))
	# debug选项
	DBG_CFLAGS = -g -O0 -DDEBUG # -Wall

	# release版本编译
	# 生成可执行文件路径
	REL_PROC = $(REL_DIR)/$(PROC)
	# 所有的.o文件
	REL_OBJS = $(patsubst  %.$(SUFFIX), $(REL_OBJ_DIR)/%.o, $(notdir $(CPPS)))
	# 所有的.d文件
	REL_DEPS = $(patsubst  %.$(SUFFIX), $(REL_DEP_DIR)/%.d, $(notdir $(CPPS)))
	# release选项
	REL_CFLAGS = -O3 -DNDEBUG

	# Default build
	all: release

	ifeq "$(MAKECMDGOALS)" "debug"
	-include $(DBG_DEPS)
	else ifeq "$(MAKECMDGOALS)" "release"
	-include $(REL_DEPS)
	else ifeq "$(MAKECMDGOALS)" "all"
	-include $(REL_DEPS)
	else ifeq "$(MAKECMDGOALS)" ""
	-include $(REL_DEPS)
	endif

	ifeq ("$(wildcard $(DBG_DIR))", "")
	DEBUG_DIR_DEPS := build_debug_dir
	endif

	ifeq ("$(wildcard $(REL_DIR))", "")
	RELEASE_DIR_DEPS := build_release_dir
	endif

	#
	# Debug rules
	#
	debug: $(DBG_PROC)

	$(DBG_PROC): $(DBG_OBJS)
		$(CC) -o $@ $^

	$(DBG_OBJ_DIR)/%.o: $(SRC_DIR)/%.$(SUFFIX)
		$(CC) -c $(DBG_CFLAGS) $(LDFLAGS) $< -o $@

	$(DBG_DEP_DIR)/%.d: $(DEBUG_DIR_DEPS) $(SRC_DIR)/%.$(SUFFIX)
	# $(CC) -MM -MT $*.o -MF $@ $(DBGCFLAGS) $(LDFLAGS) $<
		$(CC) $(CPPFLAGS) $(DBG_CFLAGS) -MM $(filter %.$(SUFFIX),$^) -MT $(DBG_OBJ_DIR)/$*.o -MF $@

	#
	# Release rules
	#
	release: $(REL_PROC)
	$(REL_PROC): $(REL_OBJS)
		$(CC) -o $@ $^

	$(REL_OBJ_DIR)/%.o: $(SRC_DIR)/%.$(SUFFIX)
		$(CC) -c $(LDFLAGS) $(REL_CFLAGS) $< -o $@

	$(REL_DEP_DIR)/%.d: $(RELEASE_DIR_DEPS) $(SRC_DIR)/%.$(SUFFIX)
		$(CC) $(CPPFLAGS) $(REL_CFLAGS) -MM $(filter %.$(SUFFIX),$^) -MT $(REL_OBJ_DIR)/$*.o -MF $@

	build_debug_dir:
		mkdir -p $(DBG_OBJ_DIR) $(DBG_DEP_DIR)

	build_release_dir:
		mkdir -p $(REL_OBJ_DIR) $(REL_DEP_DIR)

	.PHONY: all clean debug release 

	clean:
		rm -f $(DBG_OBJS) $(REL_OBJS) $(DBG_DEPS) $(REL_DEPS) $(DBG_PROC) $(REL_PROC)
		rm -rf $(DBG_DIR) $(REL_DIR)
```

### 参考资料：
1. [GNU make命令](https://www.gnu.org/software/make/manual/make.html#Multiple-Targets "GNU make命令")
2. [gcc/g++ 参数详解](https://www.runoob.com/w3cnote/gcc-parameter-detail.html "gcc/g++ 参数详解")
3. [Makefile中include命令详解](https://blog.csdn.net/sunxiaopengsun/article/details/79119446 "Makefile中include命令详解")
4. [Makefile生成依赖文件](https://blog.csdn.net/QQ1452008/article/details/50855810 "Makefile生成依赖文件")