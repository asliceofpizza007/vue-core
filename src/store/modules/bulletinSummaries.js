import deepGet from 'lodash/get'
import apiBulletins from '@api/apiBulletins'
import {
  SET_BULLETIN_SUMMARIES,
  SET_HASHMAP,
  SET_UNREAD_COUNT
} from '../mutation-types'

const state = {
  bulletinSummaries: [],
  hashMap: {},
  totalUnread: 0,
}

const mutations = {
  [SET_BULLETIN_SUMMARIES](state, bulletinSummaries) {
    state.bulletinSummaries = bulletinSummaries
  },
  [SET_HASHMAP](state, bulletinSummaries) {
    const map = {}
    let totalUnread = 0
    bulletinSummaries.forEach((mainCat, mainIndex) => {
      mainCat.list.forEach((subCat, subIndex) => {
        subCat.list.forEach((bulletin, index) => {
          if (bulletin) {
            map[bulletin.id] = `[${mainIndex}].list[${subIndex}].list[${index}]`
            totalUnread += !bulletin.isRead
          }
        })
      })
    })
    state.hashMap = map
    state.totalUnread = totalUnread
  },
  [SET_UNREAD_COUNT](state, { id, status }) {
    const bulletin = deepGet(state.bulletinSummaries, state.hashMap[id])
    bulletin.isRead = status
    state.totalUnread -= 1
  },
}

const actions = {
  async getBulletinSummaries({ commit }) {
    const bulletinSummaries = await apiBulletins.getBulletinSummaries()
    commit(SET_BULLETIN_SUMMARIES, bulletinSummaries)
    commit(SET_HASHMAP, bulletinSummaries)
  },
  updateUnread({ commit }, id) {
    commit(SET_UNREAD_COUNT, { id, status: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
