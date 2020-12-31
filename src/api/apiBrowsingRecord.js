import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 取得瀏覽記錄列表
  getBrowsingRecordList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/records?${urlQuery}`,
      method: 'get',
    })
  },
  // 匯出瀏覽記錄資料 Excel
  exportBrowsingRecord(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/records/exportExcel?${urlQuery}`,
      method: 'post',
      responseType: 'blob',
    })
  },
  // 取得單日登入者資料
  getLoginPerDay(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/loginRecords?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單日觀看者資料
  getViewerPerDay(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/viewRecords?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單日註冊者資料
  getRegisterPerDay(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/registerRecords?${urlQuery}`,
      method: 'get',
    })
  },
}
