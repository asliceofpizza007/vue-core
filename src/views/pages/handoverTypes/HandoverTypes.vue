<template lang="pug">
  #handoverCategories.views.emsTheme(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(label="狀態")
            el-select(
              v-model="condition.isEnabled"
              @change="getListWithDebounce"
              clearable
            )
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item.searchBox(label="名稱")
            el-input(
              v-model="condition.name"
              placeholder="輸入輸入名稱"
              maxlength="10"
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
        :isSortable="true"
        :currentSort="getSorter"
        :disableDeletion="true"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
        @sequence-change="sequenceChange"
      )
</template>
<script>
import apiHandoverTypes from '@api/apiHandoverTypes'
import columnModule from '@js/tableProp'
import { cloneDeep } from 'lodash'
import TableWrapper from '@c/TableWrapper'
import { CommonMixin } from '@/mixins'

export default {
  name: 'HandoverTypes',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        name: null,
        sortName: 'sequence',
        sort: 'ASC',
        isEnabled: true,
      },
      tbData: {},
      columnSetting: [
        columnModule.sequence(),
        columnModule.name(null, true),
        columnModule.isEnabled(100),
        columnModule.riskLevel(),
        columnModule.updatedOn(170),
        columnModule.updatedByName(100, false),
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
      try {
        this.listLoading = true
        const res = await apiHandoverTypes.getHandoverTypesList(this.getPayLoad)
        this.tbData = res
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    async sequenceChange({ oldIndex, newIndex }) {
      // 先複製params需要的列表資料
      const paramsList = cloneDeep(this.tbData.list)
      // 先複製params需要的列表資料
      const arr = cloneDeep(this.tbData.list)
      const targetRow = arr.splice(oldIndex, 1)[0]
      arr.splice(newIndex, 0, targetRow)

      this.tbData.list = arr

      // 舊物件
      const oldObject = paramsList[oldIndex]
      // 新物件
      const newsObject = paramsList[newIndex]
      // 移動物件的id
      const id = oldObject.id
      // 更改的排序參數
      const sequence = (newsObject.sequence === 0) ? oldObject.sequence : newsObject.sequence
      const params = {
        'sequence': sequence,
      }
      try {
        await apiHandoverTypes.updateHandoverTypesSequence(params, id)
        this.getListWithDebounce()
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
          titleProp.title = row.name
          titleProp.id = row.id
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditHandoverTypes',
          headerTitle,
          contentSize: 'L',
          bgPanel: '#05517c',
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
        const deleteApi = apiHandoverTypes.deleteHandoverTypes
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
