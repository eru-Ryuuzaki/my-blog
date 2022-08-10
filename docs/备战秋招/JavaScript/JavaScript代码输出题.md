## 一、异步&事件循环

+ ```js
  const promise = new Promise((resolve, reject) => {
    console.log(1);
    console.log(2);
  });
  promise.then(() => {
    console.log(3);
  });
  console.log(4);
  // 输出
  1
  2
  4
  3 ×
  promise.then 是微任务，它会在所有的宏任务执行完之后才会执行，同时需要promise内部的状态发生变化，因为这里内部没有发生变化，一直处于pending状态，**所以不输出3**。
  ```
+ ```js
    const promise1 = new Promise((resolve, reject) => {
      console.log('promise1')
      resolve('resolve1')
    })
    const promise2 = promise1.then(res => {
      console.log(res)
    })
    console.log('1', promise1);
    console.log('2', promise2);
    // 输出
    promise1
    1 pending ×	1 Promise{<resolved>: resolve1}
    2 pending ×	2 Promise{<pending>}
    resolve1 
    /*
    需要注意的是，直接打印 promise，会打印出它的状态值和参数。
    */
  ```

+ ```js
  const promise = new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
      console.log("timerStart");
      resolve("success");
      console.log("timerEnd");
    }, 0);
    console.log(2);
  });
  promise.then((res) => {
    console.log(res);
  });
  console.log(4);
  // 输出
  1  
  2
  4
  timerStart
  timerEnd
  success
  ```

+ ```js
  Promise.resolve().then(() => {
    console.log('promise1');
    const timer2 = setTimeout(() => {
      console.log('timer2')
    }, 0)
  });
  const timer1 = setTimeout(() => {
    console.log('timer1')
    Promise.resolve().then(() => {
      console.log('promise2')
    })
  }, 0)
  console.log('start');
  // 输出
  start
  promise1
  timer1
  promise2
  timer2
  ```

+ ```js
  const promise = new Promise((resolve, reject) => {
      resolve('success1');
      reject('error');
      resolve('success2');
  });
  promise.then((res) => {
      console.log('then:', res);
  }).catch((err) => {
      console.log('catch:', err);
  })
  // print
  then:success1
  ```

+ ```js
  Promise.resolve(1)
      .then(2)
      .then(Promise.resolve(3))
      .then(console.log)
  // print
  Promise{resolve:3} ×
  应该是
  1
  Promise {<fulfilled>: undefined} // 这个其实不算是输出，应该只是浏览器对声明了遍历之后自动做的输出
  Promise.resolve方法的参数如果是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的Promise对象，状态为resolved，Promise.resolve方法的参数，会同时传给回调函数。
    
  then方法接受的参数是函数，而如果传递的并非是一个函数，它实际上会将其解释为then(null)，这就会导致前一个Promise的结果会传递下面。
  ```

+ ```js
  const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  })
  const promise2 = promise1.then(() => {
    throw new Error('error!!!')
  })
  console.log('promise1', promise1)
  console.log('promise2', promise2)
  setTimeout(() => {
    console.log('promise1', promise1)
    console.log('promise2', promise2)
  }, 2000)
  // print
  promise1 Promise {<pending>}
  promise2 Promise {<reject>: error!!!}	× // 还在微任务呢，还没改变状态 promise2 Promise {<pending>}
  promise1 Promise {<fulfilled>: success}
  promise2 Promise {<reject>: error!!!} × // 写法不规范 promise2 Promise {<rejected>: Error: error!!}
  ```
+ ```js
  Promise.resolve(1)
    .then(res => {
      console.log(res);
      return 2;
    })
    .catch(err => {
      return 3;
    })
    .then(res => {
      console.log(res);
    });
  // print
  1
  2
  ```
+ ```js
  Promise.resolve().then(() => {
    return new Error('error!!!')
  }).then(res => {
    console.log("then: ", res)
  }).catch(err => {
    console.log("catch: ", err)
  })
  > catch: Error: error!!!
  ```
+ ```js
  const promise = Promise.resolve().then(() => {
    return promise;
  })
  promise.catch(console.err)
  // 不会、、、
  Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
    这里其实是一个坑，.then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。
  ```

+ ```js
  Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log)
  // print
1
  ```
  
+ ```js
  Promise.reject('err!!!')
    .then((res) => {
      console.log('success', res)
    }, (err) => {
      console.log('error', err)
    }).catch(err => {
      console.log('catch', err)
    })
  // print
error: err!!!
  ```
  
+ ```js
  Promise.resolve('1')
    .then(res => {
      console.log(res)
    })
    .finally(() => {
      console.log('finally')
    })
  Promise.resolve('2')
    .finally(() => {
      console.log('finally2')
    	return '我是finally2返回的值'
    })
    .then(res => {
      console.log('finally2后面的then函数', res)
    })
  // print
1
  finally2后面的then函数 2	×
  finally
  finally2	×
  // 笔记
  .finally()一般用的很少，只要记住以下几点就可以了：
  ● .finally()方法不管Promise对象最后的状态如何都会执行
  ● .finally()方法的回调函数不接受任何的参数，也就是说你在.finally()函数中是无法知道Promise最终的状态是resolved还是rejected的
  ● 它最终返回的默认会是一个上一次的Promise对象值，不过如果抛出的是一个异常则返回异常的Promise对象。
  ● finally本质上是then方法的特例
  // 正确的输出
  1
  finally2
  finally
  finally2后面的then函数 2
  ```
  
+ ```js
  function runAsync (x) {
      const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
      return p
  }
  
  Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then(res => console.log(res))
  // print
1
  2
  3
  [1, 2, 3]
  // resolve 回调函数第二个参数可以这样弄实属是没想到，可能是没作用的只是执行了一下
  ```
  
+ ```js
  function runAsync (x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
    return p
  }
  function runReject (x) {
    const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
    return p
  }
  Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
         .then(res => console.log(res))
         .catch(err => console.log(err))
  // print
1	// 1s
  3	// 1s
  2	// 2s
  Error: 2
  4	// 4s
  ```
  
+ ```js
  function runAsync (x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
    return p
  }
  Promise.race([runAsync(1), runAsync(2), runAsync(3)])
    .then(res => console.log('result: ', res))
    .catch(err => console.log(err))
  // print
1
  result: 1
  2
  3
  ```
  
+ ```js
  function runAsync(x) {
    const p = new Promise(r =>
      setTimeout(() => r(x, console.log(x)), 1000)
    );
    return p;
  }
  function runReject(x) {
    const p = new Promise((res, rej) =>
      setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
    );
    return p;
  }
  Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
    .then(res => console.log("result: ", res))
    .catch(err => console.log(err));
  // print
0 // 0S
  Error: 0 // 0S
  1 // 1s
  2 // 2s
  3 // 3s
  ```
  
+ ```js
  async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
  }
  async function async2() {
    console.log("async2");
  }
  async1();
  console.log('start')
  // print
async1 start
  async2
  start
  async1 end
  ```
  
+ ```js
  async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
    setTimeout(() => {
      console.log('timer1')
    }, 0)
  }
  async function async2() {
    setTimeout(() => {
      console.log('timer2')
    }, 0)
    console.log("async2");
  }
  async1();
  setTimeout(() => {
    console.log('timer3')
  }, 0)
  console.log("start")
  // print
async1 start
  async2
  start
  async1 end
  timer2
  timer3
  timer1
  ```
  
+ ```js
  async function async1 () {
    console.log('async1 start');
    await new Promise(resolve => {
      console.log('promise1')
    })
    console.log('async1 success');
    return 'async1 end'
  }
  console.log('srcipt start')
  async1().then(res => console.log(res))
  console.log('srcipt end')
  // print
srcipt start
  async1 start
  promise1
  srcipt end
  async1 success	×
  最后一个不知道输出啥的 QWQ 可以调用 then 方法吗? 
  如果 resolve 或者 return 了一个值的话 了的话是可以的，参考下面那题,这道题虽然有 return 但是执行不到 return 那里
  // 正确输出
  script start
  async1 start
  promise1
  script end
  这里需要注意的是在async1中await后面的Promise是没有返回值的，也就是它的状态始终是pending状态，所以在await之后的内容是不会执行的，包括async1后面的 .then。
  ```
  
+ ```js
  async function async1 () {
    console.log('async1 start');
    await new Promise(resolve => {
      console.log('promise1')
      resolve('promise1 resolve')
    }).then(res => console.log(res))
    console.log('async1 success');
    return 'async1 end'
  }
  console.log('srcipt start')
  async1().then(res => console.log(res))
  console.log('srcipt end')
  // print
srcipt start
  async1 start
  promise1
  srcipt end
  async1 success	// 这里开始错了 就算那个 then 是微任务，但是 await 后面的语句都还没执行完，所以后面的还是继续等吧！
  promise1 resolve
  // 正确输出
  script start
  async1 start
  promise1
  script end
  promise1 resolve
  async1 success
  async1 end
  // 笔记
  async 修饰的函数 返回值是一个 promise(会自动包装)
  ```
  
+ ```js
  async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
  }
  
  async function async2() {
    console.log("async2");
  }
  
  console.log("script start");
  
  setTimeout(function() {
    console.log("setTimeout");
  }, 0);
  
  async1();
  
  new Promise(resolve => {
    console.log("promise1");
    resolve();
  }).then(function() {
    console.log("promise2");
  });
  console.log('script end')
  // print
script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  setTimeout
  ```
  
+ ```js
  async function async1 () {
    await async2();
    console.log('async1');
    return 'async1 success'
  }
  async function async2 () {
    return new Promise((resolve, reject) => {
      console.log('async2')
      reject('error')
    })
  }
  async1().then(res => console.log(res))
  // print
async2
  async1	// 这里开始错
  async1 success
  // 正确输出
  async2
  Uncaught (in promise) error
  await 后面如果是一个 reject 的 promise 必须要处理这个结果，不然就报错
  ```
  
+ ```js
  const first = () => (new Promise((resolve, reject) => {
      console.log(3);
      let p = new Promise((resolve, reject) => {
          console.log(7);
          setTimeout(() => {
              console.log(5);
              resolve(6);
              console.log(p)
          }, 0)
          resolve(1);
      });
      resolve(2);
      p.then((arg) => {
          console.log(arg);
      });
  }));
  first().then((arg) => {
      console.log(arg);
  });
  console.log(4);
  // print
3
  7
  4
  1
  2
  5
  Promise{<resolved>: 1}
  ```
  
+ ```js
  const async1 = async () => {
    console.log('async1');
    setTimeout(() => {
      console.log('timer1')
    }, 2000)
    await new Promise(resolve => {
      console.log('promise1')
    })
    console.log('async1 end')
    return 'async1 success'
  } 
  console.log('script start');
  async1().then(res => console.log(res));
  console.log('script end');
  Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .catch(4)
    .then(res => console.log(res))
  setTimeout(() => {
    console.log('timer2')
  }, 1000)
  // print
script start
  async1
  promise1
  script end
  1
  timer2
  timer1
  ```
  
+ ```js
  const p1 = new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolve3');
      console.log('timer1')
    }, 0)
    resolve('resovle1');
    resolve('resolve2');
  }).then(res => {
    console.log(res)  
    setTimeout(() => {
      console.log(p1)
    }, 1000)
  }).finally(res => {
    console.log('finally', res)
  })
  // print
resovle1
  finally undefined
  timer1
  Promise{<resolved>:undefined}
  ```
  
+ ```js
  console.log('1');
  
  setTimeout(function() {
      console.log('2');
      process.nextTick(function() {
          console.log('3');
      })
      new Promise(function(resolve) {
          console.log('4');
          resolve();
      }).then(function() {
          console.log('5')
      })
  })
  process.nextTick(function() {
      console.log('6');
  })
  new Promise(function(resolve) {
      console.log('7');
      resolve();
  }).then(function() {
      console.log('8')
  })
  
  setTimeout(function() {
      console.log('9');
      process.nextTick(function() {
          console.log('10');
      })
      new Promise(function(resolve) {
          console.log('11');
          resolve();
      }).then(function() {
          console.log('12')
      })
  })
  // print
1
  7
  6
  8
  2
  4
  3
  5
  9
  11
  10
  12
  ```
  
+ ```js
  console.log(1)
  
  setTimeout(() => {
    console.log(2)
  })
  
  new Promise(resolve =>  {
    console.log(3)
    resolve(4)
  }).then(d => console.log(d))
  
  setTimeout(() => {
    console.log(5)
    new Promise(resolve =>  {
      resolve(6)
    }).then(d => console.log(d))
  })
  
  setTimeout(() => {
    console.log(7)
  })
  
  console.log(8)
  // print
1
  3
  8
  4
  2
  5
  6
  7
  ```
  
+ ```js
  console.log(1);
      
  setTimeout(() => {
    console.log(2);
    Promise.resolve().then(() => {
      console.log(3)
    });
  });
  
  new Promise((resolve, reject) => {
    console.log(4)
    resolve(5)
  }).then((data) => {
    console.log(data);
  })
  
  setTimeout(() => {
    console.log(6);
  })
  
  console.log(7);
  // print
1
  4
  7
  5
  2
  3
  6
  ```
  
+ ```js
  Promise.resolve().then(() => {
      console.log('1');
      throw 'Error';
  }).then(() => {
      console.log('2');
  }).catch(() => {
      console.log('3');
      throw 'Error';
  }).then(() => {
      console.log('4');
  }).catch(() => {
      console.log('5');
  }).then(() => {
      console.log('6');
  });
  // print
1
  3
  5
  6
  ```
  
+ ```js
  setTimeout(function () {
    console.log(1);
  }, 100);
  
  new Promise(function (resolve) {
    console.log(2);
    resolve();
    console.log(3);
  }).then(function () {
    console.log(4);
    new Promise((resove, reject) => {
      console.log(5);
      setTimeout(() =>  {
        console.log(6);
      }, 10);
    })
  });
  console.log(7);
  console.log(8);
  // print
  2
  3
  7
  8
  4
  5
  6
  1
  ```

## 二、this

+ ```js
  function foo() {
    console.log( this.a );	
  }
  
  function doFoo() {
    foo();
  }
  
  var obj = {
    a: 1,
    doFoo: doFoo
  };
  
  var a = 2; 
  obj.doFoo()	// 2
  ```

+ ```js
  var a = 10
  var obj = {
    a: 20,
    say: () => {
      console.log(this.a)
    }
  }
  obj.say() // 20 ×
  
  var anotherObj = { a: 30 } 
  obj.say.apply(anotherObj) // 20	×
  // 正确输出
  10
  10
  需要注意的是，say(箭头函数)的this来自原其父级所处的上下文
  这个上下文不是对象！！！
  这个上下文不是对象！！！
  这个上下文不是对象！！！
  所以不是指向 obj 而是指向全局作用域
  ```

+ ```js
  var a = 10  
  var obj = {  
    a: 20,  
    say(){
      console.log(this.a)  
    }  
  }  
  obj.say()   // 20
  var anotherObj={a:30}   
  obj.say.apply(anotherObj)	//30
  ```

+ ```js
  function a() {
    console.log(this);
  }
  a.call(null);
  // 不咋会
  // 正确输出
  window对象
  // 笔记
  根据ECMAScript262规范规定：如果第一个参数传入的对象调用者是null或者undefined，call方法将把全局对象（浏览器上是window对象）作为this的值。所以，不管传入null 还是 undefined，其this都是全局对象window。
  ```

+ ```js
  'use strict';
  
  function a() {
      console.log(this);
  }
  a.call(null); // null
  a.call(undefined); // undefined
  // 笔记
  要注意的是，在严格模式中，null 就是 null，undefined 就是 undefined
  ```

+ ```js
  var obj = { 
    name: 'cuggz', 
    fun: function(){ 
       console.log(this.name); 
    } 
  } 
  obj.fun()     // cuggz
  new obj.fun() // undefined
  ```

+ ```js
  var obj = {
     say: function() {
       var f1 = () =>  {
         console.log("1111", this);
       }
       f1();
     },
     pro: {
       getPro:() =>  {
          console.log(this);
       }
     }
  }
  var o = obj.say;
  o();
  obj.say();
  obj.pro.getPro();
  // 1111 window
  // 1111 obj
  // window
  ```

+ ```js
  var myObject = {
      foo: "bar",
      func: function() {
          var self = this;
          console.log(this.foo);  // bar
          console.log(self.foo);  // bar
          // 这个立即执行匿名函数表达式是由window调用的
          (function() {
              console.log(this.foo);  // undefined
              console.log(self.foo);  // bar
          }());
      }
  };
  myObject.func(); 
  ```

+ ```js
  window.number = 2;
  var obj = {
   number: 3,
   db1: (function(){
     console.log(this);
     this.number *= 4;
     return function(){
       console.log(this);
       this.number *= 5;
     }
   })()
  }
  var db1 = obj.db1;
  db1();	// window
  obj.db1();	// obj 
  console.log(obj.number);     // 15
  console.log(window.number);  // 8 错 => 40 看解析
  // 解析
  变量obj中db1是一个匿名函数, 在obj声明时db1就已经执行, 此时是系统自执行, this指向window, 不是db1()执行后才执行匿名函数
  所以 window.number 还执行了一次 *5 的操作的
  ```

+ ```js
  var length = 10;
  function fn() {
      console.log(this.length);
  }
   
  var obj = {
    length: 5,
    method: function(fn) {
      fn();	// 10
      arguments[0]();	// 这个我不会啊
    }
  };
   
  obj.method(fn, 1);
  // 解析
  第二次执行arguments[0]()，相当于arguments调用方法，this指向arguments，而这里传了两个参数，故输出arguments长度为2。
  ```

+ ```js
  var a = 1;
  function printA(){
    console.log(this.a);
  }
  var obj={
    a:2,
    foo:printA,
    bar:function(){
      printA();
    }
  }
  
  obj.foo(); // 2
  obj.bar(); // 1
  var foo = obj.foo;
  foo(); // 1
  ```

+ ```js
  var x = 3;
  var y = 4;
  var obj = {
      x: 1,
      y: 6,
      getX: function() {
          var x = 5;
          return function() {
              return this.x;
          }();
      },
      getY: function() {
          var y = 7;
          return this.y;
      }
  }
  console.log(obj.getX()) // 1 × 这里返回的立即执行函数的 this 指向的是 window
  console.log(obj.getY()) // 6
  ```

+ ```js
   var a = 10; 
   var obt = { 
     a: 20, 
     fn: function(){ 
       var a = 30; 
       console.log(this.a)
     } 
   }
   obt.fn();  // 20
   obt.fn.call(); // 10 
   (obt.fn)(); // 10 ×
  // 解析
  (obt.fn)()， 这里给表达式加了括号，而括号的作用是改变表达式的运算顺序，而在这里加与不加括号并无影响；相当于  obt.fn()，所以会打印出 20；
  ```

+ ```js
  function a(xx){
    this.x = xx;
    return this
  };
  var x = a(5);
  var y = a(6);
  
  console.log(x.x)  // 6 × undefined
  console.log(y.x)  // 6
  // 解析
  执行 a(5) 的时候给全局生成了一个全局变量 a 并且赋值为 5,
  但是随后就被 var x = a(5); 的 x 给覆盖掉了
  所以 x.x 才是 undefined
  ```

+ ```js
  function foo(something){
      this.a = something
  }
  
  var obj1 = {
      foo: foo
  }
  
  var obj2 = {}
  
  obj1.foo(2); 
  console.log(obj1.a); // 2
  
  obj1.foo.call(obj2, 3);
  console.log(obj2.a); // 3
  
  var bar = new obj1.foo(4)
  console.log(obj1.a); // 2
  console.log(bar.a); // 4
  ```

+ ```js
  function foo(something){
      this.a = something
  }
  
  var obj1 = {}
  
  var bar = foo.bind(obj1);
  bar(2);
  console.log(obj1.a); // 2
  
  var baz = new bar(3);
  console.log(obj1.a); // 2
  console.log(baz.a); // 3
  ```

## 三、作用域&变量提升&闭包

+ ```js
  (function(){
     var x = y = 1;
  })();
  var z;
  
  console.log(y); // 1
  console.log(z); // undefined
  console.log(x); // Uncaught ReferenceError: x is not defined
  // 解析
  这段代码的关键在于：var x = y = 1; 实际上这里是从右往左执行的，首先执行y = 1, 因为y没有使用var声明，所以它是一个全局变量，然后第二步是将y赋值给x，讲一个全局变量赋值给了一个局部变量，最终，x是一个局部变量，y是一个全局变量，所以打印x是报错。
  ```

+ ```js
  var a, b
  (function () {
     console.log(a);	// undefined
     console.log(b);	// undefined
     var a = (b = 3);	
     console.log(a);	// 3
     console.log(b);  // 3
  })()
  console.log(a);	// undefined
  console.log(b); // 3
  ```

+ ```js
  var friendName = 'World';
  (function() {
    if (typeof friendName === 'undefined') {
      var friendName = 'Jack';
      console.log('Goodbye ' + friendName); // Goodbye Jack
    } else {
      console.log('Hello ' + friendName);
    }
  })();
  ```

+ ```js
  function fn1(){
    console.log('fn1')
  }
  var fn2
   
  fn1()	// fn1
  fn2()	// Uncaught TypeError: fn2 is not a function
   
  fn2 = function() {
    console.log('fn2')
  }
   
  fn2()	// fn2 前面报错了所以其实执行不到这里
  ```

+ ```js
  function a() {
      var temp = 10;
      function b() {
          console.log(temp); 
      }
      b();
  }
  a();	// Uncaught ReferenceError: temp is not defined
  
  function a() {
      var temp = 10;
      b();
  }
  function b() {
      console.log(temp); 
  }
  a();	// Uncaught ReferenceError: temp is not defined(压根执行不到这里)
  ```

+ ```js
   var a=3;
   function c(){
      alert(a);
   }
   (function(){
    var a=4;
    c();
   })();
  // alert 3	
  // 解析
  js中变量的作用域链与定义时的环境有关，与执行时无关。执行环境只会改变this、传递的参数、全局变量等（参考闭包）
  ```

+ ```js
  function fun(n, o) {
    console.log(o)
    return {
      fun: function(m){
        return fun(m, n);
      }
    };
  }
  var a = fun(0);  a.fun(1);  a.fun(2);  a.fun(3); // undefined 0 1 2	×
  var b = fun(0).fun(1).fun(2).fun(3); // undefined 0 1 2
  var c = fun(0).fun(1);  c.fun(2);  c.fun(3); // undefined 0 1 2 ×
  // 正确答案
  undefined  0  0  0	// 因为 a 对象引用的那个 n 一直是 0
  undefined  0  1  2  // 因为 b 对象引用的那个 n 一直在更新
undefined  0  1  1  // 因为 c 对象引用的那个 n 变到 1 就不变了
  // 解析
  这是一道关于闭包的题目，对于fun方法，调用之后返回的是一个对象。我们知道，当调用函数的时候传入的实参比函数声明时指定的形参个数要少，剩下的形参都将设置为undefined值。所以 console.log(o); 会输出undefined。而a就是是fun(0)返回的那个对象。也就是说，函数fun中参数 n 的值是0，而返回的那个对象中，需要一个参数n，而这个对象的作用域中没有n，它就继续沿着作用域向上一级的作用域中寻找n，最后在函数fun中找到了n，n的值是0。了解了这一点，其他运算就很简单了，以此类推。
  ```
  
+ ```js
  f = function() {return true;};   
  g = function() {return false;};   
  (function() {   
     if (g() && [] == ![]) {   
        f = function f() {return false;};   
        function g() {return true;}   
     }   
  })();   
  console.log(f());	// false
  // 注意点 1 : [] == ![] 结果是 true
先看 ![] ，在 JavaScript 中，当用于布尔运算时，比如在这里，对象的非空引用被视为 true，空引用 null 则被视为 false。由于这里不是一个 null, 而是一个没有元素的数组，所以 [] 被视为 true, 而 ![] 的结果就是 false 了。当一个布尔值参与到条件运算的时候，true 会被看作 1, 而 false 会被看作 0。现在条件变成了 [] == 0 的问题了，当一个对象参与条件比较的时候，它会被求值，求值的结果是数组成为一个字符串，[] 的结果就是 '' ，而 '' 会被当作 0 ，所以，条件成立。
  // 注意点 2: 在 if 语句的条件判断时，就已经进行了变量提升，所以 g() 返回的是 true
  ```
  
  

## 四、原型&继承

+ ```js
  function Person(name) {
      this.name = name
  }
  var p2 = new Person('king');	
  console.log(p2.__proto__) // Person.prototype
  console.log(p2.__proto__.__proto__) // Funtion.prototype ×   Object.prototype
  console.log(p2.__proto__.__proto__.__proto__) // Object.prototype	×  	null
  console.log(p2.__proto__.__proto__.__proto__.__proto__) // null × 报错
  console.log(p2.__proto__.__proto__.__proto__.__proto__.__proto__) // 报错
  console.log(p2.constructor) // Person
  console.log(p2.prototype) // 函数才有好吧！× 没报错 => undefined p2是实例，没有prototype属性
  console.log(Person.constructor) // Function
  console.log(Person.prototype) // Person.prototype
  console.log(Person.prototype.constructor) // Person
  console.log(Person.prototype.__proto__) // Object.prototype
  console.log(Person.__proto__)  // Function.prototype
  console.log(Function.prototype.__proto__) // Object.prototype
  console.log(Function.__proto__)  // Object.prototype × Function.prototype
  console.log(Object.__proto__) // null × Function.prototype
  console.log(Object.prototype.__proto__) // Object.prototype × null
  // 经典题、建议全文背诵
  ```

+ ```js
  
  function Foo () {
   getName = function () {
     console.log(1);
   }
   return this;
  }
  
  Foo.getName = function () {
   console.log(2);
  }
  
  Foo.prototype.getName = function () {
   console.log(3);
  }
  
  var getName = function () {
   console.log(4);
  }
  
  function getName () {
   console.log(5);
  }
  
  Foo.getName(); // 2  
  getName(); // 4     
  Foo().getName(); // 1        
  getName(); // 1          
  new Foo.getName(); // 2    
  new Foo().getName(); // 3 
  new new Foo().getName(); // 3
  ```

+ ```js
  var F = function() {};
  Object.prototype.a = function() {
    console.log('a');
  };
  Function.prototype.b = function() {
    console.log('b');
  }
  var f = new F();
  f.a(); // a
  f.b(); // 报错 Uncaught TypeError: f.b is not a function
  F.a(); // a
  F.b(); // b
  ```

+ ```js
  function Foo(){
      Foo.a = function(){
          console.log(1);
      }
      this.a = function(){
          console.log(2)
      }
  }
  
  Foo.prototype.a = function(){
      console.log(3);
  }
  
  Foo.a = function(){
      console.log(4);
  }
  
  Foo.a(); // 4
  let obj = new Foo();
  // 这里做错了建议回去复习一下 new 关键词知识捏
  obj.a(); // 3 × obj.a() ; 调用 obj 实例上的方法 a，该实例上目前有两个 a 方法：一个是内部属性方法，另一个是原型上的方法。当这两者都存在时，首先查找 ownProperty ，如果没有才去原型链上找，所以调用实例上的 a 输出：2
  Foo.a(); // 1
  ```

+ ```js
  function Dog() {
    this.name = 'puppy'
  }
  Dog.prototype.bark = () => {
    console.log('woof!woof!')
  }
  const dog = new Dog()
  console.log(Dog.prototype.constructor === Dog && dog.constructor === Dog && dog instanceof Dog)// true
  ```

+ ```js
  var A = {n: 4399};
  var B =  function(){this.n = 9999};
  var C =  function(){var n = 8888};
  B.prototype = A;
  C.prototype = A;
  var b = new B();
  var c = new C();
  A.n++
  console.log(b.n); // 9999
  console.log(c.n); // 4400
  ```

+ ```js
  function A(){
  }
  function B(a){
  　　this.a = a;
  }
  function C(a){
  　　if(a){
  this.a = a;
  　　}
  }
  A.prototype.a = 1;
  B.prototype.a = 1;
  C.prototype.a = 1;
   
  console.log(new A().a); // 1
  console.log(new B().a); // undefined
  console.log(new C(2).a); // 2
  ```

+ ```js
  function Parent() {
      this.a = 1;
      this.b = [1, 2, this.a];
      this.c = { demo: 5 };
      this.show = function () {
          console.log(this.a , this.b , this.c.demo );
      }
  }
  
  function Child() {
      this.a = 2;
      this.change = function () {
          this.b.push(this.a);
          this.a = this.b.length;
          this.c.demo = this.a++;
      }
  }
  
  Child.prototype = new Parent();
  var parent = new Parent();
  var child1 = new Child();
  var child2 = new Child();
  child1.a = 11;
  child2.a = 12;
  // 错太多了，直接看解析吧
  parent.show(); // 1 [1, 2, 1] 5
  // 应该是和闭包原理类似
  child1.show(); // 11 [1, 2, 11] 5 ×
  child2.show(); // 12 [1, 2, 12] 5 ×
  child1.change(); 
  child2.change();
  parent.show(); // 1 [1, 2, 1, 11, 12] 12 ×
  child1.show(); // 5 [1, 2, 1, 11, 12] 12 ×
  child2.show(); // 6 [1, 2, 1, 11, 12] 12 ×
  // 正确答案
  parent.show(); // 1  [1,2,1] 5
  
  child1.show(); // 11 [1,2,1] 5
  child2.show(); // 12 [1,2,1] 5
  
  parent.show(); // 1 [1,2,1] 5
  
  child1.show(); // 5 [1,2,1,11,12] 5
  
  child2.show(); // 6 [1,2,1,11,12] 5
  // 解析
  1. parent.show()，可以直接获得所需的值，没啥好说的；
  2. child1.show()，Child的构造函数原本是指向Child的，题目显式将Child类的原型对象指向了Parent类的一个实例，需要注意Child.prototype指向的是Parent的实例parent，而不是指向Parent这个类。
  3. child2.show()，这个也没啥好说的；
  4. parent.show()，parent是一个Parent类的实例，Child.prorotype指向的是Parent类的另一个实例，两者在堆内存中互不影响，所以上述操作不影响parent实例，所以输出结果不变；
  5. child1.show()，child1执行了change()方法后，发生了怎样的变化呢?
  ● this.b.push(this.a)，由于this的动态指向特性，this.b会指向Child.prototype上的b数组,this.a会指向child1的a属性,所以Child.prototype.b变成了[1,2,1,11];
  ● this.a = this.b.length，这条语句中this.a和this.b的指向与上一句一致，故结果为child1.a变为4;
  ● this.c.demo = this.a++，由于child1自身属性并没有c这个属性，所以此处的this.c会指向Child.prototype.c，this.a值为4，为原始类型，故赋值操作时会直接赋值，Child.prototype.c.demo的结果为4，而this.a随后自增为5(4 + 1 = 5)。
  6. child2执行了change()方法, 而child2和child1均是Child类的实例，所以他们的原型链指向同一个原型对象Child.prototype,也就是同一个parent实例，所以child2.change()中所有影响到原型对象的语句都会影响child1的最终输出结果。
  ● this.b.push(this.a)，由于this的动态指向特性，this.b会指向Child.prototype上的b数组,this.a会指向child2的a属性,所以Child.prototype.b变成了[1,2,1,11,12];
  ● this.a = this.b.length，这条语句中this.a和this.b的指向与上一句一致，故结果为child2.a变为5;
  ● this.c.demo = this.a++，由于child2自身属性并没有c这个属性，所以此处的this.c会指向Child.prototype.c，故执行结果为Child.prototype.c.demo的值变为child2.a的值5，而child2.a最终自增为6(5 + 1 = 6)。
  ```

+ ```js
  function SuperType(){
      this.property = true;
  }
  
  SuperType.prototype.getSuperValue = function(){
      return this.property;
  };
  
  function SubType(){
      this.subproperty = false;
  }
  
  SubType.prototype = new SuperType();
  SubType.prototype.getSubValue = function (){
      return this.subproperty;
  };
  
  var instance = new SubType();
  console.log(instance.getSuperValue()); // true
  ```

