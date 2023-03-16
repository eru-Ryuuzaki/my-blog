## 每天一看

## JavaScript 的基本类型

+ number
+ string
+ boolean
+ null
+ undefined
+ symbol
+ bigint

### css 选择器


+ 通配符选择器	*
+ ID选择器	#id
+ 类选择器	.class
+ 元素选择器	div
+ 属性选择器	[attr="value"]
+ 伪类选择器	a:hover
+ 伪元素选择器	a::before

### HTTP 常用的状态码及使用场景

- 1xx：表示目前是协议的中间状态，还需要后续请求
- 2xx：表示请求成功
- 3xx：表示重定向状态，需要重新请求
- 4xx：表示请求报文错误
- 5xx：服务器端错误

常用状态码：

- 101 切换请求协议，从 HTTP 切换到 WebSocket
- 200 请求成功，有响应体
- 301 永久重定向：会缓存
- 302 临时重定向：不会缓存
- 304 协商缓存命中
- 403 服务器禁止访问
- 404 资源未找到
- 400 请求错误
- 500 服务器端错误
- 503 服务器繁忙

### 计算机网络模型


|        **OSI 7 层模型**        | **TCP/IP(参考)4层模型** |    **网络5层模型**     |
| :----------------------------: | :---------------------: | :--------------------: |
| 应用层<br />表示层<br />会话层 |      应用层：HTTP       |         应用层         |
|             运输层             |     运输层：TCP/UDP     |         运输层         |
|             网络层             |       网际层：IP        |         网络层         |
|     数据链路层<br />物理层     |       网际接口层        | 数据链路层<br />物理层 |

### 一个页面从输入URL到页面加载显示完成，这个过程中都发生了什么？

**分为 4 个步骤：** 

1. 当发送一个 URL 请求时，不管这个 URL 是 Web 页面的 URL 还是 Web 页面上每个资源的 URL，浏览器都会开启一个线程来处理这个请求，同时在远程 DNS 服务器上启动一个 DNS 查询。这能使浏览器获得请求对应的 IP 地址。 
2. 浏览器与远程 Web 服务器通过 TCP 三次握手协商来建立一个TCP/IP 连接。该握手包括一个同步报文，一个同步-应答报文和一个应答报文，这三个报文在浏览器和服务器之间传递。该握手首先由客户端尝试建立起通信，然后服务器响应并接受客户端的请求，最后由客户端发出该请求已经被接受的报文。 
3. 一旦 TCP/IP 连接建立，浏览器会通过该连接向远程服务器发送 HTTP 的 GET 请求。远程服务器找到资源并使用 HTTP 响应返回该资源。
4. 此时，Web 服务器提供资源服务，客户端开始下载资源。





状态码	原因	说明
100-199	信息响应	</br>
100	Continue	已收到请求，客户端应继续</br>
101	Switching Protocol	响应客户端Upgrade列出协议，服务端正在切换协议</br>
102	Processing	服务端正在处理请求，无响应可用</br>
103	Early Hints	与Link一起使用，客户端应在服务端继续响应前开始预加载资源</br>
200-299	成功响应	</br>
200	OK	请求成功，常见于GETHEADPOSTTRACE</br>
201	Created	请求成功，新资源已创建，常见于POSTPUT</br>
202	Accepted	请求已收到，但未响应</br>
203	Non-Authoritative Information	响应经过了代理服务器修改</br>
204	No Content	请求已处理，无返回，客户端不更新视图</br>
205	Reset Content	请求已处理，无返回，客户端应更新视图</br>
206	Partial Content	请求已处理，返回部分内容，常见于视频点播、分段下载、断点续传</br>
300-399	重定向	</br>
300	Multiple Choice	提供一系列地址供客户端选择重定向</br>
301	Moved Permanently	永久重定向，默认可缓存，搜索引擎应更新链接</br>
302	Found	临时重定向，默认不缓存，除非显示指定</br>
303	See Other	临时重定向，必须GET请求</br>
304	Not Modified	未修改，不含响应体</br>
307	Temporary Redirect	临时重定向，默认不缓存，除非显示指定，不改变请求方法和请求体</br>
308	Permanent Redirect	永久重定向，默认可缓存，搜索引擎应更新链接，不改变请求方法和请求体</br>
400-499	客户端错误	</br>
400	Bad Request	请求语义或参数有误，不应重复请求</br>
401	Unauthorized	请求需身份验证或验证失败</br>
403	Forbidden	拒绝，不应重复请求</br>
404	Not Found	未找到，无原因</br>
405	Method Not Allowed	不允许的请求方法，并返回Allow允许的请求方法列表</br>
406	Not Acceptable	无法根据请求条件，返回响应体</br>
407	Proxy Authentication Required	请求需在代理服务器上身份验证</br>
408	Request Timeout	请求超时</br>
409	Conflict	请求冲突，响应应包含冲突原因</br>
410	Gone	资源已被永久移除</br>
411	Length Required	请求头需添加Content-Length</br>
412	Precondition Failed	非GETPOST请求外，If-Unmodified-Since或If-None-Match规定先决条件无法满足</br>
413	Payload Too Large	请求体数据大小超过服务器处理范围</br>
414	URI Too Long	URL过长，查询字符串过长时，应使用POST请求</br>
415	Unsupported Media Type	请求文件类型服务端不支持</br>
416	Range Not Satisfiable	请求头Range与资源可用范围不重合</br>
417	Expectation Failed	服务端无法满足客户端通过Expect设置的期望响应</br>
421	Misdirected Request	HTTP2下链接无法复用时返回</br>
425	Too Early	请求有重放攻击风险</br>
426	Upgrade Required	客端应按响应头Upgrade的协议列表中的协议重新请求</br>
428	Precondition Required	没有符合If-Match的资源</br>
429	Too Many Requests	请求频次超过服务端限制</br>
431	Request Header Fields Too Large	请求头字段过大</br>
451	Unavailable For Legal Reasons	因法律原因该资源不可用</br>
500-511	服务端响应	</br>
500	Internal Server Error	服务端报错，通常是脚本错误</br>
501	Not Implemented	请求方法不被服务器支持</br>
502	Bad Gateway	网关无响应，通常是服务端环境配置错误</br>
503	Service Unavailable	服务端临时不可用，建议返回Retry-After，搜索引擎爬虫应一段时间再次访问这个URL</br>
504	Gateway Timeout	网关超时，通常是服务端过载</br>
505	HTTP Version Not Supported	请求的 HTTP 协议版本不被支持</br>
506	Variant Also Negotiates	内部服务器配置错误</br>
510	Not Extended	不支持 HTTP 扩展</br>
511	Network Authentication Required	需要身份验证，常见于公用 WIFI</br>



### http 三次握手

① Client Hello：客户端将支持 SSL 版本、加密算法、密钥交换算法等发送服务端

② Server Hello：服务端确定 SSL 版本、算法、会话 ID 发给客户端

③ Certificate：服务端将携带公钥的数字证书发给客户端

④ Server Hello Done：通知客户端版本和加密套件发完，准备交换密钥

⑤ Client Key Exchange：客户端验证证书合法性，随机生成premaster secret用公钥加密发给服务端

⑥ Change Cipher Spec：通知服务端后续报文采用协商好的密钥和加密套件

⑦ Finished：客户端用密钥和加密套件计算已交互消息的 Hash 值发给服务端。服务端进行同样计算，与收到的客户端消息解密比较，相同则协商成功

⑧ Change Cipher Spec：通知客户端后续报文采用协商好的密钥和加密套件

⑨ Finished：服务端用密钥和加密套件计算已交互消息的 Hash 值发给服务端。客户端进行同样计算，与收到的服务端消息解密比较，相同则协商成功



### http 各版本对比

#### HTTP1.0
无状态，无连接的应用层协议

无法复用连接
每次发送请求，都要新建连接
队头阻塞
下个请求必须在上个请求响应到达后发送。如果上个请求响应丢失，则后面请求被阻塞
HTTP1.1
HTTP1.1 继承了 HTTP1.0 简单，克服了 HTTP1.0 性能上的问题

长连接
新增Connection: keep-alive保持永久连接
管道化
支持管道化请求，请求可以并行传输，但响应顺序应与请求顺序相同。实际场景中，浏览器采用建立多个TCP会话的方式，实现真正的并行，通过域名限制最大会话数量
缓存处理
新增Cache-control，支持强缓存和协商缓存
断点续传
主机头
新增Host字段，使得一个服务器创建多个站点
#### HTTP2.0
HTTP2.0进一步改善了传输性能

二进制分帧
在应用层和传输层间增加二进制分帧层
多路复用
建立双向字节流，帧头部包含所属流 ID，帧可以乱序发送，数据流可设优先级和依赖。从而实现一个 TCP 会话上进行任意数量的HTTP请求，真正的并行传输
头部压缩
压缩算法编码原来纯文本发送的请求头，通讯双方各自缓存一份头部元数据表，避免传输重复头
服务器推送
服务端可主动向客户端推送资源，无需客户端请求
#### HTTP3.0
当一个 TCP 会丢包时，整个会话都要等待重传，后面数据都被阻塞。这是由于 TCP 本身的局限性导致的。HTTP3.0 基于 UDP 协议，解决 TCP 的局限性

0-RTT
缓存当前会话上下文，下次恢复会话时，只需要将之前缓存传递给服务器，验证通过，即可传输数据
多路复用
一个会话的多个流间不存在依赖，丢包只需要重发包，不需要重传整个连接
更好的移动端表现
移动端 IP 经常变化，影响 TCP 传输，HTTP3.0 通过 ID 识别连接，只要 ID 不变，就能快速连接
加密认证的根文
TCP 协议头没有加密和认证，HTTP3.0 的包中几乎所有报文都要经过认证，主体经过加密，有效防窃听，注入和篡改
向前纠错机制
每个包还包含其他数据包的数据，少量丢包可通过其他包的冗余数据直接组装而无需重传。数据发送上限降低，但有效减少了丢包重传所需时间