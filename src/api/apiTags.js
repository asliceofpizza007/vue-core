import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增標籤
  addTag(data) {
    return http({
      url: '/v1/videoTags',
      method: 'post',
      data,
    })
  },
  // 取得標籤列表
  getTagList(params = {}) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/videoTags?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆標籤資料
  getTag(id) {
    return http({
      url: `/v1/videoTags/${id}`,
      method: 'get',
    })
  },
  // 更新標籤資料
  updateTag(data, id) {
    return http({
      url: `/v1/videoTags/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除標籤
  deleteTag(id) {
    return http({
      url: `/v1/videoTags/${id}`,
      method: 'delete',
    })
  },
}
