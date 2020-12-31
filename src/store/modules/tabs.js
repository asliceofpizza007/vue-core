import { cloneDeep } from 'lodash'
import {
  SET_TAB_USER_PREFERENCES,
  SET_TABS,
  CLOSE_TAB,
  SORT_TABS,
  SET_TAB_STATUS,
  SET_RECORD_TABS,
  UPDATE_TAB
} from '../mutation-types'

const state = {
  tabs: [],
  steps: 0,
  gap: 0,
  isRecordTabs: false,
}

const mutations = {
  [SET_TAB_USER_PREFERENCES](state, preferences) {
    Object.keys(preferences).forEach(key => {
      state[key] = preferences[key]
    })
  },
  [SET_TABS](state, tab) {
    const hasTab = state.tabs.findIndex(el => el.menuCode === tab.menuCode)
    if (hasTab === -1) {
      state.tabs.push(tab)
    }
  },
  [CLOSE_TAB](state, tab) {
    const hasTab = state.tabs.findIndex(el => el.menuCode === tab.menuCode)
    if (hasTab !== -1) {
      state.tabs.splice(hasTab, 1)
    }
  },
  [SORT_TABS](state, load) {
    const { oldIndex, newIndex } = load
    const temp = cloneDeep(state.tabs)
    temp.splice(oldIndex, 1)
    temp.splice(newIndex, 0, state.tabs[oldIndex])
    state.tabs = temp
  },
  [SET_TAB_STATUS](state, status) {
    state.steps = status.steps
    state.gap = status.gap
  },
  [SET_RECORD_TABS](state) {
    state.isRecordTabs = !state.isRecordTabs
  },
  [UPDATE_TAB](state, tab) {
    const tabIndex = state.tabs.findIndex(el => el.id === tab.id)
    if (tabIndex !== -1) {
      const {
        menuCode,
        link,
        actions,
        title,
      } = tab
      const currentTab = state.tabs[tabIndex]
      currentTab.menuCode = menuCode
      currentTab.link = link
      currentTab.actions = actions
      currentTab.title = title
    }
  },
}

const actions = {
  setTabUserPreferences({ commit }, preferences) {
    commit(SET_TAB_USER_PREFERENCES, preferences)
  },
  setTabs({ commit }, tab) {
    commit(SET_TABS, tab)
  },
  closeTab({ commit }, tab) {
    commit(CLOSE_TAB, tab)
  },
  sortTabs({ commit }, load) {
    commit(SORT_TABS, load)
  },
  setTabStatus({ commit }, status) {
    commit(SET_TAB_STATUS, status)
  },
  setRecordtabs({ commit }) {
    commit(SET_RECORD_TABS)
  },
  updateTab({ commit }, tab) {
    commit(UPDATE_TAB, tab)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
