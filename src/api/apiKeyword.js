import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 取得關鍵字列表
  getKeywordList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/keywords?${urlQuery}`,
      method: 'get',
    })
  },
  // 產生關鍵字排序
  createKeywordSequence(data) {
    return http({
      url: '/v1/keywords',
      method: 'put',
      data,
    })
  },
  // 移除關鍵字排行
  removeKeyowordRank(id) {
    return http({
      url: `/v1/keywords/${id}`,
      method: 'delete',
    })
  },
  // 排序關鍵字
  keywordSequence(data, id) {
    return http({
      url: `/v1/keywords/${id}`,
      method: 'put',
      data,
    })
  },
}
