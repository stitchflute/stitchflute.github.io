## 概述

**指标**：

- **稳定**：如果a原本在b前面，而a=b时，排序之后a仍然在b的前面。

- **不稳定**：如果a原本在b的前面，而a=b时，排序之后a可能出现在b的后面。

- **内排序**：所有排序操作都在内存中完成。

- **外排序**：通常是由于数据太大，不能同时存放在内存中，根据排序过程的需要而在外存与内存之间 数据传输才能进行。

- **时间复杂度**：时间频度，一个算法执行所耗费的时间。算法中通常用数据比较次数与数据移动次数 进行衡量。

- **空间复杂度**：算法执行所需要的内存大小。

    

**总结**（多想一想）

|                          | 时间复杂度 | 空间复杂度 | 稳定性 | 备注 |
| ------------------------ | ---------- | ---------- | ------ | ---- |
| [冒泡排序](#1.冒泡排序) | $O(n^2)$   | $O(1)$     | 稳定   |      |
| [插入排序](#2.插入排序)  | $O(n^2)$   | $O(1)$     | 稳定   |      |
| [希尔排序](#3.希尔排序)  | $O(nlogn)$ | $O(1)$     | 不稳定 |      |
| [选择排序](#4.选择排序)      | $O(n^2)$   | $O(1)$     | 不稳定 |      |
| [快速排序](#5.快速排序)    | $O(nlogn)$ | $O(1)$     | 不稳定 |      |
| [归并排序](#6.归并排序)    | $O(nlogn)$ | $O(n)$     | 稳定   |      |
| [堆排序](#7.堆排序)         | $O(nlogn)$ | $O(1)$     | 不稳定 |      |
| [计数排序](#8.计数排序)      | $O(n+k)$   | $O(k)$     | 稳定   |      |
| [桶排序](#9.桶排序)         | $O(n+k)$   | $O(n+k)$   | 稳定   |      |
| [基数排序](#10.基数排序)     | $O(n*d)$   | $O(n+R)$   | 稳定   |      |



## 1.冒泡排序

比较简单，每次将最大（或最小）的冒到最右边，见代码：

```cpp
void bubbleSort(vector<int>& a){
    int n = a.size();
    for(int i = 0; i < n; ++i){
        for(int j = 0; j < n-i-1; ++j){
            if(a[j] > a[j+1])
                swap(a[j], a[j+1]);
        }
    }
}
```

优化1：可设置标志位，当某次排序没有发生交换，说明已经有序，直接结束排序过程。

```cpp
void bubbleSort(vector<int>& a){
    int n = a.size();
    for(int i = 0; i < n; ++i){
        bool exchange = false;
        for(int j = 0; j < n-i-1; ++j){
            if(a[j] > a[j+1]){
                swap(a[j], a[j+1]);
            	exchange = true;
            }
        }
        if(!exchange) return; // no exchange, ended
    }
}
```

优化2：可记录每次排序最后交换的位置pos，说明pos后的数据已经有序，下次仅需扫描到pos位置即可。

```cpp
void bubbleSort(vector<int>& a){
    int n = a.size();
    int pos = n-1;
    for(int i = 0; i < n; ++i){
        int curr_pos = 0;
        for(int j = 0; j < pos; ++j){
            if(a[j] > a[j+1]){
                curr_pos = j;
                swap(a[j], a[j+1]);
            }
        }
        if(curr_pos == 0) return; // no exchange, ended
        pos = curr_pos;
    }
}
```

冒泡排序毕竟是一种效率低下的排序方法，在数据规模很小时，可以采用。数据规模比较大时，建议采用其它排序方法。

## 2.插入排序

比较简单，模拟插入的过程，假设数组最开始没有元素，不断插入，插入时从右向左找到第一个大于该元素的位置，见代码：

```cpp
void insertSort(vector<int>& a){
    int n = a.size();
    for(int i = 0; i < n; ++i){
        int tmp = a[i];
        int j = i-1;
        while(j >= 0 && tmp < a[j])
            a[j+1] = a[j--];
        a[j+1] = tmp;
    }
}
```

优化：查找插入位置时采用二分查找，可减少比较次数：

```cpp
void insertSort(vector<int>& a){
    int n = a.size();
    for(int i = 0; i < n; ++i){
        int l = 0, r = i;
        int tmp = a[i];
        while(l < r){
            int m = l+(r-l)/2;
            if(tmp < a[m])
                r--;
            else
                l++;
        }
        for(int j = i; j > l; --j)
            a[j] = a[j-1];
        a[l] = tmp;
    }
}
```

插入排序不适合对于数据量比较大的排序应用。但是，如果需要排序的数据量很小，例如，量级小于千，那么插入排序还是一个不错的选择。尤其当数据基本有序时，采用插入排序可以明显减少数据交换和数据移动次数，进而提升排序效率。 在STL的sort算法和stdlib的qsort算法中，都将插入排序作为快速排序的补充，用于少量元素的排序。

## 3.希尔排序

将带排元素分成若干子序列（由相隔某个增量的元素组成的）分布进行直接插入排序，然后缩减增量再排序，待整个序列中元素基本有序（增量足够小）时，再对全体元素进行一次直接插入排序。增量是递减的，并且所有增量不能有除1外的公因子。代码如下：

```cpp
void shellSort(vector<int>& a){
    int n = a.size();
    for(int gap = n/2; gap >= 1; gap/=2){
        for(int i = gap; i < n; ++i){ //注意这个for循环，这里是多次分组重复执行
            int tmp = a[i];
            int j = i - gap;
            while(j >= 0 && tmp < a[j]){
                a[j+gap] = a[j];
                j -= gap;
            }
            a[j+gap] = tmp;
        }
    }
}
```

## 4.选择排序

在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。然后从剩余未排序元素中继续寻找最小（大）元素，放到已排序序列的末尾，重复该操作直至结束。

```cpp
void selectSort(vector<int>& a){
    int n = a.size();
    for(int i = 0; i < n; ++i){
        int min = i;
        for(int j = i+1; j < n; ++j)
            if(a[j] < a[min])
                min = j;
        swap(a[min], a[i]);
    }
}
```

和插入排序不同的是插入排序是通过不断交换相邻元素到将最大值移到右侧，而选择排序仅仅是比较。不稳定例子：(7) 2 5 9 3 4 [7] 1



## 5.快速排序

从序列中选择一个数（pivot），然后扫描数组，所有比他小的放在一侧，比他大的放在另一侧，然后递归的对左右两侧执行同样的步骤。

```cpp
// int partition(vector<int>& a, int l, int r){
//     int tmp = a[l];
//     int left = l;
//  	while(l < r){
//         while (l < r && a[r] >= tmp) r--;
//   		while(l < r && a[l] <= tmp) l++;
//         swap(a[l], a[r]);
// 	}
//     swap(a[left], a[l]);
//     return l;
// }

int partition(vector<int>& a, int l, int r){
	int tmp = a[l];
	int j = l;
	for(int i = l; i <= r; ++i){
        if(a[i] < tmp){
            j++;
            swap(a[i], a[j]);
        }
    }
 	swap(a[l], a[j]);
	return j;
}

void quickSortRecursive(vector<int>& a, int l, int r){
	if(l >= r)
        return;
	int m = partition(a, l ,r);
 	quickSortRecursive(a, l, m-1);
 	quickSortRecursive(a, m+1, r);
}
void quickSort(vector<int>& a){
    quickSortRecursive(a, 0, a.size()-1);
}
```

for循环版本和while循环版本的区别：

优化：选取pivot不是选第一个，而是选择前三个中间的那个，减少左右端点为极端值的情况。

```cpp
int partition(vector<int>& a, int l, int r){
	if(r - l >= 2){
		if(a[l] > a[l+1])
   			swap(a[l], a[l+1]);
  		if(a[l] > a[l+2])
   			swap(a[l], a[l+2]);
  		if(a[l+1] > a[l+2])
   			swap(a[l+1], a[l+2]);
  		swap(a[l], a[l+1]);
 	} 
 	int tmp = a[l];
 	int left = l;
 	while(l < r){
        while(l < r && a[r] >= tmp) r--;
  		while(l < r && a[l] < tmp) l++;
  		swap(a[l], a[r]);
	}
 	swap(a[left], a[l]);
 	return l;
}
```

用的最为广泛，标准库一般用的就是快速排序，但是经过优化。

## 6.归并排序

分治法，将一个子序列划分为两个子序列，对两个子序列分别排序，然后进行合并。

```cpp
void merge(vector<int>& a, vector<int>& tmp, int l, int m, int r){
 	int i =l, j = m+1, k = l;
 	while(i <= m && j <= r){
  		if(a[i] < a[j]) 
            tmp[k++] = a[i++];
        else
            tmp[k++] = a[j++];
 	}
 	while(i <= m)
  		tmp[k++] = a[i++];
 	while(j <= r)
  		tmp[k++] = a[j++];
 	for(int i = l; i <=r; ++i)
        a[i] = tmp[i];
}

void mergeSortRecursive(vector<int>& a, vector<int>& tmp, int l, int r){
 	if(l >= r)
        return;
  	int m = l + (r-l)/2;
  	mergeSortRecursive(a, tmp, l, m);
  	mergeSortRecursive(a, tmp, m+1, r);
  	merge(a, tmp, l, m, r);
}

void mergeSort(vector<int>& a){
    vector<int> tmp(a.size());
 	mergeSortRecursive(a, tmp, 0, a.size()-1);
}
```

需要额外的内存空间。

## 7.堆排序

堆：完全二叉树，子节点总是小于（或者大于）其父节点的值。

利用最大最小堆进行排序，首先构建一个最大堆，然后不断将最大的元素保存在当前序列的最右侧，代码如下：

```cpp
void adjustDown(vector<int>& a, int parent, int n){
    int child = 2 * parent + 1;
    while(child < n){
        if(child+1 < n && a[child] < a[child+1])
            child++;
        if(a[parent] >= a[child])
            break;
        swap(a[child], a[parent]);
        parent = child;
        child = 2 * parent + 1;
    }
}
void heapSort(vector<int>& a){
    int n = a.size();
    // build heap
    for(int i = (n-2)/2; i >= 0; --i)
        adjustDown(a, i, n);
    // sort
    for(int i = n-1; i >= 0; --i){
        swap(a[0], a[i]);
        adjustDown(a, 0, i);
    }
}
```

堆排序也是一种选择排序，即树形选择排序，只不过直接选择排序中，为了从R[1…n]中选择最大记录，需比较n-1次，然后从R[1…n-2]中选择最大记录需比较n-2次。事实上这n-2次比较中有很多已经在前面的n-1次比较中已经做过，而树形选择排序恰好利用树形的特点保存了部分前面的比较结果，因此可以减少比较次数。对于n个关键字序列，最坏情况下每个节点需比较log2(n)次，因此其最坏情况下时间复杂度为nlogn。

## 8.计数排序

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。用来计数的数组C的长度取决于待排序数组中数据的范围（等于待排序数组的最大值与最小值的差加上1）。

找到最大最小值，声明一个额外的数组，并计数，然后输出计数数组即可。

```cpp
void countSort(vector<int>& a){
    int n = a.size();
    int min_val = a[0], max_val = a[0];
    for(int i = 0; i < n; ++i){
        if(a[i] < min_val) min_val = a[i];
        if(a[i] > max_val) max_val = a[i];
    }
    int num = max_val - min_val + 1;
    vector<int> count(num, 0);
    // count
    for(int i = 0; i < n; ++i)
        count[a[i]-min_val]++;
    int k = 0;
    // output
    for(int i = 0; i < num; ++i){
        for(int j = 0; j < count[i]; j++)
            a[k++] = i + min_val;
    }
}
```

时间复杂度：$O(n+k)$，k是指数据的范围在0-k之间。

## 9.桶排序

原理是将数组分到有限数量的桶里。每个桶再个别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排序），最后依次把各个桶中的记录列出来记得到有序序列。桶排序是鸽巢排序的一种归纳结果。当要被排序的数组内的数值是均匀分配的时候，桶排序使用线性时间（O(n)）。但桶排序并不是比较排序，他不受到O(n log n)下限的影响。

```cpp
void bucketSort(vector<int>& a){
    int n = a.size();
    int min_val = a[0], max_val = a[0];
    for(int i = 0; i < n; ++i){
        if(a[i] < min_val) min_val = a[i];
        if(a[i] > max_val) max_val = a[i];
    }
    int num = (max_val-min_val)/n + 1;
    vector<vector<int>> bucket(num, vector<int>()); //可以使用链表
    // distribute data to buckets
    for(int i = 0; i < n; ++i){
        int index = (a[i] - min_val)/n;
        bucket[index].push_back(a[i]);
    }
    // sort each bucket
    for(int i = 0; i < num; ++i){
        insertSort(bucket[i]);
    }
    // output data
    int k = 0;
    for(int i = 0; i < num; ++i){
        for(int j = 0; j < bucket[i].size(); ++j)
            a[k++] = bucket[i][j];
    }
}

```

时间复杂度最好是$O(n+k)$，最坏是$O(n^2)$，平均是$O(n+k)$。

## 10.基数排序

原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。基数排序的方式可以采用LSD（Least significant digital）或MSD（Most significant digital），LSD的排序方式由键值的最右边开始，而MSD则相反，由键值的最左边开始。

```cpp
int maxBit(vector<int>& a){
    int n = a.size();
    int max_val = a[0];
    for(int i = 0; i < n; ++i){
        if(a[i] > max_val) max_val = a[i];
    }
    int d = 1;
    while((max_val/=RADIX))
        d++;
    return d;
}

void radixSort(vector<int>& a){
    int n = a.size();
    int R = maxBit(a);
    vector<int> count(10, 0); // 计数器
    vector<int> tmp(n);
    int radix = 1;
    for(int d = 1; d <= R; ++d){
        // 计数器清0
        for(int i = 0; i < 10; ++i)
            count[i] = 0;
        // 计数
        for(int i = 0; i < n; ++i){
            int idx = (a[i]/radix) % 10;
            count[idx]++;
        }
        for(int i = 1; i < 10; ++i){
            count[i] = count[i-1] + count[i];
        }
        // 注意这里必须得从右往左遍历，因为每次写每个桶里面的数据是从右往左写的
        // 例如：若从左往右遍历，假设第一轮排完序后数为51 33 36，第二轮结束后为36 33 51，出错，因为会将33写到更右的位置。
        for(int i = n-1; i >= 0; --i){
            int idx = (a[i]/radix) % 10;
            tmp[count[idx]-1] = a[i];
            count[idx]--;
        }
        for(int i = 0; i < n; ++i){
            a[i] = tmp[i];
        }
        radix *= 10;
    }
}
```

基数排序与计数排序、桶排序这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：

- 基数排序：根据键值的每位数字来分配桶；
- 计数排序：每个桶只存储单一键值；
- 桶排序：每个桶存储一定范围的数值；

基数排序不是直接根据元素整体的大小进行元素比较，而是将原始列表元素分成多个部分，对每一部分按一定的规则进行排序，进而形成最终的有序列表。