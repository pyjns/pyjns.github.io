
### 收集异常及性能信息

#### 资源加载错误
   iframe异常使用window.frames[0].onerror捕获
```
   window.addEventListener('error', (error) => {
      console.log('资源加载异常：', error.target.outerHTML);
   }, c)

   var img = document.createElement('img');
   img.src = 'http://www.xxx.png';
   document.body.append(img);
```

#### 同步/异步运行时错误
   跨域脚本的错误信息为"Script error."而不会报告细节，部分浏览器可以设置<script src="" crossorigin="anonymous"></script>，其他浏览器的错误详情则只能通过浏览器控制台查看。
```
   /**
   * @param {*} message ：错误信息字符串
   * @param {*} source ：发生错误的脚本URL
   * @param {*} lineno ：发生错误的行号
   * @param {*} colno ：发生错误的列号
   * @param {*} error ：Error对象
   */
   window.onerror = function (msg, url, lineno, colno, error) {
      if (msg.indexOf("Script error") > -1) {
         console.log('Script Error: See Browser Console for Detail');
      }
      console.log("捕获错误信息", { msg, url, lineno, colno, error });
      // return true; //阻止异常上抛
   }

   console.log(aaaa);
   setTimeout(() => {
      console.log(bbbb);
   }, 0);
```

#### promise错误
   当Promise被rejected且有rejection处理器时会触发rejectionhandled事件。
   当Promise被rejected且没有rejection处理器处理时会触发unhandledrejection事件。
```
   window.addEventListener("unhandledrejection", (e) => {
      console.log('promise rejected reason', e.reason);
      // e.preventDefault(); //阻止异常上抛
   });

   Promise.reject('promise error').then(() => {})
```

#### Vue errorHandler
```
   Vue.config.errorHandler = function (err, vm, info) {
   console.log(err.message); //throw eror in mounted hook
   console.log(vm);//异常vue实例
   console.log(info);//mounted hook
   }

   mounted(){
      throw new Error("throw eror in mounted hook")
   }
```

#### try...catch
   可以捕获同步运行时错误,不能捕获异步运行时错误
```
   try {
   console.log(aaaa);
   setTimeout(() => {
      console.log(bbbb);
   }, 0);
   } catch (error) {
   console.log("捕获错误信息", error)
   }
```

#### performance
   performance.timeOrigin 性能测量开始时的时间戳;
   performance.timing 包含用于计算性能指标的各种时间信息;
```
   console.log(performance)
   console.log("浏览器准备好使用HTTP请求来获取(fetch)文档的UNIX时间戳", performance.timing.fetchStart)
   console.log("dns寻址", performance.timing.domainLookupEnd - performance.timing.domainLookupStart)
   console.log("TCP握手", performance.timing.connectEnd - performance.timing.connectStart)
   console.log("TLS协商", performance.timing.secureConnectionStart && (performance.timing.connectEnd - performance.timing.secureConnectionStart))
   console.log("响应", performance.timing.responseEnd - performance.timing.responseStart)
   console.log("解析渲染", performance.timing.domInteractive - performance.timing.responseEnd)
   console.log("TTFB-首字节时间", performance.timing.responseStart - performance.timing.fetchStart)
   console.log("TTI-首次可交互时间", performance.timing.domInteractive - performance.timing.connectStart)
   console.log("白屏时间", performance.timing.domInteractive - performance.timing.fetchStart)
```