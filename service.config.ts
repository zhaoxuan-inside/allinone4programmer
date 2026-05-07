/** 不同请求服务的环境配置 */
export const serviceConfig: Record<ServiceEnvType, Record<string, string>> = {
  dev: {
    url: 'http://localhost:3000',
  },
  prod: {
    url: 'https://hardstone.org/home',
  },
}
