1. 进入algorithm_note项目下，进入note目录，修改SUMMARY.md文件，然后根据SUMMARY.md中的文件结构修改或者添加相应的文件
2. 执行gitbook build命令
3. [可选] 提交algorithm_note项目的更新至github
	```
	git add .
	git commit -m "update `date` "
	git push origin gh-pages
	```
4. 将note/_book下的所有内容拷贝至stitchflute.github.io项目下
5. 进入stitchflute.github.io，提交更新至github
	```
	git add .
	git commit -m "update `date` "
	git push origin gh-pages
	```