import type { App } from 'vue'
// 引入 Pinia 的持久化插件，可以让某些 Store 的状态自动保存到 localStorage 或 sessionStorage 中
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 集中导出 业务模块（如认证、字典、路由标签等），方便外部引用
// 简单来说，“原样再导出” 就是把其他文件里 export 出来的东西，在当前文件里再 export 一遍，让外面的人只需从这个文件 import，不用去记那些分散的路径
export * from './app/index'
export * from './auth'
export * from './dict'
export * from './router'
export * from './tab'

// 安装pinia全局状态库
export function installPinia(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
