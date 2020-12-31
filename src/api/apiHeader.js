import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增頁首
  addHeader(data) {
    return http({
      url: '/v1/headerLinks',
      method: 'post',
      data,
    })
  },
  // 取得頁首列表
  getHeaderList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/headerLinks?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆頁首資料
  getHeader(id) {
    return http({
      url: `/v1/headerLinks/${id}`,
      method: 'get',
    })
  },
  // 更新頁首資料
  updateHeader(data, id) {
    return http({
      url: `/v1/headerLinks/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新頁首排序
  updateHeaderSequence(data, id) {
    return http({
      url: `/v1/headerLinks/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除頁首
  deleteHeader(id) {
    return http({
      url: `/v1/headerLinks/${id}`,
      method: 'delete',
    })
  },
}
