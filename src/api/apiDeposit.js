import http from './http'

export default {
  // 取得存款天數設定
  getDepositSetting() {
    return http({
      url: '/v1/depositConditionConfig',
      method: 'get',
    })
  },
  // 更新存款天數設定
  updateDepositSetting(data) {
    return http({
      url: '/v1/depositConditionConfig',
      method: 'patch',
      data,
    })
  },
}
