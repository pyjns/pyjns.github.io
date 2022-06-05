function Vue(options) {

  this._init(options)
}

/* 
1.初始化Vue原型方法
  Vue.prototype.$mount
  initMixin(Vue) 
        Vue.prototype._init
  stateMixin(Vue)
        Object.defineProperty(Vue.prototype, '$data', dataDef)
        Object.defineProperty(Vue.prototype, '$props', propsDef)
        Vue.prototype.$set
        Vue.prototype.$delete
        Vue.prototype.$watch
  eventsMixin(Vue)
        Vue.prototype.$on 
        Vue.prototype.$once
        Vue.prototype.$off
        Vue.prototype.$emit
  lifecycleMixin(Vue) 
        Vue.prototype._update 
        Vue.prototype.$forceUpdate
        Vue.prototype.$destroy
            console.log("******* callHook ****** beforeDestroy ******");
              remove(parent.$children, vm);
              vm._watcher.teardown();
              vm.__patch__(vm._vnode, null);
            console.log("******* callHook ****** destroyed ******");

  renderMixin(Vue)
        Vue.prototype.$nextTick 
        Vue.prototype._render
*/

Vue.prototype._init = function (options) {

  this.$options = options;

  /*
    2.初始化vue实例方法及属性
    initLifecycle(vm) 初始化组件的基础属性
          vm.$root = parent ? parent.$root : vm
          vm.$parent = parent
          vm.$children = []
          vm.$refs = {}
    initEvents(vm) 初始化组件的事件监听
          vm.$on(event, fn)
          vm.$off(event, fn)
    initRender(this) 
          vm.$slots 
          vm.$scopedSlots
          vm.$createElement 
          defineReactive(vm, '$attrs', parentData && parentData.attr)
          defineReactive(vm, '$listeners', options._parentListeners)
  */

  console.log("******* callHook ****** beforeCreate ******");
  /*
  3.响应化(get,set)化data，创建watcher，dep收集watcher
    initInjections(vm)
        defineReactive(vm.$options.inject)
    initState(vm)
        defineReactive(vm.$options.data);
        new Watcher(vm, key, cb)
    initProvide(vm)
        vm._provided = vm.$options.provide
  */

  initState(this)

  console.log("******* callHook ****** created ******");




  /*
    this.$mount(this.$options.el)
      4.获取el元素，监听组件、渲染组件
        console.log("******* callHook ****** beforeMount ******");
            let updateComponent = () => {
                  vm._update(vm._render(), hydrating)
                   console.log("******* callHook ****** updated ******");
                }
                
            new Watcher(vm, updateComponent, {
              before() {
                if (vm._isMounted && !vm._isDestroyed) {
                  //更新前
                  console.log("******* callHook ****** beforeUpdate ******");
                }
              }
            }, true)
        
        console.log("******* callHook ****** mounted ******");
  */
}

Vue.prototype.$watch = function (key, cb) {

  const vm = this
  new Watcher(vm, key, cb)
}


function initState(vm) {

  initData(vm);
  initWatch(vm, vm.$options.watch);
}

function initData(vm) {

  let data = typeof vm.$options.data === 'function' ? vm.$options.data.call(vm) : vm.$options.data;
  new Observer(vm, data);
}

function initWatch(vm, watch) {

  for (const key in watch) {
    vm.$watch(key, watch[key])
  }
}

