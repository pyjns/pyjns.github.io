
const Template = '<div id="app"><router-view></router-view></div>'
const appEl = document.getElementById("app");
const numEl = document.createElement("span")
const buttonEl = document.createElement("button");
const inputEl = document.createElement("input");
const textEl = document.createElement("div");

let vue = new Vue({
  data() {
    return {
      num: 0,
      text: ""
    }
  },
  watch: {
    num(val) {
      console.log("")
      console.log("======watch======num======start")
      console.log(val)
      numEl.textContent = val;
      console.log("======watch======num======end")
      console.log("")
    },
    text(val) {
      console.log("")
      console.log("======watch======text======start")
      textEl.textContent = val;
      console.log("======watch======text======end")
      console.log("")
    }
  },
  methods: {
    add() {
      console.log("")
      console.log("======methods=====add=====start")
      vue.num = ++vue.num
      console.log("======methods=====add=====end")
      console.log("")
    },
    input(e) {
      console.log("")
      console.log("======methods=====input=====start")
      vue.text = e.target.value;
      console.log("======methods=====input=====end")
      console.log("")
    }
  },
});

numEl.textContent = vue.num;
buttonEl.textContent = "add";
buttonEl.onclick = vue.$options.methods.add;
inputEl.oninput = vue.$options.methods.input;


appEl.appendChild(numEl);
appEl.appendChild(buttonEl);
appEl.appendChild(document.createElement("p"));
appEl.appendChild(inputEl);
appEl.appendChild(textEl);



// let vue1 = new Vue({
//   data() {
//     return {
//       num: 0,
//     }
//   },
//   watch: {
//     num(val) {
//       console.log("")
//       console.log("======watch======num======start")
//       console.log(val)
//       numEl.textContent = val;
//       console.log("======watch======num======end")
//       console.log("")
//     },
//   },
//   methods: {
//     add() {
//       console.log("")
//       console.log("======methods=====add=====start")
//       vue1.num = ++vue1.num
//       console.log("======methods=====add=====end")
//       console.log("")
//     },
//   },
// });

// // numEl.textContent = vue1.num;
// buttonEl.textContent = "add";
// buttonEl.onclick = vue1.$options.methods.add;

// appEl.appendChild(numEl);
// appEl.appendChild(buttonEl);
// appEl.appendChild(document.createElement("p"));



// let vue2 = new Vue({
//   data() {
//     return {
//       text: ""
//     }
//   },
//   watch: {
//     text(val) {
//       console.log("")
//       console.log("======watch======text======start")
//       textEl.textContent = val;
//       console.log("======watch======text======end")
//       console.log("")
//     }
//   },
//   methods: {
//     input(e) {
//       console.log("")
//       console.log("======methods=====input=====start")
//       vue2.text = e.target.value;
//       console.log("======methods=====input=====end")
//       console.log("")
//     }
//   },
// });

// inputEl.oninput = vue2.$options.methods.input;
// appEl.appendChild(inputEl);
// appEl.appendChild(textEl);


