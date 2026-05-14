<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = defineProps<Props>()

// 父子组件之间绑定双向传递数据的 model
const iconModel = defineModel('value', { type: String })

// 包含的图标库系列名，更多：https://icon-sets.iconify.design/
const nameList = [
  // IconPark 适合对图标外观灵活性、可定制性有高要求的项目。
  'icon-park-outline',
  // Carbon 适合企业级应用，特别是风格严谨的 B 端系统。
  'carbon',
  // Ant Design 适合 React 生态的项目，可与 UI 框架无缝融合。
  'ant-design',
]

interface IconList {
  prefix: string
  icons: string[]
  title: string
  total: number
  categories?: Record<string, string[]>
  uncategorized?: string[]
}

// 获取单个图标库数据
async function fetchIconList(name: string): Promise<IconList> {
  return await fetch(`https://api.iconify.design/collection?prefix=${name}`)
    .then(res => res.json())
}

// 获取所有图标库数据
async function fetchIconAllList(nameList: string[]) {
  // 并行请求所有图标列表
  const targets = await Promise
  // Promise.all：接受一个包含多个 Promise 的数组，并返回一个新的 Promise
  // 该 Promise 在所有输入的 Promise 都成功时 resolve，或在任何一个输入的 Promise 失败时 reject
  // 如果任何一个 Promise 失败， Promise.all 会立即失败并抛出错误
    .all(
      // map 方法便利 nameList 中的每个图标库名称，调用 fetchIconList 获取数据，返回一个 Promise 数组
      nameList.map(fetchIconList),
    )

  // 处理每个返回的图标数据
  const iconList = targets
    .map((item) => {
      const icons = [
        // 扩展运算符，将数组或对象展开，并将元素拼接到新数组
        ...(
          // 分类的图标
          item.categories
          // 提取 item.categories 对象中所有值（即每个分类的图标数组），得到一个二维数组
            ? Object.values(item.categories)
              // .flat()： 二维拉平为一维
              // .flat(2): 拉平两层
                .flat()
            : []),
        ...(
          item.uncategorized
            ? Object.values(item.uncategorized)
                .flat()
            : []),
      ]
      return { ...item, icons }
    })

  // 处理本地图标
  const svgNames
    = Object.keys(
      // 原生的 ES 模块对象，包含当前模块的元信息
      import.meta
        // Vite 批量导入工具
        .glob(
          '@/assets/svg-icons/*.svg',
        ),
    )
      .map(
        path =>
        // .pop() 移除并返回数组最后一个元素
          path.split('/').pop()?.replace('.svg', ''),
      )
      // filter(Boolean): 过滤掉 undefined
      // as string[]: 断言为 string[]
      // filter(Boolean) 是常用技巧，会将数组中所有 "假值"（false、null、undefined、0、NaN、''）剔除
      .filter(Boolean) as string[]

  // 将本地图标添加到 iconList 数组最前面
  iconList
    // unshift() 将一个或多个元素添加到数组的开头
    // push() 方法是将元素添加到数组的末尾
    .unshift({
      prefix: 'local',
      title: 'Local Icons',
      icons: svgNames,
      total: svgNames.length,
      uncategorized: svgNames,
    })

  return iconList
}

// 创建一个浅层响应式的引用 (shallowRef)
// 与 Ref 相比，shallowRef 仅会对最外层的对象属性更新进行响应式追踪，而不会递归地追踪内部嵌套对象的属性变化
// 对 iconList 增删元素都不会产生响应式追踪
const iconList = shallowRef<IconList[]>([])

// 在 Vue 组件挂载到 DOM 后，异步获取图标库列表数据，并将结果赋值给 iconList.value（响应式变量）
onMounted(
  async () => {
    iconList.value = await fetchIconAllList(nameList)
  },
)

// 当前tab
const currentTab = shallowRef(0)
// 当前tag
const currentTag = shallowRef('')

// 搜索图标输入框值
const searchValue = ref('')

// 当前页数
const currentPage = shallowRef(1)

// 切换tab
function handleChangeTab(index: number) {
  currentTab.value = index
  currentTag.value = ''
  currentPage.value = 1
}

// 选择分类tag
function handleSelectIconTag(icon: string) {
  currentTag.value = currentTag.value === icon ? '' : icon
  currentPage.value = 1
}

// 包含当前分类或所有图标列表
const icons = computed(
  () => {
    if (!iconList.value[currentTab.value])
      return []
    // !! 是双重否定操作符，用于将任意值强制转换为布尔值
    // 如果 currentTag.value 是真值（非空字符串、非零数字、对象等），结果为 true
    // 如果 currentTag.value 是假值（空字符串 ''、null、undefined、0、false），结果为 false
    const hasTag = !!currentTag.value
    return hasTag
      ? iconList.value[currentTab.value]?.categories?.[currentTag.value] || []
      : iconList.value[currentTab.value].icons || []
  },
)

// 符合搜索条件的图标列表
const filteredIcons
  = computed(
    () => {
      return icons.value?.filter(
        icon => icon.includes(searchValue.value),
      ) || []
    },
  )

// 当前页显示的图标
const visibleIcons
  = computed(
    () => {
      return filteredIcons.value.slice((currentPage.value - 1) * 200, currentPage.value * 200)
    },
  )

const showModal = ref(false)

// 选择图标
function handleSelectIcon(icon: string) {
  iconModel.value = icon
  showModal.value = false
}

// 清除图标
function clearIcon() {
  iconModel.value = ''
  showModal.value = false
}
</script>

<template>
  <!-- n-input-group 组件 -->
  <n-input-group disabled>
    <n-button
      v-if="iconModel"
      :disabled="props.disabled"
      type="primary"
    >
      <!-- 图标插槽：<template #icon> -->
      <template #icon>
        <!-- <nova-icon> 会根据该标识符渲染对应图标的 SVG -->
        <nova-icon
          :icon="iconModel"
        />
      </template>
    </n-button>

    <n-input
      :value="iconModel"
      readonly :placeholder="$t('components.iconSelector.inputPlaceholder')"
    />

    <!--
    ghost:
    幽灵按钮属性,
    当与 type="primary" 一起使用时，效果变成：
    背景透明
    文字颜色为主题色
    边框为主题色（1px 实线）
    鼠标悬停时背景变为主题色的淡色（通常透明度 0.1 左右），文字和边框颜色加深。
    -->
    <n-button
      type="primary"
      ghost
      :disabled="props.disabled"
      @click="showModal = true"
    >
      {{ $t('common.choose') }}
    </n-button>
  </n-input-group>

  <!--
  n-modal: Vue 组件，来自 Naive UI 这个 UI 组件库。它的作用是在页面上创建一个"模态框（Modal）"——也称为弹窗/对话框
  preset="card": Naive UI 预设样式为“卡片”风格，带有内边距和阴影
  class="w-800px": 强制宽度 800px
  :bordered="false": 无边框。
  -->
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="$t('components.iconSelector.selectorTitle')"
    size="small"
    class="w-800px"
    :bordered="false"
  >
    <!-- 具名插槽 -->
    <template #header-extra>
      <n-button
        type="warning"
        size="small"
        ghost
        @click="clearIcon"
      >
        {{ $t('components.iconSelector.clearIcon') }}
      </n-button>
    </template>

    <!--
    标签页容器
    :value="currentTab"	当前激活标签页的索引（number 或 string），由 currentTab 控制
    type="line"	下划线样式
    animated	切换时带动画
    placement="left"	标签页头放在左侧（垂直布局）
    -->
    <n-tabs
      :value="currentTab"
      type="line"
      animated
      placement="left"
      @update:value="handleChangeTab"
    >
      <!-- <n-tab-pane> 是 Naive UI 这个 Vue 3 组件库里用来定义单个标签页内容的组件 -->
      <n-tab-pane
        v-for="(list, index) in iconList"
        :key="list.prefix"
        :name="index"
        :tab="list.title"
      >
        <n-flex vertical>
          <n-flex size="small">
            <n-tag
              v-for="(_v, k) in list.categories"
              :key="k"
              :checked="currentTag === k"
              round
              checkable
              size="small"
              @update:checked="handleSelectIconTag(k)"
            >
              {{ k }}
            </n-tag>
          </n-flex>

          <n-input
            v-model:value="searchValue" type="text" clearable
            :placeholder="$t('components.iconSelector.searchPlaceholder')"
          />

          <div>
            <n-flex :size="2">
              <n-el
                v-for="(icon) in visibleIcons" :key="icon"
                class="hover:(text-[var(--primary-color)] ring-1) ring-[var(--primary-color)] p-1 rounded flex-center"
                :title="`${list.prefix}:${icon}`"
                @click="handleSelectIcon(`${list.prefix}:${icon}`)"
              >
                <nova-icon :icon="`${list.prefix}:${icon}`" :size="24" />
              </n-el>
              <n-empty v-if="visibleIcons.length === 0" class="w-full" />
            </n-flex>
          </div>

          <n-flex justify="center">
            <n-pagination
              v-model:page="currentPage"
              :item-count="filteredIcons.length"
              :page-size="200"
            />
          </n-flex>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>
