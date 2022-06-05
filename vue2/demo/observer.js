class Observer {
  constructor(vm, data) {
    console.log("******Observer*******constructor")

    const keys = Object.keys(data)

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let val = data[key]
      const dep = new Dep()

      Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          console.log("---initData---defineProperty-------get")
          if (Dep.target) {
            dep.addSub()
          }
          return val
        },
        set: function (newVal) {
          console.log("---initData---defineProperty-------set")

          val = newVal
          dep.notify()
        }
      })
    }
  }
}