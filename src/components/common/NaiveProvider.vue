<!-- SFC 加载顺序-1 [模块加载阶段] 按字节流解析 <template/> <script setup/> <style/> 三个顶级模块 -->
<!-- SFC 加载顺序-2 [模块加载阶段] 解析 script 模块 -->
<!--
 封装了 Naive UI 所有必要的 Provider 并提供全局调用能力的包装器。
 允许在 Vue 组件外部（例如路由守卫、Axios 拦截器、纯工具函数中）使用 Naive UI 的消息提示、对话框、加载条等功能
  -->
<script setup lang="ts">
// SFC 加载顺序-2.1 [模块加载阶段] 执行其中的 import 语句
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'

// SFC 加载顺序-2.2 [模块加载阶段] 执行其中定义函数
// useLoadingBar() 等 hooks 必须在 Provider 的**子孙组件**中调用才会返回真实的实例（包含 start()、finish() 等方法）。
// 这些实例被挂载到 window 对象上，成为全局可访问的变量（例如 window.$message.success('ok')）。
// 之后在任何地方（如 router.beforeEach、axios.interceptors、甚至非 Vue 环境的普通 JS 文件）都可以直接使用 window.$message 等，而不用纠结 Vue 组件上下文。
function registerNaiveTools() {
  window.$loadingBar = useLoadingBar()
  window.$dialog = useDialog()
  window.$message = useMessage()
  window.$notification = useNotification()
}

// SFC 加载顺序-2.3 [模块加载阶段] 执行其中定义内联组件，只是创建对象，并不会直接调用 setup() 方法。
// defineComponent + render 是为了在组合式 API 风格下创建一个简单的组件，
// 也可以用 <script setup> 写另一个组件文件，但这里为了内聚，直接内联定义了一个组件。
const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  // ========== 组件实例化阶段（本 SFC 被使用时触发） ==========
  // SFC 加载顺序-5.1 [组件实例化阶段] 当 <NaiveProviderContent /> 被渲染时，调用其 setup() 函数。
  // 此时所有 Provider（n-message-provider 等）已存在于祖先链中，因此 useLoadingBar() 等能正确返回实例。
  setup() {
    // SFC 加载顺序-5.2 [组件实例化阶段] 执行 registerNaiveTools，将工具挂载到 window 上。
    registerNaiveTools()
  },
  // SFC 加载顺序-5.3 [组件实例化阶段] setup 执行完毕后，调用 render 函数生成 VNode。
  // 返回空的 div 作为占位符。
  render() {
    return h('div')
  },
  // 注：本组件未定义 mounted / beforeUnmount 等生命周期，因此无额外钩子。
})
</script>

<!-- SFC 加载顺序-3 [模块加载阶段] 解析 template 模块，因为 template 模块依赖 script 模块  -->
  <!--
   Naive UI 中的部分组件（如 n-message、n-dialog、n-notification、n-loading-bar）需要通过函数式调用（例如 message.success('xxx')）来显示。
   这些函数内部依赖于一个由 Vue注入的上下文实例。为了保证在任何地方都能调用成功，官方要求将它们各自的 Provider 放在组件树的顶层。
   -->
<template>
  <!-- 提供 loadingBar 实例。 -->
  <n-loading-bar-provider>
    <!-- 提供 dialog 实例 -->
    <n-dialog-provider>
      <!-- 提供 notification 实例。 -->
      <n-notification-provider>
        <!-- 提供 message 实例，使 useMessage() 返回可用的对象。 -->
        <n-message-provider>
          <!-- <slot /> 会让应用的其他内容渲染在这些 Provider 内部，确保任何子组件都能通过 useMessage() 等方式拿到正确的实例 -->
          <slot />
          <!-- SFC 加载顺序-5.4 [组件实例化阶段] 渲染 NaiveProviderContent 子组件，触发其 setup 和 render -->
          <NaiveProviderContent />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
  <!-- SFC 加载顺序-5.5 [组件实例化阶段] 所有子组件渲染完成 → 父组件（本 SFC）的 VNode 树构建完成 -->
  <!-- SFC 加载顺序-5.6 [组件实例化阶段] Vue 将虚拟 DOM 挂载到真实 DOM → 触发 mounted 钩子（本 SFC 未定义） -->
</template>

<!-- SFC 加载顺序-4 [模块加载阶段] 解析 style 模块 -->
<style scoped></style>

<!-- ========== 组件注销阶段（当本 SFC 被父组件销毁时触发） ========== -->
<!-- SFC 注销顺序-1 [组件卸载] 父组件条件性移除（v-if=false）、路由切换或父组件自身销毁 -->
<!-- SFC 注销顺序-2 [组件卸载] 递归销毁子组件：先销毁 <slot /> 内容，再销毁 <NaiveProviderContent />，最后销毁各 Provider -->
<!-- SFC 注销顺序-3 [组件卸载] 本 SFC 的 beforeUnmount 钩子（未定义） -->
<!-- SFC 注销顺序-4 [组件卸载] 移除 DOM 元素 -->
<!-- SFC 注销顺序-5 [组件卸载] 本 SFC 的 unmounted 钩子（未定义） -->
<!-- 警告：销毁后 window.$message 等仍然存在，但所依赖的 Provider 已不存在，继续调用会报错 -->
