<script setup lang="ts">
// CascaderOption 是 Naive UI 中级联选择器选项对象的结构类型，通常包含 label、value、children 等字段
import type { CascaderOption } from 'naive-ui'

defineOptions({
  name: 'PcaCascader',
})

// 获取原始数据，数据来源仓库
const pcaCode = shallowRef<CascaderOption[]>()

// fetchPcaCode 从 GitHub 上的一个公开仓库（modood/Administrative-divisions-of-China）获取 pca-code.json 文件。该文件包含了中国省、市、区（县）的编码（code）和名称（name）
async function fetchPcaCode() {
  return await fetch('https://cdn.jsdelivr.net/gh/modood/Administrative-divisions-of-China/dist/pca-code.json')
    .then(res => res.json())
}

onMounted(
  async () => {
    pcaCode.value = await fetchPcaCode()
  },
)
</script>

<template>
  <!-- <n-cascader> 是 Naive UI 提供的级联选择器组件 -->
  <!-- options="pcaCode"：绑定数据源，即前面获取的行政区划嵌套数组 -->
  <!-- value-field="code"：指定数据项中用作值的字段名为 code -->
  <!-- label-field="name"：指定数据项中用作显示标签的字段名为 name -->
  <!-- check-strategy="all"：级联选择时的选中策略。"all" 表示选中某个选项时，会自动选中其所有祖先和子孙选项（常用于需要“全路径”值的场景） -->
  <!-- filterable：开启搜索过滤功能，用户可通过输入文字筛选选项 -->
  <!-- clearable：显示清空按钮，允许一键清除已选内容 -->
  <n-cascader
    :options="pcaCode"
    value-field="code"
    label-field="name"
    check-strategy="all"
    filterable
    clearable
  />
</template>
