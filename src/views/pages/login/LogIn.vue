<template lang="pug">
  #logIn
    .weatherBlock
      a(
        class="weatherwidget-io"
        href="https://forecast7.com/zh-tw/24d15120d67/taichung-city/"
        data-font="微軟正黑體 (Microsoft JhengHei)"
        data-icons="Climacons Animated"
        data-theme="weather_one"
        data-label_1="台中市"
        data-label_2="氣象"
      )
    .inputBlock
      .subTitle {{ getProjectName }}
      el-form.complex-group(
        ref="complexGroup"
        :model="formData"
        :status-icon="true"
      )
        el-form-item.searchBox(
          prop="employee"
          :rules="[{ required: true, message: '帳號未填寫' }]"
        )
          el-input(
            v-model="formData.employee"
            class="login-input"
            prefix-icon="el-icon-user-solid"
            @keyup.native.enter="checkValidate"
          )
        el-form-item.searchBox(
          prop="password"
          :rules="[{ required: true, message: '密碼未填寫' }]"
        )
          el-input(
            v-model="formData.password"
            :show-password="true"
            class="login-input"
            prefix-icon="el-icon-lock"
            @keyup.native.enter="checkValidate"
          )
      el-button(
        v-loading="loading"
        class="btn-login"
        type="primary"
        @click="checkValidate"
      ) 登入
</template>
<script>
import common from '@api/common'
import { registerRouter } from '@/router/navigation'
import { delay } from '@/utils'
import weather from './js/weather'

export default {
  name: 'LogIn',
  data() {
    return {
      loading: false,
      formData: {
        employee: '',
        password: '',
      },
    }
  },
  computed: {
    getProjectName() {
      return process.env.VUE_APP_PROJECT_NAME
    },
  },
  created() {
    weather(document, 'script', 'weatherwidget-io-js')
  },
  methods: {
    checkValidate() {
      this.$refs.complexGroup.validate(valid => {
        if (valid) {
          this.login()
        }
      })
    },
    async login() {
      this.loading = true
      const data = {
        account: this.formData.employee,
        password: this.formData.password,
      }
      try {
        await delay(500)
        // const emsRes = await common.login(data)
        // const { ctlToken } = emsRes
        // localStorage.setItem('ctlToken', ctlToken)
        // localStorage.setItem('userData', JSON.stringify(emsRes))
        await registerRouter()
        this.$router.push({
          path: '/',
        })
      } catch {
        // login fail
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
