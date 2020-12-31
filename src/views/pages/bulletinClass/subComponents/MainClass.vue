<template lang="pug">
  #mainCategories.subView.emsTheme(ref="view")
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
          el-form-item.searchBox(:label="$t('th.name')")
            el-input(
              v-model="condition.name"
              placeholder="輸入搜尋名稱"
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
          ) 新增主類別
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
import apiBulletinClass from '@api/apiBulletinClass'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'MainClass',
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
        sortName: 'sequence',
        sort: 'ASC',
      },
      tbData: {},
      columnSetting: [
        columnModule.sequence(),
        columnModule.name(),
        columnModule.isEnabled(),
        columnModule.riskLevel(),
        columnModule.updatedOn(),
        columnModule.updatedByName(),
      ],
      listLoading: false,
      customAction: ['subCategory'], // to render custom action button
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
        const res = await apiBulletinClass.getBulletinMainList(this.getPayLoad)
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
        this.listLoading = true
        await apiBulletinClass.updateBulletinMainSequence({ sequence }, id)
        this.getList()
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    handleAction({ action, row = null }) {
      if (action === 'subCategory') {
        this.$emit('switch-component', {
          component: 'Sub',
          title: row.name,
          id: row.id,
        })
      } else if (action !== 'delete') {
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
          component: 'EditBulletinMain',
          headerTitle,
          bgPanel: '#05517c',
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
        const deleteApi = apiBulletinClass.deleteBulletinMainClass
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
