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

#### 上下文推断

通过类型推断的例子，我们发现变量的类型可以通过被赋值的值进行推断。除此之外，在某些特定的情况下，我们也可以通过变量所在的上下文环境推断变量的类型，具体示例如下：

```js
{

  type Adder = (a: number, b: number) => number;

  const add: Adder = (a, b) => {

    return a + b;

  }

  const x1 = add(1, 1); // 推断出 x1 类型是 number

  const x2 = add(1, '1');  // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number

}
```

这里我们定义了一个实现加法功能的**函数类型 Adder**（定义的 Adder 类型使用了 type 类型别名），声明了**add**变量的类型为 Adder 并赋值一个匿名箭头函数，箭头函数参数 a 和 b 的类型和返回类型都没有显式声明。

TypeScript 通过**add**的类型 Adder 反向（通过变量类型推断出值的相关类型）推断出箭头函数参数及返回值的类型，也就是说函数参数 a、b，以及返回类型在这个变量的声明上下文中被确定了。

正是得益于 TypeScript 这种类型推导机制和能力，使得我们无须显式声明，即可直接通过上下文环境推断出变量的类型，也就是说此时类型可缺省。

下面回头看最前面的示例（如下所示），我们发现这些缺省类型注解的变量还可以通过类型推断出类型。

```js
{
  let str = 'this is string'; // str: string
  let num = 1; // num: number
  let bool = true; // bool: boolean
}
{
  const str = 'this is string'; // str: 'this is string'
  const num = 1; // num: 1
  const bool = true; // bool: true
}
```

如上述代码中注释说明，通过 let 和 const 定义的赋予了相同值的变量，其推断出来的类型不一样。比如同样是 'this is string'（这里表示一个字符串值），通过 let 定义的变量类型是 string，而通过 const 定义的变量类型是 'this is string'（这里表示一个字符串字面量类型）。这里我们可以通过 VS Code hover 示例中的变量查看类型，验证一下这个结论。

#### 字面量类型

在 TypeScript 中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型。

目前，TypeScript 支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型，对应的字符串字面量、数字字面量、布尔字面量分别拥有与其值一样的字面量类型，具体示例如下：

```js
{

  let specifiedStr: 'this is string' = 'this is string';

  let specifiedNum: 1 = 1;

  let specifiedBoolean: true = true;

}
```

字面量类型是集合类型的子类型，它是集合类型的一种更具体的表达。比如 'this is string' （这里表示一个字符串字面量类型）类型是 string 类型（确切地说是 string 类型的子类型），而 string 类型不一定是 'this is string'（这里表示一个字符串字面量类型）类型，如下具体示例：

```js
{

  let specifiedStr: 'this is string' = 'this is string';

  let str: string = 'any string';

  specifiedStr = str; // ts(2322) 类型 '"string"' 不能赋值给类型 'this is string'

  str = specifiedStr; // ok 

}
```

#### 字符串字面量类型

一般来说，我们可以使用一个字符串字面量类型作为变量的类型，如下代码所示：

```js
let hello: 'hello' = 'hello';
hello = 'hi'; // ts(2322) Type '"hi"' is not assignable to type '"hello"'
```

实际上，定义单个的字面量类型并没有太大的用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型，用来描述拥有明确成员的实用的集合。

如下代码所示，我们使用字面量联合类型描述了一个明确、可 'up' 可 'down' 的集合，这样就能清楚地知道需要的数据结构了。

```js
type Direction = 'up' | 'down';
function move(dir: Direction) {
  // ...
}
move('up'); // ok
move('right'); // ts(2345) Argument of type '"right"' is not assignable to parameter of type 'Direction'
```

通过使用字面量类型组合的联合类型，我们可以限制函数的参数为指定的字面量类型集合，然后编译器会检查参数是否是指定的字面量类型集合里的成员。

因此，相较于使用 string 类型，使用字面量类型（组合的联合类型）可以将函数的参数限定为更具体的类型。这不仅提升了程序的可读性，还保证了函数的参数类型，可谓一举两得。

#### 数字字面量类型及布尔字面量类型

数字字面量类型和布尔字面量类型的使用与字符串字面量类型的使用类似，我们可以使用字面量组合的联合类型将函数的参数限定为更具体的类型，比如声明如下所示的一个类型 Config：

```js
interface Config {
    size: 'small' | 'big';
    isEnable:  true | false;
    margin: 0 | 2 | 4;
}
```

在上述代码中，我们限定了 size 属性为字符串字面量类型 'small' | 'big'，isEnable 属性为布尔字面量类型 true | false（布尔字面量只包含 true 和 false，true | false 的组合跟直接使用 boolean 没有区别），margin 属性为数字字面量类型 0 | 2 | 4。

#### Literal Widening

所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

下面我们通过字符串字面量的示例来理解一下字面量类型拓宽：

```js
{
  let str = 'this is string'; // 类型是 string
  let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string;
  const specifiedStr = 'this is string'; // 类型是 'this is string'
  let str2 = specifiedStr; // 类型是 'string'
  let strFun2 = (str = specifiedStr) => str; // 类型是 (str?: string) => string;
}
```

因为第 2~3 行满足了 let、形参且未显式声明类型注解的条件，所以变量、形参的类型拓宽为 string（形参类型确切地讲是 string | undefined）。

因为第 5 行的常量不可变更，类型没有拓宽，所以 specifiedStr 的类型是 'this is string' 字面量类型。

第 7~8 行，因为赋予的值 specifiedStr 的类型是字面量类型，且没有显式类型注解，所以变量、形参的类型也被拓宽了。其实，这样的设计符合实际编程诉求。我们设想一下，如果 str2 的类型被推断为 'this is string'，它将不可变更，因为赋予任何其他的字符串类型的值都会提示类型错误。

基于字面量类型拓宽的条件，我们可以通过如下所示代码添加显示类型注解控制类型拓宽行为。

```js
{
  const specifiedStr: 'this is string' = 'this is string'; // 类型是 '"this is string"'
  let str2 = specifiedStr; // 即便使用 let 定义，类型是 'this is string'
}
```

实际上，除了字面量类型拓宽之外，TypeScript 对某些特定类型值也有类似 "Type Widening" （类型拓宽）的设计，下面我们具体来了解一下。

#### Type Widening

比如对 null 和 undefined 的类型进行拓宽，通过 let、var 定义的变量如果满足未显式声明类型注解且被赋予了 null 或 undefined 值，则推断出这些变量的类型是 any：

```js
{
  let x = null; // 类型拓宽成 any
  let y = undefined; // 类型拓宽成 any
  /** -----分界线------- */
  const z = null; // 类型是 null
  /** -----分界线------- */
  let anyFun = (param = null) => param; // 形参类型是 null
  let z2 = z; // 类型是 null
  let x2 = x; // 类型是 null
  let y2 = y; // 类型是 undefined
}
```

> 注意：在严格模式下，一些比较老的版本中（2.0）null 和 undefined 并不会被拓宽成“any”。因此，某些过时的资料中会存在与课程不一致的解释。

在现代 TypeScript 中，以上示例的第 2~3 行的类型拓宽更符合实际编程习惯，我们可以赋予任何其他类型的值给具有 null 或 undefined 初始值的变量 x 和 y。

示例第 7~10 行的类型推断行为因为开启了 strictNullChecks=true（说明：本课程所有示例都基于严格模式编写），此时我们可以从类型安全的角度试着思考一下：这几行代码中出现的变量、形参的类型为什么是 null 或 undefined，而不是 any？因为前者可以让我们更谨慎对待这些变量、形参，而后者不能。

既然有类型拓宽，自然也会有类型缩小，下面我们简单介绍一下 Type Narrowing。

#### Type Narrowing

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

比如，我们可以使用类型守卫将函数参数的类型从 any 缩小到明确的类型，具体示例如下：

```js
{
  let func = (anything: any) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string 
    } else if (typeof anything === 'number') {
      return anything; // 类型是 number
    }
    return null;
  };
}
```

在 VS Code 中 hover 到第 4 行的 anything 变量提示类型是 string，到第 6 行则提示类型是 number。

同样，我们可以使用类型守卫将联合类型缩小到明确的子类型，具体示例如下：

```js
{
  let func = (anything: string | number) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string 
    } else {
      return anything; // 类型是 number
    }
  };
}
```

当然，我们也可以通过字面量类型等值判断（===）或其他控制流语句（包括但不限于 if、三目运算符、switch 分支）将联合类型收敛为更具体的类型，如下代码所示：

```js
{
  type Goods = 'pen' | 'pencil' |'ruler';
  const getPenCost = (item: 'pen') => 2;
  const getPencilCost = (item: 'pencil') => 4;
  const getRulerCost = (item: 'ruler') => 6;
  const getCost = (item: Goods) =>  {
    if (item === 'pen') {
      return getPenCost(item); // item => 'pen'
    } else if (item === 'pencil') {
      return getPencilCost(item); // item => 'pencil'
    } else {
      return getRulerCost(item); // item => 'ruler'
    }
  }
}
```

### 函数类型：返回值类型和参数类型到底如何定义？

#### 返回值类型

在 JavaScript 中，我们知道一个函数可以没有显式 return，此时函数的返回值应该是 undefined

**需要注意的是，在 TypeScript 中，如果我们显式声明函数的返回值类型为 undfined，将会得到如下所示的错误提醒。**

```js
function fn(): undefined { // ts(2355) A function whose declared type is neither 'void' nor 'any' must return a value
  // TODO
}
```

此时，正确的做法是使用 void 类型来表示函数没有返回值的类型（**这是“废柴” void 类型唯一有用的场景**），示例如下：

我们可以使用类似定义箭头函数的语法来表示函数类型的参数和返回值类型，此时`=> 类型`仅仅用来定义一个函数类型而不用实现这个函数。

需要注意的是，这里的`=>`与 ES6 中箭头函数的`=>`有所不同。TypeScript 函数类型中的`=>`用来表示函数的定义，其左侧是函数的参数类型，右侧是函数的返回值类型；而 ES6 中的`=>`是函数的实现。

如下示例中，我们定义了一个函数类型（这里我们使用了类型别名 type），并且使用箭头函数实现了这个类型。

```js
type Adder = (a: number, b: number) => number; // TypeScript 函数类型定义
const add: Adder = (a, b) => a + b; // ES6 箭头函数
```

**这里请注意：右侧的箭头函数并没有显式声明类型注解，不过可以根据上下文类型进行推断。**

在对象（即接口类型）中，除了使用这种声明语法，我们还可以使用类似对象属性的简写语法来声明函数类型的属性，如下代码所示：

```js
interface Entity {
    add: (a: number, b: number) => number;
    del(a: number, b: number): number;
}
const entity: Entity = {
    add: (a, b) => a + b,
    del(a, b) {
      return a - b;
    },
};
```

在某种意义上来说，这两种形式都是等价的。但是很多时候，我们不必或者不能显式地指明返回值的类型，这就涉及可缺省和可推断的返回值类型的讲解。

##### 可缺省和可推断的返回值类型

幸运的是，函数返回值的类型可以在 TypeScript 中被推断出来，即可缺省。

函数内是一个相对独立的上下文环境，我们可以根据入参对值加工计算，并返回新的值。从类型层面看，我们也可以通过类型推断（回想一下类型推断、上下文类型推断）加工计算入参的类型，并返回新的类型，示例如下：

```js
function computeTypes(one: string, two: number) {
  const nums = [two];
  const strs = [one]
  return {
    nums,
    strs
  } // 返回 { nums: number[]; strs: string[] } 的类型 
}
```

请记住：这是一个很重要也很有意思的特性，函数返回值的类型推断结合泛型可以实现特别复杂的类型计算（本质是复杂的类型推断，这里称之为计算是为了表明其复杂性），比如 Redux Model 中 State、Reducer、Effect 类型的关联。

一般情况下，TypeScript 中的函数返回值类型是可以缺省和推断出来的，但是有些特例需要我们显式声明返回值类型，比如 Generator 函数的返回值。

##### Generator 函数的返回值

ES6 中新增的 Generator 函数在 TypeScript 中也有对应的类型定义。

Generator 函数返回的是一个 Iterator 迭代器对象，我们可以使用 Generator 的同名接口泛型或者 Iterator 的同名接口泛型表示返回值的类型（Generator 类型继承了 Iterator 类型），示例如下：

```js
type AnyType = boolean;
type AnyReturnType = string;
type AnyNextType = number;
function *gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true; // nextValue 类型是 number，yield 后必须是 boolean 类型
  return `${nextValue}`; // 必须返回 string 类型
}
```

注意：TypeScript 3.6 之前的版本不支持指定 next、return 的类型，所以在某些有点历史的代码中，我们可能会看到 Generator 和 Iterator 类型不一样的表述。

#### 参数类型

了解了定义函数的基本语法以及返回值类型后，我们再来详细看一下可选参数、默认参数、剩余参数的几个特性。

##### 可选参数和默认参数

```js
function log(x?: string) {
  return x;
}
log(); // => undefined
log('hello world'); // => hello world
```

在上述代码中，我们在类型标注的:前添加?表示 log 函数的参数 x 就是可缺省的。

也就是说参数 x 的类型可能是 undefined（第 5 行调用 log 时不传入实参）类型或者是 string 类型（第 6 行调用 log 传入 'hello world' 实参），那是不是意味着可缺省和类型是 undefined 等价呢？我们来看看以下的示例：

```js
function log(x?: string) {
  console.log(x);
}
function log1(x: string | undefined) {
  console.log(x);
}
log();
log(undefined);
log1(); // ts(2554) Expected 1 arguments, but got 0
log1(undefined);
```

答案显而易见：**这里的 ?: 表示参数可以缺省、可以不传**，也就是说调用函数时，我们可以不显式传入参数。**但是，如果我们声明了参数类型为 xxx | undefined（这里使用了联合类型 |），就表示函数参数是不可缺省且类型必须是 xxx 或者 undfined。**

在 ES6 中支持函数默认参数的功能，而 TypeScript 会根据函数的默认参数的类型来推断函数参数的类型，示例如下：

```js
function log(x = 'hello') {
    console.log(x);
}
log(); // => 'hello'
log('hi'); // => 'hi'
log(1); // ts(2345) Argument of type '1' is not assignable to parameter of type 'string | undefined'
```

在上述示例中，根据函数的默认参数 'hello' ，TypeScript 推断出了 x 的类型为 string | undefined。

当然，对于默认参数，TypeScript 也可以显式声明参数的类型（一般默认参数的类型是参数类型的子集时，我们才需要这么做）。不过，此时的默认参数只起到参数默认值的作用，如下代码所示：

```js
function log1(x: string = 'hello') {
    console.log(x);
}
// ts(2322) Type 'string' is not assignable to type 'number'
function log2(x: number = 'hello') {
    console.log(x);
}
log2();
log2(1);
log2('1'); // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number | undefined'
```

上例函数 log2 中，我们显式声明了函数参数 x 的类型为 number，表示函数参数 x 的类型可以不传或者是 number 类型。因此，如果我们将默认值设置为字符串类型，编译器就会抛出一个 ts(2322) 的错误。

同理，如果我们将函数的参数传入了字符串类型，编译器也会抛出一个 ts(2345) 的错误。

**这里请注意：函数的默认参数类型必须是参数类型的子类型**，下面我们看一下如下具体示例：

```js
function log3(x: number | string = 'hello') {
    console.log(x);
}
```

在上述代码中，函数 log3 的函数参数 x 的类型为可选的联合类型 number | string，但是因为默认参数字符串类型是联合类型 number | string 的子类型，所以 TypeScript 也会检查通过。

##### 剩余参数

在 ES6 中，JavaScript 支持函数参数的剩余参数，它可以把多个参数收集到一个变量中。同样，在TypeScript 中也支持这样的参数类型定义，如下代码所示：

```js
function sum(...nums: number[]) {
    return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2); // => 3
sum(1, 2, 3); // => 6
sum(1, '2'); // ts(2345) Argument of type 'string' is not assignable to parameter of type 'number'
```

在上述代码中，sum 是一个求和的函数，...nums将函数的所有参数收集到了变量 nums 中，而 nums 的类型应该是 number[]，表示所有被求和的参数是数字类型。因此，sum(1, '2') 抛出了一个 ts(2345) 的错误，因为参数 '2' 并不是 number 类型。

如果我们将函数参数 nums 聚合的类型定义为 (number | string)[]，如下代码所示：

```js
function sum(...nums: (number | string)[]): number {
    return nums.reduce<number>((a, b) => a + Number(b), 0);
}
sum(1, '2', 3); // 6
```

##### this

众所周知，在 JavaScript 中，函数 this 的指向一直是一个令人头痛的问题。因为 this 的值需要等到函数被调用时才能被确定，更别说通过一些方法还可以改变 this 的指向。也就是说 this 的类型不固定，它取决于执行时的上下文。

但是，使用了 TypeScript 后，我们就不用担心这个问题了。通过指定 this 的类型（严格模式下，必须显式指定 this 的类型），当我们错误使用了 this，TypeScript 就会提示我们，如下代码所示：

```js
function say() {
    console.log(this.name); // ts(2683) 'this' implicitly has type 'any' because it does not have a type annotation
}
say();
```

在上述代码中，如果我们直接调用 say 函数，this 应该指向全局 window 或 global（Node 中）。但是，在 strict 模式下的 TypeScript 中，它会提示 this 的类型是 any，此时就需要我们手动显式指定类型了。

那么，在 TypeScript 中，我们应该如何声明 this 的类型呢？

在 TypeScript 中，我**们只需要在函数的第一个参数中声明 this 指代的对象**（即函数被调用的方式）即可，比如最简单的作为对象的方法的 this 指向，如下代码所示：

```js
function say(this: Window, name: string) {
    console.log(this.name);
}
window.say = say;
window.say('hi');
const obj = {
    say
};
obj.say('hi'); // ts(2684) The 'this' context of type '{ say: (this: Window, name: string) => void; }' is not assignable to method's 'this' of type 'Window'.
```

**需要注意的是，如果我们直接调用 say()，this 实际上应该指向全局变量 window，但是因为 TypeScript 无法确定 say 函数被谁调用，所以将 this 的指向默认为 void，也就提示了一个 ts(2684) 错误。**

此时，我们可以通过调用 window.say() 来避免这个错误，这也是一个安全的设计。因为在 JavaScript 的严格模式下，全局作用域函数中 this 的指向是 undefined。

同样，定义对象的函数属性时，只要实际调用中 this 的指向与指定的 this 指向不同，TypeScript 就能发现 this 指向的错误，示例代码如下：

```js
interface Person {
    name: string;
    say(this: Person): void;
}
const person: Person = {
    name: 'captain',
    say() {
        console.log(this.name);
    },
};
const fn = person.say;
fn(); // ts(2684) The 'this' context of type 'void' is not assignable to method's 'this' of type 'Person'
```

**注意：显式注解函数中的 this 类型，它表面上占据了第一个形参的位置，但并不意味着函数真的多了一个参数，因为 TypeScript 转译为 JavaScript 后，“伪形参” this 会被抹掉，这算是 TypeScript 为数不多的特有语法。**

同样，我们也可以显式限定类函数属性中的 this 类型，TypeScript 也能检查出错误的使用方式，如下代码所示：

```js
class Component {
  onClick(this: Component) {}
}
const component = new Component();
interface UI {
  addClickListener(onClick: (this: void) => void): void;
}
const ui: UI = {
  addClickListener() {}
};
ui.addClickListener(new Component().onClick); // ts(2345)
```

上面示例中，我们定义的 Component 类的 onClick 函数属性（方法）显式指定了 this 类型是 Component，在第 14 行作为入参传递给 ui 的 addClickListener 方法中，它指定的 this 类型是 void，两个 this 类型不匹配，所以抛出了一个 ts(2345) 错误。

此外，在链式调用风格的库中，使用 this 也可以很方便地表达出其类型，如下代码所示：

```js
class Container {
  private val: number;
  constructor(val: number) {
    this.val = val;
  }
  map(cb: (x: number) => number): this {
    this.val = cb(this.val);
    return this;
  }
  log(): this {
    console.log(this.val);
    return this;
  }
}
const instance = new Container(1)
  .map((x) => x + 1)
  .log() // => 2
  .map((x) => x * 3)
  .log(); // => 6  
```

**因为 Container 类中 map、log 等函数属性（方法）未显式指定 this 类型，默认类型是 Container**，所以以上方法在被调用时返回的类型也是 Container，this 指向一直是类的实例，它可以一直无限地被链式调用。

介绍完函数中 this 的指向和类型后，我们再来了解一下它的另外一个特性函数多态（函数重载）。

#### 函数重载

JavaScript 是一门动态语言，针对同一个函数，它可以有多种不同类型的参数与返回值，这就是函数的多态。

而在 TypeScript 中，也可以相应地表达不同类型的参数和返回值的函数，如下代码所示：

```js
function convert(x: string | number | null): string | number | -1 {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number') {
        return String(x);
    }
    return -1;
}
const x1 = convert('1'); // => string | number
const x2 = convert(1); // => string | number
const x3 = convert(null); // => string | number
```

在上述代码中，我们把 convert 函数的 string 类型的值转换为 number 类型，number 类型转换为 string 类型，而将 null 类型转换为数字 -1。此时， x1、x2、x3 的返回值类型都会被推断成 string | number 。

那么，有没有一种办法可以更精确地描述参数与返回值类型约束关系的函数类型呢？有，这就是函数重载（Function Overload），如下示例中 1~3 行定义了三种各不相同的函数类型列表，并描述了不同的参数类型对应不同的返回值类型，而从第 4 行开始才是函数的实现。

```js
function convert(x: string): number;
function convert(x: number): string;
function convert(x: null): -1;
function convert(x: string | number | null): any {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number') {
        return String(x);
    }
    return -1;
}
const x1 = convert('1'); // => number
const x2 = convert(1); // => string
const x3 = convert(null); // -1
```

> 注意：函数重载列表的各个成员（即示例中的 1 ~ 3 行）必须是函数实现（即示例中的第 4 行）的子集，例如 “function convert(x: string): number”是“function convert(x: string | number | null): any”的子集。

在 convert 函数被调用时，TypeScript 会从上到下查找函数重载列表中与入参类型匹配的类型，并优先使用第一个匹配的重载定义。因此，我们需要把最精确的函数重载放到前面。例如我们在第 13 行传入了字符串 '1'，查找到第 1 行即匹配，而第 14 行传入了数字 1，则查找到第 2 行匹配。

为了理解这部分内容， 下面我们通过以下一个示例进行具体说明。

```js
interface P1 {
    name: string;
}
interface P2 extends P1 {
    age: number;
}
function convert(x: P1): number;
function convert(x: P2): string;
function convert(x: P1 | P2): any {}
const x1 = convert({ name: "" } as P1); // => number
const x2 = convert({ name: "", age: 18 } as P2); // number
```

**因为 P2 继承自 P1，所以类型为 P2 的参数会和类型为 P1 的参数一样匹配到第一个函数重载，此时 x1、x2 的返回值都是 number。**

```js
function convert(x: P2): string;
function convert(x: P1): number;
function convert(x: P1 | P2): any { }
const x1 = convert({ name: '' } as P1); // => number
const x2 = convert({ name: '', age: 18 } as P2); // => string
```

而我们只需要将函数重载列表的顺序调换一下，类型为 P2 和 P1 的参数就可以分别匹配到正确的函数重载了，例如第 5 行匹配到第 2 行，第 6 行匹配到第 1 行。

#### 类型谓词（is）

```js
function isString(s): s is string { // 类型谓词
  return typeof s === 'string';
}
function isNumber(n: number) {
  return typeof n === 'number';
}
function operator(x: unknown) {
  if(isString(x)) { // ok x 类型缩小为 string
  }
  if (isNumber(x)) { // ts(2345) unknown 不能赋值给 number
  }
}
```

在上述代码中，在添加返回值类型的地方，我们通过“参数名 + is + 类型”的格式明确表明了参数的类型，进而引起类型缩小，**所以类型谓词函数的一个重要的应用场景是实现自定义类型守卫**。