<script setup lang="ts">
import { ref } from 'vue'
import { Login, Register, ResetPwd } from './components'

// 定义了一个自定义类型 IformType，它只能是这三个字符串字面量之一，用于标识当前显示的表单类型
type IformType = 'login' | 'register' | 'resetPwd'
// 用 Ref<IformType>('login') 创建一个响应式变量 formType，初始值为 'login'，即默认展示登录表单。
const formType = ref<IformType>('login')
const formComponets = {
  login: Login,
  register: Register,
  resetPwd: ResetPwd,
}

const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <!-- n-el 是Naive UI 提供的一个通用元素组件，与原生 div 类似，但可以更一致地使用 Naive UI 的主题和样式 -->
  <!-- var(--body-color)； var 是 CSS 内置函数，用来引用自定义属性。 --body-color，自定义属性名必须以 -- 开头 -->
  <n-el class="wh-full flex-center" style="background-color: var(--body-color);">
    <!-- 黑暗模式/语言 -->
    <div class="fixed top-40px right-40px text-lg">
      <DarkModeSwitch />
      <LangsSwitch />
    </div>

    <!-- p-4xl：超大内边距（可能是 padding: 2rem 或更大） -->
    <!-- h-full w-full：默认宽高占满父容器 -->
    <!-- sm:w-450px：在小屏幕（sm 断点，通常 ≥640px）宽度固定为 450px -->
    <!-- sm:h-unset：在小屏幕上取消高度设定，变成内容自适应高度 -->
    <div
      class="p-4xl h-full w-full sm:w-450px sm:h-unset"
      style="background: var(--card-color);box-shadow: var(--box-shadow-1);"
    >
      <!-- w-full 表示 width: 100%，让该容器占满父元素的整个宽度（父元素是卡片容器，之前设置了宽度限制） -->
      <!-- flex 设置 display: flex，启用 Flexbox 布局 -->
      <!-- flex-col Flex 布局的方向设为 flex-direction: column，即纵向排列。子元素（Logo 和标题）会从上到下堆叠 -->
      <!-- items-center 沿交叉轴（这里因为是 flex-col，交叉轴就是水平方向）居中对齐。效果是让所有子元素水平居中 -->
      <div class="w-full flex flex-col items-center">
        <!-- SvgIconsLogo 全局注册的 SVG 图标组件 -->
        <SvgIconsLogo class="text-6em" />
        <n-h3>{{ appName }} </n-h3>

        <!-- 包裹动态组件，提供切换时的过渡效果 -->
        <!-- name="fade-slide" 会在对应 CSS 中寻找 fade-slide-enter-active、fade-slide-leave-active 等类名来实现淡入淡出加滑动效果 -->
        <!-- mode="out-in"：切换模式为“先退出旧元素，再进入新元素”，避免新旧组件同时存在导致布局跳动 -->
        <transition
          name="fade-slide"
          mode="out-in"
        >
          <!-- 动态组件，Vue 内置的元组件（meta component），它本身不产生 DOM，只是一个"占位符" -->
          <!-- :is 是一个特殊属性（special attribute），用来动态地决定要渲染哪个组件 -->
          <!-- v-model="formType" 实现了父子组件的双向数据同步 -->
          <component
            :is="formComponets[formType]"
            v-model="formType"
            class="w-85%"
          />
        </transition>
      </div>
    </div>

    <div />
  </n-el>
</template>
