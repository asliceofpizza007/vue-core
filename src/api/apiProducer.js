import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增片商
  addProducer(data) {
    return http({
      url: '/v1/videoCompanies',
      method: 'post',
      data,
    })
  },
  // 取得片商列表
  getProducerList(params = {}) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/videoCompanies?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆片商資料
  getProducer(id) {
    return http({
      url: `/v1/videoCompanies/${id}`,
      method: 'get',
    })
  },
  // 更新片商資料
  updateProducer(data, id) {
    return http({
      url: `/v1/videoCompanies/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除片商
  deleteProducer(id) {
    return http({
      url: `/v1/videoCompanies/${id}`,
      method: 'delete',
    })
  },
}
