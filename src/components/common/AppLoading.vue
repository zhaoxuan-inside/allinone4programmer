<script setup lang="ts">
</script>

<!-- <template>：组件的 HTML 结构 -->
<template>
  <!-- <naive-provider>：来自 Naive UI 组件库的全局配置组件（通常用于提供主题、弹窗容器等）。
    这里只是包裹，没有传任何属性，不影响动画本身的渲染 -->
  <naive-provider>
    <!-- loading-container: 全屏遮罩容器，用来居中显示动画并覆盖页面 -->
    <div id="loading-container">
      <div class="boxes">
        <div class="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div class="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div class="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div class="box">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  </naive-provider>
</template>

<style scoped>
  /*
    width: 100vw;
    height: 100vh;
    让容器铺满整个浏览器窗口，无论窗口大小如何变化，都会自动适应；
    如果用 width: 100%;，需要父元素有确定的高度才能生效，而 fixed 定位下的父级通常是 <body>，其高度可能不是视口高度（需额外设置 height: 100%）。
    100vh 直接锚定视口，更简洁可靠
    vw: 视口宽度百分比
    vh: 视口高度百分比
    display: flex;：开启弹性盒布局，子元素会按照 flex 规则排列
    align-items: center;：在交叉轴（垂直于主轴的方向）上居中
    justify-content: center;：在主轴（当前为垂直方向）上居中，实现垂直居中。由于主轴是 column，justify-content 控制上下居中
    flex-direction: column;：将主轴方向改为从上到下（默认是水平方向）
    flex-direction: column;：将主轴方向改为从上到下（默认是水平方向）
    position: fixed: 定位使元素相对于浏览器视口固定位置
    z-index: 控制元素在Z 轴上的堆叠顺序（仅对定位元素有效，fixed 就是定位元素）
    z-index: 1;：设置 z-index 为 1，确保加载动画在其他内容之上显示（默认 z-index 是 auto，可能被其他元素覆盖）
   */
  #loading-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 15vh;
    position: fixed;
    background-color: aliceblue;
    z-index: 1;
  }

  /*
    --size: 48px; ： 定义一个自定义 CSS 属性（CSS 变量），变量名为 --size，值为 48px
    --duration: 800ms; ： 定义自定义属性 --duration，值为 800ms（毫秒）
    eight: calc(var(--size) * 2); ： 使用 calc() 函数计算高度，值为 --size 的两倍，即 96px
    width: calc(var(--size) * 3); ： 使用 calc() 函数计算宽度，值为 --size 的三倍，即 144px
    position: relative;：设置定位为相对定位，为子元素的绝对定位提供参考
    transform-style: preserve-3d;：启用 3D 转换效果，使子元素在 3D 空间中正确显示
    transform-origin: 50% 50%;：设置变换的原点为元素的中心（50% 水平，50% 垂直）
    margin-top: calc(var(--size) * 1.5 * -1);：设置上外边距为 --size 的 1.5 倍的负值，即 -72px，使元素向上移动，达到垂直居中的效果
  */
  .boxes {
    --size: 48px;
    --duration: 800ms;
    height: calc(var(--size) * 2);
    width: calc(var(--size) * 3);
    position: relative;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    margin-top: calc(var(--size) * 1.5 * -1);
    transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
  }

  .boxes .box {
    width: var(--size);
    height: var(--size);
    top: 0;
    left: 0;
    position: absolute;
    transform-style: preserve-3d;
  }

  /*
   :nth-child(1)：伪类选择器，表示选择父元素下的第一个子元素（且必须匹配前面的 .box 类型）
   transform: translate(100%, 0);
   transform 属性允许对元素进行二维或三维变换
   translate(100%, 0) 是一个二维平移函数，表示将元素沿 X 轴平移 100%（即元素自身宽度的 100%，相当于向右移动一个元素宽度），沿 Y 轴平移 0（不移动）
   animation: box1 var(--duration) linear infinite;：为元素添加动画
   */
  .boxes .box:nth-child(1) {
    transform: translate(100%, 0);
    animation: box1 var(--duration) linear infinite;
  }

  .boxes .box:nth-child(2) {
    transform: translate(0, 100%);
    animation: box2 var(--duration) linear infinite;
  }

  .boxes .box:nth-child(3) {
    transform: translate(100%, 100%);
    animation: box3 var(--duration) linear infinite;
  }

  .boxes .box:nth-child(4) {
    transform: translate(200%, 0);
    animation: box4 var(--duration) linear infinite;
  }

  /*
    .boxes .box > div : 选择父元素为 .boxes .box 的所有直接子 <div> 元素（> 表示直接子元素，不包括更深层嵌套）
    --translateZ: calc(var(--size) / 2);：沿 Z 轴平移的距离。calc(var(--size) / 2) 计算为 48px / 2 = 24px。默认所有面向外平移 24px，形成立方体的“厚度”。后面特殊面（如后面）会再次覆盖此值。
    --rotateY: 0deg; 和 --rotateX: 0deg;：默认绕 Y 轴和 X 轴的旋转角度，不同面会分别设置（例如右面绕 Y 轴旋转 90°，上面绕 X 轴旋转 -90°）
    position: absolute; : 让每个面相对于其父容器 .box 进行定位，所有面重叠在一起（默认 top/left 为 0），然后通过 transform 将它们分别旋转/平移，构建立方体
    transform: rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ));  将一个二维平面转换为立方体的一个面
     - rotateY(var(--rotateY))：绕 Y 轴旋转，角度由 --rotateY 定义（例如右面为 90°，前面为 0°）
     - rotateX(var(--rotateX))：绕 X 轴旋转，角度由 --rotateX 定义（例如上面为 -90°，前面为 0°）
     - translateZ(var(--translateZ))：沿 Z 轴平移，距离由 --translateZ 定义（默认 24px），使得每个面都向外平移形成立方体的厚度
    */
  .boxes .box > div {
    --background: #5c8df6;
    --top: auto;
    --right: auto;
    --bottom: auto;
    --left: auto;
    --translateZ: calc(var(--size) / 2);
    --rotateY: 0deg;
    --rotateX: 0deg;
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--background);
    top: var(--top);
    right: var(--right);
    bottom: var(--bottom);
    left: var(--left);
    transform: rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ));
  }

  .boxes .box > div:nth-child(1) {
    --top: 0;
    --left: 0;
  }

  .boxes .box > div:nth-child(2) {
    --background: #145af2;
    --right: 0;
    --rotateY: 90deg;
  }

  .boxes .box > div:nth-child(3) {
    --background: #447cf5;
    --rotateX: -90deg;
  }

  .boxes .box > div:nth-child(4) {
    --background: #dbe3f4;
    --top: 0;
    --left: 0;
    --translateZ: calc(var(--size) * 3 * -1);
  }

  @keyframes box1 {
    0%,
    50% {
      transform: translate(100%, 0);
    }

    100% {
      transform: translate(200%, 0);
    }
  }

  @keyframes box2 {
    0% {
      transform: translate(0, 100%);
    }

    50% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(100%, 0);
    }
  }

  @keyframes box3 {
    0%,
    50% {
      transform: translate(100%, 100%);
    }

    100% {
      transform: translate(0, 100%);
    }
  }

  @keyframes box4 {
    0% {
      transform: translate(200%, 0);
    }

    50% {
      transform: translate(200%, 100%);
    }

    100% {
      transform: translate(100%, 100%);
    }
  }
</style>
