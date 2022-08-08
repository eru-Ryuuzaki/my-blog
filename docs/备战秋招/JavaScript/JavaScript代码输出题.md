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
```
  promise.then 是微任务，它会在所有的宏任务执行完之后才会执行，同时需要promise内部的状态发生变化，因为这里内部没有发生变化，一直处于pending状态，**所以不输出3**。
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
    console.log(res)  // resolve1
    setTimeout(() => {
      console.log(p1)
    }, 1000)
  }).finally(res => {
    console.log('finally', res)
  })
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
  ```

