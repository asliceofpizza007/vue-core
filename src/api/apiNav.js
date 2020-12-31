import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 取得選單列表
  getNavList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/menus?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆選單資料
  getNav(id) {
    return http({
      url: `/v1/menus/${id}`,
      method: 'get',
    })
  },
  // 更新選單資料
  updateNav(data, id) {
    return http({
      url: `/v1/menus/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新選單排序
  updateNavSequence(data, id) {
    return http({
      url: `/v1/menus/${id}`,
      method: 'put',
      data,
    })
  },
}
