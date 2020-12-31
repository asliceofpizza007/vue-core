import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增委外廠商列表
  addContractorsList(data) {
    return http({
      url: '/v1/contractors',
      method: 'post',
      data,
    })
  },
  // 取得委外廠商列表
  getContractorsList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/contractors?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆委外廠商
  getContractors(id) {
    return http({
      url: `/v1/contractors/${id}`,
      method: 'get',
    })
  },
  // 更新委外廠商
  updateContractors(data, id) {
    return http({
      url: `/v1/contractors/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除委外廠商
  deleteContractors(id) {
    return http({
      url: `/v1/contractors/${id}`,
      method: 'delete',
    })
  },
  // 取得委外廠商聯絡人清單
  getLiaisonsOptions(code) {
    return http({
      url: `/v1/contractors/${code}/liaisons`,
      method: 'get',
    })
  },
  // 取得委外廠商選項組
  getContractorOptions() {
    return http({
      url: '/v1/contractorOptions',
      method: 'get',
    })
  },

}
