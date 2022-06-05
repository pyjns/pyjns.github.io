class Watcher {
  vm;
  key;
  value;
  cb;

  constructor(vm, key, cb) {
    console.log("******Watcher*******constructor")

    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this;
    this.value = this.vm[this.key]
    Dep.target = null;
  }

  run() {
    console.log("******Watcher*******run")

    const value = this.vm[this.key]
    const oldValue = this.value

    this.value = value

    this.cb.call(this.vm, value, oldValue)
  }
}