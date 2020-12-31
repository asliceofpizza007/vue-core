<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="位置"
          prop="position"
        )
          el-select(v-model="formData.position" clearable
            ref="firstColumn"
          )
            el-option(
              v-for="item in enumRefs.adPosition"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          label="連結方式"
          prop="openType"
        )
          el-radio-group(v-model="formData.openType")
            el-radio(
              v-for="item in enumRefs.openType"
              :key="item.id"
              :label="item.id"
            ) {{ item.name }}
        el-form-item(
          label="連結網址"
          prop="link"
          :rules="[\
            { required: true, message: '↑此項必填' },\
            { validator: checkpath },\
            { max: 255, message: '最多只能255個字' }]"
        )
          el-input(
            v-model="formData.link"
            :placeholder="linkPlaceholder"
          )
        el-form-item(label="上架日期")
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
        el-form-item(
          label="描述"
          prop="description"
          :rules="[{max: 150, message: '最多只能150個字'}]"
        )
          el-input(
            v-model="formData.description"
            maxLength=20
          )
        el-form-item(
          label="圖片管理"
          prop="imageFileSet"
          :rules="[{ required: true },{ validator: checkImg }]"
          :class="{hasPcPath:formData.imageFileSet.pcPath}"
        )
          ImgUploader(
            v-for="(type, key) in condiction"
            :key="key"
            v-model="formData.imageFileSet[key]"
            :size="type.size"
            :title="type.title"
            :fileSize="type.fileSize"
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
import apiAdvertise from '@api/apiAdvertise'
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'
import { numberValidator, replaceToDate } from '@/utils'
import { PanelMixin } from '@/mixins'
import ImgUploader from './subComponents/ImgUploader'

export default {
  name: 'EditAd',
  components: {
    ImgUploader,
  },
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
    position: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      adClass: ['活動', '遊戲', '優惠'],
      formData: {
        position: this.position,
        sequence: null,
        link: null,
        openType: null,
        publishedOn: null,
        finishedOn: null,
        description: null,
        isEnabled: true,
        imageFileSet: {
          pc: '',
          mb: '',
        },
      },
      condiction: {
        pc: {
          size: {
            w: 1920,
            h: 425,
          },
          title: 'PC廣告圖(單檔上傳)',
        },
        mb: {
          size: {
            w: 1024,
            h: 1366,
          },
          title: 'PC廣告圖(單檔上傳)',
        },
      },
      publishedRange: null,
      loading: false,
      validator: numberValidator,
      checkImg: (rule, value, callback) => {
        if (!value.pcPath || !value.mbPath) {
          callback(new Error('↑請上傳圖片'))
        } else {
          callback()
        }
      },
    }
  },
  computed: {
    ...mapState('app', {
      enumRefs: state => state.enumRefs,
    }),
    getFileSet() {
      const files = []
      Object.keys(this.formData.imageFileSet).forEach(item => {
        files.push({
          key: item,
          path: this.formData.imageFileSet[item],
        })
      })
      return files
    },
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
        const res = await apiAdvertise.getAdvertise(this.id)
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
      let api = apiAdvertise.addAdvertise
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiAdvertise.updateAdvertise
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
    timeChange() {
      if (this.publishedRange) {
        this.formData.publishedOn = this.publishedRange[0]
        this.formData.finishedOn = this.publishedRange[1]
      } else {
        this.formData.publishedOn = null
        this.formData.finishedOn = null
      }
    },
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
