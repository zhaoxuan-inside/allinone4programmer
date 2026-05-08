import type { App } from 'vue'
import {
  // 创建路由实例。
  createRouter,
  // 创建基于 URL hash（#）的历史记录模式，例如 http://example.com/#/about
  createWebHashHistory,
  // 基于 HTML5 History API 的模式，需要服务器端配置支持，URL 更干净（如 http://example.com/about）
  createWebHistory }
  from 'vue-router'
import { setupRouterGuard } from './guard'
import { routes } from './routes.inner'

const {
  // 从 import.meta.env 中读取 VITE_ROUTE_MODE 环境变量，默认值为 hash
  VITE_ROUTE_MODE = 'hash',
  // 从 import.meta.env 中读取 VITE_BASE_URL 环境变量
  VITE_BASE_URL,
} = import.meta.env

// 创建路由实例
export const router = createRouter({
  history: VITE_ROUTE_MODE === 'hash'
    ? createWebHashHistory(VITE_BASE_URL)
    : createWebHistory(VITE_BASE_URL),
  routes,
})
// 安装vue路由
export async function installRouter(app: App) {
  // 添加路由守卫
  setupRouterGuard(router)
  app.use(router)
  await router.isReady()
}
