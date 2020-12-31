import Vue from 'vue'
import Vuex from 'vuex'
import common from '@api/common'
import { debounce } from 'lodash'
import JsPanels from './modules/panels'
import app from './modules/app'
import tabs from './modules/tabs'
import menu from './modules/menu'
import bulletinSummaries from './modules/bulletinSummaries'
import options from './modules/options'

Vue.use(Vuex)

const getPreferencePostData = ({ app: appState, tabs: tabState }) => {
  const {
    isSideBarCollapse,
    isSideTabCollapse,
    fontSize,
    handoverMessageSort,
    isUrlPublic,
    isPrivate,
    pageSizeSelect,
  } = appState

  const {
    steps,
    gap,
    isRecordTabs,
  } = tabState

  const userPreferences = {
    appPreferences: {
      isSideBarCollapse,
      isSideTabCollapse,
      fontSize,
      handoverMessageSort,
      isUrlPublic,
      isPrivate,
      pageSizeSelect,
    },
    tabPreferences: {
      tabs: [],
      steps: 0,
      gap: 0,
      isRecordTabs,
    },
  }
  if (isRecordTabs) {
    userPreferences.tabPreferences = {
      tabs: tabState.tabs,
      steps,
      gap,
      isRecordTabs,
    }
  }

  return userPreferences
}

const actions = {
  updateUserPreferences: debounce(async ({ state }) => {
    const userPreferences = getPreferencePostData(state)
    const localPreferences = localStorage.getItem('userPreferences')
    const currentPreferences = JSON.stringify(userPreferences)
    const isSameSettings = (localPreferences === currentPreferences)
    if (!isSameSettings) {
      localStorage.setItem('userPreferences', currentPreferences)
      await common.updateUserPreference({ userPreferences: currentPreferences })
    }
  }, 1000),
  async updateUserPreferencesDirectly({ state }) {
    /** 此 action 僅供 logout 時使用，又 login 會重新取得 userPreferences，
     *  故無須將資料存入 localStorage  */
    const userPreferences = getPreferencePostData(state)
    const currentPreferences = JSON.stringify(userPreferences)
    await common.updateUserPreference({ userPreferences: currentPreferences })
  },
}

export default new Vuex.Store({
  strict: true,
  actions,
  modules: {
    app,
    tabs,
    JsPanels,
    menu,
    bulletinSummaries,
    options,
  },
})
