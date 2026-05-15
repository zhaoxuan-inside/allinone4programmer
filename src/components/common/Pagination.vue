<script setup lang="ts">
interface Props {
  count?: number
}

const {
  count = 0,
} = defineProps<Props>()

const emit = defineEmits<{
  change: [page: number, pageSize: number]
}>()

const page = ref(1)
const pageSize = ref(10)
const displayOrder: Array<'pages' | 'size-picker' | 'quick-jumper'> = ['size-picker', 'pages']

function changePage() {
  // 将当前最新的 page 和 pageSize 通过 emit 发送给父组件
  emit('change', page.value, pageSize.value)
}
</script>

<template>
  <!-- n-pagination NaiveUI 提供的一个前端分页模块 -->
  <!-- v-if="count > 0" 只有当 count > 0 时渲染分页器，避免无数据时显示空分页 -->
  <!-- :page-sizes="[10, 20, 30, 50]"：设置每页条数下拉选项 -->
  <!-- :item-count="count"：总数据条数，用于计算总页数 -->
  <!--
  :display-order="displayOrder"：自定义控件显示顺序

  -->
  <n-pagination
    v-if="count > 0"
    v-model:page="page"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 30, 50]"
    :item-count="count"
    :display-order="displayOrder"
    show-size-picker
    @update-page="changePage"
    @update-page-size="changePage"
  />
</template>

<style scoped></style>
