<template lang="pug">
  .panelContent
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="帳號"
          prop="account"
        )
          el-input(v-model="formData.account"
            ref="firstColumn"
          )
        el-form-item(
          label="密碼"
          prop="password"
          :rules="[{ required: true, message: '↑此項必填' },{ min:6, message: '請至少需輸入 6 位數' }]"
        )
          el-input(v-model="formData.password")
        el-form-item(label="描述")
          el-input(v-model="formData.description")
        el-form-item(
          label="電子信箱"
          prop="email"
          :rules="[{ required: true, message: '↑此項必填' },{ type: 'email', message: '請輸入正確的郵箱地址' }]"
        )
          el-input(v-model="formData.email")
        el-form-item(
          label="是否通過驗證"
          prop="isVerified"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isVerified"
            active-text="是"
            inactive-text="否")
        el-form-item(
          label="是否 VIP"
          prop="isVIP"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isVIP"
            active-text="是"
            inactive-text="否")
        el-form-item(
          label="啟用狀態"
          prop="isEnabled"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用")
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="checkValidate"
      ) 儲存
</template>
<script>
import apiMemberInfo from '@api/apiMemberInfo'
import debounce from 'lodash/debounce'
import { PanelMixin } from '@/mixins'

export default {
  name: 'CreateAccount',
  mixins: [PanelMixin],
  props: {
    action: {
      type: String,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        account: null,
        password: null,
        description: null,
        email: null,
        isVerified: true,
        isVIP: false,
        isEnabled: true,
      },
    }
  },
  methods: {
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitWhenValidate()
        }
      })
    },
    submitWhenValidate: debounce(async function () {
      try {
        this.loading = true
        await apiMemberInfo.addMember(this.formDataPayload)
        this.$message({
          message: '資料新增成功',
          type: 'success',
        })
        this.$emit('refresh-page')
        this.closePanel()
      } catch {
        // interceptor handle
      } finally {
        this.loading = false
      }
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.panelContent {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }

    .el-form-item__content {
      width: calc(100% - 120px) !important;
    }
  }
}
</style>
