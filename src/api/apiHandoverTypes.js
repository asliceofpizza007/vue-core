import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增交接類別列表
  addHandoverTypesList(data) {
    return http({
      url: '/v1/handoverTypes',
      method: 'post',
      data,
    })
  },
  // 取得交接類別列表
  getHandoverTypesList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/handoverTypes?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆交接類別
  getHandoverTypes(id) {
    return http({
      url: `/v1/handoverTypes/${id}`,
      method: 'get',
    })
  },
  // 更新交接類別
  updateHandoverTypes(data, id) {
    return http({
      url: `/v1/handoverTypes/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新交接類別排序
  updateHandoverTypesSequence(data, id) {
    return http({
      url: `/v1/handoverTypes/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除交接類別
  deleteHandoverTypes(id) {
    return http({
      url: `/v1/handoverTypes/${id}`,
      method: 'delete',
    })
  },
}
