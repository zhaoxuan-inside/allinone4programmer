import type { App } from 'vue'
import { local } from '@/utils'
import { createI18n } from 'vue-i18n'
import enUS from '../../locales/en_US.json'
import zhCN from '../../locales/zh_CN.json'

const { VITE_DEFAULT_LANG } = import.meta.env

export const i18n = createI18n({
  // 表示使用 Vue I18n 的 Composition API 模式（而非旧的 Legacy API 模式）。
  // 在 Vue 3 + vue-i18n v9+ 中，推荐设置为 false，这样才能在 <script setup> 中使用 useI18n() 等组合式函数
  legacy: false,
  // 当前激活的语言。取值逻辑：
  // 先从本地存储（localStorage）中读取 'lang' 键对应的值（通常是用户上一次选择的语言）。
  // 如果没有（用户首次访问），则使用环境变量中的默认语言。
  locale: local.get('lang') || VITE_DEFAULT_LANG,
  // 回退语言。当某个键在当前语言中找不到翻译时，会尝试使用这个语言的值。这里设置为默认语言，保证至少有一个完整翻译。
  fallbackLocale: VITE_DEFAULT_LANG,
  // 语言与翻译对象的映射。zhCN 对应中文翻译，enUS 对应英文翻译。注意键名（zhCN、enUS）必须与 locale 中传入的字符串值一致（例如 locale: 'zhCN'）
  messages: {
    zhCN,
    enUS,
  },

  // 默认情况下，如果页面使用了某个翻译键但未定义，控制台会警告。设为 false 关闭此类警告，避免在开发时输出过多干扰信息。
  missingWarn: false,

  // 当触发了回退机制（即当前语言找不见，用了 fallback 语言的值）时，是否打印警告。设为 false 同样是为了减少无关日志。
  fallbackWarn: false,
})

export function install(app: App) {
  app.use(i18n)
}
