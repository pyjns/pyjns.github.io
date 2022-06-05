class Dep {
  static target; //Watcher
  subs; //Array<Watcher>

  constructor() {
    console.log("******Dep*******constructor")

    this.subs = []
  }

  addSub() {
    console.log("******Dep*******addSub")

    this.subs.push(Dep.target)
  }

  notify() {
    console.log("******Dep*******notify", this.subs.length)

    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].run()
    }
  }
}