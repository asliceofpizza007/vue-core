<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          v-if="action === 'edit'"
          label="訊息狀態"
        )
          div {{ state ? '已發佈' : '未發佈' }}
        el-form-item(
          :label="$t('th.title')"
          prop="title"
          :rules="[{ required: true, message: '↑此項必填' },{max: 50, message: '最多只能50個字'}]"
        )
          el-input(v-model="formData.title"
            ref="firstColumn"
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
import apiMail from '@api/apiMail'
import debounce from 'lodash/debounce'
import FroalaEditor from '@c/FroalaEditor'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditMail',
  components: {
    FroalaEditor,
  },
  mixins: [PanelMixin],
  props: {
    state: {
      type: Boolean,
      default: false,
    },
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
        title: null,
        content: null,
      },
      froalaConfig: {
        width: '100%',
        heightMin: 180,
        heightMax: 500,
      },
      loading: this.id,
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
        const res = await apiMail.getMail(this.id)
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
      let api = apiMail.addMail
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiMail.updateMail
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
