<template lang="pug">
  #memberInfo.views(ref="view")
    el-popover(
      ref="popoverColumn"
      placement="bottom"
      trigger="click"
      popper-class="columSetting"
      v-model="showColumnSetting"
    )
      AdvancedSearch(
        v-if="showColumnSetting"
        :columns="columns"
        @set-columns="setColumns"
      )
    .searchBlock(ref="searchBlock")
      div
        el-form(class="complex-group" :model="condition")
          el-form-item(:label="$t('th.isEnabled')")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item(label="註冊來源")
            el-select(
              v-model="condition.sourceType"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'AV 註冊'" :value="1") AV 註冊
              el-option(:label="'平台註冊'" :value="2") 平台註冊
          el-form-item(label="帳號")
            el-input(
              v-model="condition.account"
              placeholder="帳號 (模糊搜尋)"
              @keyup.native.enter="getListWithDebounce"
              clearable
            )
          el-form-item(label="AV 層級")
            el-select(
              v-model="condition.isVIP"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'一般會員'" :value="false") 一般會員
              el-option(:label="'VIP會員'" :value="true") VIP會員
      div
        el-form(class="complex-group" :model="condition")
          el-form-item(class="selectTimer-group" label="時間")
            el-select(
              slot="label"
              v-model="condition.searchField"
              @change="getListWithDebounce"
            )
              el-option(
                :label="'註冊時間'"
                :value="'註冊時間'"
              ) 註冊時間
              el-option(
                :label="'觀看時間'"
                :value="'觀看時間'"
              ) 觀看時間
            el-date-picker(v-model="condition.date"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd"
            )
          el-form-item.search-form
            el-button(
              type="search"
              icon="el-icon-search"
              @click="getListWithDebounce"
            ) 搜尋
          el-form-item
            el-button(
              v-popover:popoverColumn
              class="advancedSearch"
              type="search"
            ) 進階
        .btnWrap
          el-button(
            type="refresh"
            icon="el-icon-refresh-right"
            @click="getListWithDebounce"
          ) 重新整理
          el-button(
            type="success"
            icon="el-icon-document-copy"
            @click="exportExcel"
          ) 匯出Excel
          el-button(
            type="view"
            icon="el-icon-edit"
            @click="handleAction({action:'viewSetting'})"
          ) 觀看條件設定
          el-button(
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增帳號
    .tableSection
      TableWrapper(
        ref="tableWrapper"
        :tableHeight="tableHeight"
        :tableData="tbData.list"
        :totalSize="tbData.totalSize"
        :pagination="pagination"
        :paginationType="paginationType"
        :columnSetting="columnSetting"
        :listLoading="listLoading"
        :currentSort="getSorter"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import TableWrapper from '@c/TableWrapper'
import AdvancedSearch from '@c/AdvancedSearch'
import apiMemberInfo from '@api/apiMemberInfo'
import debounce from 'lodash/debounce'
import {  exportExcel, fromRange } from '@/utils'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'MemberInfo',
  components: {
    TableWrapper,
    AdvancedSearch,
  },
  mixins: [CommonMixin],
  data() {
    return {
      showColumnSetting: false,
      tableHeight: 0,
      condition: {
        isEnabled: true,
        sourceType: null,
        account: null,
        isVIP: null,
        searchField: '註冊時間',
        date: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      columnSetting: [
        columnModule.id(80, 'left'),
        {
          prop: 'account',
          label: 'th.account',
          fixed: 'left',
        },
        {
          prop: 'isVIP',
          label: 'th.isVIP',
          width: 100,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span>
                { val ? 'VIP 會員' : '一般會員' }
              </span>
            )
          },
        },
        {
          prop: 'createdOn',
          label: 'th.createdOn',
          width: 170,
        },
        {
          prop: 'loginDayCount',
          label: 'th.loginDayCount',
          width: 100,
        },
        {
          prop: 'viewDayCount',
          label: 'th.viewDayCount',
          width: 100,
          sortable: true,
        },
        columnModule.updatedOn(170),
        columnModule.isEnabled(100, false),
        columnModule.updatedByName(null),
      ],
      listLoading: false,
      downloadExcel: false,
    }
  },
  computed: {
    getPayLoad() {
      const params = {}
      if (!this.downloadExcel) {
        params.page = this.pagination.pageNum
        params.pageSize = this.pagination.pageSize
      }
      const dateTime = fromRange(this.condition)
      if (dateTime.endOn) {
        dateTime.endOn.replace('00:00:00', '23:59:59')
      }
      Object.keys(this.condition).forEach(key => {
        const value = this.condition[key]
        if (key !== 'date') {
          params[key] = value
        }
      })

      const load = {}
      return Object.assign(load, params, dateTime)
    },
    columns() {
      return this.columnSetting.map(column => column.prop)
    },
  },
  created() {
    this.getList()
    this.$bus.$on('resize-table-height', this.setTableHeight)
  },
  mounted() {
    this.setTableHeight()
  },
  activated() {
    this.setTableHeight()
    this.$refs.tableWrapper.forceLayoutUpdate()
  },
  beforeDestroy() {
    this.$store.dispatch('JsPanels/closePanelByParent', this.$options.name)
    this.$bus.$off('resize-table-height')
  },
  methods: {
    setColumns(columns) {
      this.columnSetting = columns
    },
    async getList() {
      this.listLoading = true
      try {
        const res = await apiMemberInfo.getMemberList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    handleAction({ action, row = null }) {
      const component = {
        edit: 'EditAccount',
        record: 'AccountRecord',
        create: 'CreateAccount',
        viewSetting: 'ViewSetting',
      }
      const props = {
        action,
      }

      const headerTitle = {
        viewSetting: '觀看條件設定',
      }
      let id = 'only'
      if (row !== null) {
        id = row.id
        props.id = id
        headerTitle.edit = `帳號 - ${row.account} - #${id}`
        headerTitle.record = ` - ${row.account}`
      }

      const settings = {
        component: component[action],
        id,
        headerTitle: headerTitle[action],
      }

      if (action === 'record') {
        settings.contentSize = 'XL'
      }

      const events = {
        'refresh-page': () => {
          this.getListWithDebounce()
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
    exportExcel: debounce(async function () {
      this.downloadExcel = true
      try {
        const res = await apiMemberInfo.exportMemberInfo(this.getPayLoad)
        exportExcel(res)
      } catch {
        // pass
      }
      this.downloadExcel = false
    }, 600),
  },
}
</script>
<style lang="scss" scoped>
.searchBlock {
  > div {
    & + div {
      margin-top: 10px;
    }
  }

  ::v-deep.el-form-item__content {
    .el-date-editor {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
}
</style>
