import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增平台廣告影片
  addPlatformAd(data) {
    return http({
      url: '/v1/videoADs',
      method: 'post',
      data,
    })
  },
  // 取得平台廣告影片列表
  getPlatformAdList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/videoADs?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆平台廣告影片資料
  getPlatformAd(id) {
    return http({
      url: `/v1/videoADs/${id}`,
      method: 'get',
    })
  },
  // 更新平台廣告影片資料
  updatePlatformAd(data, id) {
    return http({
      url: `/v1/videoADs/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除平台廣告影片
  deletePlatformAd(id) {
    return http({
      url: `/v1/videoADs/${id}`,
      method: 'delete',
    })
  },
  // 取得平台廣告影片預覽連結
  getPlatformAdPreviewLink(name) {
    return http({
      url: `/v1/videoADPreview/${name}`,
      method: 'get',
    })
  },
}
