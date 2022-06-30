---
theme: channing-cyan
---

# HTML 基础

### Doctype 作用

Doctype 位于文档最前面，处于 html 标签之前，告诉浏览器文档使用的是哪种 HTML 或者 XHTML 。只有确定了一个正确的 DOCTYPE，HTML 或者 XHTML 里的标识和 CSS 才能正常生效。</br>

包括以下几种类型：

- 严格版本
- 过渡版本
- 基于框架 html 版本

> HTML4 规定了三种声明方式，分别是：**严格模式、过渡模式 和 框架集模式**；而 HTML5 因为不是SGML的子集，只需要<!DOCTYPE>就可以了：
>
> > 1. html 4.01基于SGML，需要声明DTD。
> > 2. html5不基于SGML，所以不需要引用DTD。

严格模式的排版和 JS 运作模式是 以该浏览器⽀持的最⾼标准运⾏

在混杂模式中，⻚⾯以宽松的向后兼容的⽅式显示。模拟⽼式浏览器的⾏为以防⽌站点⽆法⼯作。

DOCTYPE 不存在或格式不正确会导致⽂档以混杂模式呈现

### HTML5 的更新

1. 语义化标签

   - 示例

   ```html
   <header>头部</header>
   <nav>导航栏</nav>
   <section>区块</section>
   <main>主要区域</main>
   <article>主要内容</article>
   <aside>侧边栏</aside>
   <footer>底部</footer>
   ```

   - 语义化的理解

#### 语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）。通俗来讲就是⽤正确的标签做正确的事情。

- 语义化的优点如下：

        + 对机器友好，带有语义的⽂字表现⼒丰富，更适合搜索引擎的爬⾍爬取有效信息，有利于SEO。
        + 语义类还⽀持读屏软件，根据⽂章可以⾃动⽣成⽬录。
        + 对开发者友好，使⽤语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出⽹⻚的结构，便于团队的开发与维护。

2. 媒体标签
   （1）audio: 音频

   - 背景——互联网上的音频发展

     html5 之前，仍然不存在一项旨在网页上播放音频的标准，大多数音频是通过插件（比如 Flash，不过**_自 2020 年 12 月开始，Flash Player 不再受 Chrome 支持_**）来播放的。然而，并非所有浏览器都拥有同样的插件。HTML5 规定了在网页上嵌入音频元素的标准，即使用 `<audio>` 元素。

   - 使用：不算很复杂，配合文档使用即可。
   
   （2）video
   
   ##### 	诞生背景和 audio 差不多
   
   （3）source 标签
   
   - `<source>` 标签为媒体元素（比如 `<video>` 和 `<audio>`）定义媒体资源。
- `<source>` 标签允许您规定两个视频/音频文件供浏览器根据它对媒体类型或者编解码器的支持进行选择。
	
3. 本地存储

   > h5提供了sessionStorage、localStorage和indexedDB加强本地存储，使用之前应该先判断支持情况。
   > 注意：localStorage存储的数据是不能跨浏览器共用的，一个浏览器只能读取各自浏览器的数据,储存空间5M。

4. 离线 web 应用

   ```js
   if(window.applicationCache){
       //支持离线应用
   }
   ```

5. WebSocket

   > WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。
   >
   > WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。
   >
   > 在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

6. pushState() 和 replaceState() 方法

   1. hash 模式和 history 模式的区别

     + hash ：hash 虽然出现在 URL 中，但不会被包含在 http 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

       > **当 URL 改变时，页面不会重新加载。** hash（#）是URL 的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器`只会滚动到相应位置，不会重新加载网页`，也就是说 #是用来指导浏览器动作的，对服务器端完全无用，`HTTP请求中也不会不包括#`；同时每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用”后退”按钮，就可以回到上一个位置；所以说`Hash模式通过锚点值的改变，根据不同的值，渲染指定DOM位置的不同数据`

     + history ：history 利用了 html5 history interface 中新增的 pushState() 和 replaceState() 方法。这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求。

   2. history 的优点：

      - pushState 设置的 url 可以是同源下的任意 url ；而 hash 只能修改 # 后面的部分，因此只能设置当前 url 同文档的 url
      - pushState 设置的新的 url 可以与当前 url 一样，这样也会把记录添加到栈中；hash 设置的新值不能与原来的一样，一样的值不会触发动作将记录添加到栈中
      - pushState 通过 stateObject 参数可以将任何数据类型添加到记录中；hash 只能添加短字符串
      - pushState 可以设置额外的 title 属性供后续使用

      history 的缺点：

      - history 在刷新页面时，如果服务器中没有相应的响应或资源，就会出现404。因此，如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面
      - hash 模式下，仅 # 之前的内容包含在 http 请求中，对后端来说，即使没有对路由做到全面覆盖，也不会报 404
      
   3. hash 的优点：

      - 只需要前端配置路由表, 不需要后端的参与
      - 兼容性好, 浏览器都能支持
      - hash值改变不会向后端发送请求, 完全属于前端路由

      hash 的缺点：

      - hash值前面需要加#, 不符合url规范,也不美观
   
7. 表单控件：HTML5 拥有多个新的表单输入类型。这些新特性提供了更好的输入控制和验证。

   + color

   + date

   + datetime

   + datetime-local

   + email

   + month

   + number

   + range

   + search

   + tel

   + time

   + url

   + week

8. 画布/Canvas，canvas，figure,figcaption.

9. 地理/Geolocation**.地理位置 API 允许用户向 Web 应用程序提供他们的位置。出于隐私考虑，报告地理位置前会先请求用户许可。**

10. 拖拽释放.HTML拖拽释放 (Drag and drop) 接口使应用程序能够在浏览器中使用拖放功能。例如，通过这些功能，用户可以使用鼠标选择可拖动元素，将元素拖动到可放置元素，并通过释放鼠标按钮来放置这些元素。可拖动元素的一个半透明表示在拖动操作期间跟随鼠标指针。

### src 和 href 的区别

#### src ⽤于替换当前元素，href ⽤于在当前⽂档和引⽤资源之间确⽴联系

- `src`

  src 是 source 的缩写，指向外部资源的位置，**指向的内容将会嵌⼊到⽂档中当前标签所在位置**；在请求 src 资源时会将其指向的资源下载并应⽤到⽂档内，例如 js 脚本，img 图⽚和 frame 等元素。
   当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执⾏完毕，图⽚和框架等元素也如此，类似于将所指向资源嵌⼊当前标签内。这也是为什么将 js 脚本放在底部⽽不是头部。

- `href`

  href 是 Hypertext Reference 的缩写，指向⽹络资源所在位置，建⽴和当前元素（锚点）或当前⽂档（链接）之间的链接，如果在⽂档中添加`<link href="common.css" rel="stylesheet"/>`那么浏览器会设别该文档为 css ⽂件，就会并⾏下载资源并且不会停⽌对当前⽂档的处理。 **这也是为什么建议使⽤ link ⽅式来加载 css，⽽不是使⽤@import ⽅式。**

### link 和 import

⻚⾯被加载的时， link 会同时被加载，⽽ @imort ⻚⾯被加载的时， link 会同时被加载，⽽ @import 引⽤的 CSS 会等到⻚⾯被加载完再加载 import 只在 IE5 以上才能识别，⽽ link 是 XHTML 标签，⽆兼容问题 link ⽅式的样式的权重 ⾼于 @import 的权重

### 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？⾏内元 素和块级元素有什么区别？

⾏内元素有： a b span img input select strong

块级元素有： div ul ol li dl dt dd h1 h2 h3 h4… p

空元素： br,hr img input link meta

**区别**

⾏内元素不可以设置宽⾼，不独占⼀⾏

块级元素可以设置宽⾼，独占⼀⾏

### **cookies,sessionStorage,localStorage** **的区别？**

cookie 是网站为了**标示用户身份**而储存在用户本地终端（Client Side）上的数据（通常经过加密）。

cookie 数据始终在同源的 http 请求中携带（即使不需要），记会在浏览器和服务器间来回传递。

sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

**存储大小**

cookie 数据大小不能超过 4k。

sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或

更大。

**有期时间**

localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；

sessionStorage 数据在当前浏览器窗口关闭后自动删除。

cookie 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭

### HTML5 **的离线储存的使用和原理？**

**相似存储**

localStorage 长期存储数据，浏览器关闭后数据不丢失； sessionStorage 数据在浏览器关闭后自动删

除。

**离线的存储**

两种方式

+ HTML5 的离线存储.appcache文件【废弃】

+ service-worker 的标准

**HTML5** 的离线存储.appcache文件【废弃】

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓

存文件。

原理：HTML5 的离线存储是基于一个新建的.appcache 文件的缓存机制（不是存储技术），通过这个

文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。

之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

**如何使用**

页面头部像下面一样加入一个 manifest 的属性

在 cache.manifest 文件的编写离线存储的资源

```
CACHE MANIFEST 
\#v0.11 
CACHE: 
js/app.js 
css/style.css 
NETWORK: 
resourse/logo.png 
FALLBACK: 
/ /offline.html
```

在离线状态时，操作 window.applicationCache 进行需求实现。

**service-worker**

### **怎样处理 移动端** **1px** **被 渲染成** **2px** **问题？**

+ meta 标签中的 viewport 属性 ，initial-scale 设置为 1; rem 按照设计稿标准走，外加利用 transfrom 的 scale(0.5) 缩小一倍即可； 

+ meta 标签中的 viewport 属性 ，initial-scale 设置为 0.5; rem 按照设计稿标准走即可

**解释**

UI 设计师设计的时候，画的 1px（真实像素）实际上是 0.5px(css) 的线或者边框。但是他不这么认为，

他认为他画的就是 1px 的线，因为他画的稿的尺寸本身就是屏幕尺寸的 2 倍。假设手机视网膜屏的宽度

是 320x480 宽，但实际尺寸是 640x960 宽，设计师设计图的时候一定是按照 640x960 设计的。但是前

端工程师写代码的时候，所有 css 都是按照 320x480 写的，写 1px(css)，浏览器自动变成 2px（真实像

素）。

那么前端工程师为什么不能直接写 0.5px(css) 呢？因为在老版本的系统里写 0.5px(css) 的话，会被浏览

器解读为 0px(css)，就没有边框了。所以只能写成 1px(css)，实际在屏幕上显示出来就是设计师画的

1px（真实像素）的 2 倍那么宽，所以设计师会觉得这个线太粗了，和他的设计稿不一样。在新版的系

统里，已经开始逐渐支持 0.5px(css) 这种写法。所以如果设计师在大图上设计了一个 1px（真实像素）

的线的话，前端工程师直接除以 2，写 0.5px(css) 就好了。

**另外一种解释**

事实就是它并没有变粗，就是 css 单位中的 1px，对于 dpr 为 2 的设备，它实际能显示的最小值是

0.5px。

设计师口中说的 1px 是针对设备物理像素的，换算成 css 像素就是 0.5px。

一句话总结，background:1px solid black 在任何屏幕上都是一样粗的，但是 retina 屏可以显示比这更

细的边框，然后设计师就不乐意了，让你改。

### 浏览器是如何渲染页面的？

**解析** **HTML** **文件，创建** **DOM** **树**

自上而下，遇到任何样式（link、style）与脚本（script）都会阻塞（外部样式不阻塞后续外部脚本的加载）。

**解析** **CSS**

优先级：浏览器默认设置<用户设置<外部样式<内联样式<HTML中的style样式；

**构建渲染树**

将 CSS 与 DOM 合并，构建渲染树（Render Tree）

**布局和绘制**

布局和绘制，重绘（repaint）和重排（reflow）

### **iframe** **的优缺点？**

+ iframe 会阻塞主页面的 Onload 事件；

+ **iframe 和主页面共享连接池**，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。

+ 使用 iframe 之前需要考虑这两个缺点。如果需要使用 iframe，最好是通过 javascript 动态给iframe 添加 src 属性值，这样可以可以绕开以上两个问题。

### **Canvas** **和** **SVG** **图形的区别是什么？**

Canvas 和 SVG 都可以在浏览器上绘制图形。

SVG Canvas 绘制后记忆，换句话说任何使用 SVG 绘制的形状都能被记忆和操作，浏览器可以再次显示

Canvas 则是绘制后忘记，一旦绘制完成你就不能访问像素和操作它 

SVG 对于创建图形例如 CAD 软件是良好的，一旦东西绘制，用户就想去操作它 Canvas 则用于绘制和遗忘类似动漫和游戏的场画。

为了之后的操作，SVG 需要记录坐标，所以比较缓慢。

因为没有记住以后事情的任务，所以 Canvas 更快。

SVG 我们可以用绘制对象的相关事件处理; Canvas 我们不能使用绘制对象的相关事件处理，因为我们没有他们的参考(?)

SVG分辨率独立；Canvas分辨率依赖

+ SVG 并不属于 html5 专有内容，在 html5 之前就有 SVG。

+ SVG 文件的扩展名是”.svg”。

+ SVG 绘制的图像在图片质量不下降的情况下被放大。

+ SVG 图像经常在网页中制作小图标和一些动态效果图。

### **meta** **标签**

**核心**

提供给页面的一些元信息（名称 / 值对），有助于 SEO。

**属性值**

+ name

  名称 / 值对中的名称。author、description、keywords、generator、revised、others。 把 content 属性关联到一个名称。

+ http-equiv

  没有 name 时，会采用这个属性的值。content-type、expires、refresh、set-cookie。把content 属性关联到 http 头部

+ content

  名称 / 值对中的值， 可以是任何有效的字符串。 始终要和 name 属性或 http-equiv 属性一起使用

+ scheme

  用于指定要用来翻译属性值的方案。