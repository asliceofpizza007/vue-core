import { assemblyParams } from '@/utils'
import http from '../http'

export default {
  // 新增動態必填
  addSiteDynamicRequiredList(data) {
    return http({
      url: '/v1/siteDynamicRequireds',
      method: 'post',
      data,
    })
  },
  // 取得動態必填列表
  getSiteDynamicRequiredList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/siteDynamicRequireds?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆動態必填
  getSiteDynamicRequired(id) {
    return http({
      url: `/v1/siteDynamicRequireds/${id}`,
      method: 'get',
    })
  },
  // 更新動態必填
  updateSiteDynamicRequired(data, id) {
    return http({
      url: `/v1/siteDynamicRequireds/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除動態必填
  deleteSiteDynamicRequired(id) {
    return http({
      url: `/v1/siteDynamicRequireds/${id}`,
      method: 'delete',
    })
  },
}
