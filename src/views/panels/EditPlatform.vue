<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
        :disabled="action === 'view'"
        :hide-required-asterisk="action === 'view'"
        :show-message="action !== 'view'"
      )
        el-form-item(
          label="名稱"
          prop="name"
        )
          el-input(v-model="formData.name"
            ref="firstColumn"
          )
        el-form-item(
          label="前台網址"
          prop="siteUrl"
          :rules="[{ required: true, message: '↑此項必填' },{ type: 'url', message: '請輸入正確的網址' }]"
        )
          el-input(
            v-model="formData.siteUrl"
            placeholder="請輸入完整網址，例：http://www.123.com"
          )
        el-form-item(
          label="Eamil"
          prop="siteEmail"
          :rules="[{ required: true, message: '↑此項必填' },{ type: 'email', message: '請輸入正確的郵箱地址' }]"
        )
          el-input(v-model="formData.siteEmail")
        el-form-item(:label="$t('th.isEnabled')")
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
        el-form-item(
          label="網域清單"
          prop="platformDomains"
        )
          InputList(
            :propData="formData.platformDomains"
            :inputType="'url'"
            :loading="loading"
            :inputDisabled="action === 'view'"
            @emit-data='getInputList'
            @check-valid="inputListCheck"
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
import apiPlatform from '@api/apiPlatform'
import debounce from 'lodash/debounce'
import { PanelMixin } from '@/mixins'
import InputList from '@c/InputList'

export default {
  name: 'EditPlatform',
  components: {
    InputList,
  },
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
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: this.id,
      formData: {
        name: null,
        siteUrl: null,
        siteEmail: null,
        isEnabled: true,
        platformDomains: [],
      },
      inputValid: false,   // input 列表是否填寫正確
    }
  },
  created() {
    if (this.id) {
      this.getPlatform(this)
    }
  },
  methods: {
    async getPlatform() {
      const res = await apiPlatform.getPlatform(this.id)
      Object.keys(this.formData).forEach(key => {
        if (res[key] !== null && typeof res[key] !== 'undefined') {
          this.formData[key] = res[key]
        }
      })
      this.$refs.editForm.clearValidate()
      this.loading = false
    },
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (valid && this.inputValid) {
          this.submitWhenValidate()
        }
      })
    },
    submitWhenValidate: debounce(async function () {
      const postData = [this.formDataPayload]
      let api = apiPlatform.addPlatform
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiPlatform.updatePlatform
        message = '資料更新成功'
      }
      try {
        this.loading = true
        await api(...postData)
        this.$message({
          message,
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
    getInputList(value) {
      this.formData.platformDomains = value
      this.$refs.editForm.validateField('platformDomains')
    },
    inputListCheck(value) {
      this.inputValid = value
    },
  },
}
</script>

<style lang="scss" scoped>
.is-disabled::v-deep {
  opacity: 1;

  .el-input__inner {
    color: #606266;
    background-color: #fff;
    border-color: rgba(91, 81, 107, 0.25);
  }
}

</style>
