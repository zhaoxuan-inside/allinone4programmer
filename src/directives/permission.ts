import type { App, Directive } from 'vue'
import { usePermission } from '@/hooks'
import type { RoleType } from '@/typings/entities/role'

export function install(app: App) {
  const { hasPermission } = usePermission()

  function updatapermission(ele: HTMLElement, permission: RoleType | RoleType[]) {
    if (!permission)
      throw new Error('v-permissson Directive with no explicit role attached')

    if (!hasPermission(permission))
      ele.parentElement?.removeChild(ele)
  }

  const permissionDirective: Directive<HTMLElement, RoleType | RoleType[]> = {
    mounted(ele, binding) {
      updatapermission(ele, binding.value)
    },
    updated(ele, binding) {
      updatapermission(ele, binding.value)
    },
  }
  app.directive('permission', permissionDirective)
}
