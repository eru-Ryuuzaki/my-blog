### TS 简介

1. TypeScript 的本质
   TypeScript 与 JavaScript 本质并无区别，你可以将 TypeScipt 理解为是一个添加了类型注解的 JavaScript，比如 const num = 1，它同时符合 TypeScript 和 JavaScript 的语法。此外，**TypeScript 是一门中间语言**，最终它还需要转译为纯 JavaScript，再交给各种终端解释、执行。不过，TypeScript 并不会破坏 JavaScript 既有的知识体系，因为**它并未创造迥异于 JavaScript 的新语法**，依旧是“熟悉的配方”“熟悉的味道”。

2. TypeScript 更加可靠
    在所有操作符之前，TypeScript 都能检测到接收的类型（在代码运行时，操作符接收的是实际数据；静态检测时，操作符接收的则是类型）是否被当前操作符所支持。当 TypeScript 类型检测能力覆盖到整个文件、整个项目代码后，任意破坏约定的改动都能被自动检测出来（即便跨越多个文件、很多次传递），并提出类型错误。因此，你可以放心地修改、重构业务逻辑，而不用过分担忧因为考虑不周而犯下低级错误。接手复杂的大型应用时，**TypeScript 能让应用易于维护、迭代，且稳定可靠**，也会让你更有安全感。

3. 面向接口编程
    编写 TypeScript 类型注解，本质就是接口设计。TypeScript 极大可能改变你的思维方式，从而逐渐养成一个好习惯。比如，编写具体的逻辑之前，我们需要设计好数据结构、编写类型注解，并按照这接口约定实现业务逻辑。这显然可以减少不必要的代码重构，从而大大提升编码效率。

  同时，你会更明白接口约定的重要性，也会约束自己/他人设计接口、编写注解、遵守约定，乐此不疲。

4. TypeScript 正成为主流

   越来越多的主流框架（例如 React、Vue 3、Angular、Deno、Nest.js 等）要么选用 TypeScript 编写源码，要么为 TypeScript 提供了完美的支持。

   随着 TypeScript 的普及，TypeScript 在国内（国内滞后国外）成了一个主流的技术方向，国内各大互联网公司和中小型团队都开始尝试使用 TypeScript 开发项目，且越来越多的人正在学习和使用它。

### 准备工作

1. 安装 TS 转译器

   ```
   npm i -g typescript #这里是全局安装
   ```

2. 配置文件

   ```
   tsc --init
   ```

   或者直接新建一个 `tsconfg.json` 文件，用来配置 TypeScript 的行为

   参考配置：

   ```json
   {
     "compilerOptions": {
       /* Strict Type-Checking Options */
       "strict": true,                           /* Enable all strict type-checking options. */
       "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
       "strictNullChecks": true,              /* Enable strict null checks. */
       "strictFunctionTypes": true,           /* Enable strict checking of function types. */
       "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
       "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
       "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
       "alwaysStrict": false,                  /* Parse in strict mode and emit "use strict" for each source file. */
     }
   }
   ```

4. 开始转译

   > .ts 文件创建完成后，我们就可以使用 tsc（TypeScript Compiler） 命令将 .ts 文件转译为 .js 文件。

   ```
   tsc HelloWorld.ts --strict --alwaysStrict false
   ```

   **注意：指定转译的目标文件后，tsc 将忽略当前应用路径下的 tsconfig.json 配置，因此我们需要通过显式设定如下所示的参数，让 tsc 以严格模式检测并转译 TypeScript 代码。**

   同时，我们可以给 tsc 设定一个 watch 参数监听文件内容变更，实时进行类型检测和代码转译，如下代码所示：

   ```
   tsc HelloWorld.ts --strict --alwaysStrict false --watch
   ```

### 简单基础类型

#### 基础语法

在语法层面，缺省类型注解的 TypeScript 与 JavaScript 完全一致。因此，我们可以把 TypeScript 代码的编写看作是为 JavaScript 代码添加类型注解。

而 TypeScript 语法与 JavaScript 语法的区别在于，我们可以在 TypeScript 中显式声明变量num仅仅是数字类型，也就是说只需在变量num后添加: number类型注解即可，如下代码所示：

```js
let num: number = 1;
```

特殊说明：number表示数字类型，:用来分割变量和类型的分隔符。



#### 原始类型
在 JavaScript 中，原始类型指的是非对象且没有方法的数据类型，它包括 string、number、bigint、boolean、undefined、bigint 和 symbol 这七种 （null 是一个伪原始类型，它在 JavaScript 中实际上是一个对象，且所有的结构化类型都是通过 null 原型链派生而来）。

在 JavaScript 语言中，原始类型值是最底层的实现，对应到 TypeScript 中同样也是最底层的类型。



##### 字符串

在 JavaScript 中，我们可以使用string表示 JavaScript 中任意的字符串（包括模板字符串），具体示例如下所示：

```js
let firstname: string = 'Captain'; // 字符串字面量

let familyname: string = String('S'); // 显式类型转换

let fullname: string = `my name is ${firstname}.${familyname}`; // 模板字符串

```

> **说明：所有 JavaScript 支持的定义字符串的方法，我们都可以直接在 TypeScript 中使用。**

##### 数字

同样，我们可以使用`number`类型表示 JavaScript 已经支持或者即将支持的十进制整数、浮点数，以及二进制数、八进制数、十六进制数，具体的示例如下所示：

```js
/** 十进制整数 */

let integer: number = 6;

/** 十进制整数 */

let integer2: number = Number(42);

/** 十进制浮点数 */

let decimal: number = 3.14;

/** 二进制整数 */

let binary: number = 0b1010;

/** 八进制整数 */

let octal: number = 0o744;

/** 十六进制整数 */

let hex: number = 0xf00d;
```

如果使用较少的大整数，那么我们可以使用`bigint`类型来表示，如下代码所示。

```js
let big: bigint =  100n;
```

**请注意：虽然**`number`和`bigint`都表示数字，但是这两个类型不兼容。

因此，如果我们在 VS Code IDE 中输入如下示例，问题面板中将会抛出一个类型不兼容的 ts(2322) 错误。

```js
big = integer;
integer = big;
```

##### 布尔值

同样，我们可以使用`boolean`表示 True 或者 False，如下代码所示。

```js
/** TypeScript 真香 为 真 */

let TypeScriptIsGreat: boolean = true;

 /** TypeScript 太糟糕了 为 否 */

let TypeScriptIsBad: boolean = false;
```

##### Symbol

自 ECMAScript 6 起，TypeScript 开始支持新的`Symbol`原始类型， 即我们可以通过`Symbol`构造函数，创建一个独一无二的标记；同时，还可以使用`symbol`表示如下代码所示的类型。

```js
let sym1: symbol = Symbol();

let sym2: symbol = Symbol('42');
```

**当然，TypeScript 还包含 Number、String、Boolean、Symbol 等类型（注意区分大小写）。**

> **特殊说明：请你千万别将它们和小写格式对应的 number、string、boolean、symbol 进行等价**。不信的话，你可以思考并验证如下所示的示例。

```js
let sym: symbol = Symbol('a');

let sym2: Symbol = Symbol('b');

sym = sym2 // ok or fail?

sym2 = sym // ok or fail?

let str: String = new String('a');

let str2: string = 'a';

str = str2; // ok or fail?

str2 = str; // ok or fail?
```

实际上，我们压根使用不到 Number、String、Boolean、Symbol 类型，因为它们并没有什么特殊的用途。这就像我们不必使用 JavaScript Number、String、Boolean 等构造函数 new 一个相应的实例一样。

介绍完这几种原始类型后，你可能会心生疑问：缺省类型注解的有无似乎没有什么明显的作用，就像如下所示的示例一样：

```js
{

  let mustBeNum = 1;

}

{

  let mustBeNum: number = 1;

}
```

其实，以上这两种写法在 TypeScript 中是等价的，这得益于基于**上下文的类型推导**

如果变量所处的上下文环境特别复杂，在开发阶段就能检测出低级类型错误的能力将显得尤为重要，而这种能力主要来源于 TypeScript 实现的静态类型检测。

#### 静态类型检测

在编译时期，静态类型的编程语言即可准确地发现类型错误，这就是静态类型检测的优势。

在编译（转译）时期，TypeScript 编译器将通过对比检测变量接收值的类型与我们显示注解的类型，从而检测类型是否存在错误。如果两个类型完全一致，显示检测通过；如果两个类型不一致，它就会抛出一个编译期错误，告知我们编码错误，具体示例如下代码所示：

```js
const trueNum: number = 42;

const fakeNum: number = "42"; // ts(2322) Type 'string' is not assignable to type 'number'.
```

> TypeScript 的语言服务可以和 VS Code 完美集成。**因此，在编写代码的同时，我们可以同步进行静态类型检测（无须等到编译后再做检测），极大地提升了开发体验和效率。**

### 复杂基础类型：TypeScript 与 JavaScript 有何不同？

#### 数组

因为 TypeScript 的数组和元组转译为 JavaScript 后都是数组，所以这里我们把数组和元组这两个类型整合到一起介绍，也方便你更好地对比学习。

##### 数组类型（Array）

首先，我们可以直接使用 [] 的形式定义数组类型，如下代码所示：

```js
/** 子元素是数字类型的数组 */

let arrayOfNumber: number[] = [1, 2, 3];

/** 子元素是字符串类型的数组 */

let arrayOfString: string[] = ['x', 'y', 'z'];
```

同样，我们也可以使用 Array 泛型（在第 10 讲会详细介绍泛型）定义数组类型，如下代码所示：

```js
/** 子元素是数字类型的数组 */

let arrayOfNumber: Array<number> = [1, 2, 3];

/** 子元素是字符串类型的数组 */

let arrayOfString: Array<string> = ['x', 'y', 'z'];
```

以上两种定义数组类型的方式虽然本质上没有任何区别，但是我更推荐使用 [] 这种形式来定义。**一方面可以避免与 JSX 的语法冲突，另一方面可以减少不少代码量**。

##### 元组类型（Tuple）

元组最重要的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回。

在 JavaScript 中并没有元组的概念，作为一门动态类型语言，它的优势是**天然支持多类型元素数组**。

我们假设以下两个数组的元素类型如下代码所示：

```js
[state, setState]

[setState, state]
```

对于 JavaScript 而言，上面的数组其实长的都一样，并没有一个有效的途径可以区分彼此。

不过，出于较好的扩展性、可读性和稳定性考虑，我们往往会更偏向于**把不同类型的值通过键值对的形式塞到一个对象中，再返回这个对象**（尽管这样会增加代码量），而不是使用没有任何限制的数组。比如我们可能会使用如下的对象结构来替换数组：

而 TypeScript 的元组类型正好弥补了这个不足，使得定义包含固定个数元素、每个元素类型未必相同的数组成为可能。（需要注意的是，毕竟 TypeScript 会转译成 JavaScript，所以 TypeScript 的元组无法在运行时约束所谓的“元组”像真正的元组一样，保证元素类型、长度不可变更）。

元组相较对象而言，不仅为我们实现解构赋值提供了极大便利，还减少了不少代码量，这可能也是 React 官方如此设计核心 Hooks 的重要原因之一。



### 特殊类型

1. any

   any 指的是一个任意类型，它是官方提供的一个选择性绕过静态类型检测的作弊方式。

   我们可以对被注解为 any 类型的变量进行任何操作，包括获取事实上并不存在的属性、方法，并且 TypeScript 还无法检测其属性是否存在、类型是否正确。

   比如我们可以把任何类型的值赋值给 any 类型的变量，也可以把 any 类型的值赋值给任意类型（除 never 以外）的变量，如下代码所示：

   ```js
   let anything: any = {};
   
   anything.doAnything(); // 不会提示错误
   
   anything = 1; // 不会提示错误
   
   anything = 'x'; // 不会提示错误
   
   let num: number = anything; // 不会提示错误
   
   let str: string = anything; // 不会提示错误
   ```

   

   如果我们不想花费过高的成本为复杂的数据添加类型注解，或者已经引入了缺少类型注解的第三方组件库，这时就可以把这些值全部注解为 any 类型，并告诉 TypeScript 选择性地忽略静态类型检测。

   尤其是在将一个基于 JavaScript 的应用改造成 TypeScript 的过程中，我们不得不借助 any 来选择性添加和忽略对某些 JavaScript 模块的静态类型检测，直至逐步替换掉所有的 JavaScript。

   any 类型会在对象的调用链中进行传导，即所有 any 类型的任意属性的类型都是 any，如下代码所示：

   ```js
   let anything: any = {};
   
   let z = anything.x.y.z; // z 类型是 any，不会提示错误
   
   z(); // 不会提示错误
   ```

   这里我们需要明白且记住：**Any is Hell（Any 是地狱）**。

   从长远来看，使用 any 绝对是一个坏习惯。如果一个 TypeScript 应用中充满了 any，此时静态类型检测基本起不到任何作用，也就是说与直接使用 JavaScript 没有任何区别。**因此，除非有充足的理由，否则我们应该尽量避免使用 any ，并且开启禁用隐式 any 的设置。**

2. unknown

   unknown 是 TypeScript 3.0 中添加的一个类型，它主要用来描述类型并不确定的变量。

   比如在多个 if else 条件分支场景下，它可以用来接收不同条件下类型各异的返回值的临时变量，如下代码所示：

   ```js
   let result: unknown;
   
   if (x) {
   
     result = x();
   
   } else if (y) {
   
     result = y();
   
   } ...
   ```

   

   与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但 unknown 类型的值只能赋值给 unknown 或 any

   使用 unknown 后，TypeScript 会对它做类型检测。但是，如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现如下所示错误：

   ```js
   let result: unknown;
   
   result.toFixed(); // 提示 ts(2571)
   ```

   

   **而所有的类型缩小手段对 unknown 都有效**，如下代码所示：

   ```js
   let result: unknown;
   
   if (typeof result === 'number') {
   
     result.toFixed(); // 此处 hover result 提示类型是 number，不会提示错误
   
   }
   ```

   

 3. void、undefined、null

    依照官方的说法，它们实际上并没有太大的用处。

    首先我们来说一下 void 类型，它仅适用于表示没有返回值的函数。即如果该函数没有返回值，那它的类型就是 void。

    在 strict 模式下，声明一个 void 类型的变量几乎没有任何实际用处，因为我们不能把 void 类型的变量值再赋值给除了 any 和 unkown 之外的任何类型变量。

    然后我们说说 undefined 类型 和 null 类型，它们是 TypeScript 值与类型关键字同名的唯二例外。但这并不影响它们被称为“废柴”，因为单纯声明 undefined 或者 null 类型的变量也是无比鸡肋，示例如下所示：

    ```js
    let undeclared: undefined = undefined; // 鸡肋
    
    let nullable: null = null; // 鸡肋
    ```

    undefined 的**最大价值主要体现在接口类型上，它表示一个可缺省、未定义的属性**。

    这里分享一个稍微有点费解的设计：**我们可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量，反过来，类型是 void 但值是 undefined 的变量不能赋值给 undefined 类型。**

    ```js
    const userInfo: {
    
      id?: number;
    
    } = {};
    
    let undeclared: undefined = undefined;
    
    let unusable: void = undefined;
    
    unusable = undeclared; // ok
    
    undeclared = unusable; // ts(2322)
    ```

    而 null 的价值我认为**主要体现在接口制定上，它表明对象或属性可能是空值**。尤其是在前后端交互的接口，比如 Java Restful、Graphql，任何涉及查询的属性、对象都可能是 null 空对象，如下代码所示：

    ```js
    const userInfo: {
    
      name: null | string
    
    } = { name: null };
    ```

    我们需要**类型守卫（Type Guard**）在操作之前判断值的类型是否支持当前的操作。类型守卫既能通过类型缩小影响 TypeScript 的类型检测，也能保障 JavaScript 运行时的安全性，如下代码所示：

    ```js
    const userInfo: {
    
      id?: number;
    
      name?: null | string
    
    } = { id: 1, name: 'Captain' };
    
    if (userInfo.id !== undefined) { // Type Guard
    
      userInfo.id.toFixed(); // id 的类型缩小成 number
    
    }
    ```

    我们不建议随意使用非空断言（下面要讲的“类型断言”中会详细介绍非空断言）来排除值可能为 null 或 undefined 的情况，因为这样很不安全。

    ```js
    userInfo.id!.toFixed(); // ok，但不建议
    
    userInfo.name!.toLowerCase() // ok，但不建议
    ```

    而比非空断言更安全、类型守卫更方便的做法是使用单问号（Optional Chain）、双问号（空值合并），我们可以使用它们来保障代码的安全性，如下代码所示：

    ```js
    userInfo.id?.toFixed(); // Optional Chain
    
    const myName = userInfo.name?? `my name is ${info.name}`; // 空值合并 这里不是很懂
    ```

    

4. never

   never 表示永远不会发生值的类型，这里我们举一个实际的场景进行说明。

   首先，我们定义一个统一抛出错误的函数，代码示例如下（圆括号后 : + 类型注解 表示函数返回值的类型）：

   ```js
   function ThrowError(msg: string): never {
   
     throw Error(msg);
   
   }
   ```

   以上函数因为永远不会有返回值，所以它的返回值类型就是 never。

   同样，如果函数代码中是一个死循环，那么这个函数的返回值类型也是 never，如下代码所示。

   ```js
   function InfiniteLoop(): never {
     while (true) {}
   }
   ```

   never 是所有类型的子类型，它可以给所有类型赋值。但是反过来，除了 never 自身以外，其他类型（包括 any 在内的类型）都不能为 never 类型赋值。

   在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never（never 是所有其他类型的子类型，所以是类型缩小为 never，而不是变成 never）。因此，条件判断中的相关操作始终会报无法更正的错误（我们可以把这理解为一种基于静态类型检测的 Dead Code 检测机制）

   ```js
   const str: string = 'string';
   
   if (typeof str === 'number') {
   
     str.toLowerCase(); // Property 'toLowerCase' does not exist on type 'never'.ts(2339)
   
   }
   ```

   基于 never 的特性，我们还可以使用 never 实现一些有意思的功能。比如我们可以把 never 作为接口类型下的属性类型，用来禁止写接口下特定的属性，示例代码如下：

   ```js
   const props: {
   
     id: number,
   
     name?: never
   
   } = {
   
     id: 1
   
   }
   
   props.name = null; // ts(2322))
   
   props.name = 'str'; // ts(2322)
   
   props.name = 1; // ts(2322)
   ```

   此时，无论我们给 props.name 赋什么类型的值，它都会提示类型错误，实际效果等同于 name 只读 。

5. object

   object 类型表示非原始类型的类型，即非 number、string、boolean、bigint、symbol、null、undefined 的类型。然而，它也是个没有什么用武之地的类型，如下所示的一个应用场景是用来表示 Object.create 的类型。

   ```js
   declare function create(o: object | null): any;
   
   create({}); // ok
   
   create(() => null); // ok
   
   create(2); // ts(2345)
   
   create('string'); // ts(2345)
   ```



### 类型推断

TypeScript 类型检测无法做到绝对智能，毕竟程序不能像人一样思考。有时会碰到我们比 TypeScript 更清楚实际类型的情况，比如下面的例子：

```js
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2); // 提示 ts(2322)
```

其中，greaterThan2 一定是一个数字（确切地讲是 3），因为 arrayNumber 中明显有大于 2 的成员，但静态类型对运行时的逻辑无能为力。

在 TypeScript 看来，greaterThan2 的类型既可能是数字，也可能是 undefined，所以上面的示例中提示了一个 ts(2322) 错误，此时我们不能把类型 undefined 分配给类型 number。

不过，我们可以使用一种笃定的方式——**类型断言**（类似仅作用在类型层面的强制类型转换）告诉 TypeScript 按照我们的方式做类型检查。

比如，我们可以使用 as 语法做类型断言，如下代码所示：

```js
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
```

又或者是使用尖括号 + 类型的格式做类型断言，如下代码所示：

```js
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = <number>arrayNumber.find(num => num > 2);
```

以上两种方式虽然没有任何区别，但是尖括号格式会与 JSX 产生语法冲突，因此我们更推荐使用 as 语法。

> 注意：类型断言的操作对象必须满足某些约束关系，否则我们将得到一个 ts(2352) 错误，即从类型“源类型”到类型“目标类型”的转换是错误的，因为这两种类型不能充分重叠。

我一度喜欢用“指鹿为马”来形容类型断言，但其实也不够准确。

从物种类型上看，鹿和马肯定不能转换，虽然它们都是动物（继承自同一个父类），但是鹿有“角属性”，马有“鬃毛属性”，所以两者不能充分重叠。

**如果我们把它换成“指白马为马”“指马为白马”，就可以很贴切地体现类型断言的约束条件：父子、子父类型之间可以使用类型断言进行转换。**

另外，any 和 unknown 这两个特殊类型属于万金油，因为它们既可以被断言成任何类型，反过来任何类型也都可以被断言成 any 或 unknown。因此，如果我们想强行“指鹿为马”，就可以先把“鹿”断言为 any 或 unknown，然后再把 any 和 unknown 断言为“马”，比如    `鹿 as any as 马`。

我们除了可以把特定类型断言成符合约束添加的其他类型之外，还可以使用“字面量值 + as const”语法结构进行常量断言，具体示例如下所示：

```js
/** str 类型是 '"str"' */

let str = 'str' as const;

/** readOnlyArr 类型是 'readonly [0, 1]' */

const readOnlyArr = [0, 1] as const;
```

此外还有一种特殊非空断言，即在值（变量、属性）的后边添加 '!' 断言操作符，它可以用来排除值为 null、undefined 的情况，具体示例如下：

```js
let mayNullOrUndefinedOrString: null | undefined | string;

mayNullOrUndefinedOrString!.toString(); // ok

mayNullOrUndefinedOrString.toString(); // ts(2531)
```

对于非空断言来说，我们同样应该把它视作和 any 一样危险的选择。

在复杂应用场景中，如果我们使用非空断言，就无法保证之前一定非空的值，比如页面中一定存在 id 为 feedback 的元素，数组中一定有满足 > 2 条件的数字，这些都不会被其他人改变。而一旦保证被改变，错误只会在运行环境中抛出，而静态类型检测是发现不了这些错误的。

所以，我们建议使用类型守卫（更多讲解，见“第 11 讲：类型守卫”）来代替非空断言，比如如下所示的条件判断：

```js
let mayNullOrUndefinedOrString: null | undefined | string;

if (typeof mayNullOrUndefinedOrString === 'string') {

  mayNullOrUndefinedOrString.toString(); // ok

}
```

### 字面量类型、类型推断、类型拓宽和类型缩小

#### 类型推断

在 TypeScript 中，类型标注声明是在变量之后（即类型后置），它不像 Java 语言一样，先声明变量的类型，再声明变量的名称。

使用类型标注后置的好处是编译器可以通过代码所在的上下文推导其对应的类型，无须再声明变量类型，具体示例如下：

```js
{

  let x1 = 42; // 推断出 x1 的类型是 number

  let x2: number = x1; // ok

}
```

在上述代码中，x1 的类型被推断为 number，将变量赋值给 number 类型的变量 x2 后，不会出现任何错误。

在 TypeScript 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型（05 讲中会专门介绍函数类型）都可以根据上下文推断出来。比如我们能根据 return 语句推断函数返回的类型，如下代码所示：

```js
{
  /** 根据参数的类型，推断出返回值的类型也是 number */
  function add1(a: number, b: number) {
    return a + b;
  }
  const x1= add1(1, 1); // 推断出 x1 的类型也是 number

  /** 推断参数 b 的类型是数字或者 undefined，返回值的类型也是数字 */
  function add2(a: number, b = 1) {
    return a + b;
  }
  const x2 = add2(1);
  const x3 = add2(1, '1'); // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number | undefined
}
```

在上述 add1 函数中，我们 return 了变量 a + b 的结果，因为 a 和 b 的类型为 number，所以函数返回类型被推断为 number。

当然，拥有默认值的函数参数的类型也能被推断出来。比如上述 add2 函数中，b 参数被推断为 number | undefined 类型，如果我们给 b 参数传入一个字符串类型的值，由于函数参数类型不一致，此时编译器就会抛出一个 ts(2345) 错误。