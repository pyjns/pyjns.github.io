let uid = 0

const Vue = {};

Vue.createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args);
  {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML;
    }
    // clear content before mounting
    container.innerHTML = '';
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute('v-cloak');
      container.setAttribute('data-v-app', '');
    }
    return proxy;
  };
  return app;
});

function createApp(rootComponent, rootProps = null) {

  const context = {
    app: null,
    config: {},
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null)
  }


  const app = (context.app = {
    _uid: uid++,
    _context: context,
    mixin() { },
    component() { },
    directive() { },
    mount() {
      // const vnode = createVNode(
      //   rootComponent as ConcreteComponent,
      //   rootProps
      // )
      // return vnode.component!.proxy
    }
  })
  return app
}

/**
 * ```js
 * const count = ref(0)
 * const obj = reactive({
 *   count
 * })
 *
 * obj.count++
 * obj.count // -> 1
 * count.value // -> 1
 */

// function reactive(target, handlers) {

//   const proxy = new Proxy(
//     target,
//     () => {
//       Reflect.get(
//         hasOwn(instrumentations, key) && key in target
//           ? instrumentations
//           : target,
//         key,
//         receiver
//       )
//     }
//     }
//   )
// return proxy
// }