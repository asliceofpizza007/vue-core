import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增公告資料
  addBulletins(data) {
    return http({
      url: '/v1/bulletins',
      method: 'post',
      data,
    })
  },
  // 取得公告資料列表
  getBulletinsList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/bulletins?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆公告資料
  getBulletins(id) {
    return http({
      url: `/v1/bulletins/${id}`,
      method: 'get',
    })
  },
  // 更新公告資料
  updateBulletins(data, id) {
    return http({
      url: `/v1/bulletins/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除公告資料
  deleteBulletins(id) {
    return http({
      url: `/v1/bulletins/${id}`,
      method: 'delete',
    })
  },
  // 取得公告主次分類選項組
  getbulletinClassOptions() {
    return http({
      url: '/v1/bulletinClassOptions',
      method: 'get',
    })
  },
  // 取得公告資料閱讀人員清單
  getBulletinsReaders(id) {
    return http({
      url: `/v1/bulletins/${id}/readers`,
      method: 'get',
    })
  },
  // 更新公告已讀
  updateBulletinsRead(id) {
    return http({
      url: `/v1/bulletins/${id}/read`,
      method: 'put',
    })
  },
  // 取得公告摘要清單
  getBulletinSummaries() {
    return http({
      url: '/v1/bulletinSummaries',
      method: 'get',
    })
  },
}
