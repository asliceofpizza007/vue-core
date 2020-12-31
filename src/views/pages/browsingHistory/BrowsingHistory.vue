<template lang="pug">
  #browsingHistory.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(label="查詢時間")
            el-date-picker(
              v-model="condition.date"
              type="daterange"
              tange-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="getListWithDebounce"
            )
          el-form-item.search-form
            el-button(
              type="search"
              icon="el-icon-search"
              @click="getListWithDebounce"
            ) 搜尋
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
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import TableWrapper from '@c/TableWrapper'
import apiBrowsingRecord from '@api/apiBrowsingRecord'
import debounce from 'lodash/debounce'
import { exportExcel, fromRange } from '@/utils'
import { CommonMixin } from '@/mixins'

export default {
  name: 'BrowsingHistory',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        date: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        'totalSize': 0,
        'list': [
          {
            date: '2018-01-13',
            loginAmount: 10,
            watchingAmoung: 5,
            registerAmoung: 2,
          },
        ],
      },
      columnSetting: [
        {
          prop: 'date',
          label: 'th.date',
          sortable: true,
          fixed: 'left',
        },
        {
          prop: 'loginAmount',
          label: 'th.loginAmount',
          sortable: true,
        },
        {
          prop: 'watchingAmoung',
          label: 'th.watchingAmoung',
          sortable: true,
        },
        {
          prop: 'registerAmoung',
          label: 'th.registerAmoung',
          sortable: true,
        },
      ],
      cusTomActions: ['record'], // to render custom action button
      showDefaultAction: false, // to disable functional column
      listLoading: false,
    }
  },
  computed: {
    getPayLoad() {
      const pageNum = {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      const data = fromRange(this.condition)
      const load = {}
      return Object.assign(load, pageNum, data)
    },
  },
  created() {
    // this.getList()
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
    async getList() {
      this.listLoading = true
      try {
        const res = await apiBrowsingRecord.getBrowsingRecordList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      }
      this.listLoading = false
    },
    handleAction({ action, row = null }) {
      if (action !== 'delete') {
        const settings = {
          component: 'BrowsingRecord',
          id: row.id,
          headerTitle: `日期：${row.date}`,
          contentSize: 'XL',
        }
        const props = {
          action,
          list: row,
        }
        this.$store.dispatch('JsPanels/addPanel', { settings, props })
      }
    },
    exportExcel: debounce(async function () {
      const value = this.condition.date
      const load = {
        startOn: value ? value[0] : null,
        endOn: value ? value[1] : null,
      }
      const res = await apiBrowsingRecord.exportBrowsingRecord(load)
      exportExcel(res)
    }, 600),
  },
}
</script>
