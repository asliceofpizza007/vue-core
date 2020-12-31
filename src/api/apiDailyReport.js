import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 取得日報表列表
  getDailyReportList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/dailyReports?${urlQuery}`,
      method: 'get',
    })
  },
  // 匯出日報表 Excel
  exportDailyReport(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/dailyReports/exportExcel?${urlQuery}`,
      method: 'post',
    })
  },
}
