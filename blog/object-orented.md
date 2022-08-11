### 原始类型
  boolean number string symbol null undefied
###  this
 函数作用域内的this指向调用该函数的对象，this在函数调用时才被设置
### 函数方法
  函数是对象，函数也有方法，内部属性[[Call]]包含执行命令
#### call()
  第一参数指定了函数执行时this的值，其后的所有参数都是需要被传入函数的参数
#### apply()
  与call（）类同，只接受两个参数：this的值、数组或类数组对象(arguments)-内含需要被传入函数的参数
#### bind()
  要传给新函数的this值、其后的所有参数代表需要被永久设置咋新函数中的命名参数。
  可以在bind()返沪的新函数中继续设置非永久参数
### 属性类型
  属性类型：数据属性、访问器属性。数据属性保存值，访问器属性不保存值，用getter、setter进行指定的操作
  数据属性
    [[Enumerable]] 、[[Configurable]]、[[Value]] 、[[Writable]]
  访问器属性
    [[Enumerable]] 、[[Configurable]]、[[Get]]、 [[Set]] 

  #### 锁定对象
  **Object.defineProperty()**  定义属性，参数：对象、属性名、属性描述对象
  **Object.getOwnPropertyDescriptor()**  获取属性特征，对象、属性名
  **Object.preventExtensions()**  禁止扩展：不可扩展对象
  **Object.seal()**  封印：对象不可扩展、属性不可配置。只能读写属性
  **Object.freeze()**  冻结：不可扩展、不可配置、不可写入

  #### 属性探测
  **in** 操作符会检查自有属性和原型属性
  **for-in** 枚举对象的所有的可枚举属性，包括原型属性
  **Object.keys()** 只返回自由属性
  **hasOwnProperty()** 属性存在且为自有属性时返回true
  **propertyEnumerable()** 检查对象属性是否可枚举

### 原型对象链
  构造函数就是用new操作符调用的普通函数。可以用instanceof操作符或直接访问constructor属性来鉴别对象是被哪个构造函数创建的.
  可以把原型对象看作是对象的基类，所有创建的对象实例共享该原型对象。
  用new创建一个新的对象时，构造函数的原型对象会被赋给该对像的[[Prototype]]
  当一个函数被创建时，它的prototype属性也被创建，且该原型对象的constructor属性指向该函数。
  当使用对象字面形式改写原型对象Person.prototype时，其constructor属性将被置为泛用对象Object。
  为了避免这一点需要在改写原型对象时手动重置其constructor属性。
  原型对象也是一个对象，它也有自己的原型对象并继承其属性，所有对象都默认继承自Object.prototype 。对象继承其原型对象，而原型对象继承它的原型对象。
  
   **super** 指向对象原型
  **Object.create()** 以X为原型创建对象 参数：原型对象、属性描述符
   **Object.setPrototypeOf()** 指定对象的原型 参数 对象、原型对象
  
### 迭代器&生成器
  生成器是一种返回迭代器的函数
  迭代器