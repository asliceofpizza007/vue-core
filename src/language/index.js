import Vue from 'vue'
import VueI18n from 'vue-i18n'

import tw from './tw'
import jp from './jp'

Vue.use(VueI18n)

const messages = {
  'zh-TW': tw,
  'ja-JP': jp,
}

const i18n = new VueI18n({
  /** 默认值 */
  locale: 'zh-TW',  // 中文: zhTW , 日文: jaJP
  messages,
})

export default i18n
