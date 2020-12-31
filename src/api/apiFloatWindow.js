import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增浮動視窗
  addFloatWindow(data) {
    return http({
      url: '/v1/floatWindow',
      method: 'post',
      data,
    })
  },
  // 取得浮動視窗列表
  getFloatWindowList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/floatWindow?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆浮動視窗資料
  getFloatWindow(id) {
    return http({
      url: `/v1/floatWindows/${id}`,
      method: 'get',
    })
  },
  // 更新浮動視窗資料
  updateFloatWindow(data, id) {
    return http({
      url: `/v1/floatWindows/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除浮動視窗
  deleteFloatWindow(data, id) {
    return http({
      url: `/v1/floatWindows/${id}`,
      method: 'patch',
      data,
    })
  },
}
