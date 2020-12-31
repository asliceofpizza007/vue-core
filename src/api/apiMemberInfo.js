import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增會員
  addMember(data) {
    return http({
      url: '/v1/members',
      method: 'post',
      data,
    })
  },
  // 取得會員列表
  getMemberList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/members?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆會員資料
  getMember(id) {
    return http({
      url: `/v1/members/${id}`,
      method: 'get',
    })
  },
  // 更新會員資料
  updateMember(data, id) {
    return http({
      url: `/v1/members/${id}`,
      method: 'patch',
      data,
    })
  },
  // 取得會員登入記錄列表
  getMemberLoginRecordList(params, id) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/members/${id}/loginRecords?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得會員觀賞記錄列表
  getMemberViewRecordList(params, id) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/members/${id}/viewRecords?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得會員存款記錄列表
  getMemberDepositRecordList(params, id) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/members/${id}/depositRecords?${urlQuery}`,
      method: 'get',
    })
  },
  // 匯出會員資料 Excel
  exportMemberInfo(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/members/exportExcel?${urlQuery}`,
      method: 'post',
      responseType: 'blob',
    })
  },
}
