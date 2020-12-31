<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner
        el-form-item(label="下載範例")
          el-button(
            type="success"
            icon="el-icon-download"
            @click="eventShunt"
          ) 範例檔
        el-form-item(label="匯入檔案")
          ExcelUploader(
            @get-excel-file-preview="getExcelFilePreview"
            :fileUploading="fileUploading"
          )
        el-form-item(
          label="匯入檔案預覽"
          v-if="tableData.list.length"
          class="align-block"
        )
          el-table(
            class="main-table"
            :data="tableData.list" border
            :stripe="true"
          )
            el-table-column(
              prop="id"
              label="影片編號"
            )
            el-table-column(
              prop="hd.name"
              label="高清影片"
            )
            el-table-column(
              prop="sd.name"
              label="普清影片"
            )
            el-table-column(
              prop="coverImg.name"
              label="封面圖片"
            )
            el-table-column(
              prop="slideImg.name"
              label="滑入圖片"
            )
            el-table-column(
              prop="name"
              label="片名"
            )
            el-table-column(
              prop="web.values"
              label="可播網站"
            )
            el-table-column(
              prop="videoCompany"
              label="片商"
            )
            el-table-column(
              prop="videoTags"
              label="標籤"
            )
            el-table-column(
              prop="actors"
              label="女優"
            )
            el-table-column(
              prop="description"
              label="描述"
            )
            el-table-column(
              prop="isEnabled"
              label="上下架"
            )
            el-table-column(
              prop="isFree"
              label="免費影片"
            )
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        type="success"
        @click="eventShunt('submit')"
      ) 儲存
</template>
<script>
import debounce from 'lodash/debounce'
import apiVideo from '@api/apiVideo'
import { exportExcel } from '@/utils'
import ExcelUploader from './subComponents/ExcelUploader'

export default {
  name: '',
  components: {
    ExcelUploader,
  },
  props: {
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
      uploadingCount: 0,
      tableData: {
        totalSize: 0,
        list: [],
      },
      loading: false,
      fileUploading: false,
    }
  },
  computed: {
    getPayLoad() {
      const load = {
        list: this.tableData.list,
      }
      return load
    },
  },
  methods: {
    eventShunt(statement) {
      if (statement === 'submit') {
        this.addVideo()
      } else {
        this.downloadVideoExample()
      }
    },
    downloadVideoExample: debounce(async function () {
      this.loading = true
      try {
        const res = await apiVideo.downloadVideoExample()
        res.fileName = '範例檔'
        exportExcel(res)
      } catch {
        // pass
      }
      this.loading = false
    }, 600),
    addVideo: debounce(async function () {
      try {
        await apiVideo.addVideo(this.getPayLoad)
        this.$emit('refresh-page')
        this.closePanel()
      } catch {
        // pass
      }
    }, 600),
    async getExcelFilePreview(file) {
      this.uploadingCount += 1
      this.fileUploading = true
      try {
        const res = await apiVideo.videoImportPreview(file)
        this.tableData = res
      } catch {
        // pass
      }
      this.uploadingCount -= 1
      this.fileUploading = false
    },
    async closePanel() {
      if (this.uploadingCount === 0) {
        this.$parent.$emit('close')
      } else {
        try {
          await this.$confirm('檔案仍在上傳中', '確定離開？', {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            cancelButtonClass: 'cancelButton',
            confirmButtonClass: 'confirmButton',
            type: 'error',
          })
          this.$parent.$emit('close')
        } catch {
          // pass
        }
      }
    },
  },
}
</script>
