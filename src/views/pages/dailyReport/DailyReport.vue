<template lang="pug">
  #dailyReport.views(ref="view")
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
              end-placeholder="開始日期")
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
import debounce from 'lodash/debounce'
import TableWrapper from '@c/TableWrapper'
import apiDailyReport from '@api/apiDailyReport'
import { exportExcel  } from '@/utils'
import { CommonMixin } from '@/mixins'

export default {
  name: 'DailyReport',
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
            date: '2019-10-01',
            passanger: 88,
            normal: 93,
            vip: 0,
            vipDailyDeposit: 140323,
            newMemeber: 1,
            newMemberDeposit: 1,
          },
        ],
      },
      columnSetting: [
        {
          prop: 'date',
          label: 'th.date',
          fixed: 'left',
        },
        {
          prop: 'passanger',
          label: 'th.passanger',
        },
        {
          prop: 'normal',
          label: 'th.normal',
        },
        {
          prop: 'vip',
          label: 'th.vip',
        },
        {
          prop: 'vipDailyDeposit',
          label: 'th.vipDailyDeposit',
        },
        {
          prop: 'newMemeber',
          label: 'th.newMemeber',
        },
        {
          prop: 'newMemberDeposit',
          label: 'th.newMemberDeposit',
        },
      ],
      listLoading: false,
    }
  },
  computed: {
    getPayLoad() {
      const time = this.condition.date
      const load = {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      if (time !== null && typeof time !== 'undefined' && time !== '') {
        load.startOn = time[0]
        load.endOn = time[1]
      }
      return load
    },
  },
  created() {
    // this.getList(this)
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
        const res = await apiDailyReport.getDailyReportList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    exportExcel: debounce(async function () {
      try {
        const res = await apiDailyReport.exportDailyReport(this.getPayLoad)
        exportExcel(res)
      } catch {
        // pass
      }
    }, 600),
  },
}
</script>
