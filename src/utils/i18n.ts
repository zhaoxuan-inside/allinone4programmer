import type {
  // 日期相关组件的本地化（月/星期名称、日期格式、时间选择器的文案等）
  NDateLocale,
  // 全局 UI 文本本地化（按钮、分页、空状态、输入框占位等）
  NLocale,
} from 'naive-ui'
import { i18n } from '@/modules/i18n'
import { dateZhCN, zhCN } from 'naive-ui'

export function setLocale(locale: App.lang) {
  i18n.global.locale.value = locale
}

export const $t = i18n.global.t

export const naiveI18nOptions: Record<App.lang, { locale: NLocale | null, dateLocale: NDateLocale | null }> = {
  zhCN: {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  enUS: {
    locale: null,
    dateLocale: null,
  },
}
