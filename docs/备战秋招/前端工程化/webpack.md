---
theme: channing-cyan
---
## webpack 与 vue-cli 
### 概念
webpack：**前端资源模块化管理和打包工具**

vue-cli：**脚手架工具，基于 webpack 构建，并带有合理的默认配置。其作用就是用配置好的模板迅速搭建起一个项目工程来，省去自己配置webpack配置文件的基本内容。**

简单的配置方式

调整 webpack 配置最简单的方式就是在 `vue.config.js` 中的 `configureWebpack` 选项提供一个对象：

该对象将会被 webpack-merge 合并入最终的 webpack 配置。

```js
// vue.config.js 
module.exports = {
    configureWebpack: {
        plugins: [ new MyAwesomeWebpackPlugin() ] 
    } 
}
```

### 关系
vue-cli 里面包含了webpack， 并且配置好了基本的webpack打包规则

## 如何⽤**webpack**来优化前端性能？

⽤webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。

-   **压缩代码**：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利⽤ cssnano （css-loader?minimize）来压缩css
-   **利⽤CDN加速**: 在构建过程中，将引⽤的静态资源路径修改为CDN上对应的路径。可以利⽤webpack对于 output 参数和各loader的 publicPath 参数来修改资源路径
-   **Tree Shaking**: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动webpack时追加参数 --optimize-minimize 来实现
-   **Code Splitting**: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存
-   **提取公共第三⽅库**: SplitChunksPlugin插件来进⾏公共模块抽取,利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码



## 常⻅的 Loader

-   **file-loader**：把⽂件输出到⼀个⽂件夹中，在代码中通过相对 URL 去引⽤输出的⽂件。
-   **url-loader**：和 file-loader 类似，但是能在⽂件很⼩的情况下以 base64 的⽅式把⽂件内容注⼊到代码中去。
-   **source-map-loader**：加载额外的 Source Map ⽂件，以⽅便断点调试。
-   **image-loader**：加载并且压缩图⽚⽂件。
-   **babel-loader**：把 ES6 转换成 ES5。
-   **css-loader**：加载 CSS，⽀持模块化、压缩、⽂件导⼊等特性。
-   **style-loader**：把 CSS 代码注⼊到 JavaScript 中，通过 DOM 操作去加载 CSS。
-   **eslint-loader**：通过 ESLint 检查 JavaScript 代码是否符合规范和是否存在语法错误。

## babel
### 执行顺序

-   Plugin 会运行在 Preset 之前。
-   Plugin 会从前到后顺序执行。
-   Preset 的顺序则 **刚好相反**(从后向前)。

## webpack treeShaking机制的原理

-   treeShaking 也叫`摇树优化`，是一种通过移除多于代码，来优化打包体积的，`生产环境默认开启`。

-   可以在`代码不运行`的状态下，分析出`不需要的代码`；

-   利用`es6模块`的规范

    -   ES6 Module引入进行`静态分析`，故而`编译的时候正确判断到底加载了那些模块`
    -   静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码