import Vue from 'vue'
import store from '@/store'
import VueJsPanel from 'vue-js-panel/src'
import Iframe from '@c/Iframe'
import 'jspanel4/dist/jspanel.min.css'
import '@css/panels.scss'

Vue.use(VueJsPanel)

// 全局註冊 popups 裡面的組件, 用於 js panel

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context('@v/panels/', true, /\.vue$/)
const AvailablePanels = []
requireComponent.keys().forEach(fileName => {
  // Get the component config
  const componentConfig = requireComponent(fileName)
  // Get the Kebab version of the component name
  const componentName = fileName
    // Remove './' from the begin
    .replace(/\.\//, '')
    // Change all '/' to '-'
    .replace(/\//g, '-')
    // Remove the file extension from the end
    .replace(/\.\w+$/, '')

  // only register under the first layer of folder
  if (!fileName.includes('subComponents')) {
    AvailablePanels.push(componentName)
    // Globally register the component
    Vue.component(componentName, componentConfig.default || componentConfig)
  }
})

// register iframe panel
Vue.component('Iframe', Iframe)

store.dispatch('app/setPanelComponents', AvailablePanels)
