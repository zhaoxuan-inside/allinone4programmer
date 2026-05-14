<script setup lang="ts"></script>

<template>
  <!-- n-el：Naive UI 提供的通用元素组件 -->
  <!-- tag="div" 组件渲染为 <div>，可以应用 Naive UI 的 CSS 变量主题系统 -->
  <!-- p-3 — 内边距（Naive UI 的原子类，等同于 padding: 16px） -->
  <!-- cursor-pointer — 鼠标指针变为手形，提示可点击 -->
  <!-- rounded — 圆角 -->
  <n-el
    tag="div"
    class="el p-3 cursor-pointer rounded"
  >
    <!-- n-flex：Naive UI 的弹性布局组件，配置： -->
    <!-- align="center" 交叉轴居中对齐子项 -->
    <!-- :wrap="false" → 禁止换行，子项始终单行排列。 -->
    <!-- class="h-full" → 高度 100%，撑满父容器 (n-el)。 -->
    <!-- 内部放置 <slot />，允许父组件插入任意内容 -->
    <n-flex
      align="center"
      :wrap="false"
      class="h-full"
    >
      <slot />
    </n-flex>
  </n-el>
</template>

<style scoped>
  .el {
    /* --开头的属性是CSS自定义属性，可以存储值（颜色、尺寸等）然后在其他地方通过 var() 函数调用 */
    /* 使用了 CSS 自定义属性（名称带 --n- 前缀，源自 Naive UI 主题），保证颜色跟随主题动态变化，暗色/亮色模式自动适应 */
    color: var(--n-text-color);
    /*
    transition 是 CSS 的一个属性，用来让元素在状态发生改变时，不会立刻“跳变”，而是平滑地过渡过去
    0.3s：过渡持续时间为 0.3 秒
    var(--cubic-bezier-ease-in-out)：过渡的时间函数，定义了过渡的速度曲线，使用了 CSS 自定义属性（cubic-bezier-ease-in-out），通常是一个缓动函数，使过渡效果更自然（先慢后快再慢）。
     */
    transition: 0.3s var(--cubic-bezier-ease-in-out);
  }
  .el:hover {
    background-color: var(--button-color-2-hover);
    color: var(--n-text-color-hover);
  }
</style>
