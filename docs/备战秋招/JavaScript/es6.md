## ES6 基础

### ECMAScript 和 JavaScript 的关系

前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 JScript 和 ActionScript）。日常场合，这两个词是可以互换的。

## ES6 指的是什么

ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。

## 兼容性

+ babel：针对新语法，不针对新的 api
+ polyfill：用于实现浏览器并不支持的原生API的代码

## 新特性

### let、const

> ES6之前只有全局作用域和函数作用域，没有块级作用域。这带来很多不合理的场景:
>
> 1. 内层变量可能覆盖外层变量
> 2. 用来计数的循环变量泄露为全局变量
>
> 为了加强对变量生命周期的控制，ECMAScript 6 引入了块级作用域。

+ 块级作用域存在于：
  + 函数内部
  + 块中(字符 { 和 } 之间的区域)

+ let、const 共同点：
  + 不进行变量提升
  + 重复声明报错
  + let、const声明的全局变量不会挂在顶层对象下面

+ 临时性死区：在代码块内,使用let、const命令声明变量之前,该变量都是不可用的。这在语法上,称为“*暂时性死区*”(temporal dead zone,简称 TDZ) 。暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

    > ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。“暂时性死区”也意味着`typeof`不再是一个百分之百安全的操作。

+ ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

  ```javascript
  /* 第一种写法，报错
   * 这种写法由于没有大括号不存在块级作用域，let只能出现在当前作用域的顶层，这个例子中let声明的当前作用域为全局作用域，但它处于if判断的子句里，并不是全局作用域的第一层，而是第二层。
  */
  if (true) let x = 1;
  
  // 第二种写法，不报错
  if (true) {
    let x = 1;
  }
  ```

### rest 参数和扩展运算符

>**rest参数**和**扩展运算符**都是`ES6`新增的特性。
>**rest参数**的形式为：`...变量名`；**扩展运算符**是三个点（`...`）。

#### rest 参数

**rest参数和arguments对象的区别**

- rest参数只包含那些没有对应形参的实参；而 arguments 对象包含了传给函数的所有实参。

- arguments 对象不是一个真实的数组；而rest参数是真实的 Array 实例，也就是说你能够在它上面直接使用所有的数组方法。

  ```javascript
  // arguments变量的写法
  function sortNumbers() {
    return Array.prototype.slice.call(arguments).sort();
  }
  
  // rest参数的写法
  const sortNumbers = (...numbers) => numbers.sort();
  ```

  

- arguments 对象对象还有一些附加的属性 (比如callee属性)。

注意点：

- rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

  ```javascript
  function f(a, ...b, c) { ... } // 报错
  ```

- 函数的length属性，不包括 rest 参数。

  ```javascript
  (function(a) {}).length  // 1
  (function(...a) {}).length  // 0
  (function(a, ...b) {}).length  // 1
  ```

#### 扩展运算符

> 扩展运算符可以看做是 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

+ 想把一个数组加到另外一个数组某个位置时

  ```javascript
  arr1.splice(index, 0, ...arr2); // 这样是不是比 concat 方便点~
  ```

+ 求一个数组最大值

  ```javascript
  // ES5 的写法
  Math.max.apply(null, [14, 3, 77])
  
  // ES6 的写法
  Math.max(...[14, 3, 77])
  
  // 等同于
  Math.max(14, 3, 77);
  ```

+ 将字符串转化成数组（长见识了）

  ```javascript
  var str = 'hello';
  
  // ES5  
  var arr1 = str.split('');  // [ "h", "e", "l", "l", "o" ] 
  
  // ES6  
  var arr2 = [...str];  // [ "h", "e", "l", "l", "o" ] 
  ```

+ #### 实现了 Iterator 接口的对象

  任何 Iterator 接口的对象，都可以用扩展运算符转为真正的数组。

  ```smali
  var nodeList = document.querySelectorAll('div');
  var array = [...nodeList];
  ```

  上面代码中，`querySelectorAll`方法返回的是一个`nodeList`对象。它不是数组，而是一个类似数组的对象。这时，扩展运算符可以将其转为真正的数组，原因就在于`NodeList`对象实现了 `Iterator` 。

### 箭头函数

> ES6 允许使用“箭头”（`=>`）定义函数。箭头函数是ES6引入到JavaScript中的，是一种新式的匿名函数的写法，类似于其他语言中Lambda函数。箭头函数和传统函数有很多的不同，例如作用域、语法写法等等。

特点：

+ 箭头函数没有`prototype`(原型)，所以箭头函数本身没有this

  > 对于普通函数来说，内部的`this`指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的`this`对象，内部的`this`就是定义时上层作用域中的`this`。也就是说，箭头函数内部的`this`指向是固定的，相比之下，普通函数的`this`指向是可变的。

  ```javascript
  let a = () => {};
  console.log(a.prototype); // undefined
  ```

+ 不可以当作构造函数，也就是说，不可以对箭头函数使用`new`命令，否则会抛出一个错误。(因为没有this嘛)

+ 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

+ 不可以使用`yield`命令，因此箭头函数不能用作 Generator 函数。

+ 如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。如果只有一个参数，那么可以不加括号

  ```javascript
  // 没有参数
  let a = () => {};
  // 一个参数
  let b = item => {};
  // 多个参数
  let c = (item, index, arr) => {};
  ```

+ 如果箭头函数的代码块只有一条语句，那么可以不写大括号和`return`，直接返回表达式的值

  ```javascript
  let a = {b: 4}
  let res = () => a;
  console.log(res()) //  {"b":4}
  ```

  由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象(如果按照上面那样返回一个变量就不会报错)，必须在对象外面加上括号，否则会报错。

  ```javascript
  // 报错
  let getTempItem = id => { id: id, name: "Temp" };
  
  // 不报错
  let getTempItem = id => ({ id: id, name: "Temp" });
  ```

+ 简化回调函数

  + ```javascript
    // 普通函数写法
    [1,2,3].map(function (x) {
      return x * x;
    });
    // 箭头函数写法
    [1,2,3].map(x => x * x);
    ```

  + ```java
    // 普通函数写法
    var result = values.sort(function (a, b) {
      return a - b;
    });
    // 箭头函数写法
    var result = values.sort((a, b) => a - b);
    ```

### `Map`、`Set` VS `WeakMap`、`WeakSet`

+ `WeakMap`、`WeakSet`: 它对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用（如果一个对象只存在它的弱引用那么当该对象应该被GC回收时不会阻止GC的回收行为）。

+ `Map` `Set`的键可以是任意类型，`WeakMap` `WeakSet` 只接受对象作为键（null除外），不接受其他类型的值作为键

- `Map` `Set` 可以被遍历， `WeakMap` `WeakSet` 不能被遍历

#### `WeakMap`、`WeakSet`使用场景：

+ **储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏**。

  > 假设我们需要给记录页面上的禁用标签，那么一个Set对象存放就可以了，这样写功能上没有问题，但如果写成这样，当点击事件发生后，button 的dom被移除，那么整份js中 disabledElements 这个对象因为是强引用，其中的值依然存在于内存中的，那么内存泄漏就造成了，于是我们可以换成 WeakSet 来存放。