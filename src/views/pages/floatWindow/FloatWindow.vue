<template lang="pug">
  #FloatWindow.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(label="位置")
            el-select(
              v-model="condition.position"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'首頁右側'" :value="0") 首頁右側
              el-option(:label="'首頁左側'" :value="1") 首頁左側
              el-option(:label="'首頁右下方'" :value="2") 首頁右下方
              el-option(:label="'首頁左下方'" :value="3") 首頁左下方
          el-form-item(:label="$t('th.publishStatus')")
            el-select(
              v-model="condition.publishStatus"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'未上架'" :value="1") 未上架
              el-option(:label="'上架中'" :value="2") 上架中
              el-option(:label="'已下架'" :value="3") 已下架
          el-form-item(:label="$t('th.isEnabled')")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'全部'" :value="null") 全部
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
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
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增浮動視窗
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
import apiFloatWindow from '@api/apiFloatWindow'
import { listRetouch } from '@/utils'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'FloatWindow',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        position: 0,
        isEnabled: true,
        publishStatus: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        totalSize: 0,
        list: [
          {
            id: 1,
            sequence: 1,
            position: 0,
            description: '',
            isEnabled: true,
            clickCount: 32,
            publishStatus: 1,
            publishedOn: '2018-01-13',
            finishedOn: '2018-01-13',
            updatedOn: '2018-01-01 10:32:08',
            updatedByName: '管理員',
          },
          {
            id: 10,
            sequence: 2,
            position: 1,
            description: '',
            isEnabled: false,
            clickCount: 50,
            publishStatus: 2,
            publishedOn: '2018-02-13',
            finishedOn: '2018-02-13',
            updatedOn: '2018-01-30 18:32:08',
            updatedByName: '王曉',
          },
        ],
      },
      columnSetting: [
        columnModule.sequence(80, 'left'),
        {
          prop: 'position',
          label: 'th.position',
          width: 100,
          fixed: 'left',
        },
        columnModule.description(null, 'left'),
        columnModule.isEnabled(100),
        columnModule.clickCount(100),
        columnModule.publishStatus(),
        columnModule.publishedOn(),
        columnModule.finishedOn(),
        columnModule.updatedOn(170),
        columnModule.updatedByName(100),
      ],
      listLoading: false,
    }
  },
  created() {
    // TODO
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
        const res = await apiFloatWindow.getFloatWindowList(this.getPayLoad)
        res.list = listRetouch(res.list)
        this.tbData = res
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
        }
        if (row !== null) {
          titleProp.title = row.title
          titleProp.id = row.id
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditFloat',
          headerTitle,
          contentSize: 'XL',
        }

        const props = {
          action,
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
        const deleteApi = apiFloatWindow.deleteFloatWindow
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
