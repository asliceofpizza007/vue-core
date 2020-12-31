<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="名稱"
          prop="name"
          :rules="[{ required: true, message: '↑此項必填' },{max: 10, message: '最多只能 10 個字'}]"
        )
          el-input(v-model="formData.name"
            ref="firstColumn"
          )
        el-form-item(
          label="狀態"
          prop="isEnabled"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
    .buttonWrapper
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="checkValidate"
      )
        i.fa.fa-save
        span 儲存
      el-button(
        type="cancel"
        icon="el-icon-close"
        @click="closePanel"
      ) 取消
</template>
<script>
import debounce from 'lodash/debounce'
import apiSitePlatform from '@api/siteApi/apiSitePlatform'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditSitePlatform',
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
      formData: {
        name: null,
        isEnabled: true,
      },
      loading: false,
    }
  },
  created() {
    if (this.id) {
      this.getRowData()
    }
  },
  methods: {
    async getRowData() {
      this.loading = true
      try {
        const res = await apiSitePlatform.getSitePlatform(this.id)
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
      const postData = [this.formDataPayload]
      let api = apiSitePlatform.addSitePlatformList
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiSitePlatform.updateSitePlatform
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
  },
}
</script>
