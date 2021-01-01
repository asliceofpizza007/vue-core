<template lang="pug">
  #adminManagement.views(ref="view")
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
          el-form-item(label="權限群組")
            el-select(
              v-model="condition.groupId"
              clearable
              @change="getListWithDebounce"
            )
              el-option(
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ) {{ item.name }}
          el-form-item.searchBox(class="searchBox" label="關鍵字")
            el-input(
              v-model="condition.name"
              placeholder="請輸入帳號、名稱或描述"
              @keyup.native.enter="getListWithDebounce"
              maxlength="20"
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
import apiAdmin from '@api/apiAdmin'
import apiGroup from '@api/apiGroup'
import TableWrapper from '@c/TableWrapper'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'
import { delay } from '@/utils'
import { groupOptions, admins } from '@js/mockData'

export default {
  name: 'AdminManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        groupId: null,
        isEnabled: true,
        name: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      groups: {
        totalSize: 0,
        list: [
          {
            id: 0,
            name: '最高權限者',
          },
        ],
      },
      columnSetting: [
        columnModule.id(80, 'left'),
        {
          prop: 'account',
          label: 'th.account',
          width: 200,
          fixed: 'left',
          sortable: true,
        },
        columnModule.name('left', true),
        {
          prop: 'groupName',
          label: 'th.groupName',
        },
        columnModule.description(200),
        columnModule.isEnabled(),
        columnModule.updatedOn(200),
        columnModule.updatedByName(),
      ],
      paginationType: 'short',
      listLoading: false,
    }
  },
  created() {
    this.getGroupsList()
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
    this.$bus.$off('resize-table-height', this.setTableHeight)
  },
  methods: {
    async getGroupsList() {
      await delay(500)
      // const res = await apiGroup.getPermissionGroupOptions({})
      this.groups = groupOptions
    },
    async getList() {
      this.listLoading = true
      try {
        await delay(500)
        // const res = await apiAdmin.getAdminList(this.getPayLoad)
        admins.list.forEach(item => {
          const member = item
          item.account = member.account.split('_')[1]
        })
        this.tbData = admins
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
          page: this.getCurrentTab.title,
          title: row.account,
          id: row.id,
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditAdmin',
          id: row.id,
          headerTitle,
        }

        const props = {
          action,
          id: row.id,
          groupsList: this.groups,
        }

        const events = {
          'refresh-page': () => {
            this.getListWithDebounce(action)
          },
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      }
    },
  },
}
</script>
