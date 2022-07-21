#### [175. 组合两个表](https://leetcode.cn/problems/combine-two-tables/)

```mysql
SELECT firstName, lastName, city, state 
FROM Person 
LEFT JOIN Address
ON Person.personId = Address.personId;
```

+ 语法不够熟悉，一开始把`on`写成了`where`,第二次在`on`后面加了`where`

+ ①A inner join B：取交集

  ②A left join B：取A全部，B没有对应的值，则为null

  ③A right join B：取B全部，A没有对应的值，则为null

  ④A full outer join B：取并集，彼此没有对应的值为null

+ 对联表有了一点了解

#### [176. 第二高的薪水](https://leetcode.cn/problems/second-highest-salary/)

不会写，直接看题解了

```mysql
SELECT
    IFNULL(
      (SELECT DISTINCT Salary
       FROM Employee
       ORDER BY Salary DESC
        LIMIT 1 OFFSET 1),
    NULL) AS SecondHighestSalary
```

+ `mysql`中`isnull`,`ifnull`,`nullif`的用法如下：

  `isnull(expr)` 的用法： 如`expr` 为`null`，那么`isnull()` 的返回值为 `1`，否则返回值为 `0`。 

  ```mysql
  mysql> select isnull(1+1); -> 0 
  mysql> select isnull(1/0); -> 1 
  ```

  

  使用 = 的null 值对比通常是错误的。

  `isnull()` 函数同` is null`比较操作符具有一些相同的特性。请参见有关is null 的说明。

  `IFNULL(expr1,expr2)`的用法：

  假如expr1 不为 NULL，则 IFNULL() 的返回值为 expr1; 否则其返回值为 expr2。IFNULL()的返回值是数字或是字符串，具体情况取决于其所使用的语境。

  ```mysql
  mysql> SELECT IFNULL(1,0);
  -> 1
  mysql> SELECT IFNULL(NULL,10);
  -> 10
  mysql> SELECT IFNULL(1/0,10);
  -> 10
  mysql> SELECT IFNULL(1/0,'yes');
  > "yes"
  ```

+ 1、当 limit后面跟一个参数的时候，该参数表示要取的数据的数量

  例如 select* from user limit 3 表示直接取前三条数据

  2、当limit后面跟两个参数的时候，第一个数表示要跳过的数量，后一位表示要取的数量,例如

  select * from user limit 1,3;

  就是跳过1条数据,从第2条数据开始取，取3条数据，也就是取2,3,4三条数据

  3、当 limit和offset组合使用的时候，limit后面只能有一个参数，表示要取的的数量,offset表示要跳过的数量 。

  例如select * from user limit 3 offset 1;表示跳过1条数据,从第2条数据开始取，取3条数据，也就是取2,3,4三条数据

#### [177. 第N高的薪水](https://leetcode.cn/problems/nth-highest-salary/)

第一眼看上去和上一题好像，原本以为改一下就行了，结果是个函数的形式，第一次接触，不知道怎么写，卒

一开始写的代码

```mysql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
    # Write your MySQL query statement below.
    SELECT
        IFNULL(
        (SELECT DISTINCT Salary
        FROM Employee
        ORDER BY Salary DESC
            LIMIT 1 OFFSET N - 1),
        NULL) AS getNthHighestSalary(N)
    );
END
```

毫不意外地报错了

> You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '- 1),
>         NULL) AS getNthHighestSalary(N)
>     );
> END' at line 10

看了一下评论区，好像很多人写了好多年 sql 都没写过 sql 的函数，那就当做课外知识稍微了解一下吧

正解

```mysql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    SET N := N-1;
  RETURN (
      # Write your MySQL query statement below.
      SELECT 
            salary
      FROM 
            employee
      GROUP BY 
            salary
      ORDER BY 
            salary DESC
      LIMIT N, 1
  );
END
```

+ 这里不能直接用limit N-1是因为limit和offset字段后面只接受正整数（意味着0、负数、小数都不行）或者单一变量（意味着不能用表达式），也就是说想取一条，limit 2-1、limit 1.1这类的写法都是报错的。所以要想用`limit`的话，要先用 `set` 改变`n` 的值

+ 一开始觉得`SET N := N-1;` 这种写法不太好，想把`n-1`赋值给一个新变量的，结果

  > Unknown system variable 'M'

  正确做法是要先

  ```mysql
  DECLARE m INT;
  ```

#### [178. 分数排名](https://leetcode.cn/problems/rank-scores/)

看完题目，不知道加入新字段和获取排名的语法怎么写。害，边写边学吧

```mysql
select a.Score as Score,
# 每个人都计算排在他前面的不同的分数有多少个，这种时间复杂度也能接受吗？
(select count(distinct b.Score) from Scores b where b.Score >= a.Score) as Rank
from Scores a
order by a.Score DESC
```

+ 加深了对联表操作的了解

#### [180. 连续出现的数字](https://leetcode.cn/problems/consecutive-numbers/)

害，想自己做出一道题，还是需要好好加油啊

没思路，抄！

```mysql
SELECT *
FROM
    Logs l1,
    Logs l2,
    Logs l3
WHERE
    l1.Id = l2.Id - 1
    AND l2.Id = l3.Id - 1
    AND l1.Num = l2.Num
    AND l2.Num = l3.Num
;
```

评论区一位老哥的评论和符合我现在的感觉：

> 每次都是看到答案就明白，自己就是想不到 。。。。。。

+ 可以通过多个表来筛选

#### [181. 超过经理收入的员工](https://leetcode.cn/problems/employees-earning-more-than-their-managers/)

芜湖，这是第一次靠自己写出来的诶（虽然是简单题~）

```mysql
SELECT e1.name as Employee FROM 
Employee e1, Employee e2
WHERE e1.managerId = e2.id AND e1.salary > e2.salary;
```

