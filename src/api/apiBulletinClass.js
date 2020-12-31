import { assemblyParams } from '@/utils'
import http from './http'

export default {
  // 新增公告主分類
  addBulletinMain(data) {
    return http({
      url: '/v1/bulletinMainClasses',
      method: 'post',
      data,
    })
  },
  // 取得公告主分類列表
  getBulletinMainList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/bulletinMainClasses?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆公告主分類
  getBulletinMain(id) {
    return http({
      url: `/v1/bulletinMainClasses/${id}`,
      method: 'get',
    })
  },
  // 更新公告主分類
  updateBulletinMain(data, id) {
    return http({
      url: `/v1/bulletinMainClasses/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新公告主分類排序
  updateBulletinMainSequence(data, id) {
    return http({
      url: `/v1/bulletinMainClasses/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除公告主分類
  deleteBulletinMainClass(id) {
    return http({
      url: `/v1/bulletinMainClasses/${id}`,
      method: 'delete',
    })
  },
  // 新增公告次分類
  addBulletinSub(data, mainId) {
    return http({
      url: `/v1/bulletinMainClasses/${mainId}/subClasses`,
      method: 'post',
      data,
    })
  },
  // 取得公告次分類列表
  getBulletinSubList(params, mainId) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/bulletinMainClasses/${mainId}/subClasses?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆公告次分類
  getBulletinSub(id) {
    return http({
      url: `/v1/bulletinSubClasses/${id}`,
      method: 'get',
    })
  },
  // 更新公告次分類
  updateBulletinSub(data, id) {
    return http({
      url: `/v1/bulletinSubClasses/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新公告次分類排序
  updateBulletinSubSequence(data, id) {
    return http({
      url: `/v1/bulletinSubClasses/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除公告次分類
  deleteBulletinSubClass(id) {
    return http({
      url: `/v1/bulletinSubClasses/${id}`,
      method: 'delete',
    })
  },
}
