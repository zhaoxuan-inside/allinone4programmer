import type {
  // App：Vue 应用实例的类型（来自 vue），在插件安装函数中使用
  App,
  // Directive：Vue 自定义指令的类型，用于约束指令对象的形状（包含 mounted、updated 等钩子）
  Directive,
} from 'vue'
import { usePermission } from '@/hooks'
import type { RoleType } from '@/typings/entities/role'

export function install(app: App) {
  const { hasPermission } = usePermission()

  function updataPermission(
    // ele：指令所绑定的 DOM 元素（原生 HTMLElement 类型）
    ele: HTMLElement,
    // permission：指令传入的值，可以是单个角色或角色数组，类型与 hasPermission 参数一致
    permission: RoleType | RoleType[],
  ) {
    if (!permission)
      throw new Error('v-permissson Directive with no explicit role attached')

    if (!hasPermission(permission))
      ele.parentElement?.removeChild(ele)
  }

  const permissionDirective: Directive<HTMLElement, RoleType | RoleType[]> = {
    // mounted：当指令绑定的元素被插入到 DOM 后调用。此时立即根据权限决定是否删除元素
    mounted(ele, binding) {
      updataPermission(ele, binding.value)
    },
    // updated：当指令所在的组件的 VNode 更新后调用。可能由于某些原因（例如权限值发生变化、或者用户角色在 store 中动态更新），需要重新判断权限。如果权限变为“无权限”，则删除元素
    updated(ele, binding) {
      updataPermission(ele, binding.value)
    },
  }

  // 调用 app.directive 方法，将 permissionDirective 注册为全局指令，指令名称为 'permission'
  app.directive('permission', permissionDirective)
}
