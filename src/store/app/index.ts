import type { GlobalThemeOverrides } from 'naive-ui'
import { local, setLocale } from '@/utils'
import { colord } from 'colord'
import { set } from 'radash'
import themeConfig from './theme.json'
import type { ProLayoutMode } from 'pro-naive-ui'

export type TransitionAnimation = '' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out'

// 从 import.meta.env 中解构出 VITE_DEFAULT_LANG 和 VITE_COPYRIGHT_INFO 这两个环境变量的值，并赋予对应的类型
// 等价于下面的代码
// const VITE_DEFAULT_LANG = import.meta.env.VITE_DEFAULT_LANG;
// const VITE_COPYRIGHT_INFO = import.meta.env.VITE_COPYRIGHT_INFO;
const { VITE_DEFAULT_LANG, VITE_COPYRIGHT_INFO } = import.meta.env

// 把页面的根元素（<html>）变成 Vue 的一个响应式引用
// - document.documentElement
//    浏览器原生 DOM 属性，直接指向当前文档的根元素，也就是 <html> 标签。
//    比如你可以通过它获取整个页面的滚动位置、语言属性、CSS 类名等
const docEle = ref(document.documentElement)

// 对返回值解构，取出 isFullscreen 和 toggle 这两个属性
// isFullscreen 响应式的布尔值，当前该元素是否处于全屏状态。在模板中可以直接用，会随全屏状态自动更新。
// toggle 一个异步函数（返回 Promise），用来切换全屏，调用时会自动判断：如果当前未全屏就进入全屏，如果已全屏就退出全屏。
const { isFullscreen, toggle }
// 接管某个元素的全屏控制
  = useFullscreen(docEle)

// 对返回值解构，取出 system 和 store 这两个属性
const { system, store }
// 用来管理网站亮色/暗色模式的组合式函数
  = useColorMode({
    // 控制在模式为 autho 情况下，是否触发响应式，出发响应式通过 store 属性来控制
    emitAuto: true,
  })

// 创建一个响应式的布尔值 isMobile，它会根据浏览器窗口宽度是否 ≤ 700px 自动更新，用来判断当前是否为“移动端”布局
const isMobile = useMediaQuery('(max-width: 700px)')

export const useAppStore = defineStore(
  'app-store',
  {
    state: () => {
      return {
        // 页脚文字，值从构建时常量 VITE_COPYRIGHT_INFO（通常定义在 .env 文件）读取
        footerText: VITE_COPYRIGHT_INFO,
        lang: VITE_DEFAULT_LANG,
        // 主题配置对象，将导入的 themeConfig 断言为 GlobalThemeOverrides 类型（Naive UI 的主题覆盖类型）
        theme: themeConfig as GlobalThemeOverrides,
        primaryColor: themeConfig.common.primaryColor,
        // 侧边栏是否收起的布尔标志。
        collapsed: false,
        // 灰色模式开关，常与 CSS 类 gray-mode 联动。
        grayMode: false,
        // 色弱模式开关。
        colorWeak: false,
        // 页面加载标志，用于控制页面内容的重载（例如路由切换后强制重新渲染）。
        loadFlag: true,
        showLogo: true,
        // 是否显示标签页（多页签）。
        showTabs: true,
        // 是否显示页脚。
        showFooter: true,
        // 是否显示页面加载进度条。
        showProgress: true,
        // 是否显示面包屑导航。
        showBreadcrumb: true,
        showBreadcrumbIcon: true,
        showWatermark: false,
        // 是否显示设置面板（主题自定义等）
        showSetting: false,
        // 页面过渡动画类型，值断言为 TransitionAnimation 联合类型
        transitionAnimation: 'fade-slide' as TransitionAnimation,
        // 布局模式（如垂直菜单布局），断言为 ProLayoutMode
        layoutMode: 'vertical' as ProLayoutMode,
      }
    },
    getters: {
      storeColorMode() {
        return store.value
      },
      colorMode() {
        return store.value === 'auto' ? system.value : store.value
      },
      fullScreen() {
        return isFullscreen.value
      },
      isMobile() {
        return isMobile.value
      },
    },
    actions: {
    // 重置所有设置
      resetAlltheme() {
        this.theme = themeConfig
        this.primaryColor = '#18a058'
        this.collapsed = false
        this.grayMode = false
        this.colorWeak = false
        this.loadFlag = true
        this.showLogo = true
        this.showTabs = true
        this.showFooter = true
        this.showBreadcrumb = true
        this.showBreadcrumbIcon = true
        this.showWatermark = false
        this.transitionAnimation = 'fade-slide'
        this.layoutMode = 'vertical'

        // 重置所有配色
        this.setPrimaryColor(this.primaryColor)
      },
      setAppLang(lang: App.lang) {
        setLocale(lang)
        local.set('lang', lang)
        this.lang = lang
      },
      /* 设置主题色 */
      setPrimaryColor(color: string) {
        const brightenColor = colord(color).lighten(0.05).toHex()
        const darkenColor = colord(color).darken(0.05).toHex()
        set(this.theme, 'common.primaryColor', color)
        set(this.theme, 'common.primaryColorHover', brightenColor)
        set(this.theme, 'common.primaryColorPressed', darkenColor)
        set(this.theme, 'common.primaryColorSuppl', brightenColor)
      },
      setColorMode(mode: 'light' | 'dark' | 'auto') {
        store.value = mode
      },
      /* 切换侧边栏收缩 */
      toggleCollapse() {
        this.collapsed = !this.collapsed
      },
      /* 切换全屏 */
      toggleFullScreen() {
        toggle()
      },
      /**
       * @description: 页面内容重载
       * @param {number} delay - 延迟毫秒数
       * @return {*}
       */
      async reloadPage(delay = 600) {
        this.loadFlag = false
        await nextTick()
        if (delay) {
          setTimeout(() => {
            this.loadFlag = true
          }, delay)
        }
        else {
          this.loadFlag = true
        }
      },
      /* 切换色弱模式 */
      toggleColorWeak() {
        docEle.value.classList.toggle('color-weak')
        this.colorWeak = docEle.value.classList.contains('color-weak')
      },
      /* 切换灰色模式 */
      toggleGrayMode() {
        docEle.value.classList.toggle('gray-mode')
        this.grayMode = docEle.value.classList.contains('gray-mode')
      },
    },
    // Pinia 持久化插件（pinia-plugin-persistedstate）的配置
    persist: {
      // 指定存储介质为浏览器的 localStorage，默认为 sessionStorage。
      // 默认会将整个 State 序列化保存，并在 Store 初始化时恢复。
      storage: localStorage,
    },
  },
)
