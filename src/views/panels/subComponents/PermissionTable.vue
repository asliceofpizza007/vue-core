<template lang="pug">
  #PermissionTable
    el-table.permission-tree-table.main-table(
      :data="filteredPermissionData"
      tooltip-effect="dark"
      border
      :row-style="showTr"
      ref="permission-tree-table"
    )
      el-table-column(
        label="功能名稱"
        prop="title"
        width="280"
        class-name="text-start"
      )
        template(slot="header" slot-scope="scope")
          .custom-header
            el-checkbox(
              :value="allChecked"
              :indeterminate="allIndeterminated"
              @change="handleSelectAll"
            )
            span 功能名稱
            el-input(
              v-model="filterText"
              size="mini"
              placeholder="請輸入關鍵字..."
              class="searchBox"
              style="display: inline;"
            )
        template(slot-scope="scope")
          .tree-row
            span(
              v-for="(space, levelIndex) in scope.row._level"
              class="ms-tree-space"
            )
            button(
              type="button"
              class="toggleBtn button is-outlined is-primary is-small arrow-btn"
              v-if="toggleIconShow(scope.row)"
              @click="toggle(scope.$index)"
            )
              i.el-icon-plus(v-if="!scope.row._expanded")
              i.el-icon-minus(v-if="scope.row._expanded")
            span(v-if="!toggleIconShow(scope.row)" class="ms-tree-space")
            el-checkbox(
              :value="getRowCheckedStatus(scope.row)"
              :indeterminate="getRowIndeterminatedStatus(scope.row)"
              @change="checked => handleSelectRow([scope.row], checked)"
              class="tree-row-check-box"
            )
            span(
              :class="{ 'click-expand': toggleIconShow(scope.row) }"
              @click="toggle(scope.$index)"
              class="tree-label"
            ) {{ scope.row.title }}
      el-table-column(
        label="顯示選單"
        width="100"
        align="center"
        prop="isVisible"
      )
        template(slot-scope="scope")
          el-checkbox(
            v-model="scope.row.isVisible"
            :key="scope.row.systemMenuId"
            :disabled="!!scope.row.children.length"
            @change="checked => syncVisible(checked, scope.row, true)"
          )

      el-table-column(
        label="權限設定"
        prop="actions"
        class-name="ractionsRow"
      )
        template(slot-scope="scope")
          p(
            v-if="!scope.row.actions"
            :class="{ 'unable': !scope.row.actions}"
          ) 無權限設定
          div(v-else)
            el-checkbox(
              v-for="action in Object.keys(scope.row.actions)"
              v-model="scope.row.actions[action]"
              :label="action"
              @change="checked => syncVisible(checked, scope.row)"
              :key="action"
            ) {{ actionMap[action] }}
</template>
<script>
import { treeNodeAttributeInject } from '@/utils'

export default {
  name: 'PermisiionTable',
  props: {
    permissions: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      permissionNewList: [],
      filterText: '',
      defaultExpandAll: true,
      actionMap: {
        admin: '總管理者',
        create: '新增',
        update: '修改',
        delete: '刪除',
        readSingle: '檢視單筆',
        readList: '檢視列表',
      },
    }
  },
  computed: {
    filteredPermissionData() {
      if (!this.filterText) return this.permissionNewList
      return this.permissionNewList.filter(ele => ele.title.indexOf(this.filterText) >= 0)
    },
    allChecked() {
      const list = this.permissionNewList
      if (!(Array.isArray(list) && list.length > 0)) {
        return false
      }
      return list.every(row => row.isVisible)
    },
    allIndeterminated() {
      const list = this.permissionNewList
      if (!(Array.isArray(list) && list.length > 0)) {
        return false
      }
      return list.some(row => this.getRowIndeterminatedStatus(row))
    },
  },
  mounted() {
    this.handleTreeToArray()
  },
  methods: {
    handleTreeToArray() {
      const list = this.permissions
      this.permissionNewList = treeNodeAttributeInject(list, this.defaultExpandAll, 'systemMenuId')
    },
    /** 取得勾選的行數 */
    getRowIndex(row) {
      const rowIndex = this.permissionNewList.lastIndexOf(row)
      return rowIndex
    },
    /** 取得 row 的勾選狀態（只要 child 任一有勾就算） */
    getRowCheckedStatus(row) {
      const { children, actions } = row
      const hasAction = !!actions
      const hasChildren = Array.isArray(children) && children.length > 0

      let check = row.isVisible
      if (hasChildren) {
        const allCheck = children.reduce((acc, _row) => {
          return acc.concat(this.getRowCheckedStatus(_row))
        }, [])
        check = allCheck.some(c => c === true)
      } else if (hasAction) {
        check = Object.keys(actions).some(key => actions[key])
      }
      return check
    },
    getRowStrictCheckedStatus(row) {
      const { children, actions } = row
      const hasAction = !!actions
      const hasChildren = Array.isArray(children) && children.length > 0

      let check = row.isVisible
      if (hasChildren) {
        const allCheck = children.reduce((acc, _row) => {
          return acc.concat(this.getRowStrictCheckedStatus(_row))
        }, [])
        check = allCheck.length > 0 && allCheck.every(c => c === true)
      } else if (hasAction) {
        check = Object.keys(actions).every(key => actions[key])
      }
      return check
    },
    /** 取得 row 的半勾選狀態（child 任一有勾，且不是所有 children 都勾） */
    getRowIndeterminatedStatus(row) {
      const { children, actions } = row
      const hasAction = !!actions
      const hasChildren = Array.isArray(children) && children.length > 0

      let check = false
      if (hasChildren) {
        const allCheck = []
        // 任一 child 是 indeterminated
        for (let i = 0; i < children.length; i++) {
          const childRow = children[i]
          if (this.getRowIndeterminatedStatus(childRow)) {
            check = true
            return check
          }
          check = this.getRowStrictCheckedStatus(childRow)
          allCheck.push(check)
        }
        check = allCheck.some(c => c === true) && !allCheck.every(c => c === true)
      } else if (hasAction) {
        const keys = Object.keys(actions)
        check = keys.some(key => actions[key]) && !keys.every(key => actions[key])
      }

      return check
    },
    /** 控制 row 的勾選行為與聯動結果；預設會向上檢查，
     *  檢查時須帶 checkBelow: false 以避免 infinite loop
    */
    handleSelectRow(row, status = null, checkBelow = true) {
      if (!Array.isArray(row)) return
      const rowData = row[0]
      const { children, actions, parentId } = rowData
      const hasAction = !!actions
      const hasChildren = Array.isArray(children) && children.length > 0
      const hasParent = parentId !== undefined && parentId > 0
      let checked = status
      if (row.length === 1 && (checked === null || checked === true)) {
        rowData.isVisible = true
        if (hasAction) {
          const keys = Object.keys(actions)
          keys.forEach(key => {
            actions[key] = true
          })
        }
        checked = true
      } else if (row.length === 0 || checked === false) {
        // 取消
        rowData.isVisible = false
        if (hasAction) {
          const keys = Object.keys(actions)
          keys.forEach(key => {
            actions[key] = false
          })
        }
        checked = false
      }
      if (checkBelow && hasChildren) {
        children.forEach(_row => this.handleSelectRow([_row], checked))
      }
      if (hasParent) {
        const parentRow = this.permissionNewList.find(_row => {
          return _row.systemMenuId === rowData.parentId
        })
        if (parentRow) {
          this.handleSelectRow([parentRow], checked, false)
          parentRow.isVisible = this.getRowCheckedStatus(parentRow)
        }
      }
    },
    showTr({ row }) {
      // eslint-disable-next-line no-underscore-dangle
      const show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
      const showRow = row
      // eslint-disable-next-line no-underscore-dangle
      showRow._show = show
      return show ? '' : { display: 'none' }
    },
    // 樹狀結構展開下層
    toggle(trIndex) {
      const me = this
      const record = me.permissionNewList[trIndex]
      // eslint-disable-next-line no-underscore-dangle
      record._expanded = !record._expanded
    },
    // 樹狀結構點擊展開和關閉的圖標切換
    toggleIconShow(record) {
      if (Array.isArray(record.children) && record.children.length > 0) {
        return true
      }
      return false
    },
    /** 根據權限設定同步顯示選單
     *  fromRoot 為點擊 「顯示選單」
     */
    syncVisible(checked, row, fromRoot = false, checkBelow = true) {
      const rowData = row
      const { children, actions, parentId } = rowData
      const hasAction = !!actions
      const hasChildren = Array.isArray(children) && children.length > 0
      const hasParent = parentId !== undefined && parentId > 0
      // 點擊父層節點往下迭代；若點擊子層，則移至父層向下檢查是否有子節點仍勾選
      rowData.isVisible = checkBelow ? checked : this.getRowCheckedStatus(rowData)

      if (hasAction) {
        const keys = Object.keys(actions)
        const noAction = keys.every(key => !actions[key])
        // 勾起「顯示選單」時，或是勾選其他method時，至少給一個"read"權限
        if (fromRoot) {
          if (checked && noAction) {
            actions.readList = true
          }
          if (!checked) {
            keys.forEach(key => {
              actions[key] = false
            })
            rowData.isVisible = false
          }
        // 操作到action子項目，一定要確保 read 被勾
        } else if (checked) {
          // 操作到修改權限，需確保檢視單筆權限被勾選
          if (actions.update) {
            actions.readSingle = true
          }
          actions.readList = true
          rowData.isVisible = true
        } else {
          if (!actions.readList) {
            keys.forEach(key => {
              actions[key] = false
            })
          // 操作到檢視單筆權限時，確保修改權限不被勾選
          } else if (!actions.readSingle) {
            actions.update = false
          }
          if (keys.every(key => !actions[key])) {
            rowData.isVisible = false
          } else if (keys.some(key => actions[key])) {
            rowData.isVisible = true
          }
        }
      } else if (checkBelow && hasChildren) {
        this.handleSelectRow([rowData], checked)
      }

      if (hasParent) {
        const parentRow = this.permissionNewList.find(_row => {
          return _row.systemMenuId === rowData.parentId
        })
        if (parentRow) {
          this.syncVisible(checked, parentRow, false, false)
        }
      }
    },
    handleSelectAll(checked) {
      const list = this.permissionNewList
      if (list.length === 0) return
      list.forEach(row => this.handleSelectRow([row], checked, false))
    },
    /** 檢查目錄項是否需要送出 */
    getRowSubmitStatus(row) {
      const { children, actions } = row
      const hasAction = !!actions
      const hasChildren = Array.isArray(children) && children.length > 0

      let check = row.menuType === 2 ? row.isVisible : false
      if (hasChildren) {
        for (let i = 0; i < children.length; i++) {
          const childRow = children[i]
          if (this.getRowSubmitStatus(childRow)) {
            check = true
            return check
          }
        }
      } else if (hasAction) {
        check = Object.keys(actions).some(key => actions[key])
      }
      return check
    },
    /** 整理要送出的參數 */
    getParams() {
      const list = this.permissionNewList.filter(el => {
        if (el.menuType === 1) {
          return this.getRowSubmitStatus(el)
        }
        return el.isVisible
      })
      const permissions = list.map(el => {
        const {
          systemMenuId,
          parentId,
          menuCode,
          title,
          menuType,
          isVisible,
          actions,
        } = el
        return {
          systemMenuId,
          parentId,
          menuCode,
          title,
          menuType,
          isVisible,
          actions,
        }
      })
      return permissions
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-header {
  @include Flex($j: space-between);

  >span {
    width: 80%;
  }
}

.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  width: 20px;
  height: 14px;
  font-family: 'Glyphicons Halflings';
  font-weight: 400;
  font-style: normal;
  line-height: 1;

  & ~ .tree-label {
    &.click-expand {
      transition: color 0.2s;
      cursor: pointer;

      &:hover {
        color: #68bbeb;
      }
    }
  }
}

.tree-row-check-box {
  margin-right: 5px;
}

.toggleBtn {
  @include size(16px, 16px, 0);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  color: #fff;
  background-color: #616284;
  border-radius: 4px;
  cursor: pointer;

  > i {
    font-size: 12px;
  }
}

/deep/ .ractionsRow {
  padding: 12px 15px;
  text-align: left;
}

// .permission-tree-table /deep/ {
//   .el-checkbox {
//     .el-checkbox__input {
//       &.is-checked,
//       &.is-indeterminate {
//         .el-checkbox__inner {
//           background-color: #53a6c8;
//           border-color: #53a6c8;
//         }
//       }
//     }
//   }
// }
</style>
