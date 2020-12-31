import http from './http'

export default {
  // 新增系統選單
  addSystemNav(data) {
    return http({
      url: '/v1/systemMenus',
      method: 'post',
      data,
    })
  },
  // 取得系統選單列表
  getSystemNavList() {
    return http({
      url: '/v1/systemMenus',
      method: 'get',
    })
  },
  // 取得單筆系統選單資料
  getSystemNav(id) {
    return http({
      url: `/v1/systemMenus/${id}`,
      method: 'get',
    })
  },
  // 更新系統選單資料
  updateSystemNav(data, id) {
    return http({
      url: `/v1/systemMenus/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除系統選單
  deleteSystemNav(id) {
    return http({
      url: `/v1/systemMenus/${id}`,
      method: 'delete',
    })
  },
  // 更新樹狀系統選單排序
  updateSystemNavSequence(data) {
    return http({
      url: '/v1/systemMenuSequence',
      method: 'put',
      data,
    })
  },
  // 取得樹狀系統選單排序
  getSystemNavSequence() {
    return http({
      url: '/v1/systemMenuSequence',
      method: 'get',
    })
  },
}
