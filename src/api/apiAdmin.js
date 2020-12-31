import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 取得管理員帳號列表
  getAdminList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/admins?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆管理員帳號資料
  getAdmin(id) {
    return http({
      url: `/v1/admins/${id}`,
      method: 'get',
    })
  },
  // 更新管理員帳號資料
  updateAdmin(data, id) {
    return http({
      url: `/v1/admins/${id}`,
      method: 'patch',
      data,
    })
  },
}
