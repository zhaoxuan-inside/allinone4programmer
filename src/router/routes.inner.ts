import type { RouteRecordRaw } from 'vue-router'

/* 页面中的一些固定路由，错误页等 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    children: [
    ],
  },
  {
    path: '/login',
    name: 'login',
    // 懒加载的组件定义，只有在真正访问的时候才会去加在组件
    component: () =>
      // 使用 ES 模块的动态导入语法，返回一个 Promise
      import('@/views/build-in/login/index.vue'),
    // meta 是路由的元信息字段，可以自定义任意数据，供路由守卫、全局组件等逻辑使用
    meta: {
      // 通常用于动态设置浏览器标签页的标题（document.title）。
      // 在全局路由守卫 router.afterEach 中，可以使用 to.meta.title 来更新页面标题。
      title: '登录',
      // 自定义属性，表示当前页面不显示标签页导航
      withoutTab: true,
    },
  },
  {
    path: '/public',
    name: 'publicAccess',
    component: () => import('@/views/build-in/public-access/index.vue'),
    meta: {
      title: '公共访问示例',
      requiresAuth: false,
      withoutTab: true,
    },
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('@/views/build-in/not-found/index.vue'),
    meta: {
      title: '找不到页面',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/build-in/not-found/index.vue'),
    name: 'not-found',
    meta: {
      title: '找不到页面',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },

]
