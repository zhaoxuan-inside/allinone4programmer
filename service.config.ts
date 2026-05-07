/** 不同请求服务的环境配置 */
export const serviceConfig: Record<ServiceEnvType, Record<string, string>> = {
  dev: {
    url: 'http://localhost:3000',
  },
  production: {
    url: 'https://hardstone.org/home',
  },
}
