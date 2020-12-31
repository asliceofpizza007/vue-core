<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="交接主旨"
          prop="title"
        )
          el-input(v-model="formData.title"
            ref="firstColumn"
            placeholder="請輸入主旨..."
            maxLength="55"
          )
        el-form-item.inline-flex(
          label="交接類別"
          prop="typeId"
          :rules="[{ required: true, validator: typeValidator }]"
        )
          el-select(
            v-model="formData.typeId"
            @change="onTypeIdChange"
          )
            el-option(
              v-for="item in handoverTypeList.list"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            )
        el-form-item.inline-flex(
          label="交接狀態"
          prop="isFinish"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isFinish"
            active-text="已結案"
            inactive-text="未完成"
            @change="onFinishChange"
          )

        el-form-item.inline-flex(
          label="開放連結"
          prop="isUrlPublic"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isUrlPublic"
            active-text="開啟"
            inactive-text="關閉"
          )

        el-form-item.inline-flex(
          label="交接標籤"
          prop="tagId"
          :rules="[{ required: true, validator: tagValidator }]"
        )
          el-select(
            v-model="formData.tagId"
            :disabled="!formData.typeId"
          )
            el-option(
              v-for="item in handoverTagList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            )

        el-form-item.inline-flex(
          label="完成日期"
          prop="finishDate"
        )
          el-date-picker(
            v-model="formData.finishDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="選擇日期"
            @change="onFinishDateChange"
          )

        el-form-item.rate.inline-flex(
          label="重要程度"
          prop="importance"
        )
          el-rate(v-model="formData.importance" :max="3")

        el-form-item(label="交接負責人員")
          el-button(
            size="medium"
            icon="fa fa-user-plus"
            type="add"
            @click="showMembersChoose('editors')"
          ) {{ !formData.editors.length ? '負責人員' : `已選擇 ${formData.editors.length} 人` }}
          MemberTagsList.editors(
            v-if="formData.editors.length"
            :memberChosenList.sync="formData.editors"
          )

        el-form-item(label="交接閱讀人員")
          el-button(
            size="medium"
            icon="fa fa-user-plus"
            type="add"
            @click="showMembersChoose('readers')"
          ) {{ !formData.readers.length ? '閱讀人員' : `已選擇 ${formData.readers.length} 人` }}
          MemberTagsList.readers(
            v-if="formData.readers.length"
            :memberChosenList.sync="formData.readers"
          )

        el-form-item(label="附檔上傳")
          el-upload.uploader(action drag multiple
            :http-request="uploadAction"
            :before-upload="beforeUploadtest"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :limit="999"
          )
            .el-upload__text
              i.el-icon-upload(v-loading="fileUploading")
              p(v-if="!fileUploading") 請點選或拖拉檔案至此處上傳

        el-form-item(
          label="交接內容"
          prop="content"
        )
          FroalaEditor(
            v-model="formData.content"
            :customConfig="froalaConfig"
          )

        el-form-item(
          class="contractorItem"
          label="委外廠商"
          v-if="formData.contractors && contractorList.length"
          prop="contractors"
          :rules="[{ validator: contractorValidator }]"
        )
          el-select(
            v-model="formData.contractors"
            multiple
            filterable
          )
            el-option(
              v-for="item in contractorList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            )
    .buttonWrapper
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="checkValidate"
      )
        i.fa.fa-save
        span 儲存
      el-button(
        type="cancel"
        icon="el-icon-close"
        @click="closePanel"
      ) 取消
</template>

<script>
import debounce from 'lodash/debounce'
import apiHandovers from '@api/apiHandovers'
import { PanelMixin } from '@/mixins'
import common from '@api/common'
import FroalaEditor from '@c/FroalaEditor'
import {
  replaceToDate,
  contentReformat
} from '@/utils'
import TabList from '@c/TabList'
import MemberTagsList from '@c/MemberTagsList'
import moment from 'moment'
import { mapState } from 'vuex'
import ExcelUploader from './subComponents/ExcelUploader'

export default {
  name: 'EditHandoverInfo',
  components: {
    ExcelUploader,
    FroalaEditor,
    TabList,
    MemberTagsList,
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
  },
  data() {
    const typeValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('↑此項必填'))
      } else if (!this.handoverTypeList.list.find(type => type.typeId === value)) {
        callback(new Error('類別已停用，請重新選擇'))
      } else {
        if (value) {
          this.$refs.editForm.validateField('tagId')
        }
        callback()
      }
    }
    const tagValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('↑此項必填'))
      } else if (!this.tagIdSetList.find(list => list.id === value)) {
        callback(new Error('標籤已停用，請重新選擇'))
      } else {
        callback()
      }
    }
    const contractorValidator = (rule, value, callback) => {
      if (!value.length) {
        callback()
      } else if (value.every(el => {
        return this.contractorList.find(list => list.id === el)
      })) {
        callback()
      } else {
        callback(new Error('含有未許可廠商，請重新選擇'))
      }
    }
    return {
      formData: {
        title: null,
        typeId: null,
        tagId: null,
        importance: 1,
        editors: [],
        readers: [],
        isUrlPublic: false,
        isFinish: false,
        finishDate: null,
        content: null,
        files: [],
        contractors: [],
      },
      loading: false,
      fileUploading: false,
      froalaConfig: {
        width: '100%',
        heightMin: 180,
        heightMax: 500,
      },
      readers: null,
      editors: null,
      fileList: [],
      typeValidator,
      tagValidator,
      contractorValidator,
    }
  },
  computed: {
    ...mapState('app', {
      isUrlPublic: state => state.isUrlPublic,
    }),
    ...mapState('options', {
      contractorList: state => state.contractorList,
      handoverTagList: state => state.handoverTagList,
      handoverTypeList: state => state.handoverTypeList,
    }),
    tagIdSetList() {
      const typeId = this.handoverTypeList.list.find(item => {
        return item.typeId === this.formData.typeId
      })
      const tagsList = typeId ? this.handoverTagList.filter(item => {
        return typeId.tagIdSet.indexOf(item.id) > -1
      }) : null

      return tagsList
    },
    getPayload() {
      const getPayload = this.formData
      getPayload.finishDate = replaceToDate(this.formData.finishDate)
      return getPayload
    },
  },
  created() {
    if (this.id) {
      this.getRowData()
    } else {
      this.formData.isUrlPublic = this.isUrlPublic
    }
  },
  methods: {
    async getRowData() {
      try {
        this.loading = true
        const res = await apiHandovers.getHandoversInfo(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        this.formData.finishDate = replaceToDate(res.finishDate)
        // handle if the response contractor is not existed
        this.formData.contractors = this.formData.contractors.filter(id => {
          return this.contractorList.find(list => list.id === id)
        })
        this.fileList = res.files.map(item => {
          return { name: item.name, url: item.link }
        })
        this.formData.content = contentReformat(this.formData.content)
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
      let api = apiHandovers.addHandoversInfo
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiHandovers.updateHandoversInfo
        message = '資料更新成功'
      }
      try {
        this.loading = true
        await api(...postData)
        this.$message({
          message,
          type: 'success',
        })
        await this.$store.dispatch('app/setIsUrlPublic', this.formData.isUrlPublic)
        this.$store.dispatch('updateUserPreferencesDirectly')

        this.$emit('refresh-page')
        this.closePanel()
      } catch {
        // interceptor handle
      } finally {
        this.loading = false
      }
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
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
        request.onSuccess()
      } catch (err) {
        request.onError()
        this.$message({
          message: '檔案上傳發生錯誤，請聯繫系統管理員確認檔案傳輸限制',
          type: 'error',
        })
      } finally {
        this.fileUploading = false
      }
    },
    beforeUploadtest(file) {
      const fileSize = file.size / (1024 ** 2)
      if (fileSize >= 10) {
        this.$message({
          message: '檔案大小需小於 10 MB',
          type: 'error',
        })
        return false
      }
      return true
    },
    handleRemove(file) {
      const index = this.formData.files.find(item => item.name === file.name)
      this.formData.files.splice(index, 1)
    },
    handleExceed() {
      this.$message({
        message: '已達上傳上限',
        type: 'warning',
      })
    },
    showMembersChoose(target) {
      const infoMap = {
        editors: {
          title: '負責',
          member: this.formData.editors,
          updatelist: val => {
            this.formData.editors = []
            val.forEach(item => {
              this.formData.editors.push(item)
            })
          },
        },
        readers: {
          title: '閱讀',
          member: this.formData.readers,
          updatelist: val => {
            this.formData.readers = []
            val.forEach(item => {
              this.formData.readers.push(item)
            })
          },
        },
      }

      const settings = {
        component: 'MembersChoose',
        headerTitle: `選擇${infoMap[target].title}人員`,
        contentSize: {
          width: '560px',
          height: '70%',
        },
        bgPanel: '#05517c',
      }

      const props = {
        selectedMembers: infoMap[target].member,
      }
      const events = {
        'update-member-chosen-list': val => {
          infoMap[target].updatelist(val)
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
    onTypeIdChange() {
      this.formData.tagId = null
    },
    onFinishChange(status) {
      const today = replaceToDate(new Date())
      const dateEarlierThanToday = moment(this.formData.finishDate).isSameOrBefore(moment().format('YYYY-MM-DD'))
      // handle if resolve
      if (status) {
        this.formData.finishDate = today
      } else if (dateEarlierThanToday) {
        this.formData.finishDate = null
      }
    },
    onFinishDateChange(date) {
      // handle if date early than today
      const dateEarlierThanToday = moment(date).isSameOrBefore(moment().format('YYYY-MM-DD'))
      this.formData.isFinish = dateEarlierThanToday
    },
  },
}
</script>

<style lang="scss" scoped>
  .panelContent::v-deep .contentWrapper .contentInner .el-form-item {
    &::after,
    &::before {
      content: none;
    }

    &.inline-flex {
      display: inline-flex;
      width: 33.33%;
    }
  }

  .rate::v-deep {
    .el-rate {
      height: 1.8rem;
      line-height: 1.8rem;

      .el-rate__icon {
        font-size: 1.5rem;
      }
    }
  }

  .el-date-editor::v-deep {
    width: 100%;
  }

  .relatedMemberTagsList::v-deep {
    width: 100%;
  }

  .el-form-item .editors::v-deep,
  .el-form-item .readers::v-deep {
    margin: 10px 0 0;
    height: 9.2rem;
  }

  .el-form-item .uploader::v-deep {
    margin: 10px 0 5px;
    width: 100%;

    .el-upload {
      width: 100%;

      .el-upload-dragger {
        width: 100%;
        height: auto;

        .el-upload__text {
          display: flex;
          align-items: center;
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
          line-height: 1;
        }
      }
    }
  }

  .contractorItem {
    .el-select {
      width: 50%;
    }
  }
</style>
