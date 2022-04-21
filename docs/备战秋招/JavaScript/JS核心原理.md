### 数据类型

#### 数据类型种类

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220419101238.png)

前 7 种类型为基础类型，最后 1 种（Object）为引用类型，也是需要重点关注的，因为它在日常工作中是使用得最频繁，也是需要关注最多技术细节的数据类型。

 JavaScript 的数据类型最后都会在初始化之后放在不同的内存中，因此上面的数据类型大致可以分成两类来进行存储：

+ **基础类型存储在栈内存，被引用或拷贝时，会创建一个完全相等的变量**

+ **引用类型存储在堆内存，存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念**

#### 数据类型检测

+ typeof

  ```js
  typeof 1 // 'number'
  typeof '1' // 'string'
  typeof undefined // 'undefined'
  typeof true // 'boolean'
  typeof Symbol() // 'symbol'
  typeof null // 'object'
  typeof [] // 'object'
  typeof {} // 'object'
  typeof console // 'object'
  typeof console.log // 'function'
  ```

  注意，引用数据类型 Object，用 typeof 来判断的话，除了 function 会判断为 OK 以外，其余都是 'object'，是无法判断出来的。

+ instanceof

  ```js
  let Car = function() {}
  let benz = new Car()
  benz instanceof Car // true
  let car = new String('Mercedes Benz')
  car instanceof String // true
  let str = 'Covid-19'
  str instanceof String // false
  ```

  手写 instanceof

  ```js
  // 有问题的版本
  function myInstanceof(left, right) {
  	while (left) {
          if (left === right)	return true;
          left = Object.getPrototypeOf(left);
      }   
      return false;
  }
  // 改正后的版本
  function myInstanceof(left, right) {
      // 只能判断复杂类型
      if(typeof left !== 'object' || left === null) return false;
      left = Object.getPrototypeOf(left); // 这句不能少，本身并不是本身的实例
      // 上了上面那句的话
      // console.log(myInstanceof(Number.prototype, Number));            // true 加了就变成 false
  	// console.log(Number.prototype instanceof Number)					// false
  	while (left) {
          if (left === right.prototype)	return true;
          left = Object.getPrototypeOf(left);
      }   
      return false;
  }
  ```

  

这两种判断数据类型的方法之间有什么差异呢？我总结了下面两点：

1. instanceof 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型；
2. 而 typeof 也存在弊端，它虽然可以判断基础数据类型（null 除外），但是引用数据类型中，除了 function 类型以外，其他的也无法判断。

总之，不管单独用 typeof 还是 instanceof，都不能满足所有场景的需求，而只能通过二者混写的方式来判断。但是这种方式判断出来的其实也只是大多数情况，并且写起来也比较难受，你也可以试着写一下。

其实我个人还是比较推荐下面的第三种方法，相比上述两个而言，能更好地解决数据类型检测问题。

+ Object.prototype.toString

toString() 是 Object 的原型方法，调用该方法，可以统一返回格式为 “[object Xxx]” 的字符串，其中 Xxx 就是对象的类型。对于 Object 对象，直接调用 toString() 就能返回 [object Object]；而对于其他对象，则需要通过 call 来调用，才能返回正确的类型信息。我们来看一下代码。

```js
Object.prototype.toString({})       // "[object Object]"
Object.prototype.toString.call({})  // 同上结果，加上call也ok
Object.prototype.toString.call(1)    // "[object Number]"
Object.prototype.toString.call('1')  // "[object String]"
Object.prototype.toString.call(true)  // "[object Boolean]"
Object.prototype.toString.call(function(){})  // "[object Function]"
Object.prototype.toString.call(null)   //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(/123/g)    //"[object RegExp]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call([])       //"[object Array]"
Object.prototype.toString.call(document)  //"[object HTMLDocument]"
Object.prototype.toString.call(window)   //"[object Window]"
```

从上面这段代码可以看出，Object.prototype.toString.call() 可以很好地判断引用类型，甚至可以把 document 和 window 都区分开来。

但是在写判断条件的时候一定要注意，使用这个方法最后返回统一字符串格式为 "[object Xxx]" ，而这里字符串里面的 "Xxx" ，**第一个首字母要大写**（注意：使用 typeof 返回的是小写），这里需要多加留意。

下面来实现一个全局通用的数据类型判断方法

```js
function getType(obj){
  let type  = typeof obj;
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');  // 注意正则中间有个空格
}
/* 代码验证，需要注意大小写，哪些是typeof判断，哪些是toString判断？思考下 */
getType([])     // "Array" typeof []是object，因此toString返回
getType('123')  // "string" typeof 直接返回
getType(window) // "Window" toString返回
getType(null)   // "Null"首字母大写，typeof null是object，需toString来判断
getType(undefined)   // "undefined" typeof 直接返回
getType()            // "undefined" typeof 直接返回
getType(function(){}) // "function" typeof能判断，因此首字母小写
getType(/123/g)      //"RegExp" toString返回
```

#### 数据类型转换

在日常的业务开发中，经常会遇到 JavaScript 数据类型转换问题，有的时候需要我们主动进行强制转换，而有的时候 JavaScript 会进行隐式转换，隐式转换的时候就需要我们多加留心。

```js
'123' == 123   // false or true?		true
'' == null    // false or true?			true × -> 应该是 false
'' == 0        // false or true?		true
[] == 0        // false or true?		false × -> 应该是 true
[] == ''       // false or true?		false × -> 应该是 true
[] == ![]      // false or true?		false × -> 应该是 true
null == undefined //  false or true?	true
Number(null)     // 返回什么？			NaN × -> 应该是 0			
Number('')      // 返回什么？			NaN × -> 应该是 0
parseInt('');    // 返回什么？			NaN 
{}+10           // 返回什么？			'10' × -> 应该是 [object Object]10
let obj = {
    [Symbol.toPrimitive]() {
        return 200;
    },
    valueOf() {
        return 300;
    },
    toString() {
        return 'Hello';
    }
}
console.log(obj + 200); // 这里打印出来是多少？	我直接不会  -> 应该是 400
```

##### 强制类型转换

强制类型转换方式包括 Number()、parseInt()、parseFloat()、toString()、String()、Boolean()，这几种方法都比较类似，通过字面意思可以很容易理解，都是通过自身的方法来进行数据类型的强制转换。下面我列举一些来详细说明。

上面代码中，第 8 行的结果是 0，第 9 行的结果同样是 0，第 10 行的结果是 NaN。这些都是很明显的强制类型转换，因为用到了 Number() 和 parseInt()。

其实上述几个强制类型转换的原理大致相同，下面我挑两个比较有代表性的方法进行讲解。

###### Number() 方法的强制类型转换

- 如果是布尔值，true 和 false 分别被转换为 1 和 0；
- 如果是数字，返回自身；
- 如果是 null，返回 0；
- 如果是 undefined，返回 NaN；
- 如果是字符串，遵循以下规则：如果字符串中只包含数字（或者是 0X / 0x 开头的十六进制数字字符串，允许包含正负号），则将其转换为十进制；如果字符串中包含有效的浮点格式，将其转换为浮点数值；如果是空字符串，将其转换为 0；如果不是以上格式的字符串，均返回 NaN；
- **如果是 Symbol，抛出错误；**
- 如果是对象，并且部署了 [Symbol.toPrimitive] ，那么调用此方法，否则调用对象的 valueOf() 方法，然后依据前面的规则转换返回的值；如果转换的结果是 NaN ，则调用对象的 toString() 方法，再次依照前面的顺序转换返回对应的值（Object 转换规则会在下面细讲）。

下面通过一段代码来说明上述规则。

```js
Number(true);        // 1
Number(false);       // 0
Number('0111');      //111
Number(null);        //0
Number('');          //0
Number('1a');        //NaN
Number(undefined) 	// NaN
Number(-0X11);       //-17
Number('0X11')       //17
```

其中，分别列举了比较常见的 Number 转换的例子，它们都会把对应的非数字类型转换成数字类型，而有一些实在无法转换成数字的，最后只能输出 NaN 的结果。

###### Boolean() 方法的强制转换规则

这个方法的规则是：除了 undefined、 null、 false、 ''、 0（包括 +0，-0）、 NaN 转换出来是 false，其他都是 true。(**注意：空数组转换是 true**)

这个规则应该很好理解，没有那么多条条框框，我们还是通过代码来形成认知，如下所示。

```js
Boolean(0)          //false
Boolean(null)       //false
Boolean(undefined)  //false
Boolean(NaN)        //false
Boolean(1)          //true
Boolean(13)         //true
Boolean('12')       //true
Boolean([]) 		// true
```

##### 隐式类型转换

凡是通过逻辑运算符 (&&、 ||、 !)、运算符 (+、-、*、/)、关系操作符 (>、 <、 <= 、>=)、相等运算符 (==) 或者 if/while 条件的操作，如果遇到两个数据类型不一样的情况，都会出现隐式类型转换。这里需要重点关注一下，因为比较隐蔽，特别容易让人忽视。

下面着重讲解一下日常用得比较多的“==”和“+”这两个符号的隐式转换规则。

###### '==' 的隐式类型转换规则

- 如果类型相同，无须进行类型转换；
- 如果其中一个操作值是 null 或者 undefined，那么另一个操作符必须为 null 或者 undefined，才会返回 true，否则都返回 false；
- 如果其中一个是 Symbol 类型，那么返回 false；
- 两个操作值如果为 string 和 number 类型，那么就会将字符串转换为 number；
- 如果一个操作值是 boolean，那么转换成 number；
- 如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（调用 object 的 valueOf/toString 方法进行转换）。

如果直接死记这些理论会有点懵，我们还是直接看代码，这样更容易理解一些，如下所示。

```js
null == undefined       // true  规则2
null == 0               // false 规则2
'' == null              // false 规则2
'' == 0                 // true  规则4 字符串转隐式转换成Number之后再对比
'123' == 123            // true  规则4 字符串转隐式转换成Number之后再对比
0 == false              // true  e规则 布尔型隐式转换成Number之后再对比
1 == true               // true  e规则 布尔型隐式转换成Number之后再对比
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
// 注意这里a又可以等于1、2、3
console.log(a == 1 && a == 2 && a ==3);  //true f规则 Object隐式转换
// 注：但是执行过3遍之后，再重新执行a==3或之前的数字就是false，因为value已经加上去了，这里需要注意一下
```

###### '+' 的隐式类型转换规则

'+' 号操作符，不仅可以用作数字相加，还可以用作字符串拼接。仅当 '+' 号两边都是数字时，进行的是加法运算；如果两边都是字符串，则直接拼接，无须进行隐式类型转换。

除了上述比较常规的情况外，还有一些特殊的规则，如下所示。

- 如果其中有一个是字符串，另外一个是 undefined、null 或布尔型，则调用 toString() 方法进行字符串拼接；如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级（下一讲会专门介绍），然后再进行拼接。
- 如果其中有一个是数字，另外一个是 undefined、null、布尔型或数字，则会将其转换成数字进行加法运算，对象的情况还是参考上一条规则。
- 如果其中一个是字符串、一个是数字，则按照字符串规则进行拼接。

下面还是结合代码来理解上述规则，如下所示。

```js
1 + 2        // 3  常规情况
'1' + '2'    // '12' 常规情况
// 下面看一下特殊情况
'1' + undefined   // "1undefined" 规则1，undefined转换字符串
'1' + null        // "1null" 规则1，null转换字符串
'1' + true        // "1true" 规则1，true转换字符串
'1' + 1n          // '11' 比较特殊字符串和BigInt相加，BigInt转换为字符串 !!!
1 + undefined     // NaN  规则2，undefined转换数字相加NaN
1 + null          // 1    规则2，null转换为0
1 + true          // 2    规则2，true转换为1，二者相加为2
1 + 1n            // 错误  不能把BigInt和Number类型直接混合相加
'1' + 3           // '13' 规则3，字符串拼接
```

整体来看，如果数据中有字符串，JavaScript 类型转换还是更倾向于转换成字符串，因为第三条规则中可以看到，在字符串和数字相加的过程中最后返回的还是字符串，这里需要关注一下。

###### Object 的转换规则

对象转换的规则，会先调用内置的 [ToPrimitive] 函数，其规则逻辑如下：

- 如果部署了 Symbol.toPrimitive 方法，优先调用再返回；
- 调用 valueOf()，如果转换为基础类型，则返回；
- 调用 toString()，如果转换为基础类型，则返回；
- 如果都没有返回基础类型，会报错。

直接理解有些晦涩，还是直接来看代码，也可以在控制台自己敲一遍来加深印象。

```js
var obj = {
  value: 1,
  valueOf() {
    return 2;
  },
  toString() {
    return '3'
  },
  [Symbol.toPrimitive]() {
    return 4
  }
}
console.log(obj + 1); // 输出5
// 因为有Symbol.toPrimitive，就优先执行这个；如果Symbol.toPrimitive这段代码删掉，则执行valueOf打印结果为3；如果valueOf也去掉，则调用toString返回'31'(字符串拼接)
// 再看两个特殊的case：
10 + {}
// "10[object Object]"，注意：{}会默认调用valueOf是{}，不是基础类型继续转换，调用toString，返回结果"[object Object]"，于是和10进行'+'运算，按照字符串拼接规则来，参考'+'的规则C
[1,2,undefined,4,5] + 10
// "1,2,,4,510"，注意[1,2,undefined,4,5]会默认先调用valueOf结果还是这个数组，不是基础数据类型继续转换，也还是调用toString，返回"1,2,,4,5"，然后再和10进行运算，还是按照字符串拼接规则，参考'+'的第3条规则
```

总结一下就是：

1. 数据类型的基本概念：这是必须掌握的知识点，作为深入理解 JavaScript 的基础。
2. 数据类型的判断方法：typeof 和 instanceof，以及 Object.prototype.toString 的判断数据类型、手写 instanceof 代码片段，这些是日常开发中经常会遇到的，因此需要好好掌握。
3. 数据类型的转换方式：两种数据类型的转换方式，日常写代码过程中隐式转换需要多留意，如果理解不到位，很容易引起在编码过程中的 bug，得到一些意想不到的结果。



### 深浅拷贝

#### 浅拷贝原理与实现

对于浅拷贝的定义我们可以初步理解为：

> 自己创建一个新的对象，来接受你要重新复制或引用的对象值。如果对象属性是基本的数据类型，复制的就是基本类型的值给新对象；但如果属性是引用数据类型，复制的就是内存中的地址，如果其中一个对象改变了这个内存中的地址，肯定会影响到另一个对象。

下面我总结了一些 JavaScript 提供的浅拷贝方法，一起来看看哪些方法能实现上述定义所描述的过程。

##### 方法一：assign

> object.assign 是 ES6 中 object 的一个方法，该方法可以用于 JS 对象的合并等多个用途，其中一个用途就是可以进行浅拷贝。该方法的第一个参数是拷贝的目标对象，后面的参数是拷贝的来源对象（也可以是多个来源）。
>
> object.assign 的语法为：Object.assign(target, ...sources)

使用 object.assign 方法有几点需要注意：

+ **它不会拷贝对象的继承属性；**

+ **它不会拷贝对象的不可枚举的属性；**

+ **可以拷贝 Symbol 类型的属性。**

可以简单理解为：Object.assign 循环遍历原对象的属性，通过复制的方式将其赋值给目标对象的相应属性，来看一下这段代码，以验证它可以拷贝 Symbol 类型的对象。

```js
let obj1 = { a:{ b:1 }, sym:Symbol(1)}; 
Object.defineProperty(obj1, 'innumerable' ,{
    value:'不可枚举属性',
    enumerable:false
});
let obj2 = {};
Object.assign(obj2,obj1)
obj1.a.b = 2;
console.log('obj1',obj1);
console.log('obj2',obj2);
```

输出结果：

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420091225.png)



##### 方法二：扩展运算符方式

我们也可以利用 JS 的扩展运算符，在构造对象的同时完成浅拷贝的功能。

> 扩展运算符的语法为：let cloneObj = { ...obj };

```js
/* 对象的拷贝 */
let obj = {a:1,b:{c:1}}
let obj2 = {...obj}
obj.a = 2
console.log(obj)  //{a:2,b:{c:1}} console.log(obj2); //{a:1,b:{c:1}}
obj.b.c = 2
console.log(obj)  //{a:2,b:{c:2}} console.log(obj2); //{a:1,b:{c:2}}
/* 数组的拷贝 */
let arr = [1, 2, 3];
let newArr = [...arr]; //跟arr.slice()是一样的效果
```

扩展运算符 和 object.assign 有同样的缺陷，也就是实现的浅拷贝的功能差不多，但是如果属性都是基本类型的值，使用扩展运算符进行浅拷贝会更加方便。

##### 方式三：concat 拷贝数组

数组的 concat 方法其实也是浅拷贝，所以连接一个含有引用类型的数组时，需要注意修改原数组中的元素的属性，因为它会影响拷贝之后连接的数组。不过 concat **只能用于数组的浅拷贝**，使用场景比较局限。代码如下所示。

```js
let arr = [1, 2, 3];
let newArr = arr.concat();
newArr[1] = 100;
console.log(arr);  // [ 1, 2, 3 ]
console.log(newArr); // [ 1, 100, 3 ]
```

##### 方式四：slice 拷贝数组

**slice 方法也比较有局限性，因为它仅仅针对数组类型**。slice 方法会返回一个新的数组对象，这一对象由该方法的前两个参数来决定原数组截取的开始和结束位置，是不会影响和改变原始数组的。

> slice 的语法为：arr.slice(begin, end);

```js
let arr = [1, 2, {val: 4}];
let newArr = arr.slice();
newArr[2].val = 1000;
console.log(arr);  //[ 1, 2, { val: 1000 } ]
```

#### 手动实现一个浅拷贝

根据以上对浅拷贝的理解，自己实现一个浅拷贝，大致的思路分为两点：

1. 对基础类型做一个最基本的一个拷贝；

2. 对引用类型开辟一个新的存储，并且拷贝一层对象属性。

```js
const shallowClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? []: {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
          cloneTarget[prop] = target[prop];
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

#### 深拷贝的原理与实现

浅拷贝只是创建了一个新的对象，复制了原有对象的基本类型的值，而引用数据类型只拷贝了一层属性，再深层的还是无法进行拷贝。深拷贝则不同，对于复杂引用数据类型，其在堆内存中完全开辟了一块内存地址，并将原有的对象完全复制过来存放。

**这两个对象是相互独立、不受影响的，彻底实现了内存上的分离**。总的来说，深拷贝的原理可以总结如下：

> 将一个对象从内存中完整地拷贝出来一份给目标对象，并从堆内存中开辟一个全新的空间存放新对象，且新对象的修改并不会改变原对象，二者实现真正的分离。

##### 方式一：乞丐版（JSON.stringify）

JSON.stringify() 是目前开发过程中最简单的深拷贝方法，其实就是把一个对象序列化成为 JSON 的字符串，并将对象里面的内容转换成字符串，最后再用 JSON.parse() 的方法将JSON 字符串生成一个新的对象。示例代码如下所示。

```js
let obj1 = { a:1, b:[1,2,3] }
let str = JSON.stringify(obj1)；
let obj2 = JSON.parse(str)；
console.log(obj2);   //{a:1,b:[1,2,3]} 
obj1.a = 2；
obj1.b.push(4);
console.log(obj1);   //{a:2,b:[1,2,3,4]}
console.log(obj2);   //{a:1,b:[1,2,3]}
```

从上面的代码可以看到，通过 JSON.stringify 可以初步实现一个对象的深拷贝，通过改变 obj1 的 b 属性，其实可以看出 obj2 这个对象也不受影响。

但是使用 JSON.stringify 实现深拷贝还是有一些地方值得注意，总结下来主要有这几点：

1. 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；

2. 拷贝 Date 引用类型会变成字符串；

3. 无法拷贝不可枚举的属性；

4. 无法拷贝对象的原型链；

5. 拷贝 RegExp 引用类型会变成空对象；

6. 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；

7. 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。

针对这些存在的问题，来看看复杂的对象，如果用 JSON.stringify 实现深拷贝会出现什么情况。

```js
function Obj() { 
  this.func = function () { alert(1) }; 
  this.obj = {a:1};
  this.arr = [1,2,3];
  this.und = undefined; 
  this.reg = /123/; 
  this.date = new Date(0); 
  this.NaN = NaN;
  this.infinity = Infinity;
  this.sym = Symbol(1);
} 
let obj1 = new Obj();
Object.defineProperty(obj1,'innumerable',{ 
  enumerable:false,
  value:'innumerable'
});
console.log('obj1',obj1);
let str = JSON.stringify(obj1);
let obj2 = JSON.parse(str);
console.log('obj2',obj2);
```



![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420093010.png)



使用 JSON.stringify 方法实现深拷贝对象，虽然到目前为止还有很多无法实现的功能，但是这种方法足以满足日常的开发需求，并且是最简单和快捷的。而对于其他的也要实现深拷贝的，比较麻烦的属性对应的数据类型，JSON.stringify 暂时还是无法满足的，那么就需要下面的几种方法了。

##### 方式二：基础版（手写递归实现）

下面是一个实现 deepClone 函数封装的例子，通过 for in 遍历传入参数的属性值，如果值是引用类型则再次递归调用该函数，如果是基础数据类型就直接复制，代码如下所示。

```js
let obj1 = {
  a:{
    b:1
  }
}
function deepClone(obj) { 
  let cloneObj = {}
  for(let key in obj) {                 //遍历
    if(typeof obj[key] ==='object') { 
      cloneObj[key] = deepClone(obj[key])  //是对象就再次调用该函数递归
    } else {
      cloneObj[key] = obj[key]  //基本类型的话直接复制值
    }
  }
  return cloneObj
}
let obj2 = deepClone(obj1);
obj1.a.b = 2;
console.log(obj2);   //  {a:{b:1}}
```

虽然利用递归能实现一个深拷贝，但是同上面的 JSON.stringify 一样，还是有一些问题没有完全解决，例如：

1. 这个深拷贝函数并不能复制不可枚举的属性以及 Symbol 类型；

2. 这种方法只是针对普通的引用类型的值做递归复制，而对于 Array、Date、RegExp、Error、Function 这样的引用类型并不能正确地拷贝；

3. 对象的属性里面成环，即循环引用没有解决。

这种基础版本的写法也比较简单，可以应对大部分的应用情况。但是你在面试的过程中，如果只能写出这样的一个有缺陷的深拷贝方法，有可能不会通过。

所以为了“拯救”这些缺陷，下面一起看看改进的版本，以便于可以在面试种呈现出更好的深拷贝方法，赢得面试官的青睐。

##### 方法三：改进版（改进后递归实现）

针对上面几个待解决问题，我先通过四点相关的理论告诉你分别应该怎么做。

1. 针对能够遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys 方法；

2. 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；

3. 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链；

4. 利用 WeakMap 类型作为 Hash 表，**因为 WeakMap 是弱引用类型，可以有效防止内存泄漏**（你可以关注一下 Map 和 weakMap 的关键区别，这里要用 weakMap），作为检测循环引用很有帮助，如果存在循环，则引用直接返回 WeakMap 存储的值。

当你不太了解 WeakMap 的真正作用时，我建议你不要在面试中写出这样的代码，如果只是死记硬背，会给自己挖坑的。因为你写的每一行代码都是需要经过深思熟虑并且非常清晰明白的，这样你才能经得住面试官的推敲。

当然，如果你在考虑到循环引用的问题之后，还能用 WeakMap 来很好地解决，并且向面试官解释这样做的目的，那么你所展示的代码，以及你对问题思考的全面性，在面试官眼中应该算是合格的了。

那么针对上面这几个问题，我们来看下改进后的递归实现的深拷贝代码应该是什么样子的，如下所示。

```js
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) 
  return new Date(obj)       // 日期对象直接返回一个新的日期对象
  if (obj.constructor === RegExp)
  return new RegExp(obj)     //正则对象直接返回一个新的正则对象
  //如果循环引用了就用 weakMap 来解决
  if (hash.has(obj)) return hash.get(obj)
  let allDesc = Object.getOwnPropertyDescriptors(obj)
  //遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
  //继承原型链
  hash.set(obj, cloneObj)
  for (let key of Reflect.ownKeys(obj)) { 
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }
  return cloneObj
}
// 下面是验证代码
let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () { console.log('我是一个函数') },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};
Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性' }
);
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj    // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj', obj)
console.log('cloneObj', cloneObj)
```

我们看一下结果，cloneObj 在 obj 的基础上进行了一次深拷贝，cloneObj 里的 arr 数组进行了修改，并未影响到 obj.arr 的变化，如下图所示。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420093822.png)



从这张截图的结果可以看出，改进版的 deepClone 函数已经对基础版的那几个问题进行了改进，也验证了我上面提到的那四点理论。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420093917.png)

可以看到通过这一个问题能考察的能力有很多，因此千万不要用最低的标准来要求自己，应该用类似的方法去分析每个问题深入考察的究竟是什么，这样才能更好地去全面提升自己的基本功。



### JS 的六种继承实现

继承是面向对象的，使用这种方式我们可以更好地复用以前的开发代码，缩短开发的周期、提升开发效率。

#### 第一种：原型链继承

原型链继承是比较常见的继承方式之一，其中涉及的构造函数、原型和实例，三者之间存在着一定的关系，即每一个构造函数都有一个原型对象，原型对象又包含一个指向构造函数的指针，而实例则包含一个原型对象的指针。

```js
  function Parent1() {
    this.name = 'parent1';
    this.play = [1, 2, 3]
  }
  function Child1() {
    this.type = 'child2';
  }
  Child1.prototype = new Parent1();
  console.log(new Child1());
```

上面的代码看似没有问题，虽然父类的方法和属性都能够访问，但其实有一个潜在的问题，我再举个例子来说明这个问题。

```js
  var s1 = new Child1();
  var s2 = new Child2();
  s1.play.push(4);
  console.log(s1.play, s2.play);
```

这段代码在控制台执行之后，可以看到结果如下：

```js
[1, 2, 3, 4]
[1, 2, 3, 4]
```

明明我只改变了 s1 的 play 属性，为什么 s2 也跟着变了呢？原因很简单，因为两个实例使用的是同一个原型对象。它们的内存空间是共享的，当一个发生变化的时候，另外一个也随之进行了变化，这就是使用原型链继承方式的一个缺点。



#### 第二种：构造函数继承（借助 call）

```js
  function Parent1(){
    this.name = 'parent1';
  }

  Parent1.prototype.getName = function () {
    return this.name;
  }

  function Child1(){
    Parent1.call(this);
    this.type = 'child1'
  }

  let child = new Child1();
  console.log(child);  // 没问题
  console.log(child.getName());  // 会报错
```

这样写的时候子类虽然能够拿到父类的属性值，解决了第一种继承方式的弊端，但问题是，父类原型对象中一旦存在父类之前自己定义的方法，那么子类将无法继承这些方法。它使父类的引用属性不会被共享，优化了第一种继承方式的弊端；但是随之而来的缺点也比较明显——只能继承父类的实例属性和方法，不能继承原型属性或者方法。

上面的两种继承方式各有优缺点，那么结合二者的优点，于是就产生了下面这种组合的继承方式。

#### 第三种：组合继承（前两种组合）

```js
function Parent3 () {
    this.name = 'parent3';
    this.play = [1, 2, 3];
  }

  Parent3.prototype.getName = function () {
    return this.name;
  }
  function Child3() {
    // 第二次调用 Parent3()
    Parent3.call(this);
    this.type = 'child3';
  }

  // 第一次调用 Parent3()
  Child3.prototype = new Parent3();
  // 手动挂上构造器，指向自己的构造函数
  Child3.prototype.constructor = Child3;
  var s3 = new Child3();
  var s4 = new Child3();
  s3.play.push(4);
  console.log(s3.play, s4.play);  // 不互相影响
  console.log(s3.getName()); // 正常输出'parent3'
  console.log(s4.getName()); // 正常输出'parent3'
```

#### 原型式继承

这里不得不提到的就是 ES5 里面的 Object.create 方法，这个方法接收两个参数：一是用作新对象原型的对象、二是为新对象定义额外属性的对象（可选参数）。

```js
 let parent4 = {
    name: "parent4",
    friends: ["p1", "p2", "p3"],
    getName: function() {
      return this.name;
    }
  };

  let person4 = Object.create(parent4);
  person4.name = "tom";
  person4.friends.push("jerry");

  let person5 = Object.create(parent4);
  person5.friends.push("lucy");

  console.log(person4.name);	//  tom
  console.log(person4.name === person4.getName());	// true
  console.log(person5.name);	// parent4
  console.log(person4.friends);	//  ["p1","p2","p3","jerry","lucy"]
  console.log(person5.friends);	//  ["p1","p2","p3","jerry","lucy"]
```

从上面的代码中可以看到，通过 Object.create 这个方法可以实现普通对象的继承，不仅仅能继承属性，同样也可以继承 getName 的方法，请看这段代码的执行结果。

那么关于这种继承方式的缺点也很明显，多个实例的引用类型属性指向相同的内存，存在篡改的可能，接下来我们看一下在这个继承基础上进行优化之后的另一种继承方式——寄生式继承。

#### 寄生式继承

使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法，这样的继承方式就叫作寄生式继承。

虽然其优缺点和原型式继承一样，但是对于普通对象的继承方式来说，寄生式继承相比于原型式继承，还是在父类基础上添加了更多的方法。

```js
 let parent5 = {
    name: "parent5",
    friends: ["p1", "p2", "p3"],
    getName: function() {
      return this.name;
    }
  };

  function clone(original) {
    let clone = Object.create(original);
    clone.getFriends = function() {
      return this.friends;
    };
    return clone;
  }

  let person5 = clone(parent5);

  console.log(person5.getName());
  console.log(person5.getFriends());
```

从上面的代码可以看到，person5 通过 clone 的方法，增加了 getFriends 的方法，从而使 person5 这个普通对象在继承过程中又增加了一个方法，这样的继承方式就是寄生式继承。

#### 第六种：寄生组合式继承

结合第四种中提及的继承方式，解决普通对象的继承问题的 Object.create 方法，我们在前面这几种继承方式的优缺点基础上进行改造，得出了寄生组合式的继承方式，这也是所有继承方式里面相对最优的继承方式，代码如下。

```js
  function clone (parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
  }

  function Parent6() {
    this.name = 'parent6';
    this.play = [1, 2, 3];
  }
   Parent6.prototype.getName = function () {
    return this.name;
  }
  function Child6() {
    Parent6.call(this);
    this.friends = 'child5';
  }

  clone(Parent6, Child6);

  Child6.prototype.getFriends = function () {
    return this.friends;
  }

  let person6 = new Child6();
  console.log(person6);
  console.log(person6.getName());
  console.log(person6.getFriends());
```

通过这段代码可以看出来，这种寄生组合式继承方式，基本可以解决前几种继承方式的缺点，较好地实现了继承想要的结果，同时也减少了构造次数，减少了性能的开销。

整体看下来，这六种继承方式中，寄生组合式继承是这六种里面最优的继承方式。另外，ES6 还提供了继承的关键字 extends，**开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。**

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420182539.png)

通过 Object.create 来划分不同的继承方式，最后的寄生式组合继承方式是通过组合继承改造之后的最优继承方式，而 extends 的语法糖和寄生组合继承的方式基本类似。

综上，我们可以看到不同的继承方式有不同的优缺点，我们需要深入了解各种方式的优缺点，这样才能在日常开发中，选择最适合当前场景的继承方式。

### call、apply、bind

这三个方法共有的、比较明显的作用就是，都可以改变函数 func 的 this 指向。call 和 apply 的区别在于，传参的写法不同：apply 的第 2 个参数为数组； call 则是从第 2 个至第 N 个都是给 func 的传参；而 bind 和这两个（call、apply）又不同，bind 虽然改变了 func 的 this 指向，但不是马上执行，而这两个（call、apply）是在改变了函数的 this 指向之后立马执行。

##### 应用场景

+ 判断数据类型(Object.prototype.toString.call(obj))

+ 类数组借用方法
+ 获取数组的最大 / 最小值
+ 继承



#### 闭包

##### 作用域介绍

JavaScript 的作用域通俗来讲，就是指变量能够被访问到的范围，在 JavaScript 中作用域也分为好几种，ES5 之前只有全局作用域和函数作用域两种。ES6 出现之后，又新增了块级作用域，下面我们就来看下这三种作用域的概念，为闭包的学习打好基础。

###### 全局作用域

在编程语言中，不论 Java 也好，JavaScript 也罢，变量一般都会分为全局变量和局部变量两种。那么变量定义在函数外部，代码最前面的一般情况下都是全局变量。

在 JavaScript 中，全局变量是挂载在 window 对象下的变量，所以在网页中的任何位置你都可以使用并且访问到这个全局变量。下面通过看一段代码来说明一下什么是全局的作用域。

```js
var globalName = 'global';
function getName() { 
  console.log(globalName) // global
  var name = 'inner'
  console.log(name) // inner
} 
getName();
console.log(name); // ''
console.log(globalName); //global
function setName(){ 
  vName = 'setName';
}
setName();
console.log(vName); // setName
console.log(window.vName) // setName
```

从这段代码中我们可以看到，globalName 这个变量无论在什么地方都是可以被访问到的，所以它就是全局变量。而在 getName 函数中作为局部变量的 name 变量是不具备这种能力的。

如果在 JavaScript 中所有没有经过定义，而直接被赋值的变量默认就是一个全局变量，比如上面代码中 setName 函数里面的 vName 变量一样。

我们可以发现全局变量也是拥有全局的作用域，无论你在何处都可以使用它，在浏览器控制台输入 window.vName 的时候，就可以访问到 window 上所有全局变量。

当然全局作用域有相应的缺点，我们定义很多全局变量的时候，会容易引起变量命名的冲突，所以在定义变量的时候应该注意作用域的问题。

###### 函数作用域

在 JavaScript 中，函数中定义的变量叫作函数变量，这个时候只能在函数内部才能访问到它，所以它的作用域也就是函数的内部，称为函数作用域，下面我们来看一段代码。

```js
function getName () {
  var name = 'inner';
  console.log(name); //inner
}
getName();
console.log(name);
```

上面代码中，name 这个变量是在 getName 函数中进行定义的，所以 name 是一个局部的变量，它的作用域就是在 getName 这个函数里边，也称作函数作用域。

除了这个函数内部，其他地方都是不能访问到它的。**同时，当这个函数被执行完之后，这个局部变量也相应会被销毁。所以你会看到在 getName 函数外面的 name 是访问不到的。**

下面再来看最后一个块级作用域。

###### 块级作用域

ES6 中新增了块级作用域，最直接的表现就是新增的 let 关键词，使用 let 关键词定义的变量只能在块级作用域中被访问，有“暂时性死区”的特点，也就是说这个变量在定义之前是不能被使用的。

听起来好像还不是很能理解块级作用域的意思，那么我们来举个更形象例子，看看到底哪些才是块级作用域呢？其实就是在 JS 编码过程中 if 语句及 for 语句后面 {...} 这里面所包括的，就是块级作用域。

```js
console.log(a) //a is not defined
if(true){
  let a = '123'；
  console.log(a)； // 123
}
console.log(a) //a is not defined
```

从这段代码可以看出，变量 a 是在 if 语句{...} 中由 let 关键词进行定义的变量，所以它的作用域是 if 语句括号中的那部分，而在外面进行访问 a 变量是会报错的，因为这里不是它的作用域。所以在 if 代码块的前后输出 a 这个变量的结果，控制台会显示 a 并没有定义。

那么有了上面这几种作用域的概念做铺垫之后，下面我们就可以来学习闭包的概念。

##### 什么是闭包

先来看下红宝书上和 MDN 上给出的闭包的概念。

> 红宝书闭包的定义：闭包是指有权访问另外一个函数作用域中的变量的函数。
> MDN：一个函数和对其周围状态的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。

乍一看上面的两个比较官方的定义，很难让人理解清晰，尤其是 MDN 的关于闭包的定义，真的比较让人“头晕”，那么现在就和你说说我是怎么理解的。

我在这里先通俗地讲解一下：闭包其实就是一个可以访问其他函数内部变量的**函数**。即一个定义在函数内部的函数，或者直接说闭包是个内嵌函数也可以。

因为通常情况下，函数内部变量是无法在外部访问的（即全局变量和局部变量的区别），因此使用闭包的作用，就具备实现了能在外部访问某个函数内部变量的功能，让这些内部变量的值始终可以保存在内存中。下面我们通过代码先来看一个简单的例子。

```js
function fun1() {
	var a = 1;
	return function(){
		console.log(a);
	};
}
fun1();
var result = fun1();
result();  // 1
```

结合闭包的概念，我们把这段代码放到控制台执行一下，就可以发现最后输出的结果是 1（即 a 变量的值）。那么可以很清楚地发现，a 变量作为一个 fun1 函数的内部变量，正常情况下作为函数内的局部变量，是无法被外部访问到的。但是通过闭包，我们最后还是可以拿到 a 变量的值。

###### 闭包产生的原因

我们在前面介绍了作用域的概念，那么你还需要明白作用域链的基本概念。其实很简单，当访问一个变量时，代码解释器会首先在当前的作用域查找，如果没找到，就去父级作用域去查找，直到找到该变量或者不存在父级作用域中，这样的链路就是作用域链。

需要注意的是，每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。那么我们还是通过下面的代码来详细说明一下作用域链。

```js
var a = 1;
function fun1() {
  var a = 2
  function fun2() {
    var a = 3;
    console.log(a);//3
  }
}
```

从中可以看出，fun1 函数的作用域指向全局作用域（window）和它自己本身；fun2 函数的作用域指向全局作用域 （window）、fun1 和它本身；而作用域是从最底层向上找，直到找到全局作用域 window 为止，如果全局还没有的话就会报错。

那么这就很形象地说明了什么是作用域链，即当前函数一般都会存在上层函数的作用域的引用，那么他们就形成了一条作用域链。

由此可见，闭包产生的本质就是：**当前环境中存在指向父级作用域的引用**。那么还是拿上的代码举例。

```js
function fun1() {
  var a = 2
  function fun2() {
    console.log(a);  //2
  }
  return fun2;
}
var result = fun1();
result();
```

从上面这段代码可以看出，这里 result 会拿到父级作用域中的变量，输出 2。因为在当前环境中，含有对 fun2 函数的引用，fun2 函数恰恰引用了 window、fun1 和 fun2 的作用域。因此 fun2 函数是可以访问到 fun1 函数的作用域的变量。

那是不是只有返回函数才算是产生了闭包呢？其实也不是，回到闭包的本质，**我们只需要让父级作用域的引用存在即可**，因此还可以这么改代码，如下所示。

```js
var fun3;
function fun1() {
  var a = 2
  fun3 = function() {
    console.log(a);
  }
}
fun1();
fun3();
```

可以看出，其中实现的结果和前一段代码的效果其实是一样的，就是在给 fun3 函数赋值后，fun3 函数就拥有了 window、fun1 和 fun3 本身这几个作用域的访问权限；然后还是从下往上查找，直到找到 fun1 的作用域中存在 a 这个变量；因此输出的结果还是 2，最后产生了闭包，形式变了，本质没有改变。

**因此最后返回的不管是不是函数，也都不能说明没有产生闭包。**讲到这里你这里可以再深入体会一下闭包的内涵。

###### 闭包的表现形式

那么明白了闭包的本质之后，我们来看看闭包的表现形式及应用场景到底有哪些呢？我总结了大概有四种场景。

**1**. 返回一个函数，上面讲原因的时候已经说过，这里就不赘述了。

**2**. 在定时器、事件监听、Ajax 请求、Web Workers 或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。请看下面这段代码，这些都是平常开发中用到的形式。(不太理解,  可能和第三种差不多)

**3**. 作为函数参数传递的形式。

```js
var a = 1;
function foo(){
  var a = 2;
  function baz(){
    console.log(a);
  }
  bar(baz);
}
function bar(fn){
  // 这就是闭包
  fn();
}
foo();  // 输出2，而不是1
```

**4**. IIFE（立即执行函数），创建了闭包，保存了全局作用域（window）和当前函数的作用域，因此可以输出全局的变量。

```js
var a = 2;
(function IIFE(){
  console.log(a);  // 输出2
})();
```

IIFE 这个函数会稍微有些特殊，算是一种自执行匿名函数，这个匿名函数拥有独立的作用域。这不仅可以避免了外界访问此 IIFE 中的变量，而且又不会污染全局作用域，我们经常能在高级的 JavaScript 编程中看见此类函数。

##### 如何解决循环输出问题？

```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function() {
    console.log(i)
  }, 0)
}
```

上面这段代码执行之后，从控制台执行的结果可以看出来，结果输出的是 5 个 6，那么一般面试官都会先问为什么都是 6？我想让你实现输出 1、2、3、4、5 的话怎么办呢？

因此结合本讲所学的知识我们来思考一下，应该怎么给面试官一个满意的解释。你可以围绕这两点来回答。

1. setTimeout 为宏任务，由于 JS 中单线程 eventLoop 机制，在主线程同步任务执行完后才去执行宏任务，因此循环结束后 setTimeout 中的回调才依次执行。
2. 因为 setTimeout 函数也是一种闭包，往上找它的父级作用域链就是 window，变量 i 为 window 上的全局变量，开始执行 setTimeout 之前变量 i 已经就是 6 了，因此最后输出的连续就都是 6。

那么我们再来看看如何按顺序依次输出 1、2、3、4、5 呢？

###### 利用 IIFE

可以利用 IIFE（立即执行函数），当每次 for 循环时，把此时的变量 i 传递到定时器中，然后执行，改造之后的代码如下。

```js
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```

###### 使用 ES6 中的 let

ES6 中新增的 let 定义变量的方式，使得 ES6 之后 JS 发生革命性的变化，让 JS 有了块级作用域，代码的作用域以块级为单位进行执行。通过改造后的代码，可以实现上面想要的结果。

```js
for(let i = 1; i <= 5; i++){
  setTimeout(function() {
    console.log(i);
  },0)
}
```

###### 定时器传入第三个参数

setTimeout 作为经常使用的定时器，它是存在第三个参数的，日常工作中我们经常使用的一般是前两个，一个是回调函数，另外一个是时间，而第三个参数用得比较少。那么结合第三个参数，调整完之后的代码如下。

```js
for(var i=1;i<=5;i++){
  setTimeout(function(j) {
    console.log(j)
  }, 0, i)
}
```

#### JSON.stringify

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220421114528.png)

```js
function jsonStringify(data) {
  let type = typeof data;

  if(type !== 'object') {
    let result = data;
    //data 可能是基础数据类型的情况在这里处理
    if (Number.isNaN(data) || data === Infinity) {
       //NaN 和 Infinity 序列化返回 "null"
       result = "null";
    } else if (type === 'function' || type === 'undefined' || type === 'symbol') {
      // 由于 function 序列化返回 undefined，因此和 undefined、symbol 一起处理
       return undefined;
    } else if (type === 'string') {
       result = '"' + data + '"';
    }
    return String(result);
  } else if (type === 'object') {
     if (data === null) {
        return "null"  // 第01讲有讲过 typeof null 为'object'的特殊情况
     } else if (data.toJSON && typeof data.toJSON === 'function') {
        return jsonStringify(data.toJSON());
     } else if (data instanceof Array) {
        let result = [];
        //如果是数组，那么数组里面的每一项类型又有可能是多样的
        data.forEach((item, index) => {
        if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
               result[index] = "null";
           } else {
               result[index] = jsonStringify(item);
           }
         });
         result = "[" + result + "]";
         return result.replace(/'/g, '"');
      } else {
         // 处理普通对象
         let result = [];
         Object.keys(data).forEach((item, index) => {
            if (typeof item !== 'symbol') {
              //key 如果是 symbol 对象，忽略
              if (data[item] !== undefined && typeof data[item] !== 'function' && typeof data[item] !== 'symbol') {
                //键值如果是 undefined、function、symbol 为属性值，忽略
                result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
              }
            }
         });
         return ("{" + result + "}").replace(/'/g, '"');
        }
    }
}
```



手工实现一个 JSON.stringify 方法的基本代码如上面所示，有几个问题还是需要注意一下：

+ 由于 function 返回 'null'， 并且 typeof function 能直接返回精确的判断，故在整体逻辑处理基础数据类型的时候，会随着 undefined，symbol 直接处理了；

+ 由于 01 讲说过 typeof null 的时候返回'object'，故 null 的判断逻辑整体在处理引用数据类型的逻辑里面；

+ 关于引用数据类型中的数组，由于数组的每一项的数据类型又有很多的可能性，故在处理数组过程中又将 undefined，symbol，function 作为数组其中一项的情况做了特殊处理；

+ 同样在最后处理普通对象的时候，key （键值）也存在和数组一样的问题，故又需要再针对上面这几种情况（undefined，symbol，function）做特殊处理；

+ 最后在处理普通对象过程中，对于循环引用的问题暂未做检测，如果是有循环引用的情况，需要抛出 Error；

+ 根据官方给出的 JSON.stringify 的第二个以及第三个参数的实现，本段模拟实现的代码并未实现，如果有兴趣你可以自己尝试一下。

整体来说这段代码还是比较复杂的，如果在面试过程中让你当场手写，其实整体还是需要考虑很多东西的。当然上面的代码根据每个人的思路不同，你也可以写出自己认为更优的代码，比如你也可以尝试直接使用 switch 语句，来分别针对特殊情况进行处理，整体写出来可能看起来会比上面的写法更清晰一些，这些可以根据自己情况而定。

#### 数组

##### Array 的构造器

Array 构造器用于创建一个新的数组。通常，我们推荐使用对象字面量的方式创建一个数组，例如 var a = [] 就是一个比较好的写法。但是，总有对象字面量表述乏力的时候，比如，我想创建一个长度为 6 的空数组，用对象字面量的方式是无法创建的，因此只能写成下述代码这样。

```js
// 使用 Array 构造器，可以自定义长度
var a = Array(6); // [empty × 6]
// 使用对象字面量
var b = [];
b.length = 6; // [undefined × 6]
```

Array 构造器根据参数长度的不同，有如下两种不同的处理方式：

new Array(arg1, arg2,…)，参数长度为 0 或长度大于等于 2 时，传入的参数将按照顺序依次成为新数组的第 0 至第 N 项（参数长度为 0 时，返回空数组）；

new Array(len)，当 len 不是数值时，处理同上，返回一个只包含 len 元素一项的数组；当 len 为数值时，len 最大不能超过 32 位无符号整型，即需要小于 2 的 32 次方（len 最大为 Math.pow(2,32)），否则将抛出 RangeError。

以上就是 Array 构造器的基本情况，我们来看下 ES6 新增的几个构造方法。

##### ES6 新增的构造方法：Array.of 和 Array.from

鉴于数组的常用性，ES6 专门扩展了数组构造器 Array ，新增了 2 个方法：Array.of、Array.from。其中，Array.of 整体用得比较少；而 Array.from 具有灵活性，你在平常开发中应该会经常使用。

###### Array.of

Array.of 用于将参数依次转化为数组中的一项，然后返回这个新数组，而不管这个参数是数字还是其他。它基本上与 Array 构造器功能一致，唯一的区别就在单个数字参数的处理上。

比如，在下面的这几行代码中，你可以看到区别：当参数为两个时，返回的结果是一致的；当参数是一个时，Array.of 会把参数变成数组里的一项，而构造器则会生成长度和第一个参数相同的空数组。

```js
Array.of(8.0); // [8]
Array(8.0); // [empty × 8]
Array.of(8.0, 5); // [8, 5]
Array(8.0, 5); // [8, 5]
Array.of('8'); // ["8"]
Array('8'); // ["8"]
```

###### Array.from

Array.from 的设计初衷是快速便捷地基于其他对象创建新数组，准确来说就是从一个类似数组的可迭代对象中创建一个新的数组实例。其实就是，只要一个对象有迭代器，Array.from 就能把它变成一个数组（注意：是返回新的数组，不改变原对象）。

从语法上看，Array.from 拥有 3 个参数：

类似数组的对象，必选；

加工函数，新生成的数组会经过该函数的加工再返回；

this 作用域，表示加工函数执行时 this 的值。

这三个参数里面第一个参数是必选的，后两个参数都是可选的。我们通过一段代码来看看它的用法。

```js
var obj = {0: 'a', 1: 'b', 2:'c', length: 3};
Array.from(obj, function(value, index){
  console.log(value, index, this, arguments.length);
  return value.repeat(3);   //必须指定返回值，否则返回 undefined
}, obj);
> a,0,{"0":"a","1":"b","2":"c","length":3},2
> b,1,{"0":"a","1":"b","2":"c","length":3},2
> c,2,{"0":"a","1":"b","2":"c","length":3},2
```

除了上述 obj 对象以外，拥有迭代器的对象还包括 String、Set、Map 等，Array.from 统统可以处理，请看下面的代码。

在 ES5 提供该方法之前，我们至少有如下 5 种方式去判断一个变量是否为数组。

```js
var a = [];
// 1.基于instanceof
a instanceof Array;
// 2.基于constructor
a.constructor === Array;
// 3.基于Object.prototype.isPrototypeOf
Array.prototype.isPrototypeOf(a);
// 4.基于getPrototypeOf
Object.getPrototypeOf(a) === Array.prototype;
// 5.基于Object.prototype.toString
Object.prototype.toString.apply(a) === '[object Array]';
```

上面这 5 个判断全部为 True，这里应该没什么疑问。实际上，通过 Object.prototype.toString 去判断一个值的类型，也是推荐的方法。

ES6 之后新增了一个 Array.isArray 方法，能直接判断数据类型是否为数组，但是如果 isArray 不存在，那么 Array.isArray 的 polyfill 通常可以这样写：

```js
if (!Array.isArray){
  Array.isArray = function(arg){
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
```

#### 改变自身的方法

基于 ES6，会改变自身值的方法一共有 9 个，分别为 **pop、push、reverse、shift、sort、splice、unshift**，以及两个 ES6 新增的方法 **copyWithin 和 fill**。

```js
// pop方法
var array = ["cat", "dog", "cow", "chicken", "mouse"];
var item = array.pop();
console.log(array); // ["cat", "dog", "cow", "chicken"]
console.log(item); // mouse
// push方法
var array = ["football", "basketball",  "badminton"];
var i = array.push("golfball");
console.log(array); 
// ["football", "basketball", "badminton", "golfball"]
console.log(i); // 4
// reverse方法
var array = [1,2,3,4,5];
var array2 = array.reverse();
console.log(array); // [5,4,3,2,1]
console.log(array2===array); // true
// shift方法
var array = [1,2,3,4,5];
var item = array.shift();
console.log(array); // [2,3,4,5]
console.log(item); // 1
// unshift方法
var array = ["red", "green", "blue"];
var length = array.unshift("yellow");
console.log(array); // ["yellow", "red", "green", "blue"]
console.log(length); // 4
// sort方法
var array = ["apple","Boy","Cat","dog"];
var array2 = array.sort();
console.log(array); // ["Boy", "Cat", "apple", "dog"]
console.log(array2 == array); // true
// splice方法
var array = ["apple","boy"];
var splices = array.splice(1,1);
console.log(array); // ["apple"]
console.log(splices); // ["boy"]
// copyWithin方法
var array = [1,2,3,4,5]; 
var array2 = array.copyWithin(0,3);
console.log(array===array2,array2);  // true [4, 5, 3, 4, 5]
// fill方法
var array = [1,2,3,4,5];
var array2 = array.fill(10,0,3);
console.log(array===array2,array2); 
// true [10, 10, 10, 4, 5], 可见数组区间[0,3]的元素全部替换为10
```

#### 不改变自身的方法

基于 ES7，不会改变自身的方法也有 9 个，分别为 concat、join、slice、toString、toLocaleString、indexOf、lastIndexOf、未形成标准的 toSource，以及 ES7 新增的方法 includes。

我们还是通过代码，快速了解这些方法的最基本用法。

```js
// concat方法
var array = [1, 2, 3];
var array2 = array.concat(4,[5,6],[7,8,9]);
console.log(array2); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(array); // [1, 2, 3], 可见原数组并未被修改
// join方法
var array = ['We', 'are', 'Chinese'];
console.log(array.join()); // "We,are,Chinese"
console.log(array.join('+')); // "We+are+Chinese"
// slice方法
var array = ["one", "two", "three","four", "five"];
console.log(array.slice()); // ["one", "two", "three","four", "five"]
console.log(array.slice(2,3)); // ["three"]
// toString方法
var array = ['Jan', 'Feb', 'Mar', 'Apr'];
var str = array.toString();
console.log(str); // Jan,Feb,Mar,Apr
// tolocalString方法
var array= [{name:'zz'}, 123, "abc", new Date()];
var str = array.toLocaleString();
console.log(str); // [object Object],123,abc,2016/1/5 下午1:06:23
// indexOf方法
var array = ['abc', 'def', 'ghi','123'];
console.log(array.indexOf('def')); // 1
// includes方法
var array = [-0, 1, 2];
console.log(array.includes(+0)); // true
console.log(array.includes(1)); // true
var array = [NaN];
console.log(array.includes(NaN)); // true
```

其中 includes 方法需要注意的是，如果元素中有 0，那么在判断过程中不论是 +0 还是 -0 都会判断为 True，这里的 includes 忽略了 +0 和 -0。

#### 数组遍历的方法

基于 ES6，不会改变自身的遍历方法一共有 12 个，分别为 forEach、every、some、filter、map、reduce、reduceRight，以及 ES6 新增的方法 entries、find、findIndex、keys、values。

```js
// forEach方法
var array = [1, 3, 5];
var obj = {name:'cc'};
var sReturn = array.forEach(function(value, index, array){
  array[index] = value;
  console.log(this.name); // cc被打印了三次, this指向obj
},obj);
console.log(array); // [1, 3, 5]
console.log(sReturn); // undefined, 可见返回值为undefined
// every方法
var o = {0:10, 1:8, 2:25, length:3};
var bool = Array.prototype.every.call(o,function(value, index, obj){
  return value >= 8;
},o);
console.log(bool); // true
// some方法
var array = [18, 9, 10, 35, 80];
var isExist = array.some(function(value, index, array){
  return value > 20;
});
console.log(isExist); // true 
// map 方法
var array = [18, 9, 10, 35, 80];
array.map(item => item + 1);
console.log(array);  // [19, 10, 11, 36, 81]
// filter 方法
var array = [18, 9, 10, 35, 80];
var array2 = array.filter(function(value, index, array){
  return value > 20;
});
console.log(array2); // [35, 80]
// reduce方法
var array = [1, 2, 3, 4];
var s = array.reduce(function(previousValue, value, index, array){
  return previousValue * value;
},1);
console.log(s); // 24
// ES6写法更加简洁
array.reduce((p, v) => p * v); // 24
// reduceRight方法 (和reduce的区别就是从后往前累计)
var array = [1, 2, 3, 4];
array.reduceRight((p, v) => p * v); // 24
// entries方法
var array = ["a", "b", "c"];
var iterator = array.entries();
console.log(iterator.next().value); // [0, "a"]
console.log(iterator.next().value); // [1, "b"]
console.log(iterator.next().value); // [2, "c"]
console.log(iterator.next().value); // undefined, 迭代器处于数组末尾时, 再迭代就会返回undefined
// find & findIndex方法
var array = [1, 3, 5, 7, 8, 9, 10];
function f(value, index, array){
  return value%2==0;     // 返回偶数
}
function f2(value, index, array){
  return value > 20;     // 返回大于20的数
}
console.log(array.find(f)); // 8
console.log(array.find(f2)); // undefined
console.log(array.findIndex(f)); // 4
console.log(array.findIndex(f2)); // -1
// keys方法
[...Array(10).keys()];     // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
[...new Array(10).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// values方法
var array = ["abc", "xyz"];
var iterator = array.values();
console.log(iterator.next().value);//abc
console.log(iterator.next().value);//xyz
```

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220421121602.png)

以上，数组的各方法基本讲解完毕，这些方法之间存在很多共性，如下：

+ 所有插入元素的方法，比如 push、unshift 一律返回数组新的长度；

+ 所有删除元素的方法，比如 pop、shift、splice 一律返回删除的元素，或者返回删除的多个元素组成的数组；

+ 部分遍历方法，比如 forEach、every、some、filter、map、find、findIndex，它们都包含 function(value,index,array){} 和 thisArg 这样两个形参。

### 类数组

我们先来看看在 JavaScript 中有哪些情况下的对象是类数组呢？主要有以下几种：

+ 函数里面的参数对象 arguments；

+ 用 getElementsByTagName/ClassName/Name 获得的 HTMLCollection；

+ 用 querySelector 获得的 NodeList。

#### 类数组的基本概念

##### arguments

先来重点讲讲 arguments 对象，我们在日常开发中经常会遇到各种类数组对象，最常见的便是在函数中使用的 arguments，它的对象只定义在函数体中，包括了函数的参数和其他属性。我们通过一段代码来看下 arguments 的使用方法，如下所示。

```js
function foo(name, age, sex) {
    console.log(arguments);
    console.log(typeof arguments);
    console.log(Object.prototype.toString.call(arguments));
}
foo('jack', '18', 'male');
> {"0":"jack","1":"18","2":"male"}
> object
> [object Arguments]
```

typeof 这个 arguments 返回的是 object，通过 Object.prototype.toString.call 返回的结果是 '[object arguments]'，可以看出来返回的不是 '[object array]'，说明 arguments 和数组还是有区别的。

##### HTMLCollection

HTMLCollection 简单来说是 HTML DOM 对象的一个接口，这个接口包含了获取到的 DOM 元素集合，返回的类型是类数组对象，如果用 typeof 来判断的话，它返回的是 'object'。**它是及时更新的，当文档中的 DOM 变化时，它也会随之变化。**

描述起来比较抽象，还是通过一段代码来看下 HTMLCollection 最后返回的是什么，我们先随便找一个页面中有 form 表单的页面，在控制台中执行下述代码。

```js
var elem1, elem2;
// document.forms 是一个 HTMLCollection
elem1 = document.forms[0];
elem2 = document.forms.item(0);
console.log(elem1);
console.log(elem2);
console.log(typeof elem1);
console.log(Object.prototype.toString.call(elem1));
> undefined
> null
> undefined
> [object Undefined] // 这里 undefined 不是很懂
```

##### NodeList

NodeList 对象是节点的集合，通常是由 querySlector 返回的。NodeList 不是一个数组，也是一种类数组。虽然 NodeList 不是一个数组，但是可以使用 for...of 来迭代。**在一些情况下，NodeList 是一个实时集合**，也就是说，如果文档中的节点树发生变化

#### 类数组应用场景

##### 遍历参数操作

我们在函数内部可以直接获取 arguments 这个类数组的值，那么也可以对于参数进行一些操作，比如下面这段代码，我们可以将函数的参数默认进行求和操作。

```js
function add() {
    var sum =0,
        len = arguments.length;
    for(var i = 0; i < len; i++){
        sum += arguments[i];
    }
    return sum;
}
add()                           // 0
add(1)                          // 1
add(1，2)                       // 3
add(1,2,3,4);                   // 10
```

结合上面这段代码，我们在函数内部可以将参数直接进行累加操作，以达到预期的效果，参数多少也可以不受限制，根据长度直接计算，返回出最后函数的参数的累加结果，其他的操作也都可以仿照这样的方式来做。我们再看下一种场景。

##### 定义链接字符串函数

我们可以通过 arguments 这个例子定义一个函数来连接字符串。这个函数唯一正式声明了的参数是一个字符串，该参数指定一个字符作为衔接点来连接字符串。该函数定义如下。

```js
function myConcat(separa) {
  var args = Array.prototype.slice.call(arguments, 1);
  return args.join(separa);
}
myConcat(", ", "red", "orange", "blue");
// "red, orange, blue"
myConcat("; ", "elephant", "lion", "snake");
// "elephant; lion; snake"
myConcat(". ", "one", "two", "three", "four", "five");
// "one. two. three. four. five"
```

##### 传递参数使用

```js
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
   console.log(a, b, c);
}
foo(1, 2, 3)   //1 2 3
```

#### 如何将类数组转换成数组

##### 类数组借用数组方法转数组

类数组因为不是真正的数组，所以没有数组类型上自带的那些方法，我们就需要利用下面这几个方法去借用数组的方法。比如借用数组的 push 方法，请看下面的一段代码。

```js
var arrayLike = { 
  0: 'java',
  1: 'script',
  length: 2
} 
Array.prototype.push.call(arrayLike, 'jack', 'lily'); 
console.log(typeof arrayLike); // 'object'
console.log(arrayLike);
// {0: "java", 1: "script", 2: "jack", 3: "lily", length: 4}
```

从中可以看到，arrayLike 其实是一个对象，模拟数组的一个类数组，从数据类型上说它是一个对象，新增了一个 length 的属性。从代码中还可以看出，用 typeof 来判断输出的是 'object'，它自身是不会有数组的 push 方法的，这里我们就用 call 的方法来借用 Array 原型链上的 push 方法，可以实现一个类数组的 push 方法，给 arrayLike 添加新的元素。

从控制台的结果可以看出，数组的 push 方法满足了我们想要实现添加元素的诉求。我们再来看下 arguments 如何转换成数组，请看下面这段代码。

```js
function sum(a, b) {
  let args = Array.prototype.slice.call(arguments);
 // let args = [].slice.call(arguments); // 这样写也是一样效果
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);  // 3
function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments);
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);  // 3
```

这段代码中可以看到，还是借用 Array 原型链上的各种方法，来实现 sum 函数的参数相加的效果。一开始都是将 arguments 通过借用数组的方法转换为真正的数组，最后都又通过数组的 reduce 方法实现了参数转化的真数组 args 的相加，最后返回预期的结果。

##### ES6 的方法转数组

对于类数组转换成数组的方式，我们还可以采用 ES6 新增的 Array.from 方法以及展开运算符的方法。那么还是围绕上面这个 sum 函数来进行改变，我们看下用 Array.from 和展开运算符是怎么实现转换数组的，请看下面一段代码的例子。

```js
function sum(a, b) {
  let args = Array.from(arguments);
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
function sum(a, b) {
  let args = [...arguments];
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
function sum(...args) {
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
```

从代码中可以看出，Array.from 和 ES6 的展开运算符，都可以把 arguments 这个类数组转换成数组 args，从而实现调用 reduce 方法对参数进行累加操作。其中第二种和第三种都是用 ES6 的展开运算符，虽然写法不一样，但是基本都可以满足多个参数实现累加的效果。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220421125119.png)













### 数据结构

#### 链表

```js
class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}
class LinkedList {
  constructor() {
    this.head = null
    this.length = 0
  }
  append(element) {
    const node = new Node(element)
    let current = null
    if (this.head == null) {
      this.head = node
    } else {
      current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = node
    }
    this.length++
  }
  insert(position, element) {
    if (position < 0 && position > this.length) {
       return false 
    } else {
      const node = new Node(element)
      let current = this.head
      let previous = null
      let index = 0
      if (position === 0) {
        this.head = node
        node.next = current
      } else {
        while (index++ < position) {
          previous = current
          current = current.next
        }
        node.next = current
        previous.next = node
      }
      this.length++
      return true
    }
  }
  
  removeAt(position) {
    if (position < 0 && position > this.length) {
      return false
    } else {
      let current = this.head
      let previous = null
      let index = 0
      if (position === 0) {
        this.head = current.next
      } else {
        while (index++ < position) {
          previous = current
          current = current.next
        }
        previous.next = current.next
      }
      this.length--
      return true
    }
  }
  findIndex(element) {
    let current = this.head
    let index = -1
    while (current) {
      if (current.element === element) {
        return index + 1
      }
      index++
      current = current.next
    }
    return -1
  }
  remove(element) {
    const index = this.findIndex(element)
    return this.removeAt(index)
  }
  get size() {
    return this.length
  }
  get isEmpty() {
    return !this.length
  }
  toString() {
    let current = this.head
    let slink = ''
    while (current) {
      slink += `${current.element}-`
      current = current.next
    }
    return slink
  }
}
// 初始化一个链表
var s = new LinkedList()
s.append(1)
s.append(2)
s.append(3)
s.append(4)
console.log(s)
console.log(s.isEmpty)
console.log(s.size)
```

#### 树

```js
class Node {
  constructor(element) {
    this.element = element
    this.left = null
    this.right = null
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null
  }
  insert(element) {
    const temp = new Node(element)
    var insertNode = function(root, node) {
      if (node.element > root.element) {
        if (root.right === null) {
          root.right = node
        } else {
          insertNode(root.right, node)
        }
      } else {
        if (root.left === null) {
          root.left = node
        } else {
          insertNode(root.left, node)
        }
      }
    }
    if (!this.root) {
      this.root = temp
    } else {
      insertNode(this.root, temp)
    }
  }
  // 中序遍历
  inOrderTraverse(callback) {
    const inOrderTraverseNode = (node, callback) => {
      if (node !== null) {
        inOrderTraverseNode(node.left, callback)
        callback(node.element)
        inOrderTraverseNode(node.right, callback)
      }
    }
    inOrderTraverseNode(this.root, callback)
  }
  // 前序遍历
  preOrderTraverse(callback) {
    const preOrderTraverseNode = (node, callback) => {
      if (node !== null) {
        callback(node.element)
        preOrderTraverseNode(node.left, callback)
        preOrderTraverseNode(node.right, callback)
      }
    }
    preOrderTraverseNode(this.root, callback)
  }
  // 后序遍历
  postOrderTraverse(callback) {
    const postOrderTraverseNode = (node, callback) => {
      if (node !== null) {
        postOrderTraverseNode(node.left, callback)
        postOrderTraverseNode(node.right, callback)
        callback(node.element)
      }
    }
    postOrderTraverseNode(this.root, callback)
  }
  min() {
    const minNode = node => {
      return node ? (node.left ? minNode(node.left) : node) : null
    }
    return minNode(this.root)
  }
  max() {
    const maxNode = node => {
      return node ? (node.right ? maxNode(node.right) : node) : null
    }
    return maxNode(this.root)
  }
  search(key) {
    const searchNode = (node, key) => {
      if (node === null) return
      if (node.element === key) {
        console.log(node)
        return node
      } else {
        return searchNode((key < node.element) ? node.left : node.right, key)
      }
    }
    searchNode(this.root, key)
  }
}
// 初始化一个BST
const tree = new BinarySearchTree()
tree.insert(11)
tree.insert(7)
tree.insert(5)
tree.insert(3)
tree.insert(9)
tree.insert(8)
tree.insert(10)
tree.insert(13)
tree.insert(12)
tree.insert(14)
tree.insert(20)
tree.insert(18)
tree.insert(25)
console.log(tree)
// 调用二叉树对应地获取最大最小，以及搜索的方法
var m = tree.min()
console.log(m.element)
var max = tree.max()
console.log(max)
var r = tree.search(12)
console.log(r)
```



### 知识体系

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123321.png)



![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123339.png)





![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123408.png)



![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123428.png)



![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123440.png)

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123537.png)

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220420123551.png)







### 最后

其实大前端技术都是相似相通的，我认为一名优秀的前端工程师应该具备以下特征：

1. 在技术层面应该抛开对开发框架的站队，除了应用层 API 的使用之外，能够更多地关注其底层原理、设计思路和通用理念，对中短期技术发展方向有大致思路，并思考如何与过往的开发经验相结合，融进属于自己的知识体系抽象网络；
2. 而在业务上应该跳出自身职能的范围，更多关注上下游合作方背后的思考逻辑，在推进项目时，能够结合大前端直面用户的优势，将自己的专业性和影响力辐射到协作方上下游，综合提升自己统筹项目的能力。