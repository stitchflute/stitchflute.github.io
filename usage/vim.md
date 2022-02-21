1. 统计字符串个数：`%s/pattern//gn`
2. 替换字符串：
```perl
s/pattern/dest/ #替换当前行第一个pattern
s/pattern/dest/g #替换当前行所有的pattern
n,$s/pattern/dest/ #替换从第n开始到最后一行的每一行的第一个pattern
n,$s/pattern/dest/g #替换从第n开始到最后一行的每一行的所有pattern，n为数字，若n为'.'，则表示当前行开始到最后一行
%s/pattern/dest/ #替换每一行的第一个pattern
%s/pattern/dest/g #替换每一行的所有pattern
s替换成v表示对不匹配的每一行进行相应的操作
```
3. 移动到行末：shift+$ 行首：shift+^
4. 移动到匹配的括号：%
5. 精确跳到某一行：ngg或者nG
6. 向前/后翻页：`ctrl+f/b`
6. vimrc配置文件
	```perl
	source /etc/vim/vimrc
	" ************1. 基本配置************
	" 去掉有关vi一致性模式,避免操作习惯上的局限.
	set nocompatible
	" 设置背景颜色"
	set background=dark
	" 出错时，不要发出响声
	set noerrorbells
	" 出错时，视觉提示，通常是屏幕闪烁：
	set visualbell

	" 语法高亮
	syntax on

	" 在底部显示，当前处于命令模式还是插入模式
	set showmode

	" 右下角显示还没有输入完整的命令
	set showcmd

	" FIXME 在MS-DOS控制台打开vim时,控制台使用鼠标
	" 右键来复制粘贴,设置全鼠标模式,鼠标右键被映射为
	" visual mode,不能用来复制粘贴,不方便.但是如果不
	" 设置鼠标模式,会无法使用鼠标滚轮来滚动界面.经过验证,
	" 发现可以设成普通模式mouse=n来使用鼠标滚轮,也能使用
	" 鼠标右键复制粘贴. mouse=c/mouse=i模式都不能用鼠标
	" 滚轮. Linux下还是要设成 mouse=a
	set mouse=a

	" 启用256色。 
	set t_Co=256

	" 检测文件类型,并载入文件类型插件,
	" filetype plugin indent on

	" 为特定文件类型载入相关缩进文件
	filetype indent on

	" 使用 utf-8 编码
	" set encoding=utf-8  

	" ************2. 缩进************
	" 自动缩进.这个导致从外面拷贝多行以空格开头的内容时,
	" 会有多的缩进.
	set autoindent
	" 智能缩进
	set smartindent
	" 复制粘贴时保留原有的缩进
	set copyindent

	" 设置所有的Tab和缩进为4个空格"
	set tabstop=4
	" 自动缩进的空格数"
	set shiftwidth=4
	" 输入Tab字符时,自动替换成空格
	set expandtab
	" 设置softtabstop有一个好处是可以用Backspace键来一次
	" 删除4个空格. softtabstop的值为负数,会使用shiftwidth
	" 的值,两者保持一致,方便统一缩进.
	set softtabstop=-1

	" ************3. 外观************
	" 显示行号
	set number

	" 显示光标所在的当前行的行号，其他行都为相对于该行的相对行号
	set relativenumber

	" FIXME 在MS-DOS控制台打开vim,光标很小,不方便看到光标
	" 在哪里.下面设置cursorline,高亮光标所在的行.
	" cursorlineopt=number只高亮行号部分,不影响正文内容
	" 的显示. 在其他容易看到光标的终端上可以去掉这两个设置.
	set cursorline

	" 自动折行，即太长的行分成几行显示
	set wrap
	" 关闭自动折行
	" set nowrap

	" 换行显示时不把一个单词拆开，遇到指定的符号（比如空格，连词号和其他标点符号）才换行
	set linebreak
	" 指定折行处与编辑窗口的右边缘之间空出的字符数
	set wrapmargin=2

	" 光标移动到buffer的顶部和底部时保持5行距离"
	" set scrolloff=5

	" 1=启动显示状态行, 2=总是显示状态行, 0表示不显示.
	" 设置总是显示状态行,方便看到当前文件名.
	set laststatus=2

	" 右下角显示光标所在的行号和列号
	" set ruler
	" 设置状态行显示的内容.
	" %F: 显示当前文件的完整路径.
	" %r: 如果readonly,会显示[RO]
	" %B: 显示光标下字符的编码值,十六进制.
	" %l:光标所在的行号.
	" %v:光标所在的虚拟列号.
	" %P: 显示当前内容在整个文件中的百分比.
	" %H和%M是strftime()函数的参数,获取时间.
	set statusline=%F%r\ [HEX=%B][%l,%v,%P]\ %{strftime(\"%H:%M\")}

	" ************4. 搜索************

	" 显示匹配括号
	set showmatch
	" 高亮显示所有搜索到的内容.后面用map映射
	" 快捷键来方便关闭当前搜索的高亮
	set hlsearch
	" 光标立刻跳转到搜索到内容
	set incsearch
	" 搜索时忽略大小写
	set ignorecase
	" 如果同时打开了ignorecase，那么对于只有一个大写字母的搜索词，将大小写敏感；
	" 其他情况都是大小写不敏感。比如，搜索Test时，将不匹配test；搜索test时，将匹配Test。
	set smartcase

	" 打开英语单词的拼写检查
	" set spell spelllang=en_us

	" 当文件在外部被修改时，自动更新该文件"
	set autoread

	" 将tab键和多余的空格显示出来
	" set listchars=tab:»·,trail:·
	" set list

	" 在命令模式下，使用Tab键补全时,在状态栏显示匹配的列表,
	" 方便查看都有哪些命令符合补全条件.
	set wildmenu
	set wildmode=longest:list,full

	"共享剪切板"
	set clipboard+=unnamed


	" 重新打开文件时定位到上次关闭的光标处
	if has("autocmd")
	  au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
	endif

	```