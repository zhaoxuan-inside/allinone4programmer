import type { App } from 'vue'

export function install(app: App) {
  // Vue 规定：插件如果是对象，必须暴露一个 install 方法；
  // app.use(plugin) 的内部逻辑就是调用 plugin.install(app)，并把 app 作为参数传入；
  // 这样插件内部才能拿到应用实例去做注册。
  Object.values(
    import.meta
      .glob<{ install: (app: App) => void }>
      ('@/directives/*.ts', {
        eager: true,
      }),
  ).map(module => app.use(module))
}
