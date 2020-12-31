<template lang="pug">
  #siteType.views.emsTheme(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item
            el-radio-group(
              v-model="condition.onlyCollected"
              @change="getListWithDebounce"
            )
              el-radio-button(:label="false") 全部
              el-radio-button(:label="true") 僅顯示收藏
          el-form-item.closely(label="站台")
            treeselect(
              v-model="condition.platformIdSet"
              multiple
              :options="computedPlatformList"
              placeholder="請選擇"
              loading-text="讀取中..."
              :max-height="400"
              class="selectBox"
              @input="onTreeSelect($event ,'platformIdSet')"
            )
          el-form-item.closely(label="類別")
            treeselect(
              v-model="condition.typeIdSet"
              multiple
              :options="computedTypeList"
              placeholder="請選擇"
              loading-text="讀取中..."
              :max-height="400"
              class="selectBox"
              @input="onTreeSelect($event ,'typeIdSet')"
            )
          el-form-item.closely(label="用途別")
            treeselect(
              v-model="condition.purposeIdSet"
              multiple
              :options="computedPurposeList"
              placeholder="請選擇"
              loading-text="讀取中..."
              :max-height="400"
              class="selectBox"
              @input="onTreeSelect($event ,'purposeIdSet')"
            )
        .btnWrap
          el-button(
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item.enableBox(label="狀態")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item.searchBox(label="名稱")
            el-input(
              v-model.trim="condition.keyword"
              placeholder="請輸入名稱"
              maxlength="10"
              clearable
              @keyup.native.enter="getListWithDebounce"
              @clear="getListWithDebounce"
            )
          el-button(
            type="search"
            icon="el-icon-search"
            @click="getListWithDebounce"
          ) 搜尋
    .tableSection
      TableWrapper(
        ref='tableWrapper'
        :tableHeight="tableHeight"
        :tableData="tbData.list"
        :totalSize="tbData.totalSize"
        :pagination="pagination"
        :paginationType="paginationType"
        :columnSetting="columnSetting"
        :listLoading="listLoading"
        :currentSort="getSorter"
        :disableDeletion="true"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import apiSitePassword from '@api/siteApi/apiSitePassword'
import TableWrapper from '@c/TableWrapper'
import { copyToClipboardByCreateInput } from '@/utils'
import { CommonMixin } from '@/mixins'
import { mapState } from 'vuex'
import columnModule from '@js/tableProp'
import cryptoJS from '@js/cryptoJS'
import ClipboardJS from 'clipboard'

export default {
  name: 'SitePassword',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      multiple: true,
      tableHeight: 0,
      typeSearch: '',
      condition: {
        onlyCollected: false,
        platformIdSet: [],
        typeIdSet: [],
        purposeIdSet: [],
        keyword: null,
        sortName: null,
        sort: null,
        isEnabled: true,
      },
      limitOption: 3,
      tbData: {},
      columnSetting: [
        columnModule.id(80),
        {
          prop: 'platformName',
          label: 'th.platformName',
          width: 100,
          sortable: true,
          render: (h, scope) => {
            const {
              row,
            } = scope
            return (
              <span>
                {row.platformName}
              </span>
            )
          },
        },
        {
          prop: 'typeName',
          label: 'th.typeName',
          width: 100,
          sortable: true,
          render: (h, scope) => {
            const {
              row,
            } = scope
            return (
              <span>
                {row.typeName}
              </span>
            )
          },
        },
        {
          prop: 'purposeName',
          label: 'th.purposeName',
          width: 100,
          sortable: true,
          render: (h, scope) => {
            const {
              row,
            } = scope
            return (
              <span>
                {row.purposeName}
              </span>
            )
          },
        },
        columnModule.account(),
        {
          label: 'th.function',
          width: 300,
          render: (h, scope) => {
            const {
              row,
            } = scope
            return (
              <div class="actions">
                { row.link !== null
                  ? <div class="link"
                    title={row.link}
                    onClick={() => { this.handleOpenUrl(row.link) }}
                  >
                    <i class="fa fa-link"></i>
                  </div> : null
                }
                <div class="copy account"
                  title="複製帳號"
                  data-clipboard-text={row.account}
                >
                  <i class="fa fa-user-circle-o"></i>
                </div>
                <div class="copy password"
                  title="複製密碼"
                  ref={scope.$index}
                >
                  <el-popover
                    placement="top"
                    title={`${row.account} - 複製密碼`}
                    width="200"
                    trigger="click"
                    onShow={() => this.handleCopyPassword(row.id)}
                    onHide={() => { this.cpassword = '' }}
                  >
                    <i class="fa fa-key" slot="reference"></i>
                    <div style="display: flex; align-items: center;">
                      <i class="el-icon-lock" style="font-size: 16px"></i>&nbsp;
                      <input type="text" value='*************' readonly style="width: 100%; height: 32px; position: relative; top: 3px;" />
                      <el-button type="bd-copy" onClick={() => this.copyPassword()}>複製</el-button>
                    </div>
                  </el-popover>
                </div>
                <div class={row.isCollected ? 'isCollected' : 'unisCollected'}
                  title={row.isCollected ? '取消收藏' : '加入收藏'}
                  onClick={() => { this.handleCollect(row.id, row.isCollected) }}
                >
                  <i class="fa fa-heart"></i>
                </div>
                {
                  !!row.remark
                  && <div class="remark">
                    <el-tag type="bd-info"
                      disable-transitions={true}
                    >
                      {`備註： ${row.remark}`}
                    </el-tag>
                  </div>
                }
              </div>
            )
          },
        },
        columnModule.isEnabled(90, false),
        columnModule.createdOn(100),
        columnModule.createdByName(100),
        columnModule.updatedOn(100),
        columnModule.updatedByName(100),
        columnModule.readerCount(100),
      ],
      paginationType: 'short',
      listLoading: false,
      clipboard: null,
      cpassword: '',
    }
  },
  computed: {
    ...mapState('options', {
      sitePlatformList: state => state.sitePlatformList,
      sitePurposeList: state => state.sitePurposeList,
      siteTypeList: state => state.siteTypeList,
    }),
    computedPlatformList() {
      return this.sitePlatformList.map(item => {
        return {
          id: item.id,
          label: item.name,
          isDisabled: false,
        }
      })
    },
    computedPurposeList() {
      return this.sitePurposeList.map(item => {
        return {
          id: item.id,
          label: item.name,
          isDisabled: false,
        }
      })
    },
    computedTypeList() {
      return this.siteTypeList.map(item => {
        return {
          id: item.id,
          label: item.name,
          isDisabled: false,
        }
      })
    },
    getPayLoad() {
      const load = {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      Object.keys(this.condition).forEach(key => {
        const value = this.condition[key]
        const arrayKey = /platformIdSet|typeIdSet|purposeIdSet/
        if (arrayKey.test(key)) {
          if (value.length === 0) {
            load[key] = []
          } else {
            load[key] = value
          }
        } else {
          load[key] = value
        }
      })
      return load
    },
  },
  created() {
    this.getList()
    this.initialCopyAccount()
    this.$bus.$on('resize-table-height', this.setTableHeight)
  },
  mounted() {
    this.setTableHeight()
  },
  activated() {
    this.setTableHeight()
    this.$refs.tableWrapper.forceLayoutUpdate()
  },
  destroyed() {
    this.clipboard.destroy()
  },
  beforeDestroy() {
    this.$store.dispatch('JsPanels/closePanelByParent', this.$options.name)
    this.$bus.$off('resize-table-height')
  },
  methods: {
    onTreeSelect(state, key) {
      const array = this.condition[key]
      this.limitAmount(key, array.length === this.limitOption)
      this.getListWithDebounce()
    },
    limitAmount(key, action) {
      const optionMap = {
        platformIdSet: {
          basicData: this.sitePlatformList,
          optionData: this.condition.platformIdSet,
        },
        typeIdSet: {
          basicData: this.siteTypeList,
          optionData: this.condition.typeIdSet,
        },
        purposeIdSet: {
          basicData: this.sitePurposeList,
          optionData: this.condition.purposeIdSet,
        },
      }
      const {
        basicData,
        optionData,
      } = optionMap[key]

      if (action) {
        basicData.forEach(option => {
          if (!optionData.find(id => option.id === id)) {
            const disableList = option
            disableList.isDisabled = true
          }
        })
      } else {
        basicData.forEach(item => {
          item.isDisabled = false
        })
      }
    },
    async getList() {
      this.listLoading = true
      try {
        const res = await apiSitePassword.getSitePasswordsList(this.getPayLoad)
        this.tbData = res
        await this.$nextTick()
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    handleAction({ action, row = null }) {
      if (action !== 'delete') {
        const titleProp = {
          action,
          page: '帳密列表',
        }
        if (row !== null) {
          titleProp.title = row.name ? row.name : ''
          titleProp.id = row.id
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditPassword',
          headerTitle,
          contentSize: {
            width: '1100px',
            height: '75%',
          },
          bgPanel: '#05517c',
        }
        const props = {
          action,
          focusOnOpen: false,
        }

        let id = 'only'
        if (row !== null) {
          id = row.id
          props.id = id
        } else {
          props.position = this.condition.position
        }
        settings.id = id

        const events = {
          'refresh-page': () => {
            this.getListWithDebounce(action)
          },
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      } else {
        const id = row.id
        const deleteApi = apiSitePassword.deleteSitePassword
        this.delete(id, deleteApi)
      }
    },
    handleOpenUrl(url) {
      // handle window open no referer
      const newWindow = window.open()
      newWindow.opener = null
      newWindow.location = url
    },
    initialCopyAccount() {
      this.clipboard = new ClipboardJS('.copy.account')
      this.clipboard.on('success', e => {
        e.clearSelection()
        this.$message({
          message: '帳號複製成功',
          type: 'success',
        })
      })
    },
    async handleCopyPassword(id) {
      const token = localStorage.getItem('ctlToken')
      const { jti, sub } = cryptoJS.parseJwt(token)
      try {
        const res = await apiSitePassword.getPassword(id)
        const password = cryptoJS.aesDecrypt(
          res.password,
          jti,
          `${sub.uuid.substring(sub.uuid.length - 8)}${sub.uuid.substring(0, 8)}`,
        )
        this.cpassword = password
      } catch (error) {
        console.error(error)
      }
    },
    async copyPassword() {
      try {
        await copyToClipboardByCreateInput(this.cpassword)
        this.$message.success('密碼複製成功，請妥善保存')
      } catch {
        this.$message.error('密碼複製失敗')
      }
    },
    async handleCollect(id, isCollected) {
      const actionMap = {
        add: {
          api: apiSitePassword.collectAccount,
          message: '收藏成功',
        },
        cancel: {
          api: apiSitePassword.cancelCollectAccount,
          message: '已取消收藏',
        },
      }
      const {
        api,
        message,
      } = actionMap[isCollected ? 'cancel' : 'add']
      try {
        await api(id)
        this.getListWithDebounce()
        this.$message({
          message,
          type: 'success',
        })
      } catch {
        // pass
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.searchBlock::v-deep {
  .selectBox {
    &.vue-treeselect {
      min-width: 150px;
      height: auto;
    }

    .vue-treeselect__control {
      width: auto;
      height: 34px;
      border: 1px solid #3c8dbc;
      border-radius: 0;
    }

    .vue-treeselect__x-container {
      display: inline-block;
      margin-top: 12px;
      margin-right: 2px;
    }
  }

  .searchBox {
    .el-input {
      width: 132px;
    }
  }

  .enableBox {
    &.el-form-item {
      .el-select {
        width: 132px;
      }
    }
  }

  .el-form-item__content {
    line-height: normal;
  }
}

.tableSection {
  #tableWrapper /deep/ {
    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      > div:not(:first-child) {
        margin-left: 8px;
      }

      i {
        font-size: 18px;
        cursor: pointer;
      }

      .link {
        color: #3c8dbc;
      }

      .account {
        color: #43725a;
      }

      .password {
        color: #ffb160;
      }

      .unisCollected {
        color: #e1e1e1;
      }

      .isCollected {
        color: #f56c6c;
      }

      .remark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        .el-tag {
          margin-right: 10px;
          height: auto;
          line-height: 22px;
          white-space: break-spaces;
        }
      }
    }

  }
}
</style>
