import common from '@api/common'
import io from 'socket.io-client'
import { resetRouter } from '@/router/navigation'
import Vue from 'vue'

export default {
  data() {
    return {
      userData: null,
    }
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem('userData'))
    this.userData.account = this.userData.account.split('_')[1]
    this.registerSocket()
  },
  beforeDestroy() {
    this.$socket.disconnect()
  },
  methods: {
    async registerSocket() {
      const protocol = 'ctl_siteInfo'
      const socket = {
        install() {
          Vue.prototype.$socket = io(`${process.env.VUE_APP_SOCKET_URL}/${protocol}`)
        },
      }
      Vue.use(socket)

      this.$socket.on('connect', () =>  {
        this.emitUserInfo()
        this.subscribeSockets()
      })
    },
    emitUserInfo() {
      const {
        nickName,
        account,
        deptId,
        groupId,
        adminId,
      } = this.userData

      this.$socket.emit('join', {
        userName: nickName,
        companyCode: 'ctl',
        systemCode: 'siteInfo',
        deptId,
        groupId,
        adminId,
        account,
        socketId: this.$socket.id,
        connected_on: new Date(),
      })
    },
    subscribeSockets() {
      const {
        groupId,
        adminId,
      } = this.userData

      // 全部
      // this.$socket.on('ctl_siteInfo', () => {
      //   console.log('contect test')
      // })

      // 權限群組同步
      this.$socket.on(`ctl_siteInfo_group_${groupId}`, resp => {
        this.refresh({ ...resp })
      })

      // 系統選單同步
      this.$socket.on('ctl_siteInfo', resp => {
        if (resp.events && resp.events === '公告') {
          this.$bus.$emit('refresh-bulletin-summary')
        } else if (resp.type) {
          this.refresh({ ...resp })
        }
      })

      // 管理員帳號同步
      this.$socket.on(`ctl_siteInfo_admin_${adminId}`, resp => {
        this.refresh({ ...resp })
      })

      // socket踢除
      this.$socket.on('kickout', () => {
        this.socketLogout()
      })
    },
    async refresh({ type, ctlToken = null }) {
      let action
      switch (type) {
        case -2:
          await resetRouter()
          break
        case 4:
          localStorage.setItem('ctlToken', ctlToken)
          break
        case 126:
          action = 'getContractorList'
          break
        case 222:
          action = 'getSitePlatformList'
          break
        case 223:
          action = 'getSiteTypeList'
          break
        case 224:
          action = 'getSitePurposeList'
          break
        default:
          break
      }
      if (action) {
        this.$store.dispatch(`options/${action}`)
      }
    },
    async socketLogout() {
      try {
        await this.$store.dispatch('updateUserPreferencesDirectly')
        this.$socket.disconnect()
        await common.logout()
        this.$message({
          message: 'socket kick out',
          type: 'warn',
        })
        localStorage.clear()
        this.$router.push({
          path: (process.env.VUE_APP_LOGIN_PAGE === 'true') ? '/login' : '/401',
        })
      } catch {
        // pass
      }
    },
  },
}
