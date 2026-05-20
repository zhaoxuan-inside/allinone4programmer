import type { RouteLocationNormalized } from 'vue-router'
import { router } from '@/router'

interface TabState {
  pinTabs: RouteLocationNormalized[]
  tabs: RouteLocationNormalized[]
  currentTabPath: string
}

export const useTabStore = defineStore(
  'tab-store',
  {
    // state 是键名。
    state:
    // (): TabState => (...) 是键值
    // ()： 方法是入参
    // TabState 是返回值类型
    (): TabState => {
      return {
        pinTabs: [],
        tabs: [],
        currentTabPath: '',
      }
    },

    // getter 是 pinia 的属性，也就是键名
    getters: {
      allTabs: state => [...state.pinTabs, ...state.tabs],
    },

    actions: {
      addTab(route: RouteLocationNormalized) {
        // 根据meta确定是否不添加，可用于错误页,登录页等
        if (route.meta.withoutTab)
          return

        // 如果标签名称已存在则不添加
        if (this.hasExistTab(route.fullPath as string))
          return

        // 根据meta.pinTab传递到不同的分组中
        if (route.meta.pinTab)
          this.pinTabs.push(route)
        else
          this.tabs.push(route)
      },

      async closeTab(fullPath: string) {
        const tabsLength = this.tabs.length
        // 如果动态标签大于一个,才会标签跳转
        if (this.tabs.length > 1) {
          // 获取关闭的标签索引
          const tabIdx = this.getTabIndex(fullPath)
          const isLast = tabIdx + 1 === tabsLength
          // 如果是关闭的当前页面，路由跳转到原先标签的后一个标签
          if (this.currentTabPath === fullPath && !isLast) {
          // 跳转到后一个标签
            router.push(this.tabs[tabIdx + 1].fullPath)
          }
          else if (this.currentTabPath === fullPath && isLast) {
          // 已经是最后一个了，就跳转前一个
            router.push(this.tabs[tabIdx - 1].fullPath)
          }
        }
        // 删除标签
        this.tabs = this.tabs.filter((item) => {
          return item.fullPath !== fullPath
        })
        // 删除后如果清空了，就跳转到默认首页
        if (tabsLength - 1 === 0)
          router.push('/')
      },

      closeOtherTabs(fullPath: string) {
        const tabIdx = this.getTabIndex(fullPath)
        this.tabs = this.tabs.filter((_item, idx) => idx === tabIdx)
      },

      closeLeftTabs(fullPath: string) {
        const tabIdx = this.getTabIndex(fullPath)
        this.tabs = this.tabs.filter((_item, idx) => idx >= tabIdx)
      },

      closeRightTabs(fullPath: string) {
        const tabIdx = this.getTabIndex(fullPath)
        this.tabs = this.tabs.filter((_item, idx) => idx <= tabIdx)
      },

      clearAllTabs() {
        this.tabs.length = 0
        this.pinTabs.length = 0
      },

      closeAllTabs() {
        this.tabs.length = 0
        router.push('/')
      },

      hasExistTab(fullPath: string) {
        const _tabs = [...this.tabs, ...this.pinTabs]
        return _tabs.some((item) => {
          return item.fullPath === fullPath
        })
      },

      /* 设置当前激活的标签 */
      setCurrentTab(fullPath: string) {
        this.currentTabPath = fullPath
      },

      getTabIndex(fullPath: string) {
        return this.tabs.findIndex((item) => {
          return item.fullPath === fullPath
        })
      },

      modifyTab(fullPath: string, modifyFn: (route: RouteLocationNormalized) => void) {
        const tabIdx = this.getTabIndex(fullPath)
        modifyFn(this.tabs[tabIdx])
      },
    },

    // 持久化插件配置项,将 store 中的状态自动保存到本地存储
    persist: {
      // storage：指定将数据存储到会话存储
      // 不配置 paths 时，默认会持久化整个 state
      storage: sessionStorage,
    },
  },
)
