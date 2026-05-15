<script setup lang="ts">
import { useAppStore } from '@/store'

const appStore = useAppStore()
const options = [
  {
    label: 'English',
    value: 'enUS',
  },
  {
    label: '中文',
    value: 'zhCN',
  },
]
</script>

<template>
  <!--
   <n-popselect> 组件（弹出式选择器），创建了一个可以触发并显示选项菜单的按钮
    <n-popselect> 继承自 <n-select>
  -->
  <!-- :options="options"：定义下拉菜单的选项列表，每个选项通常包含 label（显示文本）和 value（实际值） -->
  <!-- trigger="click"：指定触发方式为点击（click），也可设为 hover、focus 或 manual -->
  <n-popselect
    :value="appStore.lang"
    :options="options"
    trigger="click"
    @update:value="appStore.setAppLang"
  >
    <CommonWrapper>
      <icon-park-outline-translate />
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>
