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
(select count(distinct b.Score) from Scores b where b.Score >= a.Score) as "Rank"
from Scores a
order by a.Score DESC
```

+ 加深了对联表操作的了解

#### [180. 连续出现的数字](https://leetcode.cn/problems/consecutive-numbers/)

害，想自己做出一道题，还是需要好好加油啊

没思路，抄！

```mysql
SELECT DISTINCT l1.Num ConsecutiveNums 
FROM
    Logs l1,
    Logs l2,
    Logs l3
WHERE
    l1.Id = l2.Id - 1
    AND l2.Id = l3.Id - 1
    AND l1.Num = l2.Num
    AND l2.Num = l3.Num;
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

#### [182. 查找重复的电子邮箱](https://leetcode.cn/problems/duplicate-emails/)

一开始写法：

```mysql
SELECT DISTINCT Email from Person
WHERE COUNT(Person.Email) > 1;
```

报错了

> Invalid use of group function

第二次尝试：

```mysql
SELECT Person.Email from Person
HAVING COUNT(Person.Email) > 1;
```

这次是 wa 了

>{"headers": {"Person": ["id", "email"]}, "rows": {"Person": [[1, "paris@hilton.com"], [2, "mickey@disney.com"]]}}
>
>实际输出：{"headers": ["Email"], "values": [["paris@hilton.com"]]}
>
>预期输出：{"headers": ["Email"], "values": []}

看答案：(似懂非懂，也就是我上面少加了 group by Email)

```mysql
select Email
from Person
group by Email
having count(Email) > 1;
```

另外一种写法：

```mysql
select Email from
(
  select Email, count(Email) as num
  from Person
  group by Email
) as statistic
where num > 1
;
```

+ SUM是对符合条件的记录的数值列求和

  COUNT 是对查询中符合条件的结果(或记录)的个数

#### [183. 从不订购的客户](https://leetcode.cn/problems/customers-who-never-order/)

一开始的写法

```mysql
SELECT Customers.Name Customers FROM Customers
LEFT JOIN Orders
ON Customers.Id = Orders.CustomerId
WHERE ISNULL(Customers.CustomerId);
```

又报错咯

> Unknown column 'Customers.CustomerId' in 'where clause'

还以为 left join 之后 Customers 就有了这个列，然而并不是这样，正确的写法：

```mysql
SELECT Customers.Name Customers FROM Customers
LEFT JOIN Orders
ON Customers.Id = Orders.CustomerId
WHERE ISNULL(Orders.CustomerId);
```

再慢慢理解吧~

另一个正解

```mysql
select customers.name as 'Customers'
from customers
where customers.id not in
(
    select customerid from orders
);
```

+ 也算是学到了 not in



#### [184. 部门工资最高的员工](https://leetcode.cn/problems/department-highest-salary/)

下来这个是乱写的，我都不知道自己为什么这样写

```mysql
SELECT Department, Employee, Salary FROM (
    SELECT * FROM Employee e1
    LEFT JOIN  Department d1
    ON e1.DepartmentId = d1.id
    GROUP BY d1.id
    ORDER BY salary DESC
    LIMIT 1
) as t1;
```

是的，老样子。报错了

> Duplicate column name 'id'

正解

```mysql
SELECT
    Department.name AS 'Department',
    Employee.name AS 'Employee',
    Salary
FROM
    Employee
        JOIN
    Department ON Employee.DepartmentId = Department.Id
WHERE
    (Employee.DepartmentId , Salary) IN
    (   SELECT
            DepartmentId, MAX(Salary)
        FROM
            Employee
        GROUP BY DepartmentId
	)
;
```

+ 可以两个字段 IN
+ MAX()

#### [185. 部门工资前三高的所有员工](https://leetcode.cn/problems/department-top-three-salaries/)

hard，直接 cv，先看懂再说

```mysql
SELECT
    d.Name AS 'Department', e1.Name AS 'Employee', e1.Salary
FROM
    Employee e1
        JOIN
    Department d ON e1.DepartmentId = d.Id
WHERE
    3 > (SELECT
            COUNT(DISTINCT e2.Salary)
        FROM
            Employee e2
        WHERE
            e2.Salary > e1.Salary
                AND e1.DepartmentId = e2.DepartmentId
        )
;
```



#### [196. 删除重复的电子邮箱](https://leetcode.cn/problems/delete-duplicate-emails/)

```mysql
DELETE p1 FROM Person p1,
    Person p2
WHERE
    p1.Email = p2.Email AND p1.Id > p2.Id
```

挺妙的，就是没想到