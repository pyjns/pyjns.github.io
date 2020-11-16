插入算法
```
let array = [9, 5, 2, 7, 4, 0, 6, 1, 8, 3];
let l = array.length;

for (let i = 1; i < l; i++) {
  let j = i;
  let iValue = array[i];
  while (j > 0) {
    if (array[j - 1] < iValue && array[j] > iValue) {
      array.splice(j, 0, iValue);
      array.splice(i + 1, 1);
      break
    } else if (array[0] > array[i]) {
      array.splice(0, 0, iValue);
      array.splice(i + 1, 1);
      break
    }
    j--;
  }
}
console.log(array)

array = [9, 5, 2, 7, 4, 0, 6, 1, 8, 3]

for (let i = 1; i < l; i++) {
  let iValue = array[i];
  let j = i - 1;
  while (j > -1 && array[j] > iValue) {
    array[j + 1] = array[j]
    j--
  }
  array[j + 1] = iValue
}

console.log(array)

```