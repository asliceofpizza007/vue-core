<template lang="pug">
  .panelContent
    .contentWrapper
      .contentInner
        .heading 批次操作 {{ list.length }} 筆資料
        el-form
          el-form-item(label="影片上下架")
            el-radio-group(v-model="formData.isReleased")
              el-radio(:label="0") 不修改
              el-radio(:label="1") 上架
              el-radio(:label="2") 下架
          el-form-item(label="免費影片")
            el-radio-group(v-model="formData.isFree")
              el-radio(:label="0") 不修改
              el-radio(:label="1") 免費
              el-radio(:label="2") 付費
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        type="success"
        @click="videoBatchSetting"
      ) 儲存
</template>
<script>
import debounce from 'lodash/debounce'
import apiVideo from '@api/apiVideo'

export default {
  name: '',
  props: {
    list: {
      type: Array,
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
        isReleased: 0,
        isFree: 0,
      },
    }
  },
  computed: {
    getPayLoad() {
      const load = {
        IdSet: this.list.map(item => item.id),
        isEnabled: this.stateValue(this.formData.isReleased),
        isFree: this.stateValue(this.formData.isFree),
      }
      return load
    },
  },
  methods: {
    stateValue(val) {
      switch (val) {
        case 1:
          return true
        case 2:
          return false
        default:
          return null
      }
    },
    videoBatchSetting: debounce(async function () {
      try {
        await apiVideo.videoBatchSetting(this.getPayLoad)
        this.$emit('refresh-page')
        this.closePanel()
        this.$message({
          message: '更改成功',
          type: 'success',
        })
      } catch {
        // pass
      }
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
