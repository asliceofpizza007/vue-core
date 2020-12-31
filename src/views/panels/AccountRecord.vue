<template lang="pug">
  .panelContent
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
            :class="{active: activePane === 'paneDeposit'}"
            @click="setPane('paneDeposit')"
          ) 存款記錄
        transition(
          :duration="300"
          name="fade"
          mode="out-in"
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        )
          component(:is="activePane" :style="{animationDuration: `.3s`}" :id="id")
    //- .buttonWrapper
    //-   el-button(
    //-     type="danger"
    //-     @click="closePanel"
    //-   ) 取消
    //-   el-button(type="success") 儲存
</template>
<script>
import AccountRecordLogin from './subComponents/AccountRecordPane/AccountRecordLogin'
import AccountRecordDeposit from './subComponents/AccountRecordPane/AccountRecordDeposit'
import AccountRecordView from './subComponents/AccountRecordPane/AccountRecordView'

export default {
  name: 'AccountRecord',
  components: {
    paneLogin: AccountRecordLogin,
    paneView: AccountRecordView,
    paneDeposit: AccountRecordDeposit,
  },
  props: {
    list: {
      type: Object,
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
    id: {
      type: Number,
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
  .panelContent {
    .contentInner {
      overflow-y: auto;
      height: calc(100% - 3rem);
    }
  }
</style>
