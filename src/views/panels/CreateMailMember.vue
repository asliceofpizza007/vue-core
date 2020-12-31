<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner
        el-form-item(:label="$t('th.title')")
          div {{ mailProp.title }}
        el-form-item(label="下載範例")
          el-button(
            type="success"
            icon="el-icon-download"
            @click="downloadExample"
          ) 範例檔
        el-form-item(label="匯入檔案")
          ExcelUploader(
            @get-excel-file-preview="getExcelFilePreview"
            :fileUploading="fileUploading"
          )
        el-form-item(label="寄送全部")
          el-switch(
            class="switch-group"
            v-model="formData.sendAll"
            active-text="啟用"
            inactive-text="停用"
          )
        el-form-item(
          label="檔案預覽"
          v-if="formData.previewList.totalSize !==0"
        )
          el-table(
            class="main-table"
            :data="formData.previewList.list"
            border
            stripe
          )
            el-table-column(
              label="序號"
            )
              template(slot-scope="scope")
                span {{ scope.$index + 1 }}
            el-table-column(
              prop="account"
              label="會員帳號"
            )
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="createMailMember"
      ) 儲存
</template>
<script>
import apiMail from '@api/apiMail'
import debounce from 'lodash/debounce'
import { exportExcel } from '@/utils'
import ExcelUploader from './subComponents/ExcelUploader'

export default {
  name: 'CreateMailMember',
  components: {
    ExcelUploader,
  },
  props: {
    mailProp: {
      type: Object,
      default: null,
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
        sendAll: false,
        previewList: {
          totalSize: 0,
          list: [
            // {
            //   isExist: true,
            //   account: 'testaaas',
            // },
          ],
        },
      },
      loading: false,
      fileUploading: false,
    }
  },
  computed: {
    getPayLoad() {
      const load = {
        sendAll: this.formData.sendAll,
        accountList: [],
      }
      this.formData.previewList.list.forEach(obj => {
        load.accountList.push(obj.account)
      })
      return load
    },
  },
  methods: {
    createMailMember: debounce(async function () {
      if (this.formData.previewList.totalSize !== 0 || this.formData.sendAll) {
        try {
          await apiMail.addMailMember(this.getPayLoad)
          this.$message({
            message: '資料新增成功',
            type: 'success',
          })
          this.$emit('refresh-page')
          this.closePanel()
        } catch {
          // pass
        }
      } else {
        this.$message({
          message: '無寄送對象',
          type: 'error',
        })
      }
    }, 600),
    async getExcelFilePreview(file) {
      this.fileUploading = true
      try {
        const res = await apiMail.mailListPreview(file)
        this.formData.previewList = res
      } catch {
        // pass
      }
      this.fileUploading = false
    },
    downloadExample: debounce(async function () {
      this.loading = true
      try {
        const res = await apiMail.downloadMailExample()
        exportExcel(res)
      } catch {
        // pass
      }
      this.loading = false
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
