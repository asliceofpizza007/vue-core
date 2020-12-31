<template lang="pug">
  #videoManagement.views(ref="view")
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
              el-option(:label="'上架中'" :value="true") 上架中
              el-option(:label="'已下架'" :value="false") 已下架
          el-form-item(label="是否免費")
            el-select(
              v-model="condition.isFree"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'免費'" :value="true") 免費
              el-option(:label="'付費'" :value="false") 付費
          el-form-item(:label="$t('th.title')")
            el-input(
              v-model="condition.name"
              placeholder="輸入搜尋片名"
              @keyup.native.enter="getListWithDebounce"
              clearable
              @clear="getListWithDebounce"
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
            icon="el-icon-edit"
            @click="handleAction({action: 'batch'})"
          ) 批次操作
          el-button(
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) FTP影片上傳建檔
    .tableSection
      TableWrapper(
        ref="tableWrapper"
        :tableHeight="tableHeight"
        :needSelection="true"
        :tableData="tbData.list"
        :totalSize="tbData.totalSize"
        :pagination="pagination"
        :paginationType="paginationType"
        :columnSetting="columnSetting"
        :listLoading="listLoading"
        :currentSort="getSorter"
        @selection-change="selectionChange"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import TableWrapper from '@c/TableWrapper'
import apiVideo from '@api/apiVideo'
import common from '@api/common'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'VideoManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      platform: [],
      condition: {
        isEnabled: true,
        isFree: null,
        name: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      columnSetting: [
        columnModule.id(80, 'left'),
        columnModule.name('left', '片名'),
        {
          prop: 'companyName',
          label: 'th.companyName',
        },
        columnModule.isEnabled(80),
        {
          prop: 'isFree',
          label: 'th.isFree',
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span>
                { val ? '免費' : '付費' }
              </span>
            )
          },
        },
        columnModule.clickCount(80, false),
        {
          prop: 'viewCount',
          label: 'th.viewCount',
          width: 80,
        },
        columnModule.updatedOn(200),
        columnModule.updatedByName(),
      ],
      rowSelection: [],
      listLoading: false,
    }
  },
  created() {
    this.getList()
    // this.getPlatformSet()
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
    async getPlatformSet() {
      const res = await common.getPlatformSet()
      this.platform = res.list
    },
    async getList() {
      this.listLoading = true
      try {
        const res = await apiVideo.getVideoList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    selectionChange(selections) {
      this.rowSelection = selections
    },
    handleAction({ action, row = null }) {
      if (action !== 'delete') {
        const actionMap = {
          edit: {
            component: 'EditVideo',
            headerTitle: `影片 - ${row.name} - #${row.id}`,
            contentSize: 'XL',
          },
          batch: {
            component: 'BatchOperation',
            headerTitle: '批次操作',
            contentSize: 'M',
          },
          create: {
            component: 'VideoUpload',
            headerTitle: '上傳影片建檔',
            contentSize: 'L',
          },
        }
        const settings = {
          component: actionMap[action].component,
          headerTitle: actionMap[action].component,
          contentSize: actionMap[action].contentSize,
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
        if (action === 'edit') {
          props.platform = this.platform
        }
        if (action === 'batch') {
          props.list = this.rowSelection
          if (this.rowSelection.length === 0) {
            this.$alert('請至少選擇一個項目', '注意', {
              confirmButtonText: '确定',
            })
            return
          }
        }

        const events = {
          'refresh-page': () => {
            this.getListWithDebounce(action)
          },
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      } else {
        const id = row.id
        const deleteApi = apiVideo.deleteVideo
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.searchBlock::v-deep {
  form {
    .el-form-item__content {
      max-width: 170px;
    }
  }
}

</style>
