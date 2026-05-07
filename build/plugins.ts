import UnoCSS from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import viteCompression from 'vite-plugin-compression'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoProxy from './autoProxy'
import { serviceConfig } from '../service.config'

// 导出一个名为 createVitePlugins 的函数，
// 接收一个环境变量对象 env: ImportMetaEnv，
// 返回一个 Vite 插件数组，这个数组是 Vite 构建流程中使用的所有插件的集合
export function createVitePlugins(env: ImportMetaEnv) {
  const plugins = [

    // 启用 Vite 对 .vue 单文件组件的编译和热更新支持
    // 独立的 Vite 插件：@vitejs/plugin-vue
    vue(),

    // 允许在 Vue 项目中编写 JSX/TSX 语法的组件
    vueJsx(),

    // 在开发环境下提供 Vue DevTools 的下一代体验（如组件树、性能分析、路由时间线等）
    VueDevTools(),

    // 提供高性能、按需生成的原子化 CSS 框架（类似 Tailwind，但更快更灵活）
    UnoCSS(),

    // 自动导入 API
    // 在代码中无需手动 import，直接使用导入库的 API，编译时会自动添加对应的导入语句
    // 插件：unplugin-auto-import/vite
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        // @vueuse/core 是一个基于 Vue Composition API 的实用函数集合，旨在让你用更少的代码，更高效、更优雅地完成开发工作
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
            'useModal',
          ],
        },
      ],
      // 指定哪些文件会被插件扫描并应用自动导入转换
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/,
      ],
      // 生成类型声明文件
      // 为自动导入的 API 提供 TypeScript 类型支持，避免 IDE 报错
      dts: 'src/typings/auto-imports.d.ts',
    }),

    // 自动导入组件
    // 无需手动 import 和注册组件，直接在模板中使用（如 <NaiveButton />），插件会自动按需加载
    // 插件：unplugin-vue-components/vite
    Components({
      // 组件解析器
      resolvers: [
        // ICON 解析器。
        IconsResolver({
          prefix: false,
          customCollections: [
            'svg-icons',
          ],
        }),
        // Naive UI 组件解析器
        NaiveUiResolver(),
      ],
      // 在 unplugin-vue-components 插件配置中，dts 参数用于生成一个 TypeScript 类型声明文件
      // 该文件描述了项目中所有被自动导入（自动注册）的组件，从而让 TypeScript 和 IDE（如 VSCode）能够识别这些组件，避免出现“找不到组件名”的类型错误。
      dts: 'src/typings/components.d.ts',
    }),

    // 图标按需加载
    // 以组件形式按需使用图标，支持几十个图标集，并且可以加载本地自定义 SVG
    Icons({
      defaultStyle: 'display:inline-block',
      compiler: 'vue3',
      // 自定义集合
      customCollections: {
        // svg-icons 自定义集合名称
        'svg-icons':
        // 通过 FileSystemIconLoader 读取目录下的 .svg 文件，并对其内容进行转换
        FileSystemIconLoader(
          'src/assets/svg-icons',
          svg => svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"'),
        ),
      },
    }),

    // 自动生成 API 代理和类型
    AutoProxy({
      enableProxy: env.VITE_HTTP_PROXY === 'Y',
      serviceConfig,
      dts: 'src/typings/auto-proxy.d.ts',
    }),
  ]

  // 条件压缩插件
  if (env.VITE_BUILD_COMPRESS === 'Y') {
    const { VITE_COMPRESS_TYPE = 'gzip' } = env
    plugins.push(viteCompression({
      // 压缩算法
      algorithm: VITE_COMPRESS_TYPE,
    }))
  }

  return plugins
}
