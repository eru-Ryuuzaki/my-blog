> [计算a+b的和](https://www.nowcoder.com/questionTerminal/dae9959d6df7466d9a1f6d70d6a11417)
>
> 每行包含两个整数a和b
>
> 对于每行输入对应输出一行a和b的和
>
> 输入
>
> 1 5
>
> 输出
>
> 6

## V8

```javascript
while(line=readline()){
    var lines = line.split(' ');  //字符串转换为字符数组
    var a = parseInt(lines[0]);
    var b = parseInt(lines[1]);
    print(a+b);
}
```

## NODE

```javascript
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let nums;
rl.on('line', function(line){
    nums = line.split(' ')
    console.log(+nums[0] + +nums[1]);
}).on('close', function(){

})
```

