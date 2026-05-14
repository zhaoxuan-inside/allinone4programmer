<!-- 主题模式切换器组件 -->
<script setup lang="ts">
import { useAppStore } from '@/store'
import IconAuto from '~icons/icon-park-outline/laptop-computer'
import IconMoon from '~icons/icon-park-outline/moon'
import IconSun from '~icons/icon-park-outline/sun-one'
// NFlex：从 Naive UI 引入的布局组件，用于 renderLabel 中渲染选项布局
import { NFlex } from 'naive-ui'

const { t } = useI18n()

const appStore = useAppStore()

const options = computed(() => {
  return [
    {
      label: t('app.light'),
      value: 'light',
      icon: IconSun,
    },
    {
      label: t('app.dark'),
      value: 'dark',
      icon: IconMoon,
    },
    {
      label: t('app.system'),
      value: 'auto',
      icon: IconAuto,
    },
  ]
})

function renderLabel(option: any) {
  // h： h 函数是 Vue 3 中的一个工具函数，用于创建虚拟 DOM 节点（VNode）。在 renderLabel 中，使用 h 函数来动态生成选项的标签内容。
  return h(
    // NFlex：Naive UI 的 NaiveFlex 组件，用于布局选项标签中的图标和文本
    NFlex,
    { align: 'center' },
    // 插槽定义。对象键是插槽名（default 是默认插槽），值是一个返回 VNode 数组的工厂函数（确保每个实例独立）
    {
      default: () => [
        h(option.icon),
        option.label,
      ],
    },
  )
}
</script>

<template>
  <!-- :value="appStore.storeColorMode"	v-bind 动态绑定	绑定当前选中的值（'dark' / 'light' / 'auto'），让菜单高亮对应项 -->
  <!-- :render-label="renderLabel"	props 传递函数	自定义选项的渲染方式，用 JS 函数（h 函数）控制菜单内每一项的布局 -->
  <!-- :options="options"	动态属性	传入选项数组（三个对象，含 label、value、icon） -->
  <!-- trigger="click"	静态属性（字符串）	点击触发弹出（非 hover） -->
  <!-- @update:value="appStore.setColorMode"	v-on 事件监听	当用户选择新值时，调用 store 方法更新全局主题 -->
  <n-popselect
    :value="appStore.storeColorMode"
    :render-label="renderLabel"
    :options="options"
    trigger="click"
    @update:value="appStore.setColorMode"
  >
    <CommonWrapper>
      <!-- v-if="appStore.storeColorMode === 'dark'"：当表达式为真时渲染该元素，否则不渲染（DOM 中彻底移除） -->
      <icon-park-outline-moon v-if="appStore.storeColorMode === 'dark'" />
      <icon-park-outline-sun-one v-if="appStore.storeColorMode === 'light'" />
      <icon-park-outline-laptop-computer v-if="appStore.storeColorMode === 'auto'" />
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>
