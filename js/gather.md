手机端自适应
```
  meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no"

  setHtml();
  window.addEventListener("resize",function(){
    setHtml();
  });
  function setHtml(){
    var obj = document.documentElement;
    obj.style.fontSize = 100 * (obj.clientWidth/设计图像素宽度)+"px";
  }
```  
手机端分页
```
  var bodyScollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
      scrollHeight = document.body.offsetHeight,
      availHeight = window.innerHeight,
      extH = parseInt(availHeight/2);

    if(availHeight+bodyScollTop >= scrollHeight - extH){
      if(this.pageNum >= this.totalP){
          //已无更多数据
      }else{
          //加载中...";
      }
    }
```  
页面返回压入历史信息
```
  window.addEventListener("popstate", function(e) {}, false);
  function pushHistory(){
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
  }
```  
手机端 能调起 相册 和 相机
```
  <input type="file" value="点击上传图片" name="theFile" accept="image/*" capture>
```  
清除 select 默认样式
```
 -webkit-appearance:none;
```  
固定在底部的文字
```
  html,body{height: 100%;}
  .content-wrap{
    position: relative;
    min-height: 100%;
  }
  .content-wrap:before{
    content: ".";
    color: rgba(0,0,0,0);
    height: 1.14rem;
    line-height: 1.14rem;
  }
  .content-wrap:after{
    content: "*本活动最终解释权归人人理财所有";
    padding-bottom: .2rem;
    color: #282828;
    font-size: .24rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
  }
```  
XMLHttpRequest
```
  if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function () {
      var a = ["MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.2.6", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "MSXML.XMLHTTP"];
      for (var c = 0; c < a.length; c++) {
          try {
              return new ActiveXObject(a[c])
          } catch (b) {
          }
      }
      return null
    }
  }
```  
摇一摇
```
  if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', deviceMotionHandler, false);
  } else {
      alert('本设备不支持devicemotion事件');
  }

  // var vibrateSupport = "vibrate" in navigator;
  // if (vibrateSupport) { //兼容不同的浏览器
  //     navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
  // }

  function deviceMotionHandler(eventData) {
      eventData.stopPropagation();
      var acceleration = eventData.accelerationIncludingGravity;
      var curTime = new Date().getTime();

      if ((curTime - last_update) > 100) {
          var diffTime = curTime - last_update;
          last_update = curTime;
          x = acceleration.x;
          y = acceleration.y;
          z = acceleration.z;
          var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

          if (speed > SHAKE_THRESHOLD) {
              if (shakeOnoff) {
                  shakeOnoff=false;
                  // navigator.vibrate(1000);
                  // setTimeout(function(){
                  doResult();
                  // },1000)
              }
          }
          last_x = x;
          last_y = y;
          last_z = z;
      }
  }
```  
滚动
```
  var trh = $(".recordDiv table tr").height();
  if(recordTable.find("tr").length > 5){
      var listPanel = $('.recordDiv table');
      var z = 0;//向上滚动top值
      function up() {//向上滚动
          listPanel.animate({//中奖结果
              'top': (z - trh ) + 'px'
          }, 500, 'linear', function () {
              listPanel.css({'top': '0px'})
                  .find("tr:first").appendTo(listPanel);
              up();
          });
      }
      up();
  }
```  
浏览器判断
```
  var ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
      // alert("iphone");
  } else if (/android/.test(ua)) {
      // alert("android");
  }
```  
历史记录
```
学习编程，语法本身并不难，真正困难的是如何应用它来解决现实世界的问题。为达成这一点，努力编程，获取语法经验，注重实践，再加一点创造力，几项缺一不可。  
变量  
  变量不是数值本身，它们仅仅是一个用于存储数值的容器。你可以把变量想象成一个个用来装东西的纸箱子。  
  方法是在对象内定义的函数  
  浏览器内置函数（方法）和变量（称为属性）存储在结构化对象内，以使代码更加高效，易于处理。  
  函数声明会进行声明提升（declaration hoisting），而函数表达式不会。  
  对象是一个包含相关数据和方法的集合  
  对象有时被称之为关联数组(associative array)——对象做了字符串到值的映射，而数组做的是数字到值的映射。  
  关键字"this"指向了当前代码运行时的对象( 原文：the current object the code is being written inside )  
  this 指向了代码所在的对象(其实代码运行时所在的对象)。  
  在调用函数前加一个 new ，它就会返回一个这个函数的实例化对象.  
  首先, 您能使用Object()构造函数来创建一个新对象。 是的， 一般对象都有构造函数，它创建了一个空的对象。  
  JavaScript有个内嵌的方法create(), 它允许您基于现有对象创建新的对象实例。  
  create() 实际做的是从指定原型对象创建一个新的对象。  
  JavaScript 常被描述为一种基于原型的语言 (prototype-based language)——每个对象拥有一个原型对象，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。  
  这种关系常被称为原型链 (prototype chain)，它解释了为何一个对象会拥有定义在其他对象中的属性和方法。  
  准确地说，这些属性和方法定义在Object的构造器函数(constructor functions)之上的prototype属性上，而非对象实例本身。  
  在传统的 OOP 中，首先定义“类”，此后创建对象实例时，类中定义的所有属性和方法都被复制到实例中。在 JavaScript中并不如此复制——而是在对象实例和它的构造器之间建立一个链接（它是__proto__属性，是从构造函数的prototype属性派生的），之后通过上溯原型链，在构造器中找到这些属性和方法。  

```  
```
form不可以嵌套form,会出现里层嵌套的form渲染不出来的问题
p标签不能嵌套块元素
h标签里不能嵌套h标签，h标签块元素
css不能在display:none和display:block之间进行动画，并且也不能在height:0和height:auto之间进行动画。
Boolean(-1) === true
```




