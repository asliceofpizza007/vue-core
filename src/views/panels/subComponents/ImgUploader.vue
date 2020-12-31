<template lang="pug">
  #ImgUploader
    .uploadBlock
      .title {{ title }}
        el-tooltip(
          effect="dark"
          placement="right"
        )
          span.el-icon-question
          div(slot="content")
            p 限制類型： jpg,gif,png
            p 限制大小： {{ fileSize }} MB
            p 限制尺寸： {{ size ? `${size.w}x${size.h}` : '無限制' }}
      el-upload(
        v-loading="loading"
        ref="elUpload"
        action
        drag
        :http-request="uploadAction"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :show-file-list="false"
        list-type="picture"
      )
        .btnIcon
          i.el-icon-upload
          p 檔案上傳
        .img(v-if="value")
          img(:src="value")
      button.removeBtn(
        type="button"
        @click="fileRemove"
        v-if="value"
      )
</template>
<script>
import common from '@api/common'

export default {
  name: 'ImgUploader',
  props: {
    value: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '圖檔',
    },
    fileSize: {
      type: Number,
      default: 1,
    },
    size: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async beforeUpload(file) {
      const errorMessage = []
      const pattern = /image\/(jpeg|png|gif)/
      const isAcceptType = pattern.test(file.type)
      const isAcceptSize = file.size / (1024 ** 2) <= this.fileSize
      let isAcceptWH = false
      if (isAcceptType) {
        isAcceptWH = await this.checkImgWH(file)
        if (!isAcceptWH) {
          const {
            w,
            h,
          } = this.size
          errorMessage.push(`上傳的圖片像素需為${w} * ${h}`)
        }
      } else {
        errorMessage.push('上傳的圖片格式僅能為*.jpg, *.png, *.gif')
      }

      if (!isAcceptSize) {
        errorMessage.push('上傳的圖片檔案大小需小於 1 MB')
      }

      if (errorMessage.length) {
        const message = errorMessage.join('&')
        this.$message({
          message,
          type: 'error',
        })
      }
      return (isAcceptType && isAcceptSize && isAcceptWH) || Promise.reject()
    },
    async uploadAction(request) {
      const formData = new FormData()
      formData.append('file', request.file)
      this.loading = true
      try {
        const res = await common.fileUpload(formData, 'img')
        this.$emit('input', res.link)
      } catch (err) {
        request.onError()
      } finally {
        this.loading = false
      }
    },
    checkImgWH(file) {
      return new Promise(resolve => {
        if (!this.size) { resolve(true) }
        const { w, h } = this.size
        const img = new Image()
        let valid
        img.onload = () => {
          valid = img.width <= w && img.height <= h
          resolve(valid)
        }
        img.src = URL.createObjectURL(file)
      })
    },
    handleExceed() {
      this.$message({
        message: '已達上傳上限',
        type: 'warning',
      })
    },
    fileRemove() {
      this.$refs.elUpload.clearFiles()
      this.$emit('input', '')
    },
  },
}
</script>
<style lang="scss" scoped>
#ImgUploader::v-deep {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  width: 100%;

  .uploadBlock {
    position: relative;
    width: 100%;

    .el-upload-list__item {
      width: 360px;

      .el-icon-document {
        display: none;
      }

      & > img {
        width: unset;
      }
    }
  }

  .el-upload {
    position: relative;
    width: 100%;
  }

  .el-upload-dragger {
    display: flex;
    width: 100%;
    height: 200px;

    .btnIcon,
    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .btnIcon {
      flex: 1;
      padding: 10px;

      .el-icon-upload {
        margin: 0;
        font-size: 50px;
        line-height: 1;
      }

      p {
        line-height: 1;
      }
    }

    .img {
      position: relative;
      padding: 30px;
      width: 50%;
      cursor: default;

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        display: block;
        width: 1px;
        height: 70%;
        content: '';
        transform: translateY(-50%);
        border-right: 1px solid #d9d9d9;
      }

      img {
        margin: 0;
        max-height: 100%;
      }
    }
  }

  .removeBtn {
    position: absolute;
    top: 40px;
    right: 5px;
    padding: 5px;
    cursor: pointer;

    &::before {
      font-size: 16px;
      font-family: element-icons;
      color: #606266;
      content: '';
    }
  }
}
</style>
