## nginx
 ####  **解决浏览器禁用第三方cookie**：
    1.前端请求本机nginx；
    2.request header 放置变量；
    3.nginx获取变量接口转发；

#### axios request 设置
```
  $axios.interceptors.request.use((config)=>{
    config.headers.Urlproxy = "http://192.168.0.0:8080";
  })
```

#### nginx配置
```
  location ~ /api/ {
    proxy_pass $http_Urlproxy;
  }
```

#### 本机测试 webpack配置
```
  devServer: {
    proxy: {
      "/api": {
        changeOrigin: true,
        target: "http://192.168.0.0:8080",
        router: (res) => {
          return res.headers.urlproxy;
        }
      }
    }
  }
``