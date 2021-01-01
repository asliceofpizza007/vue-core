<template lang="pug">
  #systemNavSetting.views(ref="view")
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
          @click="handleAction({action: 'sort'})"
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
      :columnSetting="columnSetting"
      :treeType="treeType"
      :tableData="tableData"
      :tableHeight="tableHeight"
      :disableDeletion="true"
    )
</template>
<script>
import apiSysNav from '@api/apiSysNav'
import { treeNodeAttributeInject, delay } from '@/utils'
import debounce from 'lodash/debounce'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'
import TreeColumn from '@c/TreeColumn'
import { systemMenus } from '@js/mockData'

export default {
  name: 'SystemNavSetting',
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
                { map[val].label }
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
              1: '-',
              2: '瀏覽器另開',
              3: 'Tab',
              4: 'JsPanel',
            }
            return (
              <span>
                { map[val] }
              </span>
            )
          },
        },
        columnModule.riskLevel(),
        columnModule.isEnabled(100, false),
        columnModule.updatedOn(160, false),
        columnModule.updatedByName(120, false),
      ],
      treeType: 'normal',
      tableData: [],
      customAction: ['addChild'], // to render custom action button
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
    setFunctionColumn() {
      this.columnSetting.push({
        label: 'th.function',
        prop: 'func',
        width: this.buttonsWidth,
        fixed: 'right',
        render: (h, scope) => {
          const {
            row,
          } = scope
          const { isEnabled, menuType } = row
          return (
            <div class="btn-wrap">
              {
                this.getTableActions.map(action => {
                  if (menuType !== 1 && action === 'addChild') return false
                  return (
                    <el-button key={action}
                      size="small"
                      type={this.functionalCol[action].btnType}
                      icon={this.functionalCol[action].icon}
                      disabled={isEnabled && action === 'delete'}
                      title={isEnabled && action === 'delete' ? '請先停用再刪除' : null}
                      onClick={() => { this.handleAction({ action, row }) }}
                    >
                      { this.$t(`functionalButton.${action}`) }
                    </el-button>
                  )
                })
              }
            </div>
          )
        },
      })
    },
    async getList() {
      this.loading = true
      try {
        await delay(500)
        // const res = await apiSysNav.getSystemNavList()
        const res = systemMenus
        this.tableData = treeNodeAttributeInject(res.list, this.defaultExpandAll, 'id')
        this.setTableHeight()
      } catch {
        // pass
      } finally {
        this.loading = false
      }
    },
    getListWithDebounce: debounce(function () {
      this.getList()
    }, 500, {
      leading: true,
      trailing: false,
    }),
    handleAction({ action, row = null }) {
      const item = row ?? { id: 'only' }
      if (action !== 'delete') {
        const actionMap = {
          create: {
            component: 'EditSystemNav',
            headerTitle: '新增系統選單',
          },
          edit: {
            component: 'EditSystemNav',
            headerTitle: `系統選單 - ${item.title} - #${item.id}`,
          },
          copy: {
            component: 'EditSystemNav',
            headerTitle: '系統選單',
          },
          sort: {
            component: 'TreeSequence',
            headerTitle: '系統選單排序',
          },
          addChild: {
            component: 'EditSystemNav',
            headerTitle: '新增系統選單',
          },
        }

        const settings = {
          component: actionMap[action].component,
          id: item.id,
          headerTitle: actionMap[action].headerTitle,
          contentSize: {
            width: '960px',
            height: '700px',
          },
        }

        const props = {
          action,
          id: typeof item.id === 'string' ? null : item.id,
        }

        const events = {
          'refresh-page': () => {
            this.getListWithDebounce()
          },
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
      } else {
        this.deleteNav(row)
      }
    },
    async deleteNav({ id, title }) {
      try {
        await this.$confirm(`確認刪除「${title}」？`, '提示', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        try {
          await delay(500)
          // await apiSysNav.deleteSystemNav(id)
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
<style lang="scss" scoped>
#systemNavSetting {
  /deep/ .el-table {
    td {
      .btn-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
</style>
