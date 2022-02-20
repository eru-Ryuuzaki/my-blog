---
theme: channing-cyan
---

### 防抖与节流

#### 防抖**debounce**
+ 应用场景
    + search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
    + ~~window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次~~（这个用节流可能合适点）


#### 节流**throttle**
+ 应用场景
    + 鼠标不断点击触发，mousedown(单位时间内只触发一次)
    + 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
    + window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次

### 改变 this 绑定**apply、call、bind**

#### apply
#### call
#### bind
#### new