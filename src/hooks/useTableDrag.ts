import type { NDataTable } from 'naive-ui'

// vue-draggable-plus库 可以将任意 DOM 容器变成可拖拽排序的列表。只要把表格的 <tbody> 作为容器，把表格的 data 数组交给它，它就会自动处理拖拽事件并修改数组顺序
import { useDraggable } from 'vue-draggable-plus'

export function useTableDrag<T = unknown>(
  params: {
    // tableRef：NDataTable 组件实例的 ref（Vue 响应式引用），类型是 Ref<InstanceType<typeof NDataTable> | undefined>，允许未定义
    tableRef: Ref<InstanceType<typeof NDataTable> | undefined>
    // data：表格绑定的数据数组的响应式引用（Ref<T[]>），拖拽时会自动修改其顺序
    data: Ref<T[]>
    // onRowDrag：拖拽结束时的回调函数，参数是被移动的连续行数据数组（T[]）
    onRowDrag: (rows: T[]) => void
  },
) {
  // 创建一个计算属性，自动跟随 tableRef 变化而返回表格的根 DOM 元素。这样后续轮询 tbody 时总能拿到最新的 DOM
  const tableEle = computed(
    () => params.tableRef?.value?.$el as HTMLElement,
  )

  // 响应式引用 tableBodyRef：用于存储 <tbody> 元素的 DOM 对象，初始为 undefined。它会被传递给 useDraggable 的容器参数
  const tableBodyRef = ref<HTMLElement | undefined>(undefined)

  // 调用 useDraggable：它会监听 tableBodyRef 和 params.data 的变化，启用拖拽排序
  const { start } = useDraggable(
    // tableBodyRef：容器元素（<tbody>）
    tableBodyRef,
    // params.data：数据数组（拖拽时会自动修改顺序）
    params.data,
    {
      // immediate: false：不立即启动拖拽，需要手动调用返回的 start() 方法（因为 tbody 可能尚未存在）
      immediate: false,
      // animation: 150：拖拽排序动画时长 150ms
      animation: 150,
      // handle: '.drag-handle'：只有点击拥有 drag-handle 类的元素时才触发拖拽（通常是一个图标列）
      handle: '.drag-handle',
      // onEnd：拖拽结束时的回调
      onEnd: (event) => {
        const { oldIndex, newIndex } = event
        const start = Math.min(oldIndex!, newIndex!)
        const end = Math.max(oldIndex!, newIndex!) - start + 1
        // [...params.data.value].splice(start, end)：复制当前数据数组，然后剪裁出被移动的连续行数据（注意：splice 会修改复制后的数组，但只需要提取的片段）
        const changedRows = [...params.data.value].splice(start, end)
        params.onRowDrag(unref([...changedRows]))
      },
    },
  )

  onMounted(
    async () => {
      while (!tableBodyRef.value) {
        tableBodyRef.value = tableEle.value?.querySelector('tbody') || undefined
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    },
  )

  watchOnce(
    () => tableBodyRef.value,
    (el) => {
      el && start()
    },
  )
}
