<template lang="pug">
  #ImgUploader
    .uploadBlock
      el-upload(action drag
        :http-request="uploadAction"
        :before-upload="beforeUploadtest"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="1"
      )
        i.el-icon-upload(v-loading="fileUploading")
        div(v-if="!fileUploading") 請點選或拖拉檔案至此處上傳
</template>
<script>
export default {
  name: 'ExcelUploader',
  props: {
    fileUploading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    beforeUploadtest(file) {
      const pattern = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/
      const isAcceptType = pattern.test(file.type)

      if (!isAcceptType) {
        this.$message({
          message: '上傳的檔案格式僅能為*.xlsx',
          type: 'error',
        })
      }
      return isAcceptType
    },
    uploadAction(request) {
      const formData = new FormData()
      formData.append('file', request.file)
      this.$emit('get-excel-file-preview', formData)
    },
    handleRemove() {
      // call api remove
    },
    handleExceed() {
      this.$message({
        message: '已達上傳上限',
        type: 'warning',
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#ImgUploader {
  display: flex;

  .uploadBlock {
    width: 50%;

    ::v-deep.el-upload-list__item {
      width: 360px;

      .el-icon-document {
        display: none;
      }

      > img {
        width: unset;
      }
    }
  }
}
</style>
