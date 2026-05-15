<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface iconPorps {
  /* 图标名称 */
  icon?: string
  /* 图标颜色 */
  color?: string
  /* 图标大小 */
  size?: number
  /* 图标深度 */
  depth?: 1 | 2 | 3 | 4 | 5
}
const { size = 18, icon } = defineProps<iconPorps>()

const isLocal = computed(() => {
  return icon && icon.startsWith('local:')
})

function getLocalIcon(icon: string) {
  const svgName = icon.replace('local:', '')
  const svg = import.meta.glob<string>('@/assets/svg-icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  return svg[`/src/assets/svg-icons/${svgName}.svg`]
}
</script>

<template>
  <n-icon
    v-if="icon"
    :size="size"
    :depth="depth"
    :color="color"
  >
    <template v-if="isLocal">
      <!-- <i> 标签：通常用于图标展示，无特殊语义，此处作为 SVG 内容的容器。 -->
      <!-- v-html 指令：将 getLocalIcon(icon) 返回的HTML 字符串（预期为 SVG 代码）插入到 <i> 内部，替换其子节点 -->
      <i v-html="getLocalIcon(icon)" />
    </template>
    <template v-else>
      <!-- :icon="icon"：动态传递图标标识（如 "mdi:home" 或 "fa:heart"），由 <Icon> 组件内部解析并渲染为 <svg> 元素 -->
      <Icon :icon="icon" />
    </template>
  </n-icon>
</template>
