import http from '../http'

export default {
  // 取得帳密列表
  getSitePasswordsList(params) {
    return http({
      url: '/v1/sitePasswords',
      method: 'get',
      params,
    })
  },
  // 刪除帳密資料
  deleteSitePassword(id) {
    return http({
      url: `/v1/sitePasswords/${id}`,
      method: 'delete',
    })
  },
  // 新增帳密
  addSitePasswordList(data) {
    return http({
      url: '/v1/sitePasswords',
      method: 'post',
      data,
    })
  },
  // 取得單筆帳密資料
  getSitePassword(id) {
    return http({
      url: `/v1/sitePasswords/${id}`,
      method: 'get',
    })
  },
  // 更新帳密資料
  updateSitePassword(data, id) {
    return http({
      url: `/v1/sitePasswords/${id}`,
      method: 'patch',
      data,
    })
  },
  // 取得密碼
  getPassword(id) {
    return http({
      url: `/v1/sitePasswords/${id}/password`,
      method: 'get',
    })
  },
  // 取得帳密資料閱讀人員清單
  getPasswordsReaders(id) {
    return http({
      url: `/v1/sitePasswords/${id}/readers`,
      method: 'get',
    })
  },
  // 增加收藏帳密資料
  collectAccount(id) {
    return http({
      url: `/v1/sitePasswords/${id}/collect`,
      method: 'put',
    })
  },
  // 取消收藏帳號資料
  cancelCollectAccount(id) {
    return http({
      url: `/v1/sitePasswords/${id}/collect`,
      method: 'delete',
    })
  },
}
