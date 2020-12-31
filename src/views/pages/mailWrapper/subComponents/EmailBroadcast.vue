<template lang="pug">
  #emailBroadcast.subView(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(:model="condition")
          el-form-item(:label="$t('th.isEnabled')")
            el-select(
              v-model="condition.state"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'已發布'" :value="true") 已發布
              el-option(:label="'未發布'" :value="false") 未發布
          el-form-item.searchBox(label="關鍵字")
            el-input(
              v-model="condition.keyword"
              @keyup.native.enter="getListWithDebounce"
              placeholder="請輸入搜尋標題"
              clearable
              @clear="getListWithDebounce"
            )
              el-button(
                slot="append"
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
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增站內信
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
import apiMail from '@api/apiMail'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'EmailBroadcast',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        keyword: null,
        state: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        totalSize: 0,
        list: [
          {
            id: 1,
            title: 'Raven',
            state: true,
            sentCount: 52,
            readCount: 30,
            unreadCount: 22,
            updatedOn: '2018-01-03 10:32:49',
            updatedByName: '管理員',
          },
        ],
      },
      columnSetting: [
        columnModule.id(80, 'left'),
        columnModule.title(null, 200, 'left'),
        {
          prop: 'state',
          label: 'th.state',
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span class={ val ? 'enable' : 'stopped'}>
                { val ? '已發佈' : '未發佈' }
              </span>
            )
          },
          width: 120,
          sortable: true,
        },
        {
          prop: 'sentCount',
          label: 'th.sentCount',
          width: 120,
          sortable: true,
        },
        {
          prop: 'readCount',
          label: 'th.readCount',
          width: 80,
          sortable: true,
        },
        {
          prop: 'unreadCount',
          label: 'th.unreadCount',
          width: 80,
          sortable: true,
        },
        columnModule.updatedOn(160),
        columnModule.updatedByName(),
      ],
      customAction: ['mailInfo'], // to render custom action button
      listLoading: false,
    }
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
    async getList() {
      this.listLoading = true
      try {
        const res = await apiMail.getMailList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    handleAction({ action, row = null }) {
      switch (action) {
        case 'mailInfo':
          this.$emit('switch-component', {
            component: 'MailInfo',
            title: row.title,
            id: row.id,
          })
          break
        case 'delete':
          const id = row.id
          const deleteApi = apiMail.deleteMail
          this.delete(id, deleteApi)
          break
        default:
          const titleProp = {
            action,
            page: '站內信',
          }
          if (row !== null) {
            titleProp.title = row.title
            titleProp.id = row.id
          }
          const headerTitle = this.getHeaderTitle(titleProp)

          const settings = {
            component: 'EditMail',
            headerTitle,
          }
          const props = {
            action,
          }
          let editId = 'only'
          if (row !== null) {
            editId = row.id
            props.id = editId
            props.state = row.state
          }
          settings.id = editId

          const events = {
            'refresh-page': () => {
              this.getListWithDebounce()
            },
          }

          this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      }
    },
  },
}
</script>
