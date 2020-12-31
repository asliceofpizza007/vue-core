<template lang="pug">
  .panelContent
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(label="主類別")
          div {{ mainCategoryProp.title }}
        el-form-item(
          :label="$t('th.title')"
          prop="subTitle"
          :rules="[{ required: true, message: '↑此項必填' },{max: 10, message: '最多只能10個字'}]"
        )
          el-input(v-model="formData.subTitle"
            ref="firstColumn"
          )
        el-form-item(
          label="排序"
          prop="sequence"
          :rules="[{ required: true, message: '↑此項必填' },{ type: 'number', message: '必須為數字' }]"
        )
          el-input(
            v-model.number="formData.sequence"
            maxLength="3"
            @blur="sequenceReset"
            @keyup.native.delete="sequenceReset"
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
        el-form-item(label="內容")
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
import apiHelpingCenter from '@api/apiHelpingCenter'
import debounce from 'lodash/debounce'
import FroalaEditor from '@c/FroalaEditor'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditHelpSub',
  components: {
    FroalaEditor,
  },
  mixins: [PanelMixin],
  props: {
    id: {
      type: Number,
      default: null,
    },
    mainCategoryProp: {
      type: Object,
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
        subTitle: null,
        sequence: null,
        isEnabled: true,
        content: null,
      },
      froalaConfig: {
        width: '100%',
        heightMin: 180,
        heightMax: 500,
      },
    }
  },
  created() {
    if (this.id) {
      this.getRowData()
    }
  },
  methods: {
    async getRowData() {
      try {
        const res = await apiHelpingCenter.getSubCategories(this.id)
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
      let api = apiHelpingCenter.addSubCategories
      let message = '資料新增成功'
      let id = this.mainCategoryProp.id
      if (this.action === 'edit') {
        id = this.id
        api = apiHelpingCenter.updateSubCategories
        message = '資料更新成功'
      }
      postData.push(id)
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
    async sequenceReset(e) {
      await this.$nextTick()
      if (!e.target.value) {
        this.$refs.editForm.clearValidate('sequence')
      }
    },
  },
}
</script>
