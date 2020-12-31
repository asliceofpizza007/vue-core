import { assemblyParams } from '@/utils'
import http from './http'

export default {
  /** Main Categories */
  // 新增幫助主類別
  addMainCategories(data) {
    return http({
      url: '/v1/helpCenterMains',
      method: 'post',
      data,
    })
  },
  // 取得幫助主類別列表
  getMainCategoriesList(params) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/helpCenterMains?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆幫助主類別資料
  getMainCategories(id) {
    return http({
      url: `/v1/helpCenterMains/${id}`,
      method: 'get',
    })
  },
  // 更新幫助主類別資料
  updateMainCategories(data, id) {
    return http({
      url: `/v1/helpCenterMains/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新幫助主類別排序
  updateMainCategoriesSequence(data, id) {
    return http({
      url: `/v1/helpCenterMains/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除幫助主類別
  deleteMainCategories(id) {
    return http({
      url: `/v1/helpCenterMains/${id}`,
      method: 'delete',
    })
  },

  /** Sub Categories */
  // 新增幫助子類別
  addSubCategories(data, mainId) {
    return http({
      url: `/v1/helpCenterMains/${mainId}/helpCenterSubs`,
      method: 'post',
      data,
    })
  },
  // 取得幫助子類別列表
  getSubCategoriesList(params, mainId) {
    const urlQuery = assemblyParams(params)
    return http({
      url: `/v1/helpCenterMains/${mainId}/helpCenterSubs?${urlQuery}`,
      method: 'get',
    })
  },
  // 取得單筆幫助子類別資料
  getSubCategories(id) {
    return http({
      url: `/v1/helpCenterSubs/${id}`,
      method: 'get',
    })
  },
  // 更新幫助子類別資料
  updateSubCategories(data, id) {
    return http({
      url: `/v1/helpCenterSubs/${id}`,
      method: 'patch',
      data,
    })
  },
  // 更新幫助子類別排序
  updateSubCategoriesSequence(data, id) {
    return http({
      url: `/v1/helpCenterSubs/${id}`,
      method: 'put',
      data,
    })
  },
  // 刪除幫助子類別
  deleteSubCategories(id) {
    return http({
      url: `/v1/helpCenterMains/${id}`,
      method: 'delete',
    })
  },
}
