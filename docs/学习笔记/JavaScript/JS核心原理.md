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



### 扁平化的方式

#### 方法一：普通的递归实
普通的递归思路很容易理解，就是通过循环递归的方式，一项一项地去遍历，如果每一项还是一个数组，那么就继续往下遍历，利用递归程序的方法，来实现数组的每一项的连接。我们来看下这个方法是如何实现的，如下所示。

```js
// 方法1
var a = [1, [2, [3, 4, 5]]];
function flatten(arr) {
  let result = [];

  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
flatten(a);  //  [1, 2, 3, 4，5]
```

#### 方法二：利用 reduce 函数迭代
从上面普通的递归函数中可以看出，其实就是对数组的每一项进行处理，那么我们其实也可以用第 7 讲中说的 reduce 来实现数组的拼接，从而简化第一种方法的代码，改造后的代码如下所示。

```js
// 方法2
var arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
console.log(flatten(arr));//  [1, 2, 3, 4，5]
```

#### 方法三：扩展运算符实现
这个方法的实现，采用了扩展运算符和 some 的方法，两者共同使用，达到数组扁平化的目的，还是来看一下代码。

```js
// 方法3
var arr = [1, [2, [3, 4]]];
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```

#### 方法四：split 和 toString 共同处理
我们也可以通过 split 和 toString 两个方法，来共同实现数组扁平化，由于数组会默认带一个 toString 的方法，所以可以把数组直接转换成逗号分隔的字符串，然后再用 split 方法把字符串重新转换为数组，如下面的代码所示。

```js
// 方法4
var arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.toString().split(',');
}
console.log(flatten(arr)); //  [1, 2, 3, 4]
```

#### 方法五：调用 ES6 中的 flat
我们还可以直接调用 ES6 中的 flat 方法，可以直接实现数组扁平化。先来看下 flat 方法的语法：

> arr.flat([depth])

其中 depth 是 flat 的参数，depth 是可以传递数组的展开深度（默认不填、数值是 1），即展开一层数组。那么如果多层的该怎么处理呢？参数也可以传进 Infinity，代表不论多少层都要展开。那么我们来看下，用 flat 方法怎么实现，请看下面的代码。

```js
// 方法5
var arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.flat(Infinity);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```

#### 方法六：正则和 JSON 方法共同处理
我们在第四种方法中已经尝试了用 toString 方法，其中仍然采用了将 JSON.stringify 的方法先转换为字符串，然后通过正则表达式过滤掉字符串中的数组的方括号，最后再利用 JSON.parse 把它转换成数组。请看下面的代码。

```js
// 方法 6
let arr = [1, [2, [3, [4, 5]]], 6];
function flatten(arr) {
  let str = JSON.stringify(arr);
  str = str.replace(/(\[|\])/g, '');
  str = '[' + str + ']';
  return JSON.parse(str); 
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```



### sort 方法实现原理

#### 结论：

+ 当 n<=10 时，采用插入排序；

+ 当 n>10 时，采用三路快速排序；

+ 10<n <=1000，采用中位数作为哨兵元素；

+ n>1000，每隔 200~215 个元素挑出一个元素，放到一个新数组中，然后对它排序，找到中间位置的数，以此作为中位数。

1. 为什么元素个数少的时候要采用插入排序？

虽然插入排序理论上是平均时间复杂度为 O(n^2) 的算法，快速排序是一个平均 O(nlogn) 级别的算法。但是别忘了，这只是理论上平均的时间复杂度估算，但是它们也有最好的时间复杂度情况，而插入排序在最好的情况下时间复杂度是 O(n)。

在实际情况中两者的算法复杂度前面都会有一个系数，当 n 足够小的时候，快速排序 nlogn 的优势会越来越小。倘若插入排序的 n 足够小，那么就会超过快排。而事实上正是如此，插入排序经过优化以后，对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排。因此，对于很小的数据量，应用插入排序是一个非常不错的选择。

2. 为什么要花这么大的力气选择哨兵元素？

因为快速排序的性能瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或者最大元素，那么进行 partition（一边是小于哨兵的元素，另一边是大于哨兵的元素）时，就会有一边是空的。如果这么排下去，递归的层数就达到了 n , 而每一层的复杂度是 O(n)，因此快排这时候会退化成 O(n^2) 级别。

这种情况是要尽力避免的，那么如何来避免？就是让哨兵元素尽可能地处于数组的中间位置，让最大或者最小的情况尽可能少。这时候，你就能理解 V8 里面所做的各种优化了。

接下来，我们看一下官方实现的 sort 排序算法的代码基本结构。

```js
function ArraySort(comparefn) {
	  CHECK_OBJECT_COERCIBLE(this,"Array.prototype.sort");
	  var array = TO_OBJECT(this);
	  var length = TO_LENGTH(array.length);
	  return InnerArraySort(array, length, comparefn);
}
function InnerArraySort(array, length, comparefn) {
  // 比较函数未传入
  if (!IS_CALLABLE(comparefn)) {
	    comparefn = function (x, y) {
	      if (x === y) return 0;
	      if (%_IsSmi(x) && %_IsSmi(y)) {
	        return %SmiLexicographicCompare(x, y);
	      }
	      x = TO_STRING(x);
	      y = TO_STRING(y);
	      if (x == y) return 0;
	      else return x < y ? -1 : 1;
	 };
  }
  function InsertionSort(a, from, to) {
    // 插入排序
    for (var i = from + 1; i < to; i++) {
	      var element = a[i];
	      for (var j = i - 1; j >= from; j--) {
	        var tmp = a[j];
	        var order = comparefn(tmp, element);
	        if (order > 0) {
	          a[j + 1] = tmp;
	        } else {
	          break;
	        }
	      }
	    a[j + 1] = element;
	 }
  }
  function GetThirdIndex(a, from, to) {   // 元素个数大于1000时寻找哨兵元素
    var t_array = new InternalArray();
	var increment = 200 + ((to - from) & 15);
	var j = 0;
	from += 1;
	to -= 1;
	for (var i = from; i < to; i += increment) {
	   t_array[j] = [i, a[i]];
	   j++;
	}
	t_array.sort(function(a, b) {
	   return comparefn(a[1], b[1]);
	});
	var third_index = t_array[t_array.length >> 1][0];
	return third_index;
  }
  function QuickSort(a, from, to) {  // 快速排序实现
        //哨兵位置
	    var third_index = 0;
	    while (true) {
	      if (to - from <= 10) {
	        InsertionSort(a, from, to); // 数据量小，使用插入排序，速度较快
	        return;
	      }
	      if (to - from > 1000) {
	        third_index = GetThirdIndex(a, from, to);
	      } else {
            // 小于1000 直接取中点
	        third_index = from + ((to - from) >> 1);
	      }
          // 下面开始快排
	      var v0 = a[from];
	      var v1 = a[to - 1];
	      var v2 = a[third_index];
	      var c01 = comparefn(v0, v1);
	      if (c01 > 0) {
	        var tmp = v0;
	        v0 = v1;
	        v1 = tmp;
	      }
	      var c02 = comparefn(v0, v2);
	      if (c02 >= 0) {
	        var tmp = v0;
	        v0 = v2;
	        v2 = v1;
	        v1 = tmp;
	      } else {
	        var c12 = comparefn(v1, v2);
	        if (c12 > 0) {
	          var tmp = v1;
	          v1 = v2;
	          v2 = tmp;
	        }
	      }
	      a[from] = v0;
	      a[to - 1] = v2;
	      var pivot = v1;
	      var low_end = from + 1; 
	      var high_start = to - 1;
	      a[third_index] = a[low_end];
	      a[low_end] = pivot;
	      partition: for (var i = low_end + 1; i < high_start; i++) {
	        var element = a[i];
	        var order = comparefn(element, pivot);
	        if (order < 0) {
	          a[i] = a[low_end];
	          a[low_end] = element;
	          low_end++;
	        } else if (order > 0) {
	          do {
	            high_start--;
	            if (high_start == i) break partition;
	            var top_elem = a[high_start];
	            order = comparefn(top_elem, pivot);
	          } while (order > 0);
	          a[i] = a[high_start];
	          a[high_start] = element;
	          if (order < 0) {
	            element = a[i];
	            a[i] = a[low_end];
	            a[low_end] = element;
	            low_end++;
	          }
	        }
	      }
          // 快排的核心思路，递归调用快速排序方法
	      if (to - high_start < low_end - from) {
	        QuickSort(a, high_start, to);
	        to = low_end;
	      } else {
	        QuickSort(a, from, low_end);
	        from = high_start;
	      }
	  }
  }
```

从上面的源码分析来看，当数据量小于 10 的时候用插入排序；当数据量大于 10 之后采用三路快排；当数据量为 10~1000 时候直接采用中位数为哨兵元素；当数据量大于 1000 的时候就开始寻找哨兵元素。

我们直接从上面的源码中就可以看到整个 sort 源码的编写逻辑，也就是上面总结分析的逻辑对应实现。如果你还是没有理解得很好，我建议你再重新看一下插入排序和快速排序的核心逻辑。其实关键点在于根据数据量的大小，从而确定用什么排序来解决；时间复杂度是根据数据量的大小，从而进行变化的，这一点需要深入理解。

### 异步编程

我们在日常开发中都用过哪些 JS 异步编程的方式？总结起来无外乎有这几种：回调函数、事件监听、Promise、Generator、async/await，这几种 JS 的编程方式都是异步编程。回调函数方式是最早的 JS 异步编程的方式，后随着 ES 标准的发展，Promise、Generator 和 async/await 接连出现。

#### 什么是同步？
所谓的同步就是在执行某段代码时，在该代码没有得到返回结果之前，其他代码暂时是无法执行的，但是一旦执行完成拿到返回值之后，就可以执行其他代码了。换句话说，在此段代码执行完未返回结果之前，会阻塞之后的代码执行，这样的情况称为同步。

#### 什么是异步？
所谓异步就是当某一代码执行异步过程调用发出后，这段代码不会立刻得到返回结果。而是在异步调用发出之后，一般通过回调函数处理这个调用之后拿到结果。异步调用发出后，不会影响阻塞后面的代码执行，这样的情形称为异步。

#### JS 编程中为什么需要异步？
我们都知道 JavaScript 是单线程的，如果 JS 都是同步代码执行意味着什么呢？这样可能会造成阻塞，如果当前我们有一段代码需要执行时，如果使用同步的方式，那么就会阻塞后面的代码执行；而如果使用异步则不会阻塞，我们不需要等待异步代码执行的返回结果，可以继续执行该异步任务之后的代码逻辑。因此在 JS 编程中，会大量使用异步来进行编程，这也是我要专门讲解这部分的原因。

#### JS 异步编程方式发展历程
说完了异步编程的基本概念，下面我们按照时间顺序来看一下 JS 异步编程的实现方式。

##### 回调函数
从历史发展的脉络来看，早些年为了实现 JS 的异步编程，一般都采用回调函数的方式，比如比较典型的事件的回调，或者用 setTimeout/ setInterval 来实现一些异步编程的操作，但是使用回调函数来实现存在一个很常见的问题，那就是回调地狱。

这里我列举了一种现实开发中会遇到的场景，我们来看一下代码。

```js
fs.readFile(A, 'utf-8', function(err, data) {
    fs.readFile(B, 'utf-8', function(err, data) {
        fs.readFile(C, 'utf-8', function(err, data) {
            fs.readFile(D, 'utf-8', function(err, data) {
                //....
            });
        });
    });
});
```

从上面的代码可以看出，其逻辑为先读取 A 文本内容，再根据 A 文本内容读取 B，然后再根据 B 的内容读取 C。为了实现这个业务逻辑，上面实现的代码就很容易形成回调地狱。回调实现异步编程的场景也有很多，比如：

1. ajax 请求的回调；

2. 定时器中的回调；

3. 事件回调；

4. Nodejs 中的一些方法回调。

异步回调如果层级很少，可读性和代码的维护性暂时还是可以接受，一旦层级变多就会陷入回调地狱，上面这些异步编程的场景都会涉及回调地狱的问题。下面我们来看一下针对上面这个业务场景，改成 Promise 来实现异步编程，会是什么样子的呢？

##### Promise
为了解决回调地狱的问题，之后社区提出了 Promise 的解决方案，ES6 又将其写进了语言标准，采用 Promise 的实现方式在一定程度上解决了回调地狱的问题。

我们还是针对上面的这个场景来看下先读取 A 文本内容，再根据 A 文本内容读取 B 文件，接着再根据 B 文件的内容读取 C 文件。我们看这样的实现通过 Promise 改造之后是什么样的，请看代码。

```js
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}
read(A).then(data => {
    return read(B);
}).then(data => {
    return read(C);
}).then(data => {
    return read(D);
}).catch(reason => {
    console.log(reason);
});
```

##### Generator
Generator 也是一种异步编程解决方案，它最大的特点就是可以交出函数的执行权，Generator 函数可以看出是异步任务的容器，需要暂停的地方，都用 yield 语法来标注。Generator 函数一般配合 yield 使用，Generator 函数最后返回的是迭代器。如果你对迭代器不太了解，可以自行补习一下这部分内容。

```js
function* gen() {
    let a = yield 111;
    console.log(a);
    let b = yield 222;
    console.log(b);
    let c = yield 333;
    console.log(c);
    let d = yield 444;
    console.log(d);
}
let t = gen();
t.next(1); //第一次调用next函数时，传递的参数无效，故无打印结果
t.next(2); // a输出2;
t.next(3); // b输出3; 
t.next(4); // c输出4;
t.next(5); // d输出5;
```

##### async/await
ES6 之后 ES7 中又提出了新的异步解决方案：async/await，async 是 Generator 函数的语法糖，async/await 的优点是代码清晰（不像使用 Promise 的时候需要写很多 then 的方法链），可以处理回调地狱的问题。async/await 写起来使得 JS 的异步代码看起来像同步代码，其实异步编程发展的目标就是让异步逻辑的代码看起来像同步一样容易理解。

`````js
function testWait() {
    return new Promise((resolve,reject)=>{
        setTimeout(function(){
            console.log("testWait");
            resolve();
        }, 1000);
    })
}
async function testAwaitUse(){
    await testWait()
    console.log("hello");
    return 123;
    // 输出顺序：testWait，hello
    // 第十行如果不使用await输出顺序：hello , testWait
}
console.log(testAwaitUse());
`````

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220425172226.png)

### 深入理解 Promise

#### Promise 的基本情况

如果一定要解释 Promise 到底是什么，简单来说它就是一个容器，里面保存着某个未来才会结束的事件（通常是异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。我们来简单看一下 Promise 实现的链式调用代码，如下所示。

```js
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}
read(A).then(data => {
    return read(B);
}).then(data => {
    return read(C);
}).then(data => {
    return read(D);
}).catch(reason => {
    console.log(reason);
});
```

结合上面的代码，我们一起来分析一下 Promise 内部的状态流转情况，Promise 对象在被创建出来时是待定的状态，它让你能够把异步操作返回最终的成功值或者失败原因，和相应的处理程序关联起来。

一般 Promise 在执行过程中，必然会处于以下几种状态之一。

1. 待定（pending）：初始状态，既没有被完成，也没有被拒绝。

2. 已完成（fulfilled）：操作成功完成。

3. 已拒绝（rejected）：操作失败。

待定状态的 Promise 对象执行的话，最后要么会通过一个值完成，要么会通过一个原因被拒绝。当其中一种情况发生时，我们用 Promise 的 then 方法排列起来的相关处理程序就会被调用。因为最后 Promise.prototype.then 和 Promise.prototype.catch 方法返回的是一个 Promise， 所以它们可以继续被链式调用。

关于 Promise 的状态流转情况，有一点值得注意的是，内部状态改变之后不可逆，你需要在编程过程中加以注意。文字描述比较晦涩，我们直接通过一张图就能很清晰地看出 Promise 内部状态流转的情况，如下所示（图片来源于网络）。

![img](https://s0.lgstatic.com/i/image6/M01/05/09/Cgp9HWAvhIyAH1WgAAES_06spV4639.png)

从上图可以看出，我们最开始创建一个新的 Promise 返回给 p1 ，然后开始执行，状态是 pending，当执行 resolve 之后状态就切换为 fulfilled，执行 reject 之后就变为 rejected 的状态。

关于 Promise 的状态切换如果你想深入研究，可以学习一下“有限状态机”这个知识点。日常中比较常见的状态机有很多，比如马路上的红绿灯。

那么，Promise 的基本情况先介绍到这里，我们再一起来分析下，Promise 如何解决回调地狱的问题。

#### Promise 如何解决回调地狱

首先，请你再回想一下什么是回调地狱，回调地狱有两个主要的问题：

1. 多层嵌套的问题；

3. 每种任务的处理结果存在两种可能性（成功或失败），那么需要在每种任务执行结束后分别处理这两种可能性。

这两种问题在“回调函数时代”尤为突出，Promise 的诞生就是为了解决这两个问题。Promise 利用了三大技术手段来解决回调地狱：**回调函数延迟绑定、返回值穿透、错误冒泡**。

下面我们通过一段代码来说明，如下所示。

```js
let readFilePromise = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')
});
```

从上面的代码中可以看到，回调函数不是直接声明的，而是通过后面的 then 方法传入的，即延迟传入，这就是回调函数延迟绑定。接下来我们针对上面的代码做一下微调，如下所示。

```js
let x = readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')  //这是返回的Promise
});
x.then(/* 内部逻辑省略 */)
```

我们根据 then 中回调函数的传入值创建不同类型的 Promise，然后把返回的 Promise 穿透到外层，以供后续的调用。这里的 x 指的就是内部返回的 Promise，然后在 x 后面可以依次完成链式调用。这便是返回值穿透的效果，这两种技术一起作用便可以将深层的嵌套回调写成下面的形式。

```js
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
});
```

这样就显得清爽了许多，更重要的是，它更符合人的线性思维模式，开发体验也更好，两种技术结合产生了链式调用的效果。

这样解决了多层嵌套的问题，那另外一个问题，即每次任务执行结束后分别处理成功和失败的情况怎么解决的呢？Promise 采用了错误冒泡的方式。其实很容易理解，我们来看看效果。

```js
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
}).catch(err => {
  // xxx
})
```

这样前面产生的错误会一直向后传递，被 catch 接收到，就不用频繁地检查错误了。从上面的这些代码中可以看到，Promise 解决效果也比较明显：实现链式调用，解决多层嵌套问题；实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题。

接下来我们再看看 Promise 提供了哪些静态的方法。

#### Promise 的静态方法

##### all 方法
语法： Promise.all（iterable）

参数： 一个可迭代对象，如 Array。

描述： 此方法对于汇总多个 promise 的结果很有用，在 ES6 中可以将多个 Promise.all 异步请求并行操作，返回结果一般有下面两种情况。

1. 当所有结果成功返回时按照请求顺序返回成功。

2. 当其中有一个失败方法时，则进入失败方法。

##### allSettled 方法
Promise.allSettled 的语法及参数跟 Promise.all 类似，其参数接受一个 Promise 的数组，返回一个新的 Promise。唯一的不同在于，执行完之后不会失败，也就是说当 Promise.allSettled 全部处理完成后，我们可以拿到每个 Promise 的状态，而不管其是否处理成功。

##### any 方法
语法： Promise.any（iterable）

参数： iterable 可迭代的对象，例如 Array。

描述： any 方法返回一个 Promise，只要参数 Promise 实例有一个变成 fulfilled 状态，最后 any 返回的实例就会变成 fulfilled 状态；如果所有参数 Promise 实例都变成 rejected 状态，包装实例就会变成 rejected 状态。

##### race 方法
语法： Promise.race（iterable）

参数： iterable 可迭代的对象，例如 Array。

描述： race 方法返回一个 Promise，只要参数的 Promise 之中有一个实例率先改变状态，则 race 方法的返回状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 race 方法的回调函数。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220425182928.png)

### 实现符合 Promise/A+ 规范的 Promise

#### Promise/A+ 规范

只有对规范进行解读并且形成明确的认知，才能更好地实现 Promise。官方的地址为：https://promisesaplus.com/，这是一个英文的版本，我把其中比较关键的部分挑了出来。

##### 术语

先来看看 Promise/A+ 规范的基本术语，如下所示。

> “promise” is an object or function with a then method whose behavior conforms to this specification.
> “thenable” is an object or function that defines a then method.
> “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
> “exception” is a value that is thrown using the throw statement.
> “reason” is a value that indicates why a promise was rejected.

翻译过来，它所描述的就是以下五点。

> “promise”：是一个具有 then 方法的对象或者函数，它的行为符合该规范。
>
> “thenable”：是一个定义了 then 方法的对象或者函数。
>
> “value”：可以是任何一个合法的 JavaScript 的值（包括 undefined、thenable 或 promise）。
>
> “exception”：是一个异常，是在 Promise 里面可以用 throw 语句抛出来的值。
>
> “reason”：是一个 Promise 里 reject 之后返回的拒绝原因。

##### 状态描述
看完了术语部分，我们再看下Promise/A+ 规范中，对 Promise 的内部状态的描述，如下所示。

> A promise must be in one of three states: pending, fulfilled, or rejected.
> When pending, a promise:
> may transition to either the fulfilled or rejected state.
> When fulfilled, a promise:
> must not transition to any other state.
> must have a value, which must not change.
> When rejected, a promise:
> must not transition to any other state.
> must have a reason, which must not change.
> Here, “must not change” means immutable identity (i.e. ===), but does not imply deep immutability.

将上述描述总结起来，大致有以下几点。

> 一个 Promise 有三种状态：pending、fulfilled 和 rejected。
>
> 当状态为 pending 状态时，即可以转换为 fulfilled 或者 rejected 其中之一。
>
> 当状态为 fulfilled 状态时，就不能转换为其他状态了，必须返回一个不能再改变的值。
>
> 当状态为 rejected 状态时，同样也不能转换为其他状态，必须有一个原因的值也不能改变。

##### then 方法
关于 then 方法的英文解读和翻译，我直接总结了出来：一个 Promise 必须拥有一个 then 方法来访问它的值或者拒绝原因。

then 方法有两个参数：

>  promise.then(onFulfilled, onRejected)

onFulfilled 和 onRejected 都是可选参数。

##### onFulfilled 和 onRejected 特性

如果 onFulfilled 是函数，则当 Promise 执行结束之后必须被调用(?还不理解)，最终返回值为 value，其调用次数不可超过一次。而 onRejected 除了最后返回的是 reason 外，其他方面和 onFulfilled 在规范上的表述基本一样。

##### 多次调用

then 方法其实可以被一个 Promise 调用多次，且必须返回一个 Promise 对象。then 的写法如下所示，其中 Promise1 执行了 then 的方法之后，返回的依旧是个 Promise2，然后我们拿着 Promise2 又可以执行 then 方法，而 Promise2 是一个新的 Promise 对象，又可以继续进行 then 方法调用。

```js
promise2 = promise1.then(onFulfilled, onRejected);
```

#### 一步步实现 Promise
按照 Promise/A+ 的规范，第一步就是构造函数。

##### 构造函数
这一步的思路是：Promise 构造函数接受一个 executor 函数，executor 函数执行完同步或者异步操作后，调用它的两个参数 resolve 和 reject。请看下面的代码，大致的构造函数框架就是这样的。

```js
function Promise(executor) {
  var self = this
  self.status = 'pending'   // Promise当前的状态
  self.data = undefined     // Promise的值
  self.onResolvedCallback = [] // Promise resolve时的回调函数集
  self.onRejectedCallback = [] // Promise reject时的回调函数集
  executor(resolve, reject) // 执行executor并传入相应的参数
}
```

从上面的代码中可以看出，我们先定义了一个 Promise 的初始状态 pending，以及参数执行函数 executor，并且按照规范设计了一个 resolve 回调函数集合数组 onResolvedCallback 以及 一个 reject 回调函数集合数组，那么构造函数的初始化就基本完成了。

接下来我们看看还需要添加什么东西呢？那就是需要在构造函数中完善 resolve 和 reject 两个函数，完善之后的代码如下。

```js
function Promise(executor) {
  var self = this
  self.status = 'pending'   // Promise当前的状态
  self.data = undefined    // Promise的值
  self.onResolvedCallback = [] // Promise resolve时的回调函数集
  self.onRejectedCallback = [] // Promise reject时的回调函数集
  function resolve(value) {
    // TODO
  }
  function reject(reason) {
    // TODO
  }
  try { // 考虑到执行过程中有可能出错，所以我们用try/catch块给包起
    executor(resolve, reject) // 执行executor
  } catch(e) {
    reject(e)
  }
}
```

resolve 和 reject 内部应该怎么实现呢？我们根据规范知道这两个方法主要做的事情就是返回对应状态的值 value 或者 reason，并把 Promise 内部的 status 从 pending 变成对应的状态，并且这个状态在改变了之后是不可以逆转的。

那么这两个函数应该怎么写呢？可以看下面的这段代码。

```js
function Promise(executor) {
  // ...上面的省略
  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.data = value
      for(var i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }
  
  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason
      for(var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason)
      }
    }
  }
  // 下面的省略
}
```

上述代码所展示的，基本就是在判断状态为 pending 之后，把状态改为相应的值，并把对应的 value 和 reason 存在内部的 data 属性上面，之后执行相应的回调函数。逻辑比较简单，无非是由于 onResolveCallback 和 onRejectedCallback 这两个是数组，需要通过循环来执行

##### 实现 then 方法
根据标准，我们要考虑几个问题。

then 方法是 Promise 执行完之后可以拿到 value 或者 reason 的方法，并且还要保持 then 执行之后，返回的依旧是一个 Promise 方法，还要支持多次调用（上面标准中提到过）。

因此 then 方法实现的思路也有了，请看下面的一段代码。

```js
// then方法接收两个参数onResolved和onRejected，分别为Promise成功或失败后的回调
Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2
  // 根据标准，如果then的参数不是function，则需要忽略它
  onResolved = typeof onResolved === 'function' ? onResolved : function(v) {}
  onRejected = typeof onRejected === 'function' ? onRejected : function(r) {}
  if (self.status === 'resolved') {
    return promise2 = new Promise(function(resolve, reject) {
    })
  }
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
    })
  }
  if (self.status === 'pending') {
    return promise2 = new Promise(function(resolve, reject) {
    })
  }
}
```

从上面的代码中可以看到，我们在 then 方法内部先初始化了 Promise2 的对象，用来存放执行之后返回的 Promise，并且还需要判断 then 方法传参进来的两个参数必须为函数，这样才可以继续执行。

上面我只是搭建了 then 方法框架的整体思路，但是不同状态的返回细节处理也需要完善，通过仔细阅读标准，完善之后的 then 的代码如下。

```js
Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2
  // 根据标准，如果then的参数不是function，则需要忽略它
  onResolved = typeof onResolved === 'function' ? onResolved : function(value) {}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {}
  if (self.status === 'resolved') {
    // 如果promise1的状态已经确定并且是resolved，我们调用onResolved，考虑到有可能throw，所以还需要将其包在try/catch块里
    return promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onResolved(self.data)
        if (x instanceof Promise) {
// 如果onResolved的返回值是一个Promise对象，直接取它的结果作为promise2的结果
          x.then(resolve, reject)
        }
        resolve(x) // 否则，以它的返回值作为promise2的结果
      } catch (e) {
        reject(e) // 如果出错，以捕获到的错误作为promise2的结果
      }
    })
  }
  // 此处与前一个if块的逻辑几乎相同，区别在于所调用的是onRejected函数
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onRejected(self.data)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  if (self.status === 'pending') {
  // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，只能等到Promise的状态确定后，才能确定如何处理
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
      self.onRejectedCallback.push(function(reason) {
        try {
          var x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}
```

根据上面的代码可以看出，我们基本实现了一个符合标准的 then 方法。但是标准里提到了，还要支持不同的 Promise 进行交互，关于不同的 Promise 交互其实Promise 标准说明中有提到。其中详细指定了如何通过 then 的实参返回的值来决定 Promise2 的状态。

关于为何需要不同的 Promise 实现交互，原因应该是 Promise 并不是 JS 一开始存在的标准，如果你使用的某一个库中封装了一个 Promise 的实现，想象一下如果它不能跟你自己使用的 Promise 实现交互的情况，其实还是会有问题的，因此我们还需要调整一下 then 方法中执行 Promise 的方法。

另外还有一个需要注意的是，在 Promise/A+ 规范中，onResolved 和 onRejected 这两项函数需要异步调用，关于这一点，标准里面是这么说的：

> In practice, this requirement ensures that onFulfilled and onRejected execute asynchronously, after the event loop turn in which then is called, and with a fresh stack.

所以我们需要对代码做一点变动，即在处理 Promise 进行 resolve 或者 reject 的时候，加上 setTimeout(fn, 0)。

下面就结合上面两点调整，给出完整版的代码

```js
try {
  module.exports = Promise
} catch (e) {}
function Promise(executor) {
  var self = this
  self.status = 'pending'
  self.onResolvedCallback = []
  self.onRejectedCallback = []
  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    setTimeout(function() { // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    })
  }
  function reject(reason) {
    setTimeout(function() { // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason)
        }
      }
    })
  }
  try {
    executor(resolve, reject)
  } catch (reason) {
    reject(reason)
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }
  if (x instanceof Promise) {
    if (x.status === 'pending') { 
      x.then(function(v) {
        resolvePromise(promise2, v, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
    return
  }
  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    resolve(x)
  }
}
Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2
  onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
    return v
  }
  onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
    throw r
  }
  if (self.status === 'resolved') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() { // 异步执行onResolved
        try {
          var x = onResolved(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    })
  }
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() { // 异步执行onRejected
        try {
          var x = onRejected(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    })
  }
  if (self.status === 'pending') {
    // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
      self.onRejectedCallback.push(function(reason) {
          try {
            var x = onRejected(reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (r) {
            reject(r)
          }
        })
    })
  }
}
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}
// 最后这个是测试用的，后面会说
Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
```

最终版的 Promise 的实现还是需要经过规范的测试（Promise /A+ 规范测试的工具地址为：https://github.com/promises-aplus/promises-tests），需要暴露一个 deferred 方法（即 exports.deferred 方法），上面提供的代码中我已经将其加了进去。

最后，执行如下代码 npm 安装之后，即可执行测试。

```cmd
npm i -g promises-aplus-tests
promises-aplus-tests Promise.js
```



### 垃圾回收

#### JavaScript 的内存管理

不管是什么样的计算机程序语言，运行在对应的代码引擎上，对应的使用内存过程大致逻辑是一样的，可以分为这三个步骤：

1. 分配你所需要的系统内存空间；

2. 使用分配到的内存进行读或者写等操作；

3. 不需要使用内存时，将其空间释放或者归还。

与其他需要手动管理内存的语言不太一样的地方是，在 JavaScript 中，当我们创建变量（对象，字符串等）的时候，系统会自动给对象分配对应的内存。

```js
var a = 123; // 给数值变量分配栈内存
var etf = "ARK"; // 给字符串分配栈内存
// 给对象及其包含的值分配堆内存
var obj = {
  name: 'tom',
  age: 13
}; 
// 给数组及其包含的值分配内存（就像对象一样）
var a = [1, null, "PSAC"]; 
// 给函数（可调用的对象）分配内存
function sum(a, b){
  return a + b;
}
```

当系统经过一段时间发现这些变量不会再被使用的时候，会通过垃圾回收机制的方式来处理掉这些变量所占用的内存，其实开发者不用过多关心内存问题。即便是这样，我们在开发过程中也需要了解 JavaScript 的内存管理机制，这样才能避免一些不必要的问题，在 JavaScript 中数据类型分为两类：简单类型和引用类型。

对于简单的数据类型，内存是保存在栈（stack）空间中的；复杂数据类型，内存保存在堆（heap）空间中。简而言之，基本就是说明以下两点。

基本类型：这些类型在内存中会占据固定的内存空间，它们的值都保存在栈空间中，直接可以通过值来访问这些；

引用类型：由于引用类型值大小不固定（比如上面的对象可以添加属性等），栈内存中存放地址指向堆内存中的对象，是通过引用来访问的。

因此总结来说：**栈内存中的基本类型，可以通过操作系统直接处理；而堆内存中的引用类型，正是由于可以经常变化，大小不固定，因此需要 JavaScript 的引擎通过垃圾回收机制来处理。**

#### Chrome 内存回收机制
在 Chrome 浏览器中，JavaScript 的 V8 引擎被限制了内存的使用，根据不同的操作系统（操作系统有 64 位和 32 位的）内存大小会不同，大的可以到 1.4G 的空间，小的只能到 0.7G 的空间。

那么请你思考一下，为什么要去限制内存使用呢？大致是两个原因：V8 最开始是为浏览器而设计的引擎，早些年由于 Web 应用都比较简单，其实并未考虑占据过多的内存空间；另外又由于被 V8 的垃圾回收机制所限制，比如清理大量的内存时会耗费很多时间，这样会引起 JavaScript 执行的线程被挂起，会影响当前执行的页面应用的性能。

下面我们来看下 Chrome 的内存回收机制。Chrome 的 JavaScript 引擎 V8 将堆内存分为两类 **新生代的回收机制和老生代的回收机制**，我们来分别看看这两种堆的内存回收机制是什么原理。

##### 新生代内存回收
我们先来看下新生代的内存回收的空间，在 64 位操作系统下分配为 32MB，正是因为新生代中的变量存活时间短，不太容易产生太大的内存压力，因此不够大也是可以理解的。首先系统会将分配给新生代的内存空间分为两部分，如下图所示。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220425173236.png)

图中左边部分表示正在使用的内存空间，右边是目前闲置的内存空间。当浏览器开始进行内存的垃圾回收时，JavaScript 的 V8 引擎会将左边的对象检查一遍。如果引擎检测是存活对象，那么会复制到右边的内存空间去；如果不是存活的对象，则直接进行系统回收。当所有左边的内存里的对象没有了的时候，等再有新生代的对象产生时，上面的部分左右对调，这样来循环处理。

如果是顺序放置的那比较好处理，可以按照上面所说的处理方式。但是如果是下图这样零散的场景怎么处理呢？

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220425173311.png)

图中橙色的块代表存活对象，白色地方代表未分配的内存。正常情况下，由于堆内存是连续分配的，但是也有可能出现上图的这种内存分配情况，这种零散的分配情况就造成了内存碎片，会影响比较大的内存对象的放置。

因此这里介绍一个算法 Scavenge，它主要就是解决上图中内存碎片的情况，在通过算法处理过后，内存中对象的排布都会变成下图这个排列方式，请看效果。

![img](https://s0.lgstatic.com/i/image6/M01/15/DC/CioPOWBFyf2AOkMAAABanoDBiq0058.png)

进行这样的算法处理，明显会让内存排布变得更整齐了，这样就非常方便之后新来的对象的内存分配。

##### 老生代内存回收
上面讲解了新生代的回收方式，那么新生代中的变量如果经过回收之后依然一直存在，那么就会被放入到老生代内存中。时间长了之后通过几个原因的判断，我们就会把这些变量进行 "晋升"，只要是已经经历过一次 Scavenge 算法回收的，就可以晋升为老生代内存的对象。那么在进入老生代的内存回收机制中，就不能再用 Scavenge 的算法了。Scavenge 的算法是有其适用的场景，而对于内存空间比较大的，就不适合用 Scavenge 算法了。

那么老生代内存中的垃圾回收，是采用什么样的策略进行的呢？这里采用了 Mark-Sweep（标记清除） 和 Mark-Compact（标记整理）的策略，我们先来看下 Mark-Sweep 标记清除的策略。

###### 标记清除（Mark-Sweep）

通过名字你就可以理解，标记清除分为两个阶段：标记阶段和清除阶段。

首先它会遍历堆上的所有的对象，分别对它们打上标记；然后在代码执行过程结束之后，对使用过的变量取消标记。那么没取消标记的就是没有使用过的变量，因此在清除阶段，就会把还有标记的进行整体清除，从而释放内存空间。

听起来这一切都比较完美，但是其实通过标记清除之后，还是会出现上面图中的内存碎片的问题。内存碎片多了之后，如果要新来一个较大的内存对象需要存储，会造成影响。对于通过标记清除产生的内存碎片，还是需要通过另外一种方式进行解决，因此这里就不得不提到标记整理策略（Mark-Compact）了。下面我们就来看看标记整理策略是如何帮助清除内存碎片的问题的。

###### 标记整理（Mark-Compact）

经过标记清除策略调整之后，老生代的内存中因此产生了很多内存碎片，若不清理这些内存碎片，之后会对存储造成影响。

为了方便解决浏览器中的内存碎片问题，标记整理这个策略被提出。这个策略是在标记清除的基础上演进而来的，和标记清除来对比来看，标记整理添加了活动对象整理阶段，处理过程中会将所有的活动对象往一端靠拢，整体移动完成后，直接清理掉边界外的内存。其操作效果如下图所示。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220425174226.png)

可以看到，老生代内存的管理方式和新生代的内存管理方式区别还是比较大的。Scavenge 算法比较适合内存较小的情况处理；而对于老生代内存较大、变量较多的时候，还是需要采用“标记-清除”结合“标记-整理”这样的方式处理内存问题，并尽量避免内存碎片的产生。

那么以上就是内存的垃圾回收机制的内容了。最后我们再看看日常在开发中，应该注意哪些问题来避免内存泄漏，从而提升你的代码的可靠性。

#### 内存泄漏与优化

平常用 JavaScript 开发代码，内存的泄漏和优化是应该经常留意的。内存泄漏是指 JavaScript 中，已经分配堆内存地址的对象由于长时间未释放或者无法释放，造成了长期占用内存，使内存浪费，最终会导致运行的应用响应速度变慢以及最终崩溃的情况。这种就是内存泄漏，你应该在日常开发和使用浏览器过程中也遇到过，那么我们来回顾一下内存泄漏的场景：

1. 过多的缓存未释放；

2. 闭包太多未释放；

3. 定时器或者回调太多未释放；

4. 太多无效的 DOM 未释放；

5. 全局变量太多未被发现。

那么这些问题该怎么优化呢？

1. **减少不必要的全局变量，使用严格模式避免意外创建全局变量**。例如：

```js
function foo() {
    // 全局变量=> window.bar
    this.bar = '默认this指向全局';
    // 没有声明变量，实际上是全局变量=>window.bar
    bar = '全局变量'; 
}
foo();
```

这段代码中，函数内部绑定了太多的 this 变量，虽然第一眼看不出问题，但仔细一分析，其实 this 下的属性默认都是绑定到 window 上的属性，均为全局变量，这一点是非常有必要注意的。

2. **在使用完数据后，及时解除引用（闭包中的变量，DOM 引用，定时器清除）**。例如：

```js
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        node.innerHTML = JSON.stringify(someResource));
        // 定时器也没有清除，可以清除掉
    }
    // node、someResource 存储了大量数据，无法回收
}, 1000);
```

比如上面代码中就缺少清除 setInterval 的代码，类似这样的代码增多会造成内存的占用过多，这是同样也需要注意的一点。

3. **组织好代码逻辑，避免死循环等造成浏览器卡顿、崩溃的问题**。例如，对于一些比较占用内存的对象提供手工释放内存的方法

```js
var leakArray = [];
exports.clear = function () {
    leakArray = [];
}
```

比如这段代码提供了清空该数组内容的方法，使用完成之后可以根据合适业务时机进行操作释放。这样就能较好地避免对象数据量太大造成的内存溢出的问题。

关于内存泄漏这部分，如果你想更好地去排查以及提前避免问题的发生，**最好的解决方式是通过熟练使用 Chrome 的内存剖析工具，多分析多定位 Chrome 帮你分析保留的内存快照，来查看持续占用大量内存的对象。**最好在业务代码上线前做好分析和诊断，之后才能保证线上业务的质量。

### JS 编译流程

#### V8 引擎介绍

我们先看一下当前百花齐放的编程语言，主要分为编译型语言和解释型语言。

编译型语言的特点是在代码运行前编译器直接将对应的代码转换成机器码，运行时不需要再重新翻译，直接可以使用编译后的结果。

解释型语言也是需要将代码转换成机器码，但是和编译型的区别在于运行时需要转换。比较显著的特点是，解释型语言的执行速度要慢于编译型语言，因为解释型语言每次执行都需要把源码转换一次才能执行。

我们比较清楚的，像 Java 和 C++ 都是编译型语言；而 JavaScript 和 ruby 都是解释性语言，它们整体的执行速度都会略慢于编译型的语言。

为了提高运行效率，很多浏览器厂商在也在不断努力。目前市面上有很多种 JS 引擎，例如 JavaScriptCore、chakra、V8 等。而比较现代的 JS 引擎，当数 V8，它引入了 Java 虚拟机和 C++ 编译器的众多技术，和早期的 JS 引擎工作方式已经有了很大的不同。

V8 是众多浏览器的 JS 引擎中性能表现最好的一个，并且它是 Chrome 的内核，Node.js 也是基于 V8 引擎研发的。V8 引擎很具有代表性，因此你有必要好好了解和学习。

那么我们来看下 V8 引擎执行 JS 代码都要经过哪些阶段。

1. Parse 阶段：V8 引擎负责将 JS 代码转换成 AST（抽象语法树）；

2. Ignition 阶段：解释器将 AST 转换为字节码，解析执行字节码也会为下一个阶段优化编译提供需要的信息；

3. TurboFan 阶段：编译器利用上个阶段收集的信息，将字节码优化为可以执行的机器码；

4. Orinoco 阶段：垃圾回收阶段，将程序中不再使用的内存空间进行回收。

其中，生成 AST、生成字节码、生成机器码是比较重要的三个阶段，下面我就对其进行详细分析，看看每个底层阶段到底做了哪些操作，会影响 JS 代码执行的编译执行。

#### 生成 AST

身为一名前端开发，你肯定在日常工作中用过 Eslint 和 Babel 这两个工具，这些工具每个都和 AST 脱不了干系。V8 引擎就是通过编译器（Parse）将源代码解析成 AST 的。

AST 在实际工作中应用场景也比较多，我们来看看抽象语法树的应用场景，大致有下面几个：

1. JS 反编译，语法解析；

2. Babel 编译 ES6 语法；

3. 代码高亮；

4. 关键字匹配；

5. 代码压缩。

这些场景的实现，都离不开通过将 JS 代码解析成 AST 来实现。生成 AST 分为两个阶段，一是词法分析，二是语法分析，我们来分别看下这两个阶段的情况。

1. 词法分析：这个阶段会将源代码拆成最小的、不可再分的词法单元，称为 token。比如这行代码 var a =1；通常会被分解成 var 、a、=、2、; 这五个词法单元。另外刚才代码中的空格在 JavaScript 中是直接忽略的。

2. 语法分析：这个过程是将词法单元转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树，这个树被称为抽象语法树。

下面我们来简单看一下解析成抽象语法树之后是什么样子的，代码如下。

```js
// 第一段代码
var a = 1;
// 第二段代码
function sum (a,b) {
  return a + b;
}
```

将这两段代码，分别转换成 AST 抽象语法树之后返回的 JSON 格式如下。

1. 第一段代码，编译后的结果：

   ```js
   {
     "type": "Program",
     "start": 0,
     "end": 10,
     "body": [
       {
         "type": "VariableDeclaration",
         "start": 0,
         "end": 10,
         "declarations": [
           {
             "type": "VariableDeclarator",
             "start": 4,
             "end": 9,
             "id": {
               "type": "Identifier",
               "start": 4,
               "end": 5,
               "name": "a"
             },
             "init": {
               "type": "Literal",
               "start": 8,
               "end": 9,
               "value": 1,
               "raw": "1"
             }
           }
         ],
         "kind": "var"
       }
     ],
     "sourceType": "module"
   }
   ```

   2. 第二段代码，编译出来的结果：

      ```js
      {
        "type": "Program",
        "start": 0,
        "end": 38,
        "body": [
          {
            "type": "FunctionDeclaration",
            "start": 0,
            "end": 38,
            "id": {
              "type": "Identifier",
              "start": 9,
              "end": 12,
              "name": "sum"
            },
            "expression": false,
            "generator": false,
            "async": false,
            "params": [
              {
                "type": "Identifier",
                "start": 14,
                "end": 15,
                "name": "a"
              },
              {
                "type": "Identifier",
                "start": 16,
                "end": 17,
                "name": "b"
              }
            ],
            "body": {
              "type": "BlockStatement",
              "start": 19,
              "end": 38,
              "body": [
                {
                  "type": "ReturnStatement",
                  "start": 23,
                  "end": 36,
                  "argument": {
                    "type": "BinaryExpression",
                    "start": 30,
                    "end": 35,
                    "left": {
                      "type": "Identifier",
                      "start": 30,
                      "end": 31,
                      "name": "a"
                    },
                    "operator": "+",
                    "right": {
                      "type": "Identifier",
                      "start": 34,
                      "end": 35,
                      "name": "b"
                    }
                  }
                }
              ]
            }
          }
        ],
        "sourceType": "module"
      }
      ```

      从上面编译出的结果可以看到，AST 只是源代码语法结构的一种抽象的表示形式，计算机也不会去直接去识别 JS 代码，转换成抽象语法树也只是识别这一过程中的第一步。

      前面我提到了前端领域经常使用一个工具 Babel，比如现在浏览器还不支持 ES6 语法，需要将其转换成 ES5 语法，这个过程就要借助 Babel 来实现。将 ES6 源码解析成 AST，再将 ES6 语法的抽象语法树转成 ES5 的抽象语法树，最后利用它来生成 ES5 的源代码。另外 ESlint 的原理也大致相同，检测流程也是将源码转换成抽象语法树，再利用它来检测代码规范。

      抽象语法树是一个很重要的概念，需要深入了解，才能更好地帮助我们理解所写代码。如果想自己把代码翻译成 AST，可以到这个地址，代码帖进去就可以转换成相应的 AST：[AST 在线转换](https://astexplorer.net/)。

      好了，接下来我们讨论一下 AST 如何转换成字节码。

#### 生成字节码

将抽象语法树转换为字节码，也就是上面提到的 Ignition 阶段。这个阶段就是将 AST 转换为字节码，但是之前的 V8 版本不会经过这个过程，最早只是通过 AST 直接转换成机器码，而后面几个版本中才对此进行了改进。如果将 AST 直接转换为机器码还是会有一些问题存在的，例如：

1. 直接转换会带来内存占用过大的问题，因为将抽象语法树全部生成了机器码，而机器码相比字节码占用的内存多了很多；

2. 某些 JavaScript 使用场景使用解释器更为合适，解析成字节码，有些代码没必要生成机器码，进而尽可能减少了占用内存过大的问题。

而后，官方在 V8 的 v5.6 版本中还是将抽象语法树转换成字节码这一过程又加上了，重新加入了字节码的处理过程。再然后，V8 重新引进了 Ignition 解释器，将抽象语法树转换成字节码后，内存占用显著下降了，同时也可以使用 JIT 编译器做进一步的优化。

其实字节码是介于 AST 和机器码之间的一种代码，需要将其转换成机器码后才能执行，字节码可以理解为是机器码的一种抽象。Ignition 解释器除了可以快速生成没有优化的字节码外，还可以执行部分字节码。这里你只需要知道这是个中间代码就够了，我们接着看最后一个阶段。

#### 生成机器码

在 Ignition 解释器处理完之后，如果发现一段代码被重复执行多次的情况，生成的字节码以及分析数据会传给 TurboFan 编译器，它会根据分析数据的情况生成优化好的机器码。再执行这段代码之后，只需要直接执行编译后的机器码，这样性能就会更好。

这里简单说一下 TurboFan 编译器，它是 JIT 优化的编译器，因为 V8 引擎是多线程的，TurboFan 的编译线程和生成字节码不会在同一个线程上，这样可以和 Ignition 解释器相互配合着使用，不受另一方的影响。

由 Ignition 解释器收集的分析数据被 TurboFan 编译器使用，主要是通过一种推测优化的技术，生成已经优化的机器码来执行。这个过程我只是通过文字描述，可能你很难理解，你通过一张图来看下整个生成抽象语法树，再到转换成字节码以及机器码的一个过程。

![](https://raw.githubusercontent.com/eru-Ryuuzaki/myPic/master/img/20220425180543.png)



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