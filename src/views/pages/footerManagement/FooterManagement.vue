<template lang="pug">
  #headerManagement.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(label="連結方式")
            el-select(
              v-model="condition.openType"
              clearable
              @change="getListWithDebounce"
            )
              el-option(
                :label="'幫助中心'"
                :value="1"
              ) 幫助中心
              el-option(
                :label="'另開視窗'"
                :value="0"
              ) 另開視窗
          el-form-item(:label="$t('th.isEnabled')")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(
                :label="'啟用中'"
                :value="true"
              ) 啟用中
              el-option(
                :label="'已停用'"
                :value="false"
              ) 已停用
          el-form-item(label="開啟方式")
            el-select(
              v-model="condition.openType"
              clearable
              @change="getListWithDebounce"
            )
              el-option(
                :label="'幫助中心'"
                :value="1"
              ) 幫助中心
              el-option(
                :label="'另開視窗'"
                :value="0"
              ) 另開視窗
          el-form-item.searchBox(label="關鍵字")
            el-input(
              v-model="condition.keyword"
              placeholder="輸入搜尋關鍵字"
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
          ) 新增頁尾
    .tableSection
      TableWrapper(
        ref="tableWrapper"
        :tableHeight="tableHeight"
        :tableData="tbData.list"
        :totalSize="tbData.totalSize"
        :pagination="pagination"
        :paginationType="paginationType"
        :columnSetting="columnSetting"
        :isSortable="true"
        :listLoading="listLoading"
        :currentSort="getSorter"
        @sequence-change="sequenceChange"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import TableWrapper from '@c/TableWrapper'
import apiFooter from '@api/apiFooter'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'FooterManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        openType: null,
        isEnabled: true,
        keyword: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      columnSetting: [
        columnModule.sequence(),
        columnModule.title(),
        columnModule.link(400),
        {
          prop: 'openType',
          label: 'th.openType',
          width: 120,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span>
                { val ? '幫助中心' : '另開視窗' }
              </span>
            )
          },
        },
        columnModule.isEnabled(120),
        columnModule.clickCount(90),
        columnModule.updatedOn(200),
        columnModule.updatedByName(),
      ],
      paginationType: 'short',
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
        const res = await apiFooter.getFooterList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    async sequenceChange({ oldIndex, newIndex }) {
      try {
        const id = this.tbData.list[oldIndex].id
        const sequence = newIndex + 1
        await apiFooter.updateFooterSequence({ sequence }, id)
        // this.getList()
      } catch {
        // pass
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
          component: 'EditFooter',
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
        const deleteApi = apiFooter.deleteFooter
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
