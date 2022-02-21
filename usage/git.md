1. 删除未跟踪的文件：
```perl
git clean -df #返回到某个节点，（未跟踪文件的删除）
git clean 参数
		-n 不实际删除，只是进行演练，展示将要进行的操作，有哪些文件将要被删除。（可先使用该命令参数，然后再决定是否执行）
		-f 删除文件
		-i 显示将要删除的文件
		-d 递归删除目录及文件（未跟踪的）
		-q 仅显示错误，成功删除的文件不显示
```
2. 回退：
```perl
git reset --hard 回退到上一次提交的位置，所有已修改的内容会丢失
git reset --hard HASH
git reset --hard HEAD       (going back to HEAD)
git reset --hard HEAD^      (going back to the commit before HEAD)
git reset --hard HEAD~1     (equivalent to "^")
git reset --hard HEAD~2     (going back two commits before HEAD)
git stash #把所有没有提交的修改暂存到stash里面。可用git stash pop回复。
```

3. 合并：
冲突信息：
```
HEAD
本分支
<===
别人的分支
new_ephemeral
```
将master分支合并到自己的分支：`git merge master`