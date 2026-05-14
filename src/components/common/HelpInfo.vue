<script setup lang="ts">
interface Props {
  message: string
}

/*
defineProps 是一个 编译宏（只能在 <script setup> 中使用），用于声明组件接收的 props。
根据传入的类型参数自动推导 props 的类型和默认值等。
这里通过 <Props> 将类型接口传入，Vue 会据此校验外部传入的 message 属性是否为字符串。

defineProps 的返回值是一个包含所有 props 的**响应式对象**。

但代码中使用了解构赋值 { message }，将 message 单独提取出来。
⚠️ 注意：在 Vue 3 中，直接解构 props 会丢失响应性，因为解构后的变量是一个普通的常量，不再与 props 对象保持响应式连接。
不过在本例中，该 message 只用于模板中直接显示，且模板编译时会正确处理（{{ message }} 会被转换为访问 props.message），所以实际上是安全的。
更推荐的写法是：const props = defineProps<Props>()，然后在模板中用 {{ props.message }}，或者使用 toRefs 保持响应性。
*/
const props = defineProps<Props>()
</script>

<template>
  <!--
   n-tooltip： 来自 Naive UI 组件库，用于实现鼠标悬停或点击时显示浮动提示
   :show-arrow="false"：不显示提示框的小箭头（三角指示器）
   trigger="hover"：触发方式为鼠标悬停（hover）
   -->
  <n-tooltip
    :show-arrow="false"
    trigger="hover"
  >
    <!--
  #trigger 是 具名插槽，用于自定义触发 tooltip 显示的元素
  icon-park-outline-help 是 IconPark 图标库中的一个帮助问号图标（轮廓风格）
   cursor-help 设置鼠标指针变为帮助样式（通常是问号箭头）
  -->
    <template #trigger>
      <icon-park-outline-help class="op-50 cursor-help" />
    </template>
    {{ props.message }}
  </n-tooltip>
</template>
