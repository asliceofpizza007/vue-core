<template lang="pug">
.notify-switch 桌面通知
  el-switch.switch(
    v-model="isDesktopNotifyEnabled"
    @change="toggleNotificationPermissions"
  )
  el-dialog(
    title="您的桌面通知功能已被禁用"
    :visible.sync="isModalShow"
    width="30%"
    :show-close="false"
    center
    :modal-append-to-body="false"
    class="dialog"
  )
    section
      p 若需重新啟用此功能，請將下圖標記「<span class="forbidden">封鎖</span>」項目改為「<span class="primary">允許</span>」
        | ，並重新整理網頁
      br
      img(src="@/assets/img/notify.jpg" width="100%")
</template>

<script>
export default {
  data() {
    return {
      isModalShow: false,
      isDesktopNotifyEnabled: false,   // 是否顯示桌面提示
      isForbidden: false,              // 是否被 browser 禁用
    }
  },
  async created() {
    await this.$nextTick()
    const permission = Notification.permission

    if (permission !== 'granted' && permission !== 'denied') {
      try {
        const p = await Notification.requestPermission()
        if (p === 'granted' || p === 'denied') {
          localStorage.setItem('notification-permissions', 'granted')
        } else {
          this.requestPermission()
        }
      } catch (err) {
        this.isDesktopNotifyEnabled = false
      }
    }
    this.checkDesktopNotificationStatus()
  },
  methods: {
    /** 檢查 Notification API 是否可用；
     *  若可用，從 localStorage 中檢查當前權限；若是 default，則直接請求權限
     *  權限(Notification.permission) 分類：
     *    default:         預設狀態
     *    granted:         允許
     *    denied:          禁止；若出現權限視窗後，使用者點右上角 X，一樣會是 denied
     *  額外分類(localStorage 中不會有 default)：
     *    denied(by user): 允許，但使用者從介面上擋了
     */
    checkDesktopNotificationStatus() {
      if (!window.Notification) {
        this.$notify({
          title: '系統提示',
          message: '您的瀏覽器未支援「桌面通知」功能',
          type: 'warning',
        })
        this.isDesktopNotifyEnabled = false
        return
      }
      let permission = localStorage.getItem('notification-permissions')
      switch (Notification.permission) {
        case 'granted':
          if (permission !== 'denied(by user)') {
            localStorage.setItem('notification-permissions', 'granted')
          }
          break
        case 'denied':
          localStorage.setItem('notification-permissions', 'denied')
          this.isForbidden = true
          break
        default:
          break
      }
      permission = localStorage.getItem('notification-permissions')
      if (permission) {
        this.isDesktopNotifyEnabled = permission === 'granted'
      } else {
        this.requestPermission()
      }
    },
    /** 呼叫請求權限介面 */
    async requestPermission() {
      try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          localStorage.setItem('notification-permissions', 'granted')
        } else {
          localStorage.setItem('notification-permissions', 'denied')
        }
        this.checkDesktopNotificationStatus()
      } catch (err) {
        this.isDesktopNotifyEnabled = false
      }
    },
    /** 以 button 切換權限 */
    async toggleNotificationPermissions(checked) {
      switch (Notification.permission) {
        case 'granted':
          localStorage.setItem('notification-permissions', checked ? 'granted' : 'denied(by user)')
          this.$notify({
            title: '系統提示',
            message: `「桌面通知」功能已${checked ? '開啟' : '關閉'}`,
            type: 'success',
          })
          break
        case 'denied':
          localStorage.setItem('notification-permissions', 'denied')
          this.isModalShow = true
          break
        case 'default':
          try {
            const p = await Notification.requestPermission()
            if (p === 'granted' || p === 'denied') {
              localStorage.setItem('notification-permissions', checked ? 'granted' : 'denied')
            } else {
              this.requestPermission()
            }
          } catch (err) {
            this.isDesktopNotifyEnabled = false
          }
          break
        default:
          break
      }
      this.checkDesktopNotificationStatus()
    },
  },
}
</script>

<style lang="scss">
.switch {
  margin: 0 0 0 10px;
}

.el-dialog__header {
  background-color: #e4e7e9;
}
</style>
