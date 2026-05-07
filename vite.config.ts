// 从 Node.js 内置的 path 模块导入 resolve 方法。
import {
  // 将相对路径或路径片段解析为绝对路径，用于后续设置别名
  resolve,
} from 'node:path'
import {
  defineConfig,
  // 根据当前运行模式（mode）加载指定目录下的环境变量文件
  loadEnv,
} from 'vite'
// 从相对路径 ./build/plugins 导入一个自定义函数 createVitePlugins
import {
  // 函数接收环境变量对象，返回一个 Vite 插件数组。
  createVitePlugins,
} from './build/plugins'

// 使用 defineConfig 并传入一个回调函数，回调的参数包含当前运行模式 mode（如 development、production）。
// 这种方式可以根据不同模式动态生成配置，而不是写死一个对象。
export default defineConfig(({ mode }) => {
  // 加载环境变量
  // as ImportMetaEnv：类型断言
  // 假设全局已定义 ImportMetaEnv 接口（通常在 vite-env.d.ts 中声明），让 TypeScript 知道 env 的形状（例如包含 VITE_BASE_URL 字段）
  const env = loadEnv(mode, __dirname, '') as ImportMetaEnv

  return {
    // 设置应用的基础路径（公共路径），对应构建后资源引用的前缀
    base: env.VITE_BASE_URL,
    // 调用自定义函数生成 Vite 插件列表，并传入环境变量，方便插件内部根据不同环境调整行为（如开发时启用热更新、生产时压缩代码）
    plugins: createVitePlugins(env),

    resolve: {
      // 设置模块路径别名。
      alias: {
        // 当代码中使用 @/components/Button.vue 导入时，Vite 会将其解析为 <项目根目录>/src/components/Button.vue
        // 使用 resolve(__dirname, 'src') 生成绝对路径，确保跨平台兼容。
        '@': resolve(__dirname, 'src'),
      },
    },
    // 配置开发服务器。
    server: {
      // host: '0.0.0.0'：监听所有网络接口，允许通过局域网 IP 或 localhost 访问。默认是 localhost（只有本机能访问）
      host: '0.0.0.0',
    },
    build: {
      // target: 'esnext'：指定构建输出的 ECMAScript 版本。esnext 表示生成最新特性的代码，不进行降级转换（适用于现代浏览器环境）
      target: 'esnext',
      // reportCompressedSize: false：构建完成后不报告各个包的压缩后大小。设为 false 可以略微提升构建速度，减少控制台输出。
      reportCompressedSize: false,
    },

    // 预构建依赖列表。Vite 在开发启动时会扫描代码中的裸模块导入（如 import 'echarts'），默认会预构建它们
    // 确保这些较大的依赖在开发服务器启动时就被预构建（优化为 ES 模块），避免运行时动态发现和转换，提升页面首次加载速度。
    optimizeDeps: {
      include: [
        // 数据可视化图表库。
        'echarts',
        // Markdown 编辑器组件
        'md-editor-v3',
        // 富文本编辑器
        'quill',
      ],
    },

    // 配置 CSS 预处理器
    css: {
      // preprocessorOptions：Vite中用于向 CSS 预处理器传递自定义编译选项的配置项。
      // 可以通过它来调整预处理器（如 SCSS/Sass、Less、Stylus）的行为
      preprocessorOptions: {
        // 使用 Sass 的 modern API
        scss: {
        },
      },
    },
  }
})
