// 系列类型的定义后缀都为 SeriesOption
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts'
// 组件类型的定义后缀都为 ComponentOption
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import { useAppStore } from '@/store'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'

import {
  DatasetComponent, // 数据集组件
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent, // 内置数据转换器组件 (filter, sort)
} from 'echarts/components'
import * as echarts from 'echarts/core'

import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useTemplateRef } from 'vue'

// ComposeOption：ECharts 提供的工具类型，用于将多个系列类型和组件类型合并成一个完整且不冲突的 ECOption 类型
// 实际图表配置可能同时包含 title、tooltip、series（可以是多种系列类型），直接使用联合类型会有属性重叠问题。ComposeOption 会智能合并，使类型提示更准确
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DatasetComponentOption
  | ToolboxComponentOption
  | RadarSeriesOption
>

// 注册必须的组件
// echarts.use：注册所需的组件、图表、功能、渲染器。未在此处注册的组件如果在 chartOptions 中使用，会导致图表无法渲染或报错
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  PieChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  ToolboxComponent,
  RadarChart,
])

/**
 * Echarts hooks函数
 * @description 按需引入图表组件，没注册的组件需要先引入
 */
export function useEcharts(ref: string, chartOptions: Ref<ECOption>) {
  const ele = useTemplateRef<HTMLLIElement>(ref)

  const appStore = useAppStore()

  let chart: echarts.ECharts | null = null

  const { width, height } = useElementSize(ele)

  const isRendered = () => Boolean(ele && chart)

  async function render() {
    // 宽或高不存在时不渲染
    if (!width || !height)
      return

    const chartTheme = appStore.colorMode
      ? 'dark'
      : 'light'

    // await nextTick()：等待 Vue 完成 DOM 更新，确保 el.value 已经真正挂载
    await nextTick()
    if (ele) {
      chart = echarts.init(ele.value, chartTheme)
      update(chartOptions.value)
    }
  }

  async function update(updateOptions: ECOption) {
    if (isRendered()) {
      chart!.setOption({ backgroundColor: 'transparent', ...updateOptions })
    }
  }

  function destroy() {
    chart?.dispose()
    chart = null
  }

  // 监听容器尺寸变化，如果图表已渲染且新尺寸有效，调用 resize() 重新适应大小
  watch(
    [width, height],
    async ([newWidth, newHeight]) => {
      if (isRendered() && newWidth && newHeight)
        chart?.resize()
    },
  )

  watch(
    chartOptions,
    (newValue) => {
      update(newValue)
    },
  )

  onMounted(() => {
    render()
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    destroy,
    update,
  }
}
