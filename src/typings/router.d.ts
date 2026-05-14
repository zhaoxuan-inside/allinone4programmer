// TypeScript 中的模块增强（Module Augmentation）用法，用于扩展 vue-router 库原有的类型定义
import 'vue-router'

// TypeScript 的类型声明语法
// TypeScript 对指定模块（此处为 'vue-router'）进行额外的类型定义。
// 如果模块原本已有类型声明，则里面的内容会与原有声明合并（Declaration Merging）
declare module 'vue-router' {
  // interface RouteMeta：声明一个名为 RouteMeta 的接口。vue-router 库中本来就已经有一个 RouteMeta 接口（用于定义路由元信息的类型）
  // extends AppRoute.RouteMeta：表示新声明的 RouteMeta 接口继承自 AppRoute.RouteMeta。也就是说，最终的 RouteMeta 类型会包含 AppRoute.RouteMeta 中定义的所有属性/方法
  // {}：花括号内为空，表示没有在此基础上添加新的成员。这样做等价于 “将 vue-router 原有的 RouteMeta 接口重新定义为 AppRoute.RouteMeta 类型”
  interface RouteMeta extends AppRoute.RouteMeta {}
}

// 经过上述声明后，在使用 Vue Router 的地方（比如 $route.meta、definePage 的 meta 选项、路由守卫中的 to.meta 等），
// TypeScript 会识别出 meta 对象的类型就是 AppRoute.RouteMeta，从而获得完整的类型提示和检查。
