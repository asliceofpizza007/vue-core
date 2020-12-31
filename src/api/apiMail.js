import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增站內信
  addMail(data) {
    return http({
      url: '/v1/privateMsgs',
      method: 'post',
      data,
    })
  },
  // 取得站內信列表
  getMailList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/privateMsgs?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆站內信資料
  getMail(id) {
    return http({
      url: `/v1/privateMsgs/${id}`,
      method: 'get',
    })
  },
  // 更新站內信資料
  updateMail(data, id) {
    return http({
      url: `/v1/privateMsgs/${id}`,
      method: 'patch',
      data,
    })
  },
  // 刪除站內信
  deleteMail(id) {
    return http({
      url: `/v1/privateMsgs/${id}`,
      method: 'delete',
    })
  },

  /** 發送 */
  // 寄送名單範例下載
  downloadMailExample() {
    return http({
      url: '/v1/msgReaderExample',
      method: 'get',
      responseType: 'blob',
    })
  },
  // 寄送名單預覽
  mailListPreview(file) {
    return http({
      url: '/v1/msgReaderPreviews',
      method: 'post',
      data: file,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  // 新增寄送會員
  addMailMember(data, id) {
    return http({
      url: `/v1/privateMsgs/${id}/msgReaders`,
      method: 'post',
      data,
    })
  },
  // 取得寄送會員列表
  getMailMemberList(params, id) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/privateMsgs/${id}/msgReaders?${urlQuery}`,
      method: 'get',
    })
  },
  // 刪除寄送會員
  deleteMailMember(id) {
    return http({
      url: `/v1/msgReaders/${id}`,
      method: 'delete',
    })
  },
}
