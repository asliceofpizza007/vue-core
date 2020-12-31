import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增輪播圖
  addSlideBanner(data) {
    return http({
      url: '/v1/slideBanners',
      method: 'post',
      data,
    })
  },
  // 取得輪播圖列表
  getSlideBannerList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/slideBanners?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆輪播圖資料
  getSlideBanner(id) {
    return http({
      url: `/v1/slideBanners/${id}`,
      method: 'get',
    })
  },
  // 更新輪播圖資料
  updateSlideBanner(data, id) {
    return http({
      url: `/v1/slideBanners/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新輪播圖排序
  updateSlideBannerSequence(data, id) {
    return http({
      url: `/v1/slideBanners/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除輪播圖
  deleteSlideBanner(id) {
    return http({
      url: `/v1/slideBanners/${id}`,
      method: 'delete',
    })
  },
}
