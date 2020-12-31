<template lang="pug">
  .panelContent.emsTheme
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
      )
        el-form-item(
          label="時間搜尋種類"
        )
          .hor-align
            el-select(
              v-model="formData.dateType"
            )
              el-option(
                :label="'交辦日期'"
                :value="1"
              )
              el-option(
                :label="'完成日期'"
                :value="2"
              )
            el-date-picker(v-model="publishedRange"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              @change="dateRangeChange"
            )
        el-form-item.tabList(
          label="交辦主旨"
        )
          TabList(
            :infoList.sync="formData.titleSet"
          )
          EnterInput(
            :disable="disableInputTitle"
            @enter="enterTitle"
          )
          .tip (最多可輸入 3 筆)
        el-form-item.tabList(
          label="交辦內文"
        )
          TabList(
            :infoList.sync="formData.contentSet"
          )
          EnterInput(
            :disable="disableInputContent"
            @enter="enterContent"
          )
          .tip (最多可輸入 3 筆)
        el-form-item.tabList(
          label="交辦人員"
        )
          MemberTagsList(
            :memberChosenList.sync="formData.publisherIdSet"
            :categorizeByDept="false"
          )
          el-button.chooseMember(v-show="!disableInputPublisher" @click="showChoosePublisherPanel")
            i(class="el-icon-plus")
          .tip (最多可輸入 3 筆)
        el-form-item(
          label="交辦狀態"
        )
          el-radio-group(
            v-model="formData.isFinish"
            size="small"
          )
            el-radio-button(:label="null") 全部
            el-radio-button(:label="false") 未完成
            el-radio-button(:label="true") 已結案
        el-form-item(
          label="邏輯選擇"
        )
          el-radio-group(
            v-model="formData.isMatchAll"
            size="small"
          )
            el-radio-button(:label="true") 全部符合
            el-radio-button(:label="false") 擇一符合
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        type="success"
        @click="checkValidate"
      ) 搜尋
</template>

<script>
import { PanelMixin } from '@/mixins'
import debounce from 'lodash/debounce'
import EnterInput from '@c/EnterInput'
import TabList from '@c/TabList'
import MemberTagsList from '@c/MemberTagsList'

export default {
  name: 'AdvancedFilter',
  components: {
    EnterInput,
    TabList,
    MemberTagsList,
  },
  mixins: [PanelMixin],
  props: {
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      publishedRange: null,
      formData: {
        dateBegin: null,
        dateEnd: null,
        dateType: 1,
        titleSet: [],
        contentSet: [],
        publisherIdSet: [],
        isMatchAll: true,
        isFinish: null,
      },
    }
  },
  computed: {
    disableInputTitle() {
      return this.formData.titleSet.length >= 3
    },
    disableInputContent() {
      return this.formData.contentSet.length >= 3
    },
    disableInputPublisher() {
      return this.formData.publisherIdSet.length >= 3
    },
  },
  methods: {
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.search()
        }
      })
    },
    search: debounce(async function () {
      try {
        this.$emit('search', this.formDataPayload)
        this.closePanel()
      } catch {
        // pass
      }
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
    },
    timeChange() {
      if (this.publishedRange) {
        this.formData.dateBegin = this.publishedRange[0]
        this.formData.dateEnd = this.publishedRange[1]
      } else {
        this.formData.dateBegin = null
        this.formData.dateEnd = null
      }
    },
    enterTitle(value) {
      this.formData.titleSet.push(value)
    },
    enterContent(value) {
      this.formData.contentSet.push(value)
    },
    showChoosePublisherPanel() {
      const settings = {
        component: 'MembersChoose',
        headerTitle: '選擇交辦人員',
        contentSize: {
          width: '560px',
          height: '70%',
        },
      }

      const props = {
        selectedMembers: this.formData.publisherIdSet,
        numberLimit: 3,
      }

      // 將更新的人員選單連動到 chosenEditor
      const events = {
        'update-member-chosen-list': val => {
          this.formData.publisherIdSet = []
          val.forEach(item => {
            this.formData.publisherIdSet.push(item)
          })
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
    async dateRangeChange(value) {
      if (value) {
        this.formData.dateBegin = value[0]
        this.formData.dateEnd = value[1]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .tabList::v-deep {
    .el-form-item__content {
      display: flex;

      .enterInput {
        width: 195px;
      }
    }

    .tip {
      margin: 0 0 0 10px;
      color: red;
    }
  }

  .hor-align {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
