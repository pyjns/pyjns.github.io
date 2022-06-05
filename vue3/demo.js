let activeEffect = null;
const effectStack = [];

/**
 * weakMay
 *  data Map
 *       key Set
 *             deps
 */
const bucket = new WeakMap();

let data = { flag: true, text: "123", nums: 1 };

const obj = new Proxy(data, {
  get(target, key) {

    track(target, key);

    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;

    trigger(target, key)

    return true;
  }
});

function track(target, key) {

  if (!activeEffect) return;

  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(activeEffect);

  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  let depsMap = bucket.get(target);
  if (!depsMap) return;
  let effects = depsMap.get(key);

  const effectsToRun = new Set();
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })

  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn();
    }
  });
}

function cleanup(effectFn) {

  for (let i = 0; i < effectFn.deps.length; i++) {
    effectFn.deps[i].delete(effectFn)
  }

  effectFn.deps.length = 0;
}

const jobQueue = new Set();
const p = Promise.resolve();
let isFlushing = false;

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;

  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  })
}


function effect(fn, options = {}) {
  // activeEffect = fn;
  // fn();

  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  }
  effectFn.options = options;
  effectFn.deps = [];

  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

effect(() => {
  console.log(obj.nums)
}, {
  lazy: true,
  scheduler(fn) {
    jobQueue.add(fn);
    flushJob();
  }
})

// effect(() => {
//   console.log(obj.nums);
// })

obj.nums++
obj.nums++;

console.log("------end------")


// effect(() => {
//   console.log("******effect******")
//   document.body.innerText = obj.flag ? obj.text : "000";
// })

// console.log(bucket)

// setTimeout(() => {

//   obj.flag = false;

// }, 1000)

// setTimeout(() => {

//   obj.text = "456";

// }, 2000)

