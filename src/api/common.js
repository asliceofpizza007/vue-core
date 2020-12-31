import axios from 'axios'
import http from './http'

export default {
  // 取得使用者偏好
  getUserPreference() {
    return http({
      url: '/v1/userPreferences',
      method: 'get',
    })
  },
  updateUserPreference(data) {
    return http({
      url: '/v1/userPreferences',
      method: 'post',
      data,
    })
  },
  // 登入
  login(data) {
    return http({
      url: '/v1/login',
      method: 'post',
      data,
    })
  },
  // 取得AV系統外連
  systemRedirect(token) {
    return axios({
      url: process.env.VUE_APP_EMS_REDIRECT + '/redirect/213',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
  },
  // 登出
  logout() {
    return http({
      url: '/v1/logout',
      method: 'post',
    })
  },
  // Token驗證
  getVerifiedToken(data) {
    return http({
      url: '/v1/authToken',
      method: 'post',
      data,
    })
  },
  refreshToken(data) {
    return http({
      url: '/v1/refreshToken',
      method: 'post',
      data,
    })
  },
  // 取得所有平台選項集
  getPlatformSet() {
    return http({
      url: '/v1/platformSet',
      method: 'get',
    })
  },
  // 切換平台
  switchPlatform(id) {
    return http({
      url: `/v1/switchPlatform/${id}`,
      method: 'put',
    })
  },
  // 上傳附檔
  fileUpload(data, channel = 'atch') {
    return http({
      url: `/v1/fileUpload/${channel}`,
      method: 'post',
      data,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  // 取得所有列舉對照清單
  getEnumRefs() {
    return http({
      url: '/v1/enumRefs',
      method: 'get',
    })
  },
  // 取得路由權限設定清單
  getPermissionList() {
    return http({
      url: '/v1/permissions',
      method: 'get',
    })
  },
  getMenuList() {
    return http({
      url: '/v1/menuList',
      method: 'get',
    })
  },
  // 取得所有路由權限清單
  getPermissionRoutes() {
    return http({
      url: '/v1/routerOptions',
      method: 'get',
    })
  },
  // 取得所有人員清單
  getAllEmployees() {
    return http({
      url: '/v1/hiddenEmployees',
      method: 'get',
    })
  },
}
