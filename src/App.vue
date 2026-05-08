<script setup lang="ts">
import AppMain from './AppMain.vue'
import AppLoading from './components/common/AppLoading.vue'
</script>

<template>
  <!--
   Suspense 组件，用来协调异步依赖的加载状态。
   当一个组件树中有异步组件（defineAsyncComponent）或组合式 API 中返回 Promise 的 setup() 时，Suspense 能在等待异步内容时渲染一个 fallback 内容
   -->
  <Suspense>
    <AppMain />
    <!-- 等价于 <template v-slot:fallback> -->
    <template #fallback>
      <AppLoading />
    </template>
  </Suspense>
</template>
