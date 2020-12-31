<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="名稱"
          prop="name"
        )
          el-input(v-model="formData.name"
            ref="firstColumn"
            naxLength="100"
          )
        el-form-item(
          label="描述"
          prop="description"
          :rules="[{ required: true, message: '↑此項必填' },{max: 255, message: '最多只能255個字'}]"
        )
          el-input(
            v-model="formData.description"
          )
        el-form-item(
          label="FTP 影片檔名"
          prop="fileName"
        )
          el-input(
            v-model="formData.fileName"
            placeholder="請輸入影片名稱"
          )
            el-button(
              slot="append"
              type="add"
              icon="el-icon-video-camera"
              @click="getPlatformAdPreviewLink"
            ) 預覽影片
        el-form-item(label="上架時間")
          el-date-picker(
            v-model="publishedRange"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="選擇上架日期範圍"
            @change="timeChange"
            @clear="timeChange"
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
      .videoPreview(v-if="videoSrc")
        video(
          controls
          autoplay
          name="media"
          ref="videoPreview"
        )
          source(
            :src="videoSrc"
            @error="videoError"
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
import apiPlatformAd from '@api/apiPlatformAd'
import { PanelMixin } from '@/mixins'
import { replaceToDate } from '@/utils'

export default {
  name: 'EditPlatformAd',
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
      videoSrc: '',
      formData: {
        name: null,
        description: null,
        fileName: null,
        publishedOn: null,
        finishedOn: null,
        isEnabled: true,
      },
      publishedRange: null,
      loading: false,
    }
  },
  created() {
    if (this.id) {
      this.getPlatformAd()
    }
  },
  methods: {
    async getPlatformAd() {
      this.loading = true
      try {
        const res = await apiPlatformAd.getPlatformAd(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        if (res.publishedOn.indexOf('0000-00-00') > -1) {
          this.formData.publishedOn = null
          this.formData.finishedOn = null
          this.publishedRange = ['', '']
        } else {
          this.formData.publishedOn = replaceToDate(res.publishedOn)
          this.formData.finishedOn = replaceToDate(res.finishedOn)
          this.publishedRange = [res.publishedOn, res.finishedOn]
        }
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
      let api = apiPlatformAd.addPlatformAd
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiPlatformAd.updatePlatformAd
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
    getPlatformAdPreviewLink: debounce(async function () {
      try {
        const res = await apiPlatformAd.getPlatformAdPreviewLink(this.formData.fileName)
        this.videoSrc = res.filePath
      } catch {
        this.videoSrc = ''
      }
      this.$nextTick(() => {
        if (this.videoSrc) {
          this.$refs.videoPreview.load()
        }
      })
    }, 600),
    timeChange() {
      if (this.publishedRange) {
        this.formData.publishedOn = this.publishedRange[0]
        this.formData.finishedOn = this.publishedRange[1]
      } else {
        this.formData.publishedOn = null
        this.formData.finishedOn = null
      }
    },
    videoError() {
      this.videoSrc = ''
      this.$message({
        message: '錯誤404，影片連結無法撥放',
        type: 'error',
      })
    },
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep.videoPreview {
  width: 100%;
  height: 100%;

  video {
    width: 100%;
    height: 100%;
  }
}

::v-deep.el-form-item {
  .el-form-item__label {
    width: 115px !important;
  }
}

</style>
