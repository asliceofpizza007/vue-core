<template lang="pug">
  #mailInfo.subView(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form(class="complex-group" :model="condition")
          el-form-item(label="訊息狀態")
            el-select(
              v-model="condition.isRead"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'已讀'" :value="true") 已讀
              el-option(:label="'未讀'" :value="false") 未讀
          el-form-item.searchBox(class="searchBox" label="會員帳號")
            el-input(
              v-model="condition.account"
              placeholder="請輸入搜尋帳號"
              @keyup.native.enter="getListWithDebounce"
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
            type="back"
            icon="el-icon-back"
            @click="returnToPre"
          ) 返回
          el-button(
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增寄送會員
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
  name: 'MailInfo',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  props: {
    mailProp: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      tableHeight: 0,
      condition: {
        account: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        totalSize: 0,
        list: [
          {
            id: 1,
            sequence: 1,
            account: 'testaaa',
            isRead: true,
            updatedOn: '2018-01-03 10:32:49',
            updatedByName: '管理員',
          },
        ],
      },
      columnSetting: [
        columnModule.id(null, 'left'),
        {
          prop: 'account',
          label: 'th.account',
          sortable: true,
          fixed: 'left',
        },
        {
          prop: 'isRead',
          label: 'th.state',
          sortable: true,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span>
                { val ? '已讀' : '未讀' }
              </span>
            )
          },
        },
        columnModule.updatedOn(),
        columnModule.updatedByName(),
      ],
      paginationType: 'short',
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
        const res = await apiMail.getMailMemberList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    handleAction({ action, row = null }) {
      if (action !== 'delete') {
        const settings = {
          component: 'createMailMember',
          id: 'only',
          headerTitle: `新增寄送會員 - ${this.mailProp.title}`,
        }
        const props = {
          action,
          mailProp: this.mailProp,
        }

        const events = {
          'refresh-page': () => {
            this.getListWithDebounce(action)
          },
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      } else {
        const id = row.id
        const deleteApi = apiMail.deleteMailMember
        this.delete(id, deleteApi)
      }
    },
    returnToPre() {
      this.$emit('switch-component', {
        component: 'EmailBroadcast',
      })
    },
  },
}
</script>
