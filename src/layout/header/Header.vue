<template lang="pug">
  #header
    .headAside
      TabNav
    .headAside.userHead
      //- div.switchPlatform
      //-   span  平台切換：
      //-   el-select(
      //-     v-model="platform"
      //-     @change="switchPlatform"
      //-   )
      //-     el-option(
      //-       v-for="option in filterPlatform"
      //-       :key="option.id"
      //-       :label="option.name"
      //-       :value="option.id"
      //-     )
      el-button(
        v-popover:popoverUserset
      ) {{ `${userData.nickName} 【${userData.account}】` }}
      el-badge#notice(
        v-popover:popoverNotify
      )
        el-button(icon="el-icon-message-solid")
      el-tooltip(
        effect="dark"
        content="登出"
        placement="bottom"
      )
        el-button(
          icon="el-icon-switch-button"
          @click="logout"
        )
      el-button(
        v-if="useSideTabs"
        :collapse="isSideTabCollapse"
        icon="el-icon-s-unfold"
        @click="toggleSideTab"
      )
    el-popover(
      ref="popoverNotify"
      placement="bottom"
      trigger="click"
      popper-class="notifications"
      v-model="showNotify"
    )
      Notify(v-show="showNotify")
    el-popover(
      ref="popoverUserset"
      placement="bottom"
      trigger="click"
      v-model="showUserset"
      popper-class="userset"
    )
      Userset(v-if="showUserset")
</template>
<script>
import common from '@api/common'
import { mapState } from 'vuex'
import {
  TabNav,
  Notify,
  Userset
} from './subComponents'

export default {
  name: 'Header',
  components: {
    TabNav,
    Notify,
    Userset,
  },
  data() {
    return {
      // changePlatform: false,
      // platform: null,
      // platformSet: [],
      showNotify: false,
      showUserset: false,
      userData: {
        account: 123456,
        nickName: 'Austin',
      },
      useSideTabs: process.env.VUE_APP_USESIDETABS === 'true',
    }
  },
  computed: {
    ...mapState('app', {
      isSideTabCollapse: state => state.isSideTabCollapse,
    }),
  },
  // created() {
  //   this.userData = JSON.parse(localStorage.getItem('userData'))
  //   this.userData.account = this.userData.account.split('_')[1]
  // },
  methods: {
    toggleSideTab() {
      this.$store.dispatch('app/setSideTabCollapse')
      this.$store.dispatch('updateUserPreferences')
    },
    async logout() {
      try {
        await this.$store.dispatch('updateUserPreferencesDirectly')
        await this.$confirm('確認登出系統？', '提醒', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'warning',
        })
        await common.logout()
        this.$message({
          message: '已登出成功',
          type: 'success',
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
</script>

<style lang="scss" scoped>
#notice {
  button {
    padding: 8px 10px;
    font-size: 20px;
    color: #606266;
    background: none;
    border: unset;
  }
}

.switchPlatform {
  > :first-child {
    font-size: 14px;
    color: #606266;
  }

  /deep/ .el-select {
    width: 120px;

    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }

    .el-input__icon {
      line-height: 28px;
    }
  }
}
</style>
