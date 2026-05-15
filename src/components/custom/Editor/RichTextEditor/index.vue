<script setup lang="ts">
//  Quill 库的默认导出，用于初始化富文本编辑器
import Quill from 'quill'
//  useTemplateRef 函数，用于获取模板中的 DOM 元素引用（Vue 3.5+ 新特性）
import { useTemplateRef } from 'vue'
// Quill 的 snow 主题样式，使编辑器具有默认外观
import 'quill/dist/quill.snow.css'

defineOptions({
  name: 'RichTextEditor',
})

const { disabled } = defineProps<Props>()
interface Props {
  disabled?: boolean
}
const model = defineModel<string>()

let editorInst = null

const editorModel = ref<string>()

onMounted(() => {
  initEditor()
})

const editorRef = useTemplateRef<HTMLElement>('editorRef')
function initEditor() {
  // 配置工具栏模块，提供一系列文本格式化按钮。toolbar 数组中的每一项对应一个控件：标题级别选择、加粗、斜体等
  const options = {
    modules: {
      toolbar: [
        // 标题
        { header: [1, 2, 3, 4, 5, 6, false] },
        'bold', // 加粗
        'italic', // 斜体
        'strike', // 删除线
        { size: ['small', false, 'large', 'huge'] }, // 字体大小
        { font: [] }, // 字体种类
        { color: [] }, // 字体颜色、
        { background: [] }, // 字体背景颜色
        'link', // 插入链接
        'image', // 插入图片
        'blockquote', // 引用
        'video', // 插入视频
        { list: 'bullet' }, // 无序列表
        { list: 'ordered' }, // 有序列表
        { script: 'sub' }, // 下标
        { script: 'super' }, // 上标
        { align: [] }, // 对齐方式
        'formula', // 公式
        'clean', // remove formatting button
      ],
    },

    placeholder: 'Insert text here ...',
    theme: 'snow',
  }

  // 创建 Quill 实例，传入 DOM 元素（非空断言 ! 因为编辑器已挂载）和配置选项
  const quill = new Quill(editorRef.value!, options)

  quill.on(
    // // 监听编辑器的 text-change 事件（内容变化时触发）
    'text-change',
    // 回调函数
    (_delta, _oldDelta, _source) => {
      editorModel.value
      // 将用于编辑的内部结构，转换成语义正确、干净标准的 HTML 代码
        = quill.getSemanticHTML()
    },
  )

  if (disabled)
    quill.enable(false)

  editorInst = quill

  if (model.value)
    setContents(model.value)
}

function setContents(html: string) {
  editorInst!.setContents(editorInst!.clipboard.convert({ html }))
}

watch(
  // 监听 model.value
  () => model.value,

  (newValue, _oldValue) => {
    if (newValue && newValue !== editorModel.value) {
      setContents(newValue)
    }
    else if (!newValue) {
      setContents('')
    }
  },
)

watch(
  // 监听 editorModel
  editorModel,

  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue)
      model.value = newValue

    else if (!newValue)
      editorInst!.setContents([])
  },
)

watch(
  // 监听 disabled 属性
  () => disabled,

  (newValue, _oldValue) => {
    // ! 判空断言
    editorInst!.enable(!newValue)
  },
)

onBeforeUnmount(
  () => editorInst = null,
)
</script>

<template>
  <!-- 空的 <div> 元素，通过 ref="editorRef" 关联到 useTemplateRef 获取的 DOM 引用。Quill 编辑器将挂载到这个 div 上 -->
  <div ref="editorRef" />
</template>
