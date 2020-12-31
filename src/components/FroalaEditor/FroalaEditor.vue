<template lang="pug">
  froala#froalaEditor(
    tag="textarea"
    :config="config"
    :value="value"
    @input="handleInput"
  )
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'FroalaEditor',
  props: {
    customConfig: {
      type: Object,
      default: null,
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      config: {
        language: 'zh_tw',
        zIndex: 1000,
        placeholderText: '請輸入內容',
        /** 預設工具列 */
        toolbarButtons: [
          'fullscreen', '|',
          'fontFamily', 'fontSize', 'color', 'bold', 'italic', '|',
          'underline', 'strikeThrough', '|',
          'superscript', 'subscript', '|',
          'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|',
          'insertLink', 'insertImage', 'insertVideo', 'insertTable', '|',
          'emoticons', 'specialCharacters', 'insertHR', '|',
          'html', 'help',
        ],
        /** image upload */
        requestWithCORS: true,
        imageUploadMethod: 'POST',
        requestHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('ctlToken'),
        },
        imageUploadParam: 'file',
        imageUploadURL: process.env.VUE_APP_APIPATH + '/v1/fileUpload/img',
        /** 插入圖片按鈕（取消imageManager） */
        imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
        /** 關閉檔案上傳功能 */
        fileUpload: false,
        /** 表格樣式選擇 */
        tableCellMultipleStyles: true,
        tableCellStyles: {
          tableStyle: 'Default',
        },
        /** 連結皆以新分頁開啟 */
        linkAlwaysBlank: true,
      },
    }
  },
  created() {
    this.config = Object.assign(this.config, this.customConfig)
  },
  methods: {
    handleInput(e) {
      if (e.length > 65535) {
        this.errorMsg(e.length)
      } else {
        this.$emit('input', e)
      }
    },
    errorMsg: debounce(function (l) {
      this.$message({
        type: 'error',
        message: `您輸入的內容過多超過儲存上限 ${l - 65535} 字元，請簡化樣式或文字`,
      })
    }, 500),
  },
}
</script>

<style lang="scss">
.editorFroala {
  button[data-cmd='imageManager'],
  button[data-cmd='videoUpload'] {
    display: none !important;
  }
}

.tableStyle {
  padding: 0.5rem;
  border: 1px solid #ddd;
}
</style>
