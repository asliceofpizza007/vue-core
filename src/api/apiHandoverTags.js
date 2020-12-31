import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增交接標籤列表
  addHandoverTagsList(data) {
    return http({
      url: '/v1/handoverTags',
      method: 'post',
      data,
    })
  },
  // 取得交接標籤列表
  getHandoverTagsList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/handoverTags?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆交接標籤
  getHandoverTags(id) {
    return http({
      url: `/v1/handoverTags/${id}`,
      method: 'get',
    })
  },
  // 更新交接標籤
  updateHandoverTags(data, id) {
    return http({
      url: `/v1/handoverTags/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新交接標籤排序
  updateHandoverTagsSequence(data, id) {
    return http({
      url: `/v1/handoverTags/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除交接標籤
  deleteHandoverTags(id) {
    return http({
      url: `/v1/handoverTags/${id}`,
      method: 'delete',
    })
  },
  // 取得交接標籤選項組
  getHandoverTagOptions() {
    return http({
      url: '/v1/handoverTagOptions',
      method: 'get',
    })
  },

}
