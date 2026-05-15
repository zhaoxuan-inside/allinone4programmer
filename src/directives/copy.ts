import type { App, Directive } from 'vue'
import { $t } from '@/utils'

interface CopyHTMLElement extends HTMLElement {
  _copyText: string
}

// useClipboard() 和 usePermission() 来自 VueUse 库，提供响应式的剪贴板能力及权限查询
export function install(app: App) {
  // copy：执行复制的方法
  const { isSupported, copy } = useClipboard()
  // permissionWrite：'clipboard-write' 权限的状态（'granted'、'denied'、'prompt'）
  const permissionWrite = usePermission('clipboard-write')

  function clipboardEnable() {
    if (!isSupported.value) {
      window.$message.error($t('components.copyText.unsupportedError'))
      return false
    }

    if (permissionWrite.value === 'denied') {
      window.$message.error($t('components.copyText.unpermittedError'))
      return false
    }
    return true
  }

  function copyHandler(this: any) {
    if (!clipboardEnable())
      return
    copy(this._copyText)
    window.$message.success($t('components.copyText.message'))
  }

  function updataClipboard(ele: CopyHTMLElement, text: string) {
    ele._copyText = text
    // 为元素添加 click 事件监听（每次调用都会添加一个新的监听器）
    ele.addEventListener('click', copyHandler)
  }

  const copyDirective: Directive<CopyHTMLElement, string> = {
    // mounted：元素首次插入 DOM 时调用，绑定事件监听器
    mounted(ele, binding) {
      updataClipboard(ele, binding.value)
    },
    // updated：指令绑定的值发生变化时调用，重新设置 el._copyText（但会导致重复监听）
    updated(ele, binding) {
      updataClipboard(ele, binding.value)
    },
    // unmounted：元素卸载时移除事件监听，防止内存泄漏
    unmounted(ele) {
      ele.removeEventListener('click', copyHandler)
    },
  }

  // 全局注册 v-copy 指令，可在任意组件中使用
  app.directive('copy', copyDirective)
}
