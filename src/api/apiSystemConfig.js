import http from './http'

export default {
  // 取得系統設定
  getSystemConfigsList() {
    return http({
      url: '/v1/systemConfigs',
      method: 'get',
    })
  },
  // 更新系統設定
  updateSystemConfigs(data) {
    return http({
      url: '/v1/systemConfigs',
      method: 'put',
      data,
    })
  },
}
