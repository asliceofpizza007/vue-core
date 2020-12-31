import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增廣告圖
  addAdvertise(data) {
    return http({
      url: '/v1/advertisements',
      method: 'post',
      data,
    })
  },
  // 取得廣告圖列表
  getAdvertiseList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/advertisements?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆廣告圖資料
  getAdvertise(id) {
    return http({
      url: `/v1/advertisements/${id}`,
      method: 'get',
    })
  },
  // 更新廣告圖資料
  updateAdvertise(data, id) {
    return http({
      url: `/v1/advertisements/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除廣告圖
  deleteAdvertise(id) {
    return http({
      url: `/v1/advertisements/${id}`,
      method: 'delete',
    })
  },
}
