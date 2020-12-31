<template lang="pug">
  #navSetting.views(ref="view")
    .searchBlock(ref="searchBlock")
      div(style="justifyContent: flex-end")
        el-button(
          type="refresh"
          icon="el-icon-refresh-right"
          @click="getListWithDebounce"
        ) 重新整理
        el-button(
          type="refresh"
          icon="el-icon-sort"
          @click="handleAction({action:'sort'})"
        ) 排序
        el-button(
          v-if="getActions && getActions.create"
          type="add"
          icon="el-icon-plus"
          @click="handleAction({ action: 'create' })"
        ) 新增系統選單
    TreeColumn(
      ref="treeColumn"
      :loading="loading"
      :actions="actions"
      :columnSetting="columnSetting"
      :treeType="treeType"
      :tableData="tableData"
      :tableHeight="tableHeight"
      :disableDeletion="true"
    )
</template>
<script>
import apiNav from '@api/apiNav'
import { treeNodeAttributeInject } from '@/utils'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'
import TreeColumn from '@c/TreeColumn'

export default {
  name: 'NavSetting',
  components: { TreeColumn },
  mixins: [CommonMixin],
  data() {
    return {
      loading: false,
      tableHeight: 0,
      defaultExpandAll: true,
      columnSetting: [
        {
          label: 'th.menuType',
          prop: 'menuType',
          width: 100,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            const map = {
              1: {
                label: '目錄',
                class: 'tab',
              },
              2: {
                label: '頁面',
                class: 'page',
              },
            }
            return (
              <span class={map[val].class}>
                {map[val].label}
              </span>
            )
          },
        },
        {
          label: 'th.openType',
          prop: 'openType',
          width: 100,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            const map = {
              1: '本頁',
              2: '另開',
            }
            return (
              <span>
                { val ? map[val] : '-' }
              </span>
            )
          },
        },
        columnModule.link(160, null),
        columnModule.isEnabled(100, false),
        columnModule.updatedOn(120, false),
        columnModule.updatedByName(80, false),
      ],
      treeType: 'normal',
      tableData: [],
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
    this.$refs.treeColumn.forceLayoutUpdate()
  },
  beforeDestroy() {
    this.$store.dispatch('JsPanels/closePanelByParent', this.$options.name)
    this.$bus.$off('resize-table-height')
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const res = await apiNav.getNavList()
        this.tableData = treeNodeAttributeInject(res.list, this.defaultExpandAll, 'id')
        this.setTableHeight()
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    handleAction({ action, index = null, list = null }) {
      const item = list ?? { id: 'only' }
      if (action !== 'delete') {
        const actionMap = {
          create: {
            component: 'EditNav',
            headerTitle: '新增系統選單',
          },
          edit: {
            component: 'EditNav',
            headerTitle: `系統選單 - ${item.title} - #${item.id}`,
          },
          sort: {
            component: 'TreeSequence',
            headerTitle: '系統選單排序',
          },
        }

        const settings = {
          component: actionMap[action].component,
          id: item.id,
          headerTitle: actionMap[action].headerTitle,
        }

        const props = {
          action,
          id: typeof item.id === 'string' ? null : item.id,
        }

        const events = {
          'refresh-page': () => {
            this.getListWithDebounce(action)
          },
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      } else {
        this.deleteNav(index)
      }
    },
    async deleteNav(index) {
      const item = this.tableData[index]
      try {
        await this.$confirm(`確認刪除「${item.title}」？`, '提示', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        try {
          await apiNav.deleteNav(item.id)
          this.$message({
            showClose: true,
            type: 'success',
            message: '選單删除成功!',
          })
          this.getList()
        } catch {
          // interceptor handle
        }
      } catch (err) {
        return false
      }
      return true
    },
  },
}
</script>
