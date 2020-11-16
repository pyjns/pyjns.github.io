
## 日期
当Date作为构造函数调用并传入多个参数时，如果数值大于合理范围时，相邻的数值会被调整。  
IOS支持的日期格式：YYYY/MM/DD HH:MM:SS   
----
### 获取月份的天数
#### 1.利用Date构造函数特性：“数值大于合理范围时相邻的数值会被调整”
```
  fuction getMonthDays(year, month){
    return new Date(year, month + 1, 0).getDate();
  }

  fuction getMonthDays(year, month){
    return 32 - new Date(year, month, 32).getDate();
  }
```
#### 2.判断年份、月份
```
  fuction getMonthDays(year, month){
    if (month == 2) {
      return year % 4 == 0 ? 29 : 28;
    } else if ([4, 6, 9, 11].indexOf(month) > -1) {
      return 30;
    } else {
      return 31;
    }
  }
```
----