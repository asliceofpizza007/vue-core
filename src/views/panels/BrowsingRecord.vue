<template lang="pug">
  .panelContent#BrowsingRecord
    .contentWrapper
      .contentInner
        ul.tabGroup
          li(
            :class="{active: activePane === 'paneLogin'}"
            @click="setPane('paneLogin')"
          ) 登入記錄
          li(
            :class="{active: activePane === 'paneView'}"
            @click="setPane('paneView')"
          ) 觀看記錄
          li(
            :class="{active: activePane === 'paneRegister'}"
            @click="setPane('paneRegister')"
          ) 註冊記錄
        transition(
          :duration="300"
          name="fade"
          mode="out-in"
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        )
          component(:is="activePane" :style="{animationDuration: `.3s`}")
    //- .buttonWrapper
    //-   el-button(
    //-     type="danger"
    //-     @click="closePanel"
    //-   ) 取消
    //-   el-button(type="success") 儲存
</template>
<script>
import BrowsingRecordLogin from './subComponents/BrowsingRecordPane/BrowsingRecordLogin'
import BrowsingRecordRegister from './subComponents/BrowsingRecordPane/BrowsingRecordRegister'
import BrowsingRecordView from './subComponents/BrowsingRecordPane/BrowsingRecordView'

export default {
  name: 'BrowsingRecord',
  components: {
    paneLogin: BrowsingRecordLogin,
    paneView: BrowsingRecordView,
    paneRegister: BrowsingRecordRegister,
  },
  props: {
    action: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      activePane: 'paneLogin',
    }
  },
  methods: {
    setPane(pane) {
      this.activePane = pane
    },
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
#BrowsingRecord .el-form-item__content {
  width: auto;
}

.panelContent {
  .contentInner {
    overflow-y: auto;
    height: calc(100% - 3rem);
  }
}
</style>
