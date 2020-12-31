import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增平台
  addPlatform(data) {
    return http({
      url: '/v1/platforms',
      method: 'post',
      data,
    })
  },
  // 取得平台列表
  getPlatformList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/platforms?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆平台資料
  getPlatform(id) {
    return http({
      url: `/v1/platforms/${id}`,
      method: 'get',
    })
  },
  // 更新平台資料
  updatePlatform(data, id) {
    return http({
      url: `/v1/platforms/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除平台
  deletePlatform(id) {
    return http({
      url: `/v1/platforms/${id}`,
      method: 'delete',
    })
  },
}
