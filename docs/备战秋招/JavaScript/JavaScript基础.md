---
theme: channing-cyan
highlight: a11y-light
---
### JavaScript 数据类型
+ #### JS 数据类型有：数字（number）、字符串（string）、布尔（bool）、符号（symbol）、空（undefined）、空（null）、对象（object）、bigint。
+ #### JS 数据类型又可以分为两种
    + 基本数据类型：包括**Undefined、Null、Boolean、Number、String、Symbol、BigInt**七种基本数据类型。
    + 引用数据类型：**Object**。常见的有**对象、数组和函数**等。



### 基本数据类型和引用数据类型有什么区别？
#### 概念

+ 基本数据类型：简单的数据段，表示不能再细分下去的基本类型。
+ 引用数据类型：有多个值构成的对象。对象在逻辑上是属性的无序集合，是存放各种值的容器。对象值存储的是引用地址，所以和基本类型值不可变的特性不同，对象值是可变的。
#### 存放位置

+ 基本数据类型：原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；

+ 引用数据类型：引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；**引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。**



### 闭包

#### 概念

使用闭包主要是为了设计私有的方法和变量。闭包的优点是可以避免全局变量的污染，缺点是闭包会常
驻内存，会增大内存使用量，使用不当很容易造成内存泄露。在js中，函数即闭包，只有函数才会产生
作用域的概念。

#### 闭包特性：

1. 函数嵌套函数
2. 函数内部可以引用外部的参数和变量
3. 参数和变量不会被垃圾回收机制回收

#### 使用场景
+ 函数 curry 化



### js 垃圾回收机制

> 参考[这篇文章](https://juejin.cn/post/6981588276356317214)

#### 什么是垃圾回收机制？

> 垃圾回收机制也称为`GC`， 即 `Garbage Collection` ，程序工作过程中会产生很多 `垃圾`，这些垃圾是程序不用的内存或者是之前用过了，以后不会再用的内存空间，而 `GC` 就是负责回收垃圾的，因为他工作在引擎内部，所以对于我们前端来说，`GC` 过程是相对比较无感的，这一套引擎执行而对我们又相对无感的操作也就是常说的 `垃圾回收机制` 了
>
> 当然也不是所有语言都有 `GC`，一般的高级语言里面会自带 `GC`，比如 `Java、Python、JavaScript` 等，也有无 `GC` 的语言，比如 `C、C++` 等，那这种就需要我们程序员手动管理内存了，相对比较麻烦

#### 垃圾的产生

> 我们知道写代码时创建一个基本类型、对象、函数……都是需要占用内存的，但是我们并不关注这些，因为这是引擎为我们分配的，我们不需要显式手动的去分配内存。
>
> 我们知道 `JavaScript` 的引用数据类型是保存在堆内存中的，然后在栈内存中保存一个对堆内存中实际对象的引用，所以，`JavaScript` 中对引用数据类型的操作都是操作对象的引用而不是实际的对象。可以简单理解为，栈内存中保存了一个地址，这个地址和堆内存中的实际值是相关的。如果没有一个引用指向一个对象，那么这个对象也就成了“垃圾”。对于这些用不到但是还一直占用着内存的“垃圾”，要及时释放。
>
> 用官方一点的话说，程序的运行需要内存，只要程序提出要求，操作系统或者运行时就必须提供内存，那么对于持续运行的服务进程，必须要及时释放内存，否则，内存占用越来越高，轻则影响系统性能，重则就会导致进程崩溃。

#### 垃圾回收策略

在 JavaScript 内存管理中有一个概念叫做 `可达性`，就是那些以某种方式可访问或者说可用的值，它们被保证存储在内存中，反之不可访问则需回收

至于如何回收，其实就是怎样发现这些不可达的对象（垃圾）它并给予清理的问题， `JavaScript` 垃圾回收机制的原理说白了也就是定期找出那些不再用到的内存（变量），然后释放其内存

你可能还会好奇为什么不是实时的找出无用内存并释放呢？其实很简单，实时开销太大了

我们都可以 Get 到这之中的重点，那就是怎样找出所谓的垃圾？

这个流程就涉及到了一些算法策略，有很多种方式，我们简单介绍两个最常见的

+ 标记清除算法

  + 垃圾收集器在运行时会给内存中的所有变量都加上一个标记，假设内存中所有对象都是垃圾，全标记为0
  + 然后从各个根对象开始遍历，把不是垃圾的节点改成1
  + 清理所有标记为0的垃圾，销毁并回收它们所占用的内存空间
  + 最后，把所有内存中对象标记修改为0，等待下一轮垃圾回收

+ 引用计算算法

  + 当声明了一个变量并且将一个引用类型赋值给该变量的时候这个值的引用次数就为 1
  + 如果同一个值又被赋给另一个变量，那么引用数加 1
  + 如果该变量的值被其他的值覆盖了，则引用次数减 1
  + 当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，回收空间，垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的内存

  > 我靠。。。。那篇文章讲的太细太好了，先继续学吧，等消化了在自己总结

### 函数声明和函数表达式

1. 写法：
    +  函数声明：

    ```js
    function foo() { 
        alert( "foo" ); 
    }
    ```
    + 函数表达式：
    ```js
    const foo = function() { 
        alert( "foo" ); 
    }
    ```
    
2. 代表的含义：
   
    + 上面这两段示例代码的意思都是“创建一个名为`foo`的函数”（函数也是对象）。
    
3. 创建时机：
    + 函数声明：**解析器在向执行环境中加载数据时会率先读取函数声明，并使其在执行任何代码之前可用(可访问)，即函数声明提升。函数声明的另外一个特殊的功能是它们的块级作用域。严格模式下，当一个函数声明在一个代码块内时，它在该代码块内的任何位置都是可见的。但在代码块外不可见。**
    + 函数表达式：**在代码执行到表达式时被创建，被创建之前是调用不了的。**

    
    
    
    
### js 遍历数组有哪些方法

+  for 

  ```javascript
  for (let i = 0; i < arr.length; i++) {
  	// ......
  }
  ```

+ forEach（没有返回值，不改变原数组）

  ```javascript
  arr.forEach((item, index, array) => {
      // ......
  })
  ```

+ map（返回一个操作后新的数组，不改变原数组）

  ```javascript
  var arr = [12,23,24,42,1]; 
  var res = arr.map(function (item, index, array) { 
      return item * 10; 
  }) 
  console.log(res);//-->[120,230,240,420,10];  原数组拷贝了一份，并进行了修改
  console.log(ary);//-->[12,23,24,42,1]；  原数组并未发生变化
  ```

+ reduce (用法挺多，不改变原数组，返回操作结果)

  ```javascript
  let total = [0,1,2,3,4].reduce((a, b)=>a + b); //10
  ```

  类似的还有 reduceRight 方法，不同的是一个从左边开始操作，一个从右边开始操作

+ filter（返回一个数组中符合某些条件的元素，不改变原数组）

  ```javascript
  var arr = [73, 84, 56, 22, 100]
  var newArr = arr.filter(item => item > 80)   //得到新数组 [84, 100]
  console.log(newArr, arr)
  ```

+ every (如果数组中每个元素都符合条件，则返回 true)

  ```javascript
  var arr = [ 1, 2, 3, 4, 5, 6 ]; 
  console.log( arr.every( function( item, index, array ){ 
          return item > 3; 
      })); 
  // false
  ```

+ some (只要数组中存在一个以上的元素符合条件，则返回 true)

  ```javascript
  var arr = [ 1, 2, 3, 4, 5, 6 ]; 
     
  console.log( arr.some( function( item, index, array ){ 
    return item > 3; 
  })); 
  // true
  ```

+ find (返回数组中符合测试函数条件的第一个元素, 没有则返回undefined)

  ```javascript
  var stu = [
      {
          name: '张三',
          gender: '男',
          age: 20
      },
      {
          name: '王小毛',
          gender: '男',
          age: 20
      },
      {
          name: '李四',
          gender: '男',
          age: 20
      }
  ]
  stu.find((element) => (element.name == '李四'))
  //{name: "李四", gender: "男", age: 20}
  ```

  类似的还有 findIndex 方法，find 返回的是 value，findIndex 返回的是 key（数组下标）

+ keys (对键名遍历)、values (对键值遍历)，entries (对键值对遍历)，三个方法返回的都是一个遍历器对象

  ```javascript
  for (let index of ['a', 'b'].keys()) {
  	console.log(index);
  }
  // 0
  // 1
  for (let elem of ['a', 'b'].values()) {
  	console.log(elem);
  }
  // 'a'
  // 'b'
  for (let [index, elem] of ['a', 'b'].entries()) {
  	console.log(index, elem);
  }
  // 0 "a"
  // 1 "b"
  ```

  

# 一些比较重要的 API

### reduce
>reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，不包括数组中被删除或从未被赋值的元素，最终计算为一个值。reduce() 可以作为一个高阶函数，用于函数的 compose。**注意:  reduce() 对于空数组是不会执行回调函数的。**
>`累加器`: 累加器 (accumulator) 是一种寄存器，用来储存计算产生的中间结果。
>`函数的 compose`:

#### 语法

    arr.reduce(callback(accumulator, currentValue[,index[,array]])[, initialValue]);

 









#### 参数说明

+ callback （执行数组中每个值的函数，包含四个参数）

    1. previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    2. currentValue （数组中当前被处理的元素）
    3. index （当前元素在数组中的索引）
    4. array （调用 reduce 的数组）

+ initialValue （作为第一次调用 callback 的第一个参数。）

注意点：
如果没有提供 initialValue，reduce 会从索引1的地方开始执行 callback 方法，
previousValue 作为第一个索引的值并跳过第一个索引。如果提供 initialValue ，从索引0开始。

**建议提供 initialValue**，如果不提供 initialValue 的话，在空数组中使用会报错。
    

#### 使用场景

+ 数组求和

```js
var sum = arr.reduce((x, y) => x + y);
```
+ 数组求积
```
var mul = arr.reduce((x, y) => x * y);
```
+ 计算单词出现次数

```js
let students = ['小李', '小王', '小陈', '小冯', '小李'];
let nameNum = students.reduce((pre, cur)=>{
    if(cur in pre){
        pre[cur]++;
    }else{
        pre[cur] = 1;
    }
    return pre;
}, {}); // 这个时候 initialValue 就应该是一个对象了
console.log(nameNum); // {"小李":2,"小王":1,"小陈":1,"小冯":1}
```
+ 数组去重

```js
let arr = [1, 2, 3, 4, 5, 777, 8, 9, 2, 4, 8];
let res = arr.reduce((pre, cur) => {
    if(!pre.includes(cur)){
        return pre.concat(cur);
    } else {
        return pre;
    }
}, []);
console.log(res) // [1,2,3,4,5,777,8,9]
```
+ 数组扁平化

    - 二维
    ```js
    var arr = [[1, 2, 8], [3, 4, 9], [5, 6, 10]];
    var res = arr.reduce((x, y) => x.concat(y), []); // [1,2,8,3,4,9,5,6,10]
    ```
    
    - 多维
    ```js
    let arr = [[0, 1], [2, 3], [4, [5, 6, 7]]];
    const newArr = function(arr) {
       return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? newArr(cur) : cur), []);
    }
    console.log(newArr(arr)); // [0, 1, 2, 3, 4, 5, 6, 7]
    ```
    
#### reduceRight
`reduceRight()` 方法的功能和 `reduce()` 功能是一样的，不同的是 reduceRight() **从数组的末尾向前**将数组中的数组项做累加。

#### 个人踩坑

一开始学的时候，以为 callback 中的 第四个参数 array 可以是别的数组（一开始觉得是用 arr1 中的 reduce 方法对数组 arr2 进行操作），结果发现这个只是相当于 arr1 的别名，估计传进来的是 arr1 的引用，这里就相当于形参。


```js
let arr1 = [1, 2, 3, 4], arr2 = [5, 6, 7, 8, 9];
const sum = arr1.reduce((pre, cur, index, arr2) => {
console.log(arr2[index]) // 1 2 3 4
return pre + cur;
}, 0);
console.log(sum); // 10
```

### 事件捕获 & 事件冒泡

![capture](./img/capture.jpg)

### addEventListener 函数的第三个参数可以是什么？

+ 当为 boolean 时：
    + 第三个参数涉及到是冒泡还是捕获的时候触发事件：为 true 时是捕获，为 false 时是冒泡。
+ 当为 Object 时：
    + capture： Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
    + once： Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
    + passive：Boolean，设置为 true 时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    + mozSystemGroup：只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。
    

### addEventListener 和 on 的区别是什么？

+ addEventListener 可以给一个事件注册多个listener，而on在同一时间只能指向唯一对象。
+ addEventListener对任何DOM都是有效的，而onclick仅限于HTML。（这句话不是很理解，是在说XHTML这些？）
+ on 事件解绑需要将其置为none，而addEventListener需要使用removeEventListener。

### 判断一个对象是否为空对象的方法

+ Object.keys() 或者 Object.values() 或者 Object.getOwnPropertyNames()  （原型链上的不知道算不算、、、）
  ```js
  const obj = {};
  Object.keys(obj).length === 0  // true 则为空对象
  // 如果加上处理边界情况
  obj && Object.keys(obj).length === 0 && obj.constructor === Object;  // true 则为空对象
  ```

+ JSON.stringify()
  ```js
  const obj = {};
  console.log(JSON.stringify(obj) == "{}");
  ```

+ for...in

  ```js
  const obj = {};
  function chectEmptyObj() {
      for(let v in obj) {
          return false;
      }
      return true;
  }
  ```

  

### 前端模块化

#### 推荐阅读： [写给前端新手看的一些模块化知识](https://juejin.cn/post/7026992093016883207)

