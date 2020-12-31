<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item.tagName(
          label="名稱"
          prop="name"
          :rules="[{ required: true, message: '↑此項必填'},{max: 10, message: '最多只能10個字'}]"
        )
          el-input(v-model.title="formData.name"
            ref="firstColumn"
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
import debounce from 'lodash/debounce'
import apiTags from '@api/apiTags'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditTags',
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
      },
    }
  },
  created() {
    if (this.id) {
      this.getTag()
    }
  },
  methods: {
    async getTag() {
      try {
        const res = await apiTags.getTag(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
      } catch {
        // pass
      }
      this.loading = false
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
      let api = apiTags.addTag
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiTags.updateTag
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
.panelContent .contentWrapper .contentInner /deep/ .el-form-item {
  .el-form-item__label {
    width: 70px;
  }

  .el-form-item__content {
    width: calc(100% - 70px);
  }
}
</style>
