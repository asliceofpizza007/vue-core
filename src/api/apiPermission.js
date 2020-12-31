import http from './http'

export default {
  // 取得層級權限列表
  getPermissionList(id) {
    return http({
      url: `/v1/managerLevel/${id}/permissions`,
      method: 'get',
    })
  },
  // 修改單筆層級權限
  updatePermission(id) {
    return http({
      url: `/v1/managerLevel/${id}/permissions`,
      method: 'patch',
    })
  },
  // 取得權限(個人 已合併角色)
  getSelfPermission(id) {
    return http({
      url: `/v1/manager/${id}/permissions`,
      method: 'get',
    })
  },
}
