import type { ApiLoginInfo } from '@/typings/api/login'
import type { EntityDict } from '@/typings/entities/dict'

// 扩展全局 Window 接口，为 window 对象添加 Naive UI 相关方法
interface Window {
  // 属性 $loadingBar，类型为从 naive-ui 导入的 LoadingBarApi（用于全局加载进度条）
  $loadingBar: import('naive-ui').LoadingBarApi
  // 属性 $dialog，类型为从 naive-ui 导入的 DialogApi（对话框 API）
  $dialog: import('naive-ui').DialogApi
  // 属性 $message，类型为从 naive-ui 导入的 MessageApi（消息提示 API）
  $message: import('naive-ui').MessageApi
  // 属性 $notification，类型为从 naive-ui 导入的 NotificationApi（通知 API）
  $notification: import('naive-ui').NotificationApi
}

declare const AMap: any
declare const BMap: any

// 声明模块，处理所有 .vue 文件的导入
declare module '*.vue' {
  // 仅从 vue 中导入 DefineComponent 类型（不会产生运行时代码）
  // DefineComponent 通常来自 defineComponent 函数的返回，用于描述 Vue 组件的类型
  import type { DefineComponent } from 'vue'

  // 默认导出该组件，使得 import 一个 .vue 文件时能得到正确的组件类型
  export default DefineComponent
}

declare namespace NaiveUI {
  type ThemeColor = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
}

declare global {
  namespace Storage {
    interface Session {
      dict: DictMap
    }

    interface Local {
    /* 存储用户信息 */
      userInfo: ApiLoginInfo
      /* 存储访问token */
      accessToken: string
      /* 存储刷新token */
      refreshToken: string
      /* 存储登录账号 */
      loginAccount: any
      /* 存储当前语言 */
      lang: App.lang
    }
  }

  namespace App {
    type lang = 'zhCN' | 'enUS'
  }

  interface DictMap {
    [key: string]: EntityDict[]
  }
}
