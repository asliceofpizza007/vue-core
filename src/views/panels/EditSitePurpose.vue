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
        el-form-item(
          label="動態必填欄位"
        )
          el-checkbox-group(v-model="formData.dynamicFields")
            el-checkbox(
              v-for="item in checkList"
              :label="item.id"
              :key="item.id"
            ) {{ item.name }}
        el-form-item(
          label="顯示網址"
          prop="hasLink"
        )
          el-switch(
            class="switch-group"
            v-model="formData.hasLink"
            active-text="是"
            inactive-text="否"
          )
        el-form-item(
          label="顯示申請日"
          prop="hasApplyDate"
        )
          el-switch(
            class="switch-group"
            v-model="formData.hasApplyDate"
            active-text="是"
            inactive-text="否"
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
import apiSitePurpose from '@api/siteApi/apiSitePurpose'
import apiSiteDynamic from '@api/siteApi/apiSiteDynamic'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditSitePurpose',
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
        dynamicFields: [],
        hasLink: true,
        hasApplyDate: true,
      },
      loading: false,
      checkList: [],
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    // 取得用途別清單
    async getOptions() {
      this.loading = true
      try {
        const load = {
          isEnabled: true,
        }
        const res = await apiSiteDynamic.getSiteDynamicRequiredList(load)
        this.checkList = res.list
        if (this.id) {
          await this.getRowData()
        }
      } catch {
        // pass
      } finally {
        this.loading = false
      }
    },
    async getRowData() {
      try {
        const res = await apiSitePurpose.getSitePurpose(this.id)
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
      let api = apiSitePurpose.addSitePurposeList
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiSitePurpose.updateSitePurpose
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
