import { local } from '@/utils'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import type { VueHookType } from 'alova/vue'
import {
  DEFAULT_ALOVA_OPTIONS,
  DEFAULT_BACKEND_OPTIONS,
} from './config'
import {
  handleBusinessError,
  handleRefreshToken,
  handleResponseError,
  handleServiceResult,
} from './handle'

const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<VueHookType>({
  // 服务端判定token过期
  refreshTokenOnSuccess: {
    // 当服务端返回401时，表示token过期
    isExpired: async (response, method) => {
      // response.clone()：克隆一个 Response 对象。因为 Response 的 **body** 只能被读取一次（比如调用 .json()、.text() 会消耗流），克隆后可以保留原始 response 供后续使用，同时对克隆体进行读取。
      // .json()：读取克隆体的 **body**，并解析为 JSON 格式，返回一个 Promise。
      // await：等待 Promise 完成，得到解析后的 JavaScript 对象，赋值给 res
      const res = await response.clone().json()

      const isExpired = method.meta && method.meta.isExpired
      // response.status 只是读取 HTTP 状态码，属于响应头的一部分，不会消耗 body 流
      return (response.status === 401 || res.code === 401) && !isExpired
    },

    // 当token过期时触发，在此函数中触发刷新token
    handler: async (_response, method) => {
      // 此处采取限制，防止过期请求无限循环重发
      if (!method.meta)
        method.meta = { isExpired: true }
      else
        method.meta.isExpired = true

      await handleRefreshToken()
    },
  },
  // 添加token到请求头
  assignToken: (method) => {
    method.config.headers.Authorization = `Bearer ${local.get('accessToken')}`
  },
})

// Alova 是一个轻量级的前端请求库，风格类似 axios，但提供了更灵活的缓存、状态管理等能力
export function createAlovaInstance(
  // alovaConfig：调用方传入的 Alova 配置（如 baseURL、timeout、自定义 beforeRequest 钩子等）
  alovaConfig: Service.AlovaConfig,
  // backendConfig：后端接口规范配置，例如接口返回的 code 字段名、表示成功的 code 值等。可选，若不传则使用默认值
  backendConfig?: Service.BackendConfig,
) {
  // ... 展开运算符，将对象进行浅层展开，常用于多个对象属性的合并
  const _backendConfig = { ...DEFAULT_BACKEND_OPTIONS, ...backendConfig }
  const _alovaConfig = { ...DEFAULT_ALOVA_OPTIONS, ...alovaConfig }

  return createAlova({
    // 表明该实例要与 Vue 的响应式系统集成（通常是 Vue 3 的 reactive/ref）。这样 Alova 返回的 useRequest 等组合式函数可以直接在 Vue 组件中使用，获得响应式状态。
    statesHook: VueHook,
    // 使用浏览器原生 fetch 作为底层请求适配器。也可以换成 adapterXHR，但 fetch 是更现代的选择。
    requestAdapter: adapterFetch(),
    // 关闭所有请求缓存。Alova 默认支持缓存策略，这里显式设置为 null 表示不缓存任何请求。
    cacheFor: null,
    baseURL: _alovaConfig.baseURL,
    timeout: _alovaConfig.timeout,

    // beforeRequest 是 alova 实例配置中的一个钩子，会在每个请求发送前执行。
    // onAuthRequired 是一个高阶函数，接收一个回调（(method) => {...}）并返回一个新函数。
    beforeRequest: onAuthRequired((method) => {
      if (method.meta?.isFormPost) {
        method.config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        method.data = new URLSearchParams(method.data as URLSearchParams).toString()
      }
      alovaConfig.beforeRequest?.(method)
    }),

    // responded：alova 实例配置中的一个钩子，在请求得到响应后执行（无论成功或失败）
    // onResponseRefreshToken：一个高阶函数，接收一个配置对象（包含 onSuccess、onError 等），返回一个函数赋值给 responded。
    responded: onResponseRefreshToken({
      // 请求成功的拦截器
      // response：原生的 Fetch API 响应对象（因为 alova 默认使用 fetch 适配器）
      // method：当前请求的 method 对象，包含 meta、config 等属性
      onSuccess: async (response, method) => {
        // 使用解构赋值从 response 对象中取出 status 属性
        const { status } = response

        if (status === 200) {
          // 返回blob数据
          if (method.meta?.isBlob)
            // response.blob()：读取响应体为 Blob 对象（常用于文件下载）
            return response.blob()

          // 返回 data 数据
          const apiData = await response.json()
          // 请求成功
          if (apiData[_backendConfig.codeKey] === _backendConfig.successCode)
            return handleServiceResult(apiData)

          // 业务请求失败
          const errorResult = handleBusinessError(apiData, _backendConfig)
          return handleServiceResult(errorResult, false)
        }
        // 接口请求失败
        const errorResult = handleResponseError(response)
        return handleServiceResult(errorResult, false)
      },

      // error：错误对象，包含错误信息（如 error.message）、堆栈、状态码等。
      // method：当前请求的 method 对象，包含请求类型（type：'GET'、'POST' 等）、url、meta 等信息
      onError: (error, method) => {
        const tip = `[${method.type}] - [${method.url}] - ${error.message}`
        window.$message?.warning(tip)
      },

      onComplete: async (_method) => {
        // 处理请求完成逻辑
      },
    }),
  })
}
