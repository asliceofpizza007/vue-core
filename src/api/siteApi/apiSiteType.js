import { assemblyParams } from '@/utils'
import http from '../http'

export default {
  // 新增類別
  addSiteTypeList(data) {
    return http({
      url: '/v1/siteTypes',
      method: 'post',
      data,
    })
  },
  // 取得類別列表
  getSiteTypeList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/siteTypes?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆類別
  getSiteType(id) {
    return http({
      url: `/v1/siteTypes/${id}`,
      method: 'get',
    })
  },
  // 更新類別
  updateSiteType(data, id) {
    return http({
      url: `/v1/siteTypes/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除類別
  deleteSiteType(id) {
    return http({
      url: `/v1/siteTypes/${id}`,
      method: 'delete',
    })
  },
  // 取得類別下拉清單
  getSiteTypeOptions() {
    return http({
      url: '/v1/siteTypeOptions',
      method: 'get',
    })
  },
}
