import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增頁尾
  addFooter(data) {
    return http({
      url: '/v1/footerLinks',
      method: 'post',
      data,
    })
  },
  // 取得頁尾列表
  getFooterList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/footerLinks?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆頁尾資料
  getFooter(id) {
    return http({
      url: `/v1/footerLinks/${id}`,
      method: 'get',
    })
  },
  // 更新頁尾資料
  updateFooter(data, id) {
    return http({
      url: `/v1/footerLinks/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新頁尾排序
  updateFooterSequence(data, id) {
    return http({
      url: `/v1/footerLinks/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除頁尾
  deleteFooter(id) {
    return http({
      url: `/v1/footerLinks/${id}`,
      method: 'delete',
    })
  },
}
