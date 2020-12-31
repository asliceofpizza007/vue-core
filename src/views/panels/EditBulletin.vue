<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        div.innerLeft
          el-form-item(
            label="主分類"
            prop="mainClassId"
            :rules="[{ required: true, validator: mainClassValidator, }]"
          )
            el-select(v-model="formData.mainClassId"
              ref="firstColumn"
              clearable
              @change="onMainClassChange"
            )
              el-option(
                v-for="item in bulletinClassList"
                :key="item.mainClassId"
                :label="item.mainClassName"
                :value="item.mainClassId"
              )
          el-form-item(
            label="次分類"
            prop="subClassId"
            :rules="[{ required: true, validator: subClassValidator, }]"
          )
            el-select(
              v-model="formData.subClassId"
              :disabled="!formData.mainClassId"
              clearable
            )
              el-option(
                v-for="item in subClassIdList"
                :key="item.subClassId"
                :label="item.subClassName"
                :value="item.subClassId"
              )

          el-form-item(
            :label="$t('th.title')"
            prop="title"
            :rules="[{ required: true, message: '↑此項必填' }]"
          )
            el-input(
              v-model="formData.title"
            )

          el-form-item(
            label="開放編輯"
            :rules="[{ required: true, message: '↑此項必填' }]"
          )
            el-switch(
              class="switch-group"
              v-model="formData.isPrivate"
              active-text="公開"
              inactive-text="私人"
              :active-value="false"
              :inactive-value="true"
              @change="handlePrivateChange"
            )
          el-form-item(
            label="上架日期"
            prop="publishedRange"
            :rules="[{ required: true, message: '↑此項必填' }]"
          )
            el-date-picker(
              v-model="formData.publishedRange"
              type="datetimerange"
              :picker-options="getPickerOptions"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              placeholder="選擇上架日期範圍"
              value-format="yyyy-MM-dd HH:mm:ss"
            )
          el-form-item(
            label="內容"
            prop="content"
            :rules="[{ required: true, message: '↑此項必填' }]"
          )
            FroalaEditor(
              v-model="formData.content"
              :customConfig="froalaConfig"
            )
          template(v-if="id")
            el-form-item(label="發布記錄")
              el-tag(
                type="bd-info"
                :disable-transitions="true"
              )
                i.el-icon-user-solid
                span {{ createdByName }}
              el-tag(
                type="bd-info"
                :disable-transitions="true"
              )
                i.el-icon-time
                span {{ createdOn }}
            el-form-item(label="更新記錄")
              el-tag(
                type="bd-info"
                :disable-transitions="true"
              )
                i.el-icon-user-solid
                span {{ updatedByName }}
              el-tag(
                type="bd-info"
                :disable-transitions="true"
              )
                i.el-icon-time
                span {{ updatedOn }}
        div.innerRight
          el-form-item(
            label="閱讀人員"
          )
            div
              el-button(
                type="add"
                icon="fa fa-user-plus"
                @click="showChooseMemberPanel()"
              ) {{ !formData.readers.length ? '閱讀人員' : `已選擇 ${formData.readers.length} 人` }}
            MemberTagsList.editors(
              v-if="formData.readers.length"
              :memberChosenList.sync="formData.readers"
            )
            .blank(v-else)
              .title
              .content 尚未選取任何人員
          el-form-item(
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
import apiBulletins from '@api/apiBulletins'
import FroalaEditor from '@c/FroalaEditor'
import { PanelMixin } from '@/mixins'
import { contentReformat } from '@/utils'
import MemberTagsList from '@c/MemberTagsList'
import { mapState } from 'vuex'

export default {
  name: 'EditBulletin',
  components: {
    FroalaEditor,
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
    mainClassName: {
      type: String,
      default: null,
    },
    createdByName: {
      type: String,
      default: null,
    },
    updatedByName: {
      type: String,
      default: null,
    },
    createdOn: {
      type: String,
      default: null,
    },
    updatedOn: {
      type: String,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    const mainClassValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('↑此項必填'))
      } else if (!this.bulletinClassList.find(list => list.mainClassId === value)) {
        callback(new Error('分類已停用，請重新選擇'))
      } else {
        if (value) {
          this.$refs.editForm.validateField('subClassId')
        }
        callback()
      }
    }
    const subClassValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('↑此項必填'))
      } else if (!Object.keys(this.subClassIdList).find(key => {
        return this.subClassIdList[key].subClassId === value
      })) {
        callback(new Error('分類已停用，請重新選擇'))
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
      loading: false,
      subClassId: [],
      formData: {
        mainClassId: null,
        subClassId: null,
        title: null,
        content: null,
        isPrivate: false,
        publishedRange: null,
        publishedOn: null,
        finishedOn: null,
        readers: [],
        contractors: [],
      },
      froalaConfig: {
        width: '100%',
        heightMin: 180,
        heightMax: 300,
      },
      mainClassValidator,
      subClassValidator,
      contractorValidator,
    }
  },
  computed: {
    ...mapState('app', {
      isPrivate: state => state.isPrivate,
    }),
    ...mapState('options', {
      bulletinClassList: state => state.bulletinClassList,
      contractorList: state => state.contractorList,
    }),
    subClassIdList() {
      const mainClass = this.bulletinClassList.find(item => {
        return item.mainClassId === this.formData.mainClassId
      })

      return mainClass ? mainClass.subClasses : null
    },
    getPickerOptions() {
      return {
        // disabled date before today
        disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000,
      }
    },
  },
  created() {
    if (this.id) {
      this.getRowData()
    } else {
      this.formData.isPrivate = this.isPrivate
    }
  },
  methods: {
    async getRowData() {
      try {
        this.loading = true
        const res = await apiBulletins.getBulletins(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        this.setMainSubClass()
        const {
          content,
          contractors,
          subClassId,
          publishedOn,
          finishedOn,
        } = this.formData
        this.formData.content = contentReformat(content)
        // handle if the response contractor is not existed
        this.formData.contractors = contractors.filter(id => {
          return this.contractorList.find(list => list.id === id)
        })
        // handle if subClass is disabled
        if (!this.subClassIdList
          || !Object.keys(this.subClassIdList).find(key => {
            return this.subClassIdList[key].subClassId === subClassId
          })
        ) {
          this.formData.subClassId = null
        }
        this.formData.publishedRange = [publishedOn, finishedOn]
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
    setMainSubClass() {
      const match = this.bulletinClassList.find(list => list.mainClassName === this.mainClassName)
      if (match) {
        this.formData.mainClassId = match.mainClassId
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
      const temp = { ...this.formDataPayload }
      temp.publishedOn = temp.publishedRange[0]
      temp.finishedOn = temp.publishedRange[1]
      delete temp.publishedRange
      delete temp.mainClassId

      const postData = [temp]

      let api = apiBulletins.addBulletins
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiBulletins.updateBulletins
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
    closePanel() {
      this.$parent.$emit('close')
    },
    handlePrivateChange(status) {
      this.$store.dispatch('app/setisPrivate', status)
    },
    onMainClassChange() {
      this.formData.subClassId = null
    },
    showChooseMemberPanel() {
      const settings = {
        component: 'MembersChoose',
        headerTitle: '選擇閱讀人員',
        contentSize: {
          width: '560px',
          height: '70%',
        },
        bgPanel: '#05517c',
      }

      const props = {
        selectedMembers: this.formData.readers,
      }

      const events = {
        'update-member-chosen-list': readers => {
          this.formData.readers = readers
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
  },
}
</script>
<style lang="scss" scoped>
.contentInner {
  display: flex;

  /deep/ .el-select {
    width: 100%;
  }

  .innerLeft {
    width: 500px;

    /deep/.fr-wrapper {
      padding: 0 28px;
      background-color: #e6e6e6;

      .fr-element {
        background-color: #fff;
      }

      .fr-placeholder {
        left: 30px;
        z-index: 2;
        pointer-events: none;
      }
    }

    /deep/ .el-form-item__content {
      .el-date-editor--datetimerange {
        width: 100%;

        .el-input__icon {
          line-height: 26px;
        }

        .el-range-separator {
          width: 10%;
          line-height: 26px;
        }
      }

      .el-tag {
        margin-right: 10px;
        color: #347ea9;
        background: #e2f2fb;
        border: 1px solid #347ea9;

        >span {
          margin-left: 5px;
        }
      }
    }
  }

  .innerRight {
    flex: 1;

    .editors {
      display: block;
      margin-top: 10px;
      height: auto;
    }

    .blank {
      margin-top: 10px;
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      .title {
        height: 28px;
        background-color: #609279;
        line-height: 2;
      }

      .content {
        padding: 0.5em;
        text-align: center;
      }
    }
  }
}
</style>
