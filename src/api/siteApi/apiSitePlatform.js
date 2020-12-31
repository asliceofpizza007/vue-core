import { assemblyParams } from '@/utils'
import http from '../http'

export default {
  // 新增站台別
  addSitePlatformList(data) {
    return http({
      url: '/v1/sitePlatforms',
      method: 'post',
      data,
    })
  },
  // 取得站台別列表
  getSitePlatformList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/sitePlatforms?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆站台別
  getSitePlatform(id) {
    return http({
      url: `/v1/sitePlatforms/${id}`,
      method: 'get',
    })
  },
  // 更新站台別
  updateSitePlatform(data, id) {
    return http({
      url: `/v1/sitePlatforms/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除台別
  deleteSitePlatform(id) {
    return http({
      url: `/v1/sitePlatforms/${id}`,
      method: 'delete',
    })
  },
  // 取得站台別下拉清單
  getSitePlatformOptions() {
    return http({
      url: '/v1/sitePlatformOptions',
      method: 'get',
    })
  },
}
