import {
  SET_APP_USER_PREFERENCES,
  SET_IS_MOBILE,
  SET_SIDEBAR_COLLAPSE,
  SET_SIDETAB_COLLAPSE,
  SET_HANDOVER_MESSAGE_SORT,
  SET_IS_URL_PUBLIC,
  SET_BULLETIN_EDITABLE,
  SET_ENUM_REFS,
  SET_PANEL_COMPONENTS,
  SET_PAGE_COMPONENTS,
  SET_FONT_SIZE,
  SET_LANG,
  SET_ALL_EMPLOYEES,
  SET_PAGE_SIZE_SELECT
} from '../mutation-types'

const state = {
  isMobile: false,
  isSideBarCollapse: false,   // 左側選單式收合
  isSideTabCollapse: false,   // 右側視窗是否收合
  handoverMessageSort: 'ASC', // 交接留言排序
  isUrlPublic: false,         // 交接開放連結
  isPrivate: false,    // 公告編輯
  // platformId: null,        // 平台id
  fontSize: 'normal',         // 字體大小
  enumRefs: {},               // 列舉對照清單
  pageSizeOption: {           // 頁數選項
    normal: [15, 30, 50],
    short: [10, 20, 40],
    large: [50, 100],
  },
  pageSizeSelect: {           // 頁數選擇(需與使用者偏好配合)
    normal: 15,
    short: 10,
    large: 50,
  },
  availablePanels: [],
  availablePages: [],
  allEmployees: null,
  lang: 'zh-TW',                 // 目前語系
  langMap: {                  // 語系選項
    'zh-TW': {
      label: '繁體中文',
      timeZone: 'Asia/Taipei',
    },
    'ja-JP': {
      label: '日本語',
      timeZone: 'Asia/Tokyo',
    },
  },
}

const mutations = {
  [SET_APP_USER_PREFERENCES](state, preferences) {
    Object.keys(preferences).forEach(key => {
      state[key] = preferences[key]
    })
  },
  [SET_IS_MOBILE](state) {
    state.isMobile = !state.isMobile
  },
  [SET_SIDEBAR_COLLAPSE](state) {
    state.isSideBarCollapse = !state.isSideBarCollapse
  },
  [SET_SIDETAB_COLLAPSE](state) {
    state.isSideTabCollapse = !state.isSideTabCollapse
  },
  [SET_HANDOVER_MESSAGE_SORT](state, val) {
    state.handoverMessageSort = val
  },
  [SET_IS_URL_PUBLIC](state, val) {
    state.isUrlPublic = val
  },
  [SET_BULLETIN_EDITABLE](state, status) {
    state.isPrivate = status
  },
  [SET_ENUM_REFS](state, refs) {
    state.enumRefs = refs
  },
  [SET_PANEL_COMPONENTS](state, availablePanels) {
    state.availablePanels = availablePanels
  },
  [SET_PAGE_COMPONENTS](state, availablePages) {
    state.availablePages = availablePages
  },
  [SET_FONT_SIZE](state, fontSize) {
    state.fontSize = fontSize
  },
  [SET_LANG](state, payload) {
    state.lang = payload
  },
  [SET_ALL_EMPLOYEES](state, allEmployees) {
    state.allEmployees = allEmployees
  },
  [SET_PAGE_SIZE_SELECT](state, params) {
    const {
      key,
      value,
    } = params
    state.pageSizeSelect[key] = value
  },
}

const actions = {
  setAppUserPreferences({ commit }, preferences) {
    commit(SET_APP_USER_PREFERENCES, preferences)
  },
  setIsMobile({ commit }) {
    commit(SET_IS_MOBILE)
  },
  setSideBarCollapse({ commit }) {
    commit(SET_SIDEBAR_COLLAPSE)
  },
  setSideTabCollapse({ commit }) {
    commit(SET_SIDETAB_COLLAPSE)
  },
  setHandoverMessageSort({ commit }, value) {
    commit(SET_HANDOVER_MESSAGE_SORT, value)
  },
  setIsUrlPublic({ commit }, value) {
    commit(SET_IS_URL_PUBLIC, value)
  },
  setIsPrivate({ commit }, status) {
    commit(SET_BULLETIN_EDITABLE, status)
  },
  setEnumRefs({ commit }, refs) {
    commit(SET_ENUM_REFS, refs)
  },
  setPanelComponents({ commit }, availablePanels) {
    commit(SET_PANEL_COMPONENTS, availablePanels)
  },
  setPageComponents({ commit }, availablePages) {
    commit(SET_PAGE_COMPONENTS, availablePages)
  },
  setFontSize({ commit }, fontSize) {
    commit(SET_FONT_SIZE, fontSize)
  },
  setLang({ commit }, payload) {
    commit(SET_LANG, payload)
  },
  setAllEmployees({ commit }, allEmployees) {
    commit(SET_ALL_EMPLOYEES, allEmployees)
  },
  setPageSizeSelect({ commit }, params) {
    commit(SET_PAGE_SIZE_SELECT, params)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
