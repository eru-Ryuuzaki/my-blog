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

### addEventListener 函数的第三个参数可以是什么？
+ 当为 boolean 时：
    + 第三个参数涉及到是冒泡还是捕获：为 true 时是捕获，为 false 时是冒泡。
+ 当为 Object 时：
    + capture： Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
    + once： Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
    + passive：Boolean，设置为 true 时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    + mozSystemGroup：只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。
    
### 前端模块化
#### 推荐阅读： [写给前端新手看的一些模块化知识](https://juejin.cn/post/7026992093016883207)