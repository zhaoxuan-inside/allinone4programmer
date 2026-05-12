import type { ApiLoginInfo } from '@/typings/api/login'
import { request } from '../http'

interface Ilogin {
  userName: string
  password: string
}

export function fetchLogin(data: Ilogin) {
  const methodInstance = request.Post<Service.ResponseResult<ApiLoginInfo>>('/login', data)
  methodInstance.meta = {
    authRole: null,
  }
  return methodInstance
}

export function fetchUpdateToken(data: any) {
  const method = request.Post<Service.ResponseResult<ApiLoginInfo>>('/updateToken', data)
  method.meta = {
    authRole: 'refreshToken',
  }
  return method
}

export function fetchUserRoutes(params: { id: number }) {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>('/getUserRoutes', { params })
}
