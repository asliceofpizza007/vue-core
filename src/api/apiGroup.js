import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增權限群組
  addPermissionGroup(data) {
    return http({
      url: '/v1/groups',
      method: 'post',
      data,
    })
  },
  // 取得權限群組列表
  getPermissionGroupList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/groups?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆權限群組資料
  getPermissionGroup(id) {
    return http({
      url: `/v1/groups/${id}`,
      method: 'get',
    })
  },
  // 更新權限群組資料
  updatePermissionGroup(data, id) {
    return http({
      url: `/v1/groups/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除權限群組
  deletePermissionGroup(id) {
    return http({
      url: `/v1/groups/${id}`,
      method: 'delete',
    })
  },
  // 取得權限群組選項清單
  getPermissionGroupOptions() {
    return http({
      url: '/v1/groupOptions',
      method: 'get',
    })
  },
}
