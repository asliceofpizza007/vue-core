<template lang="pug">
  #whiteIP.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form(class="complex-group" :model="condition")
          el-form-item(:label="$t('th.isEnabled')")
            el-select(v-model="condition.isEnabled" clearable)
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item.searchBox(class="searchBox" label="關鍵字")
            el-input(
              v-model="condition.keyword"
              placeholder="請輸入搜尋名稱"
              clearable
            )
              el-button(
                slot="append"
                icon="el-icon-search"
              ) 搜尋
        .btnWrap
          el-button(
            type="refresh"
            icon="el-icon-refresh-right"
          ) 重新整理
          el-button(
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增
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
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'WhiteIP',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        isEnabled: null,
        keyword: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        'totalSize': 15,
        'list': [
          {
            'id': 3,
            'remark': 'RD電腦',
            'whiteIP': '10.255.0.2',
            'createdByName': 0,
            'createdOn': '2019-02-13 17:28:13',
            'updatedByName': '嘉偉',
            'updatedOn': '2019-08-26 10:32:02',
            'isEnabled': true,
          },
          {
            'id': 4,
            'remark': '資訊電腦-1',
            'whiteIP': '210.68.95.160',
            'createdByName': 0,
            'createdOn': '2019-02-13 17:28:13',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 5,
            'remark': '資訊電腦-2',
            'whiteIP': '118.170.114.59',
            'createdByName': 0,
            'createdOn': '2019-02-13 17:28:13',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 7,
            'remark': '財務\r\n',
            'whiteIP': '203.85.53.136',
            'createdByName': 0,
            'createdOn': '2019-02-13 17:28:13',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 8,
            'remark': '財務部',
            'whiteIP': '203.85.53.137',
            'createdByName': 0,
            'createdOn': '2019-05-20 16:04:12',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 9,
            'remark': '財務部',
            'whiteIP': '203.85.53.135',
            'createdByName': 0,
            'createdOn': '2019-05-20 16:04:12',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 10,
            'remark': '財務部',
            'whiteIP': '203.85.53.134',
            'createdByName': 0,
            'createdOn': '2019-05-20 16:04:12',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 11,
            'remark': '財務部',
            'whiteIP': '203.85.53.132',
            'createdByName': 0,
            'createdOn': '2019-05-20 16:04:12',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 13,
            'remark': '財務部',
            'whiteIP': '211.72.131.171',
            'createdByName': 0,
            'createdOn': '2019-05-20 16:04:12',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
          {
            'id': 14,
            'remark': '財務部',
            'whiteIP': '211.72.131.169',
            'createdByName': 0,
            'createdOn': '2019-05-20 16:04:12',
            'updatedByName': 0,
            'updatedOn': null,
            'isEnabled': true,
          },
        ],
      },
      columnSetting: [
        columnModule.id(80, 'left'),
        {
          prop: 'remark',
          label: '名稱',
          fixed: 'left',
        },
        {
          prop: 'whiteIP',
          label: 'IP',
        },
        columnModule.isEnabled(null, false),
      ],
      listLoading: false,
    }
  },
  mounted() {
    this.setTableHeight()
    this.$bus.$on('resize-table-height', this.setTableHeight)
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
    getList() {

    },
    handleAction({ action, row = null }) {
      if (action !== 'delete') {
        const titleProp = {
          action,
          page: this.getCurrentTab.title,
        }
        if (row !== null) {
          titleProp.title = row.remark
          titleProp.id = row.id
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditIP',
          headerTitle,
        }
        const props = {
          action,
        }
        let id = 'only'
        if (row !== null) {
          id = row.id
          props.id = id
          props.list = row
        }
        settings.id = id

        this.$store.dispatch('JsPanels/addPanel', { settings, props })
      } else {
        this.delete(row.id)
      }
    },
    async deleteWhiteIp(id) {
      try {
        await this.$confirm('確認刪除？', '提示', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        //  await apiAdvertise.deleteAdvertise(id)
        this.$message({
          message: '刪除成功',
          type: 'success',
        })
      } catch {
        // passssss
      }
    },
  },
}
</script>
