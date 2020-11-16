## 精准计算
原则：不使用小数做任何计算
示例：
```
  console.log(4444.44*100) //444443.99999999994
  console.log(2222.22*100) //222221.99999999997
  console.log(268.34+0.83) //269.16999999999996
  console.log(0.1+0.7) //0.7999999999999999
```
----
#### 加
```
  function AccAdd(num1, num2) {
    let d1 = 0, d2 = 0, m, c;

    if (num1.toString().indexOf(".") > -1) {
      d1 = num1.toString().split(".")[1].length;
    }

    if (num2.toString().indexOf(".") > -1) {
      d2 = num2.toString().split(".")[1].length;
    }

    m = Math.pow(10, Math.max(d1, d2));
    c = Math.abs(d1 - d2);
    if (c > 0) {
      let cm = Math.pow(10, c);
      if (d1 > d2) {
        num1 = Number(num1.toString().replace(".", ""));
        num2 = Number(num2.toString().replace(".", "")) * cm;
      } else {
        num1 = Number(num1.toString().replace(".", "")) * cm;
        num2 = Number(num2.toString().replace(".", ""));
      }
    } else {
      num1 = Number(num1.toString().replace(".", ""));
      num2 = Number(num2.toString().replace(".", ""));
    }
    return (num1 + num2) / m;
  }
```
#### 减
```
  function AccSub(num1, num2) {
    let d1 = 0, d2 = 0, m;

    if (num1.toString().indexOf(".") > -1) {
      d1 = num1.toString().split(".")[1].length;
    }

    if (num2.toString().indexOf(".") > -1) {
      d2 = num2.toString().split(".")[1].length;
    }

    m = Math.pow(10, Math.max(d1, d2));
    return (AccMul(num1, m) - AccMul(num2, m)) / m;
  }
```
#### 乘
```
  function AccMul(num1, num2) {
    let m = 0,
      s1 = num1.toString(),
      s2 = num2.toString();

    if (s1.indexOf(".") > -1) {
      m += s1.split(".")[1].length;
    }

    if (s2.indexOf(".") > -1) {
      m += s2.split(".")[1].length;
    }

    return (
      (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
      Math.pow(10, m)
    );
  }
```
#### 除
```
  function AccDiv(num1, num2) {
    let d1 = 0,
      d2 = 0,
      i1,
      i2;

    if (num1.toString().indexOf(".") > -1) {
      d1 = num1.toString().split(".")[1].length;
    }

    if (num2.toString().indexOf(".") > -1) {
      d2 = num2.toString().split(".")[1].length;
    }

    i1 = Number(num1.toString().replace(".", ""));
    i2 = Number(num2.toString().replace(".", ""));
    return AccMul(i1 / i2, Math.pow(10, d2 - d1));
  }
```

