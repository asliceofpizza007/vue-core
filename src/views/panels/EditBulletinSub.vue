<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(label="主類別")
          div {{ mainCategoryProp.title }}
        el-form-item(
          :label="$t('th.name')"
          prop="name"
          :rules="[{ required: true, message: '↑此項必填' },{max: 10, message: '最多只能10個字'}]"
        )
          el-input(v-model="formData.name"
            ref="firstColumn"
          )
        el-form-item(
          label="排序"
          prop="sequence"
          :rules="[{ validator }]"
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
import apiBulletinClass from '@api/apiBulletinClass'
import debounce from 'lodash/debounce'
import { numberValidator } from '@/utils'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditBulletinSub',
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
        name: null,
        sequence: null,
        isEnabled: true,
      },
      loading: false,
      validator: numberValidator,
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
        this.loading = true
        const res = await apiBulletinClass.getBulletinSub(this.id)
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
      let id = this.mainCategoryProp.id
      let api = apiBulletinClass.addBulletinSub
      let message = '資料新增成功'
      if (this.action === 'edit') {
        id = this.id
        api = apiBulletinClass.updateBulletinSub
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
