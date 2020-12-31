<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="位置"
          prop="position"
        )
          el-select(v-model="formData.position" clearable
            ref="firstColumn"
          )
            el-option(:label="'首頁右側'" :value="0") 首頁右側
            el-option(:label="'首頁左側'" :value="1") 首頁左側
            el-option(:label="'首頁右下方'" :value="2") 首頁右下方
            el-option(:label="'首頁左下方'" :value="3") 首頁左下方
        el-form-item(
          label="描述"
          prop="description"
        )
          el-input(
            v-model="formData.description"
            type="textarea"
            maxlength="150"
            show-word-limit
          )
        el-form-item(
          label="與視窗最上方距離"
          prop="marginTop"
        )
          el-input(v-model.number="formData.marginTop")
            i(slot="suffix") %
        el-form-item(label="上架日期")
          el-date-picker(
            v-model="publishedRange"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="選擇上架日期範圍"
            @change="checkDateTime"
          )
        el-form-item(
          :label="$t('th.isEnabled')"
          prop="isEnabled"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
        el-form-item(
          label="內容"
          prop="content"
        )
          FroalaEditor(
            v-model="formData.content"
            :customConfig="froalaConfig"
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
import apiFloatWindow from '@api/apiFloatWindow'
import debounce from 'lodash/debounce'
import FroalaEditor from '@c/FroalaEditor'
import { PanelMixin } from '@/mixins'
import { htmlWordLimit } from '@/utils'

export default {
  name: 'EditFloat',
  components: {
    FroalaEditor,
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
    position: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        position: this.position,
        description: null,
        marginTop: 0,
        isEnabled: true,
        content: null,
        publishedOn: null,
        finishedOn: null,
      },
      publishedRange: null,
      froalaConfig: {
        width: '100%',
        heightMin: 180,
        heightMax: 500,
      },
      loading: false,
    }
  },
  created() {
    if (this.id) {
      // TODO: api uncomment
      // this.getRowData()
    }
  },
  methods: {
    async getRowData() {
      this.loading = true
      try {
        const res = await apiFloatWindow.getFloatWindow(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        this.publishedRange = [res.publishedOn, res.finishedOn]
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
    checkDateTime(val) {
      if (val) {
        this.formData.publishedOn = val[0]
        this.formData.finishedOn = val[1]
      }
    },
    checkValidate() {
      if (this.contentLimit()) return
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitWhenValidate()
        }
      })
    },
    contentLimit() {
      let countercheck = false
      if (!htmlWordLimit(this.formData.content, '65535')) {
        this.$confirm('內容字數太多', '提示', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        countercheck = true
      }
      return countercheck
    },
    submitWhenValidate: debounce(async function () {
      const postData = [this.formDataPayload]
      let api = apiFloatWindow.addFloatWindow
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiFloatWindow.updateFloatWindow
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
<style lang="scss" scoped>
::v-deep.el-form-item {
  .el-form-item__label {
    width: 150px !important;
  }
}
</style>
