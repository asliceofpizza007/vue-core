<template lang="pug">
  #helpLayout.views
    .breadcrumbBlock
      i.el-icon-s-order
      el-breadcrumb(separator-class="el-icon-arrow-right")
        el-breadcrumb-item 站內信推播
        el-breadcrumb-item(v-if="mailProp.id") {{ mailProp.title }}
    transition(
      :duration="300"
      name="fade"
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    )
      components(
        :is="currentComponent"
        :style="{animationDuration: `.3s`}"
        :mailProp="mailProp"
        @switch-component="switchComponent"
      )
</template>
<script>
import EmailBroadcast from './subComponents/EmailBroadcast'
import MailInfo from './subComponents/MailInfo'

export default {
  name: 'MailWrapper',
  components: {
    EmailBroadcast,
    MailInfo,
  },
  data() {
    return {
      currentComponent: 'EmailBroadcast',
      mailProp: {},
    }
  },
  methods: {
    switchComponent(obj) {
      this.currentComponent = obj.component
      this.mailProp = {
        title: obj.title,
        id: obj.id,
      }
    },
  },
}
</script>
