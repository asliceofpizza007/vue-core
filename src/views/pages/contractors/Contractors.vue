<template lang="pug">
  #handoverCategories.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(label="狀態")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item.searchBox(label="名稱")
            el-input(
              v-model="condition.name"
              placeholder="請輸入名稱"
              maxlength="10"
              @keyup.native.enter="getListWithDebounce"
              clearable
              @clear="getListWithDebounce"
            )
            el-button(
              type="search"
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
        :currentSort="getSorter"
        :disableDeletion="true"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import apiContractors from '@api/apiContractors'
import columnModule from '@js/tableProp'
import TableWrapper from '@c/TableWrapper'
import { CommonMixin } from '@/mixins'
import { mapState } from 'vuex'

export default {
  name: 'Contractors',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        name: null,
        sortName: 'id',
        sort: 'ASC',
        isEnabled: true,
      },
      tbData: {},
      columnSetting: [
        columnModule.id(),
        columnModule.name(null, true),
        {
          prop: 'code',
          label: 'th.code',
        },
        {
          prop: 'areaId',
          label: 'th.areaId',
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span>
                { this.areaCodeMap[val] }
              </span>
            )
          },
        },
        columnModule.isEnabled(100),
        columnModule.updatedOn(120),
        columnModule.updatedByName(100),
      ],
      paginationType: 'short',
      listLoading: false,
    }
  },
  computed: {
    ...mapState('app', {
      enumRefs: state => state.enumRefs,
    }),
    areaCodeMap() {
      const { areaCode } = this.enumRefs
      const codeMap = {}
      areaCode.forEach(item => {
        codeMap[item.id] = item.code
      })
      return codeMap
    },
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
        const res = await apiContractors.getContractorsList(this.getPayLoad)
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
          component: 'EditContractors',
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
        const deleteApi = apiContractors.deleteContractors
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
