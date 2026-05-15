<script setup lang="ts">
import type { ToolbarNames } from 'md-editor-v3'
import { useAppStore } from '@/store'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const model = defineModel<string>()

const appStore = useAppStore()

const toolbarsExclude: ToolbarNames[] = [
  'mermaid',
  'katex',
  'github',
  'htmlPreview',
  'catalog',
]
</script>

<template>
  <!-- <MdEditor>，提供了 Markdown 编辑器所应具备的各种功能 -->
  <!-- :toolbars-exclude="toolbarsExclude"：动态绑定 toolbars-exclude 属性，值为前面定义的数组，告诉编辑器隐藏这些工具栏按钮 -->
  <MdEditor
    v-model="model"
    :theme="appStore.colorMode"
    :toolbars-exclude="toolbarsExclude"
  />
</template>

<style scoped></style>
