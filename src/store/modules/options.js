import apiBulletins from '@api/apiBulletins'
import apiHandovers from '@api/apiHandovers'
import {
  SET_BULLETIN_CLASS_LIST,
  SET_HANDOVER_TYPE_LIST,
  SET_HANDOVER_TAG_LIST,
  SET_CONTRACTOR_LIST,
  SET_SITE_PLATFORM_LIST,
  SET_SITE_TYPE_LIST,
  SET_SITE_PURPOSE_LIST
} from '../mutation-types'

const state = {
  bulletinClassList: [],
  handoverTypeList: [],
  handoverTagList: [],
  contractorList: [],
  sitePlatformList: [],
  siteTypeList: [],
  sitePurposeList: [],
}

const mutations = {
  [SET_BULLETIN_CLASS_LIST](state, bulletinClassList) {
    state.bulletinClassList = bulletinClassList
  },
  [SET_HANDOVER_TYPE_LIST](state, handoverTypeList) {
    state.handoverTypeList = handoverTypeList
  },
  [SET_HANDOVER_TAG_LIST](state, handoverTagList) {
    state.handoverTagList = handoverTagList
  },
  [SET_CONTRACTOR_LIST](state, contractorList) {
    state.contractorList = contractorList
  },
  [SET_SITE_PLATFORM_LIST](state, sitePlatformList) {
    state.sitePlatformList = sitePlatformList
  },
  [SET_SITE_TYPE_LIST](state, siteTypeList) {
    state.siteTypeList = siteTypeList
  },
  [SET_SITE_PURPOSE_LIST](state, sitePurposeList) {
    state.sitePurposeList = sitePurposeList
  },
}

const actions = {
  async getBulletinClassList({ commit }) {
    const res = await apiBulletins.getbulletinClassOptions()
    commit(SET_BULLETIN_CLASS_LIST, res)
  },
  async getHandoverTypeList({ commit }) {
    const res = await apiHandovers.getHandoverTypeTags()
    commit(SET_HANDOVER_TYPE_LIST, res)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
