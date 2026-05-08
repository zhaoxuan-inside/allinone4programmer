// 引入 UnoCSS 生成的原子化样式表。UnoCSS 是即时按需生成的 CSS 引擎，这行代码确保样式被加载到全局
import 'uno.css'
// 引入项目内部的全局自定义样式文件（@ 通常是路径别名，指向 src 目录）。这里可以放基础重置、主题变量或覆盖样式。
import '@/styles/index.css'

export function install() {
}
