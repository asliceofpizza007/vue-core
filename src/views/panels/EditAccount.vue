<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(label="帳號")
          el-input(v-model="formData.account"
            ref="firstColumn"
            disabled
          )
        el-form-item(
          label="變更密碼"
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
        el-form-item(label="帳號到期時間")
          el-date-picker(
            v-model="formData.availableTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          )
        el-form-item(
          :label="$t('th.isEnabled')"
          prop="isEnabled"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用")
        el-form-item(label="平台層級")
          el-input(
            v-model="formData.platformLevel"
            disabled
          )
        el-form-item(label="最近一筆存款")
          el-input(
            v-model="formData.lastDeposit"
            disabled
          )
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
  name: 'EditAccount',
  mixins: [PanelMixin],
  props: {
    id: {
      type: Number,
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
        platformLevel: null,
        lastDeposit: null,
        availableTime: null,
        account: null,
        password: null,
        description: null,
        email: null,
        isVerified: true,
        isVIP: false,
        isEnabled: true,
      },
      loading: false,
    }
  },
  created() {
    this.getRowData()
  },
  methods: {
    async getRowData() {
      this.loading = true
      try {
        const res = await apiMemberInfo.getMember(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
      } catch (err) {
        const pattern = /^2/
        const error = JSON.parse(err.message)
        if (error.status && !pattern.test(error.status)) {
          this.$emit('refresh-page')
          this.closePanel()
        }
      } finally {
        this.loading = false
      }
    },
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
        await apiMemberInfo.updateMember(this.formDataPayload, this.id)
        this.$message({
          message: '資料更新成功',
          type: 'success',
        })
        this.$emit('refresh-page')
        this.closePanel()
      } catch (e) {
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
