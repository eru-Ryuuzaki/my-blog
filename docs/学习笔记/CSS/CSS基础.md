---
theme: channing-cyan
---

### CSS 选择器、优先级、权重计算方式（待补充）

**感觉这就体现出了 CSS 的层叠性**

CSS选择器包括行内样式、`id`选择器、`class`选择器、标签选择器，优先级依次降低，`!important`可用于优先级提升，比行内样式优先级还要高，权重的计算依次为`1000`,`100`,`10`,`1`,`!important`的优先级为正无穷。

但实际上，`1000,100,10,1`不是十进制中的`1000,100,10,1`，而是进制数，不是`2`进制，不是`10`进制，而是`256`进制，就是`0`到`255`后`+1`才是`1`，比如通配符的权重为`0`，伪元素的权重为`1`，中间相差了`255`，依次类推。

并且，`!important`的权重虽然为正无穷，但也是可以计算的，比如正无穷`+1`或者`*2`就比正无穷大，原因是计算机中的正无穷是有界的，不是数学上无界的概念。

#### CSS选择器类型 

+ 样式类型

    + 行内样式：`<div style="color:red;">`

    + 内联样式：`<style></style>`

    + 外部样式：`<link>或@import引入`

+ 选择器类型

    + id选择器
    + class选择器
    + 属性选择器
    + \*
    + 伪类选择器
    + 伪元素
    + 后代选择器
    + 子类选择器
    + 兄弟选择器
    
    > [1. 基础选择器](#1-基础选择器---toc---)
    >
    > - [1.1. ID选择器](#11-id选择器)
    > - [1.2. 类选择器](#12-类选择器)
    > - [1.3. 通配符选择器](#13-通配符选择器)
    > - [1.4. 标签选择器](#14-标签选择器)
    > - [1.5. 属性选择器](#15-属性选择器)
    >
    > [2. 组合选择器](#2-组合选择器)
    >
    > - [2.1. 后代选择器](#21-后代选择器)
    > - [2.2. 子元素选择器](#22-子元素选择器)
    > - [2.3. 相邻兄弟选择器](#23-相邻兄弟选择器)
    > - [2.4. 通用兄弟选择器](#24-通用兄弟选择器)
    > - [2.5. 交集选择器](#25-交集选择器)
    > - [2.6. 并集选择器](#26-并集选择器)
    >
    > [3. 伪类和伪元素选择器](#3-伪类和伪元素选择器)
    >
    > - [3.1. 标记状态的伪类](#31-标记状态的伪类)
    > - [3.2. 筛选功能的伪类](#32-筛选功能的伪类)
    > - [3.3. 伪元素选择器](#33-伪元素选择器)

#### 权重计算规则

**css中用四位数字表示权重，权重的表达方式如：0000**

-   第一优先级：`!important`会覆盖页面内任何位置的元素样式
-   1.内联样式，权值为`1000`
-   2.ID选择器，权值为`0100`
-   3.类、伪类、属性选择器，权值为`0010`
-   4.标签、伪元素选择器，权值为`0001`
-   5.通配符、子类选择器、兄弟选择器，如`*, >, +`，权值为`0000`
-   6.继承的样式没有权值

#### 比较规则
1. `!important`声明的样式的优先级最⾼；
2. `1000 > 0100`，从左向右逐个比较，前一级相等才能往后比较
3. 权重相同的情况下，位于后面的样式会覆盖前面的样式
4. 通配符（*）、子选择器（>）、兄弟选择器（+），虽然权重为`0000`，但是优先于继承的样式
5. 样式表的来源不同时，优先级顺序为：`内联样式 > 内部样式 > 外部样式 > 浏览器⽤户⾃定义样式 > 浏览器默认样式`。

### **CSS** **动画有哪些？**

animation、transition、transform、translate 这几个属性要搞清楚：

animation：用于设置动画属性，他是一个简写的属性，包含6个属性

- animation-name
- animation-duration
- animation-timing-function
- animation-delay
- animation-iteration-count
- animation-direction

transition：用于设置元素的样式过度，和animation有着类似的效果，但细节上有很大的不同,他是一个简写的属性，包含4个属性

- transition-property
- transition-duration
- transition-timing-function
- transition-delay

transform：用于元素进行旋转、缩放、移动或倾斜，和设置样式的动画并没有什么关系

translate：translate只是transform的一个属性值，即移动，除此之外还有 scale 等

### **visibility** **和** **display** 的差别（还有opacity)

visibility：设置 hidden 会隐藏元素，但是其位置还存在与页面文档流中，不会被删除，所以会触

发浏览器渲染引擎的重绘

display：设置了 none 属性会隐藏元素，且其位置也不会被保留下来，所以会触发浏览器渲染引擎

的回流和重绘。

opacity：会将元素设置为透明，但是其位置也在页面文档流中，不会被删除，所以会触发浏览器

渲染引擎的重绘

**opacity** **可以有过渡效果嘛？**

可以设置过渡效果

### **BFC** **与** **IFC** **区别**

**布局规则**

+ IFC布局规则：

  1. 在行内格式化上下文中，boxes一个接一个地水平排列，起点是包含块的顶部。

  2. 水平方向上的margin border padding在框之间得到保留

  3. 在垂直方向上可以以不同的方式对齐：顶部或底部对齐，或者根据文字的基线对齐

+ BFC布局规则：
  1. 内部的Box会在垂直方向，一个接一个地放置
  2. Box垂直方向上的距离由margin决定，同属一个BFC的两个相邻Box的margin会发生重叠
  3. 每个元素的左外边缘(margin-left)，与包含块的左边(contain box left)相接触(对于从左到右的格式化)。即使存在浮动也是如此，除非这个元素自己形成一个新的BFC
  4. BFC的区域不会与float box重叠
  5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
  6. 计算BFC的高度时，浮动元素也参与计算

**如何形成一个BFC**

+ 根元素或者其它包含它的元素
+ 浮动元素(float不是none)
+ 绝对定位的元素（position为absolute或fixed）
+ 非块级元素具有display:inline-block， table-cell，table-caption，flex，inline-flex
+ 块级元素具有overflow，且值不是visible

**BFC会与float元素相互覆盖吗？为什么？举例说明**

> 不会，因为 BFC 是页面中一个独立的隔离容器，其内部的元素不会与外部的元素相互影响，比如两个div，上面的 div 设置了 float，那么如果下面的元素不是 BFC，也没有设置 float，会形成对上面的元素进行包裹内容的情况，如果设置了下面元素为 overflow：hidden；属性那么就能够实现经典的两列布局，左边内容固定宽度，右边因为是 BFC 所以会进行自适应。

### 了解box-sizing吗？

box-sizing 属性可以被用来调整这些表现: 

+ content-box 是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
+ border-box 告诉浏览器：你想要设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高。

### 说一下你知道的position属性，都有啥特点？

+ static：无特殊定位，对象遵循正常文档流。top，right，bottom，left等属性不会被应用。

+ relative：对象遵循正常文档流，但将依据top，right，bottom，left等属性在正常文档流中偏移位置。而其层叠通过z-index属性定义。

+ absolute：对象脱离正常文档流，使用top，right，bottom，left等属性进行绝对定位。而其层叠通过z-index属性定义。

+ fixed：对象脱离正常文档流，使用top，right，bottom，left等属性以窗口为参考点进行定位，当出现滚动条时，对象不会随着滚动。而其层叠通过z-index属性定义。

+ sticky：具体是类似 relative 和 fixed，在 viewport 视口滚动到阈值之前应用 relative，滚动到阈值之后应用 fixed 布局，由 top 决定。

### 两个div上下排列，都设margin，有什么现象？

是由块级格式上下文决定的，BFC，元素在 BFC 中会进行上下排列，然后垂直距离由 margin 决定，并

且会发生重叠，具体表现为同正取最大的，同负取绝对值最大的，一正一负，相加

BFC 是页面中一个独立的隔离容器，内部的子元素不会影响到外部的元素。

**18.** **清除浮动有哪些方法？**

不清楚浮动会发生高度塌陷：浮动元素父元素高度自适应（父元素不写高度时，子元素写了浮动后，父

元素会发生高度塌陷）

+ clear清除浮动（添加空div法）在浮动元素下方添加空div,并给该元素写css样式：

  ```css
  {clear:both;height:0;overflow:hidden;}
  ```

+ 给浮动元素父级设置高度,父级同时浮动（需要给父级同级元素添加浮动）

+ 父级设置成inline-block，其margin: 0 auto居中方式失效

+ 给父级添加overflow:hidden 清除浮动

+ 万能清除法 after伪类 清浮动（现在主流方法，推荐使用）


### 布局
1. **flex 布局**

    此处个人推荐阮一峰大大的博客，个人学习的 flex 基础知识都是从上面学的~

    [Flex 布局教程:语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

    [Flex 布局教程:实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

    + flex: 1 代表着什么

      `flex:1` 为：`flex: 1 1 0;`
      
      - 第一个参数表示: **flex-grow 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大**
      - 第二个参数表示: **flex-shrink 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小**
      - 第三个参数表示: **flex-basis** **给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小**
      
      > 数值 1 设置的是 flex-grow，flex-shrink没设置的时候默认值是1，和初始值一样的；
      >  特殊在于flex-basis，初始值为 auto 那常规思路没设置就采用默认值则：`flex:1 === flex:1 1 auto`;
      >  但[MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FCSS%2Fflex)给了定义一个值的时候的解释，如果flex只定义了一个数字值，则 flex-basis 的值为 0；
      >  所以：`flex:1` 为：`flex: 1 1 0`;

2.  **定位**
    
    + *子绝父相*
    
        top、right、bottom、left这四个属性要生效的话,必须得设置相对定位/绝对定位，即position：relative;或者position：absolute;
        
        也就是说top、right、bottom、left是为相对定位/绝对定位而生的。 
        
        子绝父相就是：子元素为绝对定位(position：absolute;)，父元素为相对定位position：relative;。例如A为子元素，那么父元素B必须包含A，也就是说AB一定是嵌套关系(父子关系),不可以是兄弟关系。

