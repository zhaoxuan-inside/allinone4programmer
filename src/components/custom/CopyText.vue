<script setup lang="ts">
interface Props {
  maxLength?: string
}
const { maxLength } = defineProps<Props>()
const modelValue = defineModel<string>('value')
</script>

<template>
  <div
    v-if="modelValue"
    class="inline-flex items-center gap-0.5em"
  >
    <!-- <n-ellipsis>：来自Naive UI组件库，用于处理文本溢出。当内容超出max-width时自动显示省略号 -->
    <!-- :style动态绑定：内联样式对象，max-width优先使用props传入的maxLength，否则为"12em" -->
    <n-ellipsis
      :style="{ 'max-width': maxLength || '12em' }"
    >
      {{ modelValue }}
    </n-ellipsis>
    <!-- trigger="hover"：鼠标悬停时显示提示 -->
    <n-tooltip
      trigger="hover"
    >
      <!-- #trigger：具名插槽，指定触发展示tooltip的元素 -->
      <template
        #trigger
      >
        <!-- class="cursor-pointer"：鼠标悬浮时变为手形，表示可点击 -->
        <span
          v-copy="modelValue"
          class="cursor-pointer"
        >
          <icon-park-outline-copy />
        </span>
      </template>
      {{ $t('components.copyText.tooltip') }}
    </n-tooltip>
  </div>
</template>
