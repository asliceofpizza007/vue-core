<template lang="pug">
  .panelContent
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
      )
        el-form-item(
          label="儲存金額"
          prop="deposit"
          :rules="[{ required: true, message: '↑此項必填' },{ type: 'number', message: '必須為數字' }]"
        )
          el-input(
            v-model.number="formData.deposit"
          )
        el-form-item(
          label="觀看天數"
          prop="viewDay"
          :rules="[{ required: true, message: '↑此項必填' },{ type: 'number', message: '必須為數字' }]"
        )
          el-input(
            v-model.number="formData.viewDay"
          )
        el-form-item(label="歷史記錄")
          el-table(
            class="main-table"
            :data="tbData" border
            :stripe="true"
          )
            el-table-column(
              prop="deposit"
              label="單次存款"
            )
            el-table-column(
              prop="viewDay"
              label="觀看天數"
            )
            el-table-column(
              prop="updatedOn"
              label="更新時間"
            )
            el-table-column(
              prop='updatedByName'
              label="更新者"
            )
          div {{ `總計：${tbData.length} 筆` }}
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
import apiDeposit from '@api/apiDeposit'
import debounce from 'lodash/debounce'
import { PanelMixin } from '@/mixins'

export default {
  name: 'ViewSetting',
  mixins: [PanelMixin],
  props: {
    action: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        deposit: null,
        viewDay: null,
      },
      tbData: [],
    }
  },
  created() {
    this.getRowData()
  },
  methods: {
    async getRowData() {
      try {
        const res = await apiDeposit.getDepositSetting()
        this.tbData = res
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
          this.formData.deposit = this.tbData[0].deposit
          this.formData.viewDay = this.tbData[0].viewDay
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
      try {
        this.loading = true
        await apiDeposit.updateDepositSetting(this.formDataPayload)
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
