import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增交接資訊
  addHandoversInfo(data) {
    return http({
      url: '/v1/handovers',
      method: 'post',
      data,
    })
  },
  // 取得交接資訊列表
  getHandoversInfoList(params) {
    return http({
      url: '/v1/handovers',
      method: 'get',
      params,
    })
  },
  // 取得單筆交接資訊
  getHandoversInfo(id) {
    return http({
      url: `/v1/handovers/${id}`,
      method: 'get',
    })
  },
  // 更新交接資訊
  updateHandoversInfo(data, id) {
    return http({
      url: `/v1/handovers/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除交接資訊
  deleteHandoversInfo(id) {
    return http({
      url: `/v1/handovers/${id}`,
      method: 'delete',
    })
  },
  // 取得交接類別與標籤對應清單
  getHandoverTypeTags() {
    return http({
      url: '/v1/handoverTypeTags',
      method: 'get',
    })
  },
  // 取得交接資訊閱讀人員清單
  getHandoversReaders(id) {
    return http({
      url: `/v1/handovers/${id}/readers`,
      method: 'get',
      id,
    })
  }, // 取得交接資訊負責人員清單
  getHandoversEditors(id) {
    return http({
      url: `/v1/handovers/%${id}/editors`,
      method: 'get',
      id,
    })
  },
  // 更新交接結案
  updateHandoversclose(id) {
    return http({
      url: `/v1/handovers/${id}/close`,
      method: 'put',
      id,
    })
  },
  // 更新交接已讀
  updateHandoversRead(data) {
    return http({
      url: '/v1/handoverRead',
      method: 'put',
      data,
    })
  },
  // 新增收藏交接
  addHandoversRcollect(id) {
    return http({
      url: `/v1/handovers/${id}/collect`,
      method: 'put',
      id,
    })
  },
  // 取消收藏交接
  deleteHandoverscollect(id) {
    return http({
      url: `/v1/handovers/${id}/collect`,
      method: 'delete',
    })
  },
  // 取得交接資訊公開連結
  getPublicUrl(id) {
    return http({
      url: `/v1/handovers/${id}/publicUrl`,
      method: 'get',
    })
  },
  // 取得單筆公開交接資訊
  getPublicHandovers(accessKey) {
    return http({
      url: `/v1/publicHandovers/${accessKey}`,
      method: 'get',
      dropBearerToken: true,
    })
  },
  // 新增交接留言
  addHandoverMsgs(id, data) {
    return http({
      url: `/v1/handovers/${id}/handoverMsgs`,
      method: 'post',
      data,
    })
  },
  // 取得交接留言列表
  getHandoverMsgsList(id, params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/handovers/${id}/handoverMsgs?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆交接留言
  getHandoverMsgs(id) {
    return http({
      url: `v1/handoverMsgs/${id}`,
      method: 'get',
    })
  },
  // 更新交接留言
  updateHandoverMsgs(id, data) {
    return http({
      url: `/v1/handoverMsgs/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除交接留言
  deleteHandoverMsgs(id) {
    return http({
      url: `/v1/handoverMsgs/${id}`,
      method: 'delete',
    })
  },
}
