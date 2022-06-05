
const effectStack = []
let activeEffect = null
const targetMap = new WeakMap()

function track(target, type, key) {

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

const ITERATE_KEY = Symbol('iterate')
export const isMap = (val) => Object.prototype.toString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'


function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const effects = new Set()
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect !== activeEffect || effect.allowRecurse) {
          effects.add(effect)
        }
      })
    }
  }


  switch (type) {
    case add:

      add(depsMap.get(ITERATE_KEY))
      if (isMap(target)) {
        add(depsMap.get(MAP_KEY_ITERATE_KEY))
      }


      break
    case set:
      if (isMap(target)) {
        add(depsMap.get(ITERATE_KEY))
      }
      break
  }





  effects.forEach((effect) => { })
}