<template lang="pug">
  .panelContent
    .contentWrapper
      el-form.contentInner
        el-form-item(label="白名單IP")
          el-input(v-model="formData.whiteIP"
            ref="firstColumn"
          )
        el-form-item(label="備註")
          el-input(v-model="formData.remark")
        el-form-item(:label="$t('th.isEnabled')")
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        v-if="action !== 'view'"
        type="success"
      ) 儲存
</template>
<script>
export default {
  name: 'EditIP',
  props: {
    list: {
      type: Object,
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        whiteIP: null,
        remark: null,
        isEnabled: true,
      },
    }
  },
  mounted() {
    if (this.id) {
      Object.keys(this.formData).forEach(key => {
        if (this.list[key] !== null && typeof this.list[key] !== 'undefined') {
          this.formData[key] = this.list[key]
        }
      })
    }
  },
  methods: {
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
