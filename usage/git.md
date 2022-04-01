## Git使用

1. 删除未跟踪的文件：

   ```
   git clean -df #返回到某个节点，（未跟踪文件的删除）
   git clean 参数
   		-n 不实际删除，只是进行演练，展示将要进行的操作，有哪些文件将要被删除。（可先使用该命令参数，然后再决定是否执行）
   		-f 删除文件
   		-i 显示将要删除的文件
   		-d 递归删除目录及文件（未跟踪的）
   		-q 仅显示错误，成功删除的文件不显示
   ```

   

2. 回退：

   ```
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

4. 暂存代码（不进行add和commit操作）并切换到别的分支：

   ```
   git stash save "信息" 暂存当前分支
   切换到别的分支完成想做的工作再切换回当前分支
   git stash pop 回到最后暂存的分支
   git stash list 查看所有暂存版本信息
   git stash apply stash@{0} 回到指定暂存的分支
   ```

5. 查看历史代码：

   ```
   git show VERSION:path_to_file
   ```

6. git设置不需要输入用户名和密码：

   ```
   # .gitconfig
   [user]
       email = fugang15@mails.ucas.ac.cn
       name = fugang
   [credential]
       helper = store
   ```

7. git remove用法

   ```
   git remote -v
   git remote add name 仓库地址
   git remote rename old_name new_name
   git remote remove name
   ```

   

