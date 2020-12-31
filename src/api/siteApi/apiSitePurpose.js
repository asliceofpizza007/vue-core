import { assemblyParams } from '@/utils'
import http from '../http'

export default {
  // 新增站用途別
  addSitePurposeList(data) {
    return http({
      url: '/v1/sitePurposes',
      method: 'post',
      data,
    })
  },
  // 取得站用途別列表
  getSitePurposeList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/sitePurposes?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆站用途別
  getSitePurpose(id) {
    return http({
      url: `/v1/sitePurposes/${id}`,
      method: 'get',
    })
  },
  // 更新站用途別
  updateSitePurpose(data, id) {
    return http({
      url: `/v1/sitePurposes/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除用途別
  deleteSitePurpose(id) {
    return http({
      url: `/v1/sitePurposes/${id}`,
      method: 'delete',
    })
  },
  // 取得用途別下拉清單
  getSitePurposeOptions() {
    return http({
      url: '/v1/sitePurposeOptions',
      method: 'get',
    })
  },
  // 取得用途別動態必填清單
  getSiteDynamicRequireds(id) {
    return http({
      url: `/v1/sitePurposes/${id}/dynamicRequireds`,
      method: 'get',
    })
  },
}
