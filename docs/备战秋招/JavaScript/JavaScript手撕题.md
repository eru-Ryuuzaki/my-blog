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

### js 链式调用的调用对象

是每一次调用返回的结果进行再次调用而不是都作用于一开始的对象

```js
let a = [1, 2, 3, 4, 5, 6]
let b = a.slice(2, 4).forEach(v => {
    console.log(v)
})
// > 3
// > 4
```

### 正则表达式中有变量的话，可以通过new RegExp() 来创建

### [获取 url 中的参数](https://www.nowcoder.com/practice/a3ded747e3884a3c86d09d88d1652e10)

1. 指定参数名称，返回该参数的值 或者 空字符串；
2. 不指定参数名称，返回全部的参数对象 或者 {}；
3. 如果存在多个同名参数，则返回数组 ；
4. 不支持URLSearchParams方法

+ 做法一：

  ```js
  function getUrlParam(sUrl, sKey) {
      let idx1 = sUrl.indexOf('?');
      let idx2 = sUrl.includes('#') ? sUrl.indexOf('#') : sUrl.length;
      if (idx1 === -1) {
          if (sKey)    return "";
          else         return {};
      }
      let paramsUrl = sUrl.split('').slice(idx1 + 1, idx2).join('').split('&');
      if (sKey) {
          let ans = [];
          paramsUrl.forEach(item => {
              let arr = item.split('=');
              if (arr[0] === sKey) {
                  ans.push(arr[1]);
              }
          })
          if (ans.length <= 1) return ans.toString();
          return ans;
      } else {
          let ans = {};
          paramsUrl.forEach(item => {
              let arr = item.split('=');
              if (!ans[arr[0]]) {
                  ans[arr[0]] = [arr[1]];
              } else {
                  ans[arr[0]].push(arr[1]);
              }
          })
          for (let v in ans) {
              if (!Array.isArray(ans[v])) {
                  ans[v] = ans[v].toString();
              }
          }
          return ans;
      }
  }
  ```

  

+ 做法二：（解法一的简化版）

  ```js
  function getUrlParam(sUrl, sKey) {
      var left= sUrl.indexOf("?") + 1
      var right= sUrl.lastIndexOf("#")
      var parasString = sUrl.slice(left, right)
      var paras = parasString.split('&');
      var parasjson = {}
      paras.forEach(function (value, index, arr) {
          var a = value.split('=');
          parasjson[a[0]] !== undefined ? parasjson[a[0]] = [].concat(parasjson[a[0]], a[1]) : parasjson[a[0]] = a[1];
      });
  
      let result = arguments[1] !== void 0 ? (parasjson[arguments[1]] || '') : parasjson;
      return result
  }
  ```

  

+ 做法三：使用正则表达式匹配字符，并使用正则Replace方法替换

  ```js
  function getUrlParam2(sUrl, sKey) {
      var result, Oparam = {};
      // $0 表示的是整一块匹配的子串, $1、$2...... 这些才是分组的子串
      sUrl.replace(/[\?&]?(\w+)=(\w+)/g, function ($0, $1, $2) 
          console.log('$0:' + $0 + "     $1:" + $1 + "     $2:" + $2);
          Oparam[$1] === void 0 ? Oparam[$1] = $2 : Oparam[$1] = [].concat(Oparam[$1], $2);
      });
      sKey === void 0 || sKey === '' ? result = Oparam : result = Oparam[sKey] || '';
      return result;
  }
  ```

  

+ 题目延伸：修改 url 中某个参数的值

  ```js
  let url = "http://www.nowcoder.com?key=1&key=2&key=3&test=4tr#hehe"
  let tar = "eru"
  function solve(url, key, target) {
      let reg = new RegExp(`[\\?&]?(${key})=([^&#]+)`, "g");
      return url.replace(reg, function($0, $1, $2) {
          return $0.replace($2, target)
      })
  }
  console.log(solve(url, "test", tar))
  // > http://www.nowcoder.com?key=1&key=2&key=3&test=eru#hehe
  ```

  