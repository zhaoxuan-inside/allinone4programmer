import {
  // 辅助函数，提供类型提示和配置规范，配置文件获得类型提示和自动补全支持，从而避免手写配置时出现拼写错误或结构错误
  defineConfig,
  // 允许以 HTML 属性的方式使用原子类（例如 <div bg-red-500 p-4>）
  presetAttributify,
  presetIcons,
  presetTagify,
  presetTypography,
  presetWebFonts,
  // UnoCSS 的核心预设，相当于 Tailwind CSS / Windi CSS 的常用工具类集合
  presetWind4,
  // 支持将多个带变体的类组合成一个简写（例如 hover:bg-red-500 hover:text-white 可以写成 hover:bg-red-500 text-white 并自动展开）
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // presets
  // 用于加载一组预先定义好的规则（rules）、变体（variants）、主题（theme） 和快捷方式（shortcuts） 的集合。
  // UnoCSS 本身是高度可定制的引擎，默认不包含任何 CSS 规则。为了让用户开箱即用地写出类似 Tailwind CSS 的样式，官方提供了多个预设。通过 presets 数组，可以实现如下需求：
  // 1. 按需组合预设（例如 Uno 类 + 属性化 + Icons）
  // 2. 覆盖/扩展预设中的规则
  // 3. 完全自定义自己的预设
  presets: [
    // 支持的元素
    // 兼容 Tailwind CSS v3 的实用类集合
    presetWind4(
      {
        // 暗色模式策略：'class' 表示通过 .dark 类控制，'media' 表示跟随系统
        dark: 'class',
        // 控制是否启用内置的 CSS 重置样式（类似 Tailwind 的 base）
        // 1. 消除浏览器默认样式差异
        // 2. 保留有用的默认值
        // 3. 方便 Tailwind 实用类工作
        preflights: {
          // 开启重置，不再需要额外导入 @unocss/reset
          reset: true,
        },
        // 自定义工具类解析器：例如将 rem 批量转换为 px
        utilityResolver: (utility: string) => {
        // 示例：将以 'p-' 开头的 rem 值转换为 px（假设 1rem = 16px）
          if (utility.startsWith('p-')) {
            const remValue = Number.parseFloat(utility.slice(2))
            if (!Number.isNaN(remValue)) {
              return `p-${remValue * 16}px`
            }
          }
          return utility // 返回原始或修改后的字符串
        },
        // 主题变量的生成模式：'on-demand'（按需生成，推荐），true（全量生成），false（不生成）
        theme: 'on-demand',
      },
    ),
    // 允许以 HTML 属性的方式使用原子类
    presetAttributify({
      // 属性前缀，用于避免与原生属性或组件 props 冲突
      prefix: 'un-',

      // 是否只处理带前缀的属性（配合 prefix 使用）
      prefixedOnly: false,

      // 是否支持无值属性，如 <div rounded /> 等同于 class="rounded"
      nonValuedAttribute: true,

      // 在 JSX 环境中，将值为 true 的属性视为无值属性（提升兼容性）
      trueToNonValued: false,

      // 忽略某些属性名，不将其作为样式解析
      ignoreAttributes: ['data-id', 'data-testid'],

      // 严格模式：只生成被属性模式或 class 使用的样式
      strict: false,
    }),
    // 通过类名（如 i-mdi-home）按需加载图标，支持超过 20 万个图标
    presetIcons({
      // 图标缩放比例（相对于当前字号）
      scale: 1.2,

      // 设置所有图标的默认额外样式
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },

      // 强制指定渲染模式（可选 'mask' 或 'background-img'，不指定则自动判断）
      mode: 'mask',

      // 通过 CDN 加载图标集（如果不想本地安装 @iconify-json 包）
      cdn: 'https://esm.sh/@iconify-json/ph',

      // 图标集配置（推荐使用动态导入，按需加载）
      collections: {
        // 例如使用 Iconify 的 Material Design Icons 和 HeroIcons
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        hero: () => import('@iconify-json/heroicons/icons.json').then(i => i.default),
      },

      // 图标自定义钩子
      customizations: {
        // 转换 SVG 内容（仅对自定义集合生效，collections 中动态导入的图标也有效）
        // 将所有 fill="currentColor" 替换为 fill="custom"
        transform: svg => svg.replace(/fill=["']?currentColor["']?/g, 'fill="custom"'),
        // 更高级的定制函数，可以修改整个图标数据对象
        customize: (_customization, data, _content) => {
          // 例如：将所有图标宽度强制设为 24px
          if (data.width)
            data.width = 24
        },
      },
    }),

    // 方便集成 Google Fonts 等网络字体
    presetWebFonts({
      // 字体来源服务商：'google'、'bunny'（欧盟隐私友好）、'fontshare' 等
      provider: 'google',

      // 字体系列配置：key 是生成的类名（如 .font-sans，.font-mono）
      fonts: {
        // 无衬线字体
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // 衬线字体（可指定多个字重）
        serif: [
          { name: 'Merriweather', weights: ['400', '700'] },
          'Georgia',
        ],
        // 等宽字体
        mono: ['Fira Code', 'monospace'],
        // 手写字体
        cursive: ['Caveat', 'cursive'],
      },

      // 是否自动将字体合并到 UnoCSS 主题的 fontFamily 中
      extendTheme: true,

      // 是否将 @import 语句内联到 CSS 中（优化实际加载）
      inlineImports: true,

      // 自定义网络请求函数（可用于本地化字体或代理）
      customFetch: async (url) => {
        // 示例：通过本地代理加载 Google Fonts
        const proxyUrl = `/api/fonts?url=${encodeURIComponent(url)}`
        const res = await fetch(proxyUrl)
        return res.text()
      },

    }),
    // 为 Markdown 或富文本内容提供常见的排版样式（如 prose 类）
    presetTypography({
      // 根类名，默认为 'prose'，可改为 'markdown' 等
      selectorName: 'prose',

      // 扩展或覆盖排版内部元素的样式
      cssExtend: {
        // 对 h1 标题增加下划线
        h1: {
          'border-bottom': '2px solid #e5e7eb',
          'padding-bottom': '0.5rem',
        },
      },

      // 颜色方案配置（仅在未使用 prose-{color} 变体时生效）
      colorScheme: {
      },

      // 提高排版样式优先级：true 表示添加 !important，或指定一个选择器作为作用域
      important: false,
    }),

    // 允许使用自定义标签名（如 <btn>) 来应用样式
    presetTagify({
      // 标签前缀，例如 un-button 会匹配 <un-button>
      prefix: 'un-',
    }),

  ],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
  },
  transformers: [
    transformerVariantGroup(),
  ],
})
