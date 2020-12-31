import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // FTP影片範例檔下載
  downloadVideoExample() {
    return http({
      url: '/v1/videoImportExample',
      method: 'get',
      responseType: 'blob',
    })
  },
  // FTP影片匯入預覽
  videoImportPreview(file) {
    return http({
      url: '/v1/videoImportPreviews',
      method: 'post',
      data: file,
      header: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })
  },
  // FTP影片匯入建檔
  addVideo(data) {
    return http({
      url: '/v1/videoImports',
      method: 'put',
      data,
    })
  },
  // 取得影片列表
  getVideoList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/videos?${urlQuery}`,
      method: 'get',
    })
  },
  // 影片批次設定
  videoBatchSetting(data) {
    return http({
      url: '/v1/videos',
      method: 'put',
      data,
    })
  },
  // 取得單筆影片資料
  getVideo(id) {
    return http({
      url: `/v1/videos/${id}`,
      method: 'get',
    })
  },
  // 更新影片
  updateVideo(data, id) {
    return http({
      url: `/v1/videos/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除影片
  deleteVideo(id) {
    return http({
      url: `/v1/videos/${id}`,
      method: 'delete',
    })
  },
}
