const baseHandlers = {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver)
  },
  set() {
    return Reflect.set(target, key, value, receiver)
  },
  has() {
    return Reflect.has(target, key)
  },
  deleteProperty() {
    return Reflect.deleteProperty(target, key)
  },
  ownKeys() {
    return Reflect.ownKeys(target)
  }
}


function reactive(target) {
  return new Proxy(target, baseHandlers)
}