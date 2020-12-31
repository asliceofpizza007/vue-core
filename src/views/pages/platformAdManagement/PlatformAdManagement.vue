<template lang="pug">
  #platformAd.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(:label="$t('th.isEnabled')")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item(:label="$t('th.publishStatus')")
            el-select(
              v-model="condition.publishStatus"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'未上架'" :value="1") 未上架
              el-option(:label="'上架中'" :value="2") 上架中
              el-option(:label="'已下架'" :value="3") 已下架
          el-form-item(class="searchBox" label="名稱")
            el-input(
              v-model="condition.name"
              placeholder="輸入搜尋廣告名稱"
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
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增廣告影片
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
import apiPlatformAd from '@api/apiPlatformAd'
import TableWrapper from '@c/TableWrapper'
import { listRetouch } from '@/utils'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'PlatformAdManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        isEnabled: true,
        name: null,
        publishStatus: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      columnSetting: [
        columnModule.id(80, 'left'),
        columnModule.name('left'),
        columnModule.description(),
        columnModule.isEnabled(100),
        columnModule.publishStatus(),
        {
          prop: 'publishedOn',
          label: 'th.publishedOn',
          sortable: true,
          width: 160,
        },
        {
          prop: 'finishedOn',
          label: 'th.finishedOn',
          sortable: true,
          width: 160,
        },
        columnModule.updatedOn(180),
        columnModule.updatedByName(),
      ],
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
        const res = await apiPlatformAd.getPlatformAdList(this.getPayLoad)
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
          titleProp.title = row.name
          titleProp.id = row.id
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditPlatformAd',
          headerTitle,
        }
        const props = {
          action,
        }
        let id = 'only'
        if (row !== null) {
          id = row.id
          props.id = id
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
        const deleteApi = apiPlatformAd.deletePlatformAd
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
