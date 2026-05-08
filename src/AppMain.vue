<script setup lang="ts">
import type { App } from 'vue'
import { installRouter } from '@/router'
import { installPinia } from '@/store'
import { naiveI18nOptions } from '@/utils'
import { darkTheme } from 'naive-ui'
import { useAppStore } from './store'

// 创建异步初始化 Promise - 这会让组件变成异步组件
const initializationPromise = (async () => {
  // 获取当前应用实例
  const app
  // Vue 3 提供的内部函数，返回当前组件实例
    = getCurrentInstance()
    // 可选链，若 getCurrentInstance() 返回 null，则 app 将是 undefined
      // 组件实例上的属性，包含当前应用上下文
      ?.appContext
      // 应用上下文中的根 Vue 应用实例（即 createApp() 返回的对象）
      .app

  if (!app) {
    throw new Error('Failed to get app instance')
  }

  // 注册模块 Pinia
  installPinia(app)

  // 注册模块 Vue-router
  await installRouter(app)

  // 注册模块 指令/静态资源
  const modules
  // ES 模块中暴露当前模块元信息的对象
    = import.meta
    // Vite 对 import.meta 对象做了扩展，加上了 glob 等方法，以便在构建时处理文件系统级操作。
    // 允许你通过通配符模式批量导入文件，无需手动逐个引入。返回值默认是一个对象，键是匹配到的文件路径，值是一个动态导入函数（() => import(...)）
      .glob<
      // 描述每个模块导出的对象结构。这里假设每个模块默认导出一个对象，该对象具备一个 install 方法，它接受一个 App 实例（Vue 应用实例）且无返回值（void）
      // 作用：为 import.meta.glob 的返回值提供类型提示和检查。
      // install 方法是 ./modules/*.ts 每个 ts 文件都要实现的方法
      { install: (app: App) => void }
    >('./modules/*.ts', {
      // 配置选项对象，用来控制 import.meta.glob 的行为。
      // eager: true：表示立即加载这些模块，而不是懒加载。
        eager: true,
      })

  Object.values(modules).forEach(module => app.use(module))

  return true
})()

// 等待初始化完成 - 这使得整个 setup 函数变成异步的
await initializationPromise

const appStore = useAppStore()

// 创建一个计算属性 naiveLocale，用于动态切换 Naive UI 组件的语言
const naiveLocale = computed(() => {
  return naiveI18nOptions[appStore.lang]
    ? naiveI18nOptions[appStore.lang]
    : naiveI18nOptions.enUS
})
</script>

<template>
  <!-- Naive UI 框架的 <n-config-provider> 作为顶层容器，让内部所有 Naive UI 组件共享统一的主题、语言、日期区域等配置 -->
  <n-config-provider
    class="wh-full"
    inline-theme-disabled
    :theme="appStore.colorMode === 'dark' ? darkTheme : null"
    :locale="naiveLocale.locale"
    :date-locale="naiveLocale.dateLocale"
    :theme-overrides="appStore.theme"
  >
    <naive-provider>
      <router-view />
      <Watermark :show-watermark="appStore.showWatermark" />
    </naive-provider>
  </n-config-provider>
</template>
