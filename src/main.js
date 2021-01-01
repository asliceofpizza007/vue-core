/* eslint-disable import/extensions */
import Vue from 'vue'

// 添加animate.css library
import animated from 'animate.css'

Vue.use(animated)

// set lang attribute by user's browser language
document.documentElement.setAttribute('lang', navigator.language)

/* Froala Editor */
// import 'froala-editor/js/froala_editor.pkgd.min'
// // Import third party plugins
// // import 'froala-editor/js/third_party/embedly.min'
// import 'froala-editor/js/third_party/font_awesome.min'
// import 'froala-editor/js/third_party/spell_checker.min'
// import 'froala-editor/js/third_party/image_tui.min'
// import 'froala-editor/js/languages/zh_tw'
// import 'font-awesome/css/font-awesome.css'
// import 'froala-editor/css/froala_editor.pkgd.min.css'
// import 'froala-editor/css/froala_style.min.css'

import VueFroala from 'vue-froala-wysiwyg'

Vue.use(VueFroala)
Vue.config.productionTip = false

/* ElementUI */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 使用繁體中文語言包
import locale from 'element-ui/lib/locale/lang/zh-TW'

Vue.use(ElementUI, {
  locale,
})

/* Treeselect */
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

Vue.component('Treeselect', Treeselect)

/** event bus */
const eventBus = {
  install() {
    Vue.prototype.$bus = new Vue()
  },
}
Vue.use(eventBus)

// 註冊jsPanel
import '@c/Panels/panels'

// 取得所有頁面組件
import '@/assets/js/pageComponents'

// global scss
import '@css/layout.scss'
import '@css/reset.scss'
import '@css/theme.scss'
import '@css/emsTheme.scss'

import App from './App'
import './router/navigation'
import router from './router'
import store from './store'
// 多語系
import i18n from './language'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render(h) { return h(App) },
}).$mount('#app')
