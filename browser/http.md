HTTP本质是无状态的，把Cookies添加到头部中就可以创建一个有状态的会话，让每次请求都能共享相同的上下文信息达成相同的状态。
XMLHttpRequest和Fetch API都遵循同源策略

####HTTP请求方法
```
  GET
    用于获取数据，可以被缓存
  POST
    用于提交数据到服务器
  PUT
    用于添加资源资源（语义上的约定，并无强约束）
  DELETE
    用于删除资源（语义上的约定，并无强约束）
  PATCH
    用于修改资源进行。
  HEAD
    与GET请求类似只返回响应头
  OPTIONS
    用于获取目标资源的通讯选型
  TRACE
    用于测试消息回送，判断是否通顺
  CONNECT
    与服务器建立通道，多用于WebSocket
```

####HTTP响应状态代码分为五类
```
  100–199：信息响应
    100 Continue
      客户端应该继续请求
  200–299：成功响应
    200 OK 
      请求成功
  300–399：重定向
    304 Not Modified
      GET请求时，客户端缓存版本已是最新，服务端的内容没有改变。
  400–499：客户端错误
    403 Forbidden
      服务器拒绝执行，一般是无权限
    404 Not Found
      资源未找到
    405 Method Not Allowed
      请求方法用错了
  500–599：服务器错误
    500 Internal Server Error
      服务端报错
```

####HTTP Headers
```
  User-Agent：用户代理的特征字符串
  Authorization：服务器验证用户代理的凭证
  Set-Cookie：服务端发送cookies到用户代理
  Cookie：用户代理存储的cookie
  Accept：用户代理请求时期望接受的数据类型
  Content-Type：服务器响应的数据类型
                application/json
                application/x-www-form-urlencoded
                application/xml
  Cache-Control：指定缓存机制
  Origin：获取数据的来源
  Access-Control-Allow-Origin：响应是否可以共享（Origin）
  Connection：控制网络连接是否保持打开
  Keep-Alive：指定持久连接保持打开的时间
  Referer：跳转到当前页的来源网页地址
```

####HTTP 缓存
常见的HTTP缓存只能存储GET响应，对于其他类型的响应则无能为力。
缓存目的：缓解服务器端压力，缩短获取资源的耗时
```
缓存的种类
  私有缓存（单用户）
    浏览器缓存：向后/向前导航
  共享缓存（多用户）
    代理缓存
    网关缓存
    CDN(Content Delivery Network)缓存
    反向代理缓存
    负载均衡服务器缓存
```