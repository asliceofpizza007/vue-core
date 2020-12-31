<template lang="pug">
  .responseArea(v-show="show")
    FroalaEditor(
      tag="textarea"
      v-model="formData.content"
      :customConfig="froalaConfig"
    )
    el-upload.uploader(drag action multiple
      :http-request="uploadAction"
      :on-remove="clearFileChange"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :file-list="formData.files"
      :limit="10"
    )
      .el-upload__text
        i.el-icon-upload
        p 拖曳檔案至此或點擊此處上傳
          br
          | (單檔上限 10 MB，一次最多 10 個檔案)
    .btns
      el-button(
        type="info"
        icon="el-icon-close"
        @click="closeFroalaEditor"
      ) 取消
      el-button(
        v-if="activeMessage && activeMessage.id"
        type="success"
        @click="updateMessage"
        icon="el-icon-edit-outline"
      )
        span 儲存留言
      el-button(
        v-else
        type="success"
        icon="el-icon-s-promotion"
        @click="addMessage"
        class="abreast"
      )
        span 送出留言
</template>
<script>
import FroalaEditor from '@c/FroalaEditor'
import { saveAs } from 'file-saver'
import apiHandovers from '@api/apiHandovers'
import common from '@api/common'

export default {
  name: 'MessageSubmitBlock',
  components: {
    FroalaEditor,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    activeMessage: {
      type: Object,
      default: null,
    },
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        content: '',
        files: [],
      },
      /** froala 簡易版界面設定 */
      froalaConfig: {
        toolbarButtons: [
          'fullscreen', '|',
          'fontFamily', 'fontSize', 'color', 'bold', 'italic', '|',
          'underline', 'strikeThrough', '|',
          'formatOL', 'formatUL', 'quote', '|',
          'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'html', '|',
        ],
        heightMax: 100,
        heightMin: 100,
      },
    }
  },
  watch: {
    activeMessage: {
      handler(newVal) {
        if (newVal) {
          const {
            content,
            files,
          } = newVal
          this.formData.content = content
          this.formData.files = files
        }
      },
    },
  },
  methods: {
    resetFroalaEditor() {
      this.formData.content = ''
      this.formData.files = []
      this.fileList = []
    },
    closeFroalaEditor() {
      this.resetFroalaEditor()
      this.$emit('handle-edit-show')
    },
    async addMessage() {
      if (!this.formData.content) {
        this.$message({
          message: '留言內容未填寫',
          type: 'error',
        })
        return
      }
      try {
        await apiHandovers.addHandoverMsgs(this.id, this.formData)
        this.$message({
          message: '資料新增成功',
          type: 'success',
        })
        this.$emit('reload-message')
      } catch {
        // pass
      } finally {
        this.closeFroalaEditor()
      }
    },
    async updateMessage() {
      try {
        const {
          id,
        } = this.activeMessage
        await apiHandovers.updateHandoverMsgs(id, this.formData)
        this.$message({
          message: '資料更新成功',
          type: 'success',
        })
        this.$emit('reload-message')
      } catch {
        // pass
      } finally {
        this.closeFroalaEditor()
      }
    },
    downloadFile(url, fileName) {
      saveAs(url, fileName)
    },
    async uploadAction(request) {
      this.fileUploading = true
      const formData = new FormData()
      formData.append('file', request.file)
      try {
        const res = await common.fileUpload(formData)
        const file = {
          id: res.id,
          name: request.file.name,
          link: null,
        }
        this.formData.files.push(file)
      } catch {
        this.$message({
          message: '檔案無法上傳',
          type: 'warning',
        })
      }

      this.fileUploading = false
    },
    clearFileChange(file) {
      const index = this.formData.files.find(item => item.name === file.name)
      this.formData.files.splice(index, 1)
    },
    handleExceed() {
      this.message({
        message: '上傳的檔案數量超過上限',
        type: 'warning',
      })
    },
    beforeUpload() {
      return true
    },
  },
}
</script>
<style lang="scss" scoped>
  .responseArea::v-deep {
    position: absolute;
    bottom: 3.2rem;
    padding: 1rem;
    width: 100%;
    background-color: #f1f1f1;
    z-index: 1;
    box-shadow: 0 -4px 8px -2px rgba(0, 0, 0, 0.2);

    .fr-box .fr-view {
      min-height: 100px;
    }

    .uploader {
      margin: 10px 0 5px;
      width: 100%;

      .el-upload {
        width: 100%;

        .el-upload-dragger {
          width: 100%;
          height: auto;

          .el-upload__text {
            display: flex;
            justify-content: center;
            padding: 10px;
          }

          .el-icon-upload {
            line-height: 1;
            margin: 0 10px 0 0;
            font-size: 40px;
            color: #606266;
          }

          p {
            text-align: left;
          }
        }
      }
    }

    .btns {
      button {
        width: calc(50% - 5px);
      }
    }
  }
</style>
