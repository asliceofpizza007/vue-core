import moment from 'moment'
import { mapState } from 'vuex'
import { delay } from '@/utils'

export default {
  props: {
    focusOnOpen: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('JsPanels', {
      panelCount: state => state.panels.length,
    }),
    rules() {
      const rule = {}
      Object.keys(this.formData).forEach(key => {
        rule[key] = [{ required: true, message: '↑此項必填' }]
      })
      return rule
    },
    formDataPayload() {
      const load = {}
      Object.keys(this.formData).forEach(key => {
        const value = this.formData[key] !== '' ? this.formData[key] : null
        if (key === 'imageFileSet') {
          load[key] = {}
          Object.keys(this.formData[key]).forEach(item => {
            const path = this.formData[key][item]
            const linkArray = path.split('/')
            const link = 'file/img/' + linkArray[linkArray.length - 1]
            load[key][item] = linkArray.length ? link : ''
          })
        } else if (key === 'content') {
          const pattern = new RegExp(process.env.VUE_APP_APIPATH, 'gi')
          load[key] = this.formData[key].replace(pattern, '#{APIPATH}')
        } else {
          const pattern = /publishedOn|finishedOn/
          const validFmt = 'YYYY-MM-DD'
          let tmpVal = value
          let map = {}
          if (pattern.test(key) && moment(value, validFmt, true).isValid()) {
            map = {
              publishedOn: moment(value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
              finishedOn: moment(value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            }
          } else if (tmpVal && typeof tmpVal === 'string') {
            tmpVal = tmpVal.trim()
            this.formData[key] = tmpVal
          }
          load[key] = map[key] ?? tmpVal
        }
      })
      return load
    },
    linkPlaceholder() {
      if (this.formData.openType === 1) {
        return '連結網址須為 / 開頭'
      }
      return '請輸入完整網址，例：http://www.123.com'
    },
  },
  created() {
    if (this.action !== 'view') {
      this.initKeydown()
    }
  },
  mounted() {
    if (this.focusOnOpen) {
      this.onFocus()
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydownHandler)
  },
  methods: {
    async onFocus() {
      await delay(0)
      this.$refs.firstColumn?.focus()
    },
    async initKeydown() {
      await delay(0)
      window.addEventListener('keydown', this.keydownHandler)
    },
    keydownHandler(e) {
      if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault()
        this.checkSaveShortCut()
      }
    },
    checkSaveShortCut() {
      const parent = this.$parent.instance
      const { zIndex } = window.getComputedStyle(parent)
      if (parseInt(zIndex, 10) === (100 + this.panelCount - 1)) {
        this.checkValidate()
      }
    },
    checkpath(rule, value, callback) {
      if (this.formData.openType === 1) {
        if (!value) {
          callback(new Error('↑此項必填'))
        } else if (value.indexOf('/') !== 0) {
          callback(new Error('連結網址須為 / 開頭'))
        }
      }
      if (this.formData.openType === 2) {
        const urlCheck = /https?:\/\/?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        if (!value) {
          callback(new Error('↑此項必填'))
        } else if (!urlCheck.test(value) && !value) {
          callback(new Error('請輸入正確的網址'))
        }
      }
      callback()
    },
  },
}
