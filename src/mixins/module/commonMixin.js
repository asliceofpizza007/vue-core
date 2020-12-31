import debounce from 'lodash/debounce'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showDefaultAction: true,
      functionalCol: {
        mailInfo: {
          btnType: 'bd-send',
          icon: 'el-icon-message',
        },
        subCategory: {
          btnType: 'bd-sub',
          icon: 'el-icon-folder-opened',
        },
        record: {
          btnType: 'bd-record',
          icon: 'el-icon-document',
        },
        view: {
          btnType: 'bd-view',
          icon: 'el-icon-view',
        },
        edit: {
          btnType: 'bd-edit',
          icon: 'el-icon-edit',
        },
        copy: {
          btnType: 'bd-copy',
          icon: 'el-icon-document-copy',
        },
        delete: {
          btnType: 'bd-cancel',
          icon: 'el-icon-delete',
        },
        deleteRank: {
          btnType: 'bd-cancel',
          icon: 'el-icon-delete',
        },
        keywordSequence: {
          btnType: 'bd-success',
          icon: 'el-icon-plus',
        },
        addChild: {
          btnType: 'bd-success',
          icon: 'el-icon-plus',
        },
      },
      pagination: {
        pageNum: 1,
        pageSize: 15,
      },
      paginationType: 'normal',
    }
  },
  computed: {
    ...mapState('tabs', {
      tabs: state => state.tabs,
    }),
    ...mapState('app', {
      pageSizeSelect: state => state.pageSizeSelect,
    }),
    getPayLoad() {
      const load = {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      Object.keys(this.condition).forEach(key => {
        let value = this.condition[key]
        if (value && typeof value === 'string') {
          value = value.trim()
          this.condition[key] = value
        }
        load[key] = value
      })
      return load
    },
    getSorter() {
      return {
        prop: this.condition.sortName,
        order: this.condition.sort === 'ASC' ? 'ascending' : 'descending',
      }
    },
    getCurrentTab() {
      return this.tabs.find(tab => tab.link === this.$route.name)
    },
    getActions() {
      return this.getCurrentTab ? this.getCurrentTab.actions : {}
    },
    checkActions() {
      const tmp = []
      // handle if there's no permission setting
      if (!this.getActions) return tmp
      Object.keys(this.getActions).forEach(key => {
        const pattern = /create|delete|update/
        if (pattern.test(key) && this.getActions[key]) {
          if (key === 'update') {
            tmp.push('edit')
            return
          }
          tmp.push(key)
        }
      })
      if (this.getActions.readSingle) {
        if (this.getActions.create) {
          tmp.unshift('copy')
        }
        if (!this.getActions.update) {
          tmp.unshift('view')
        }
      }
      return tmp
    },
    getTableActions() {
      const actionsSeq = ['view', 'copy', 'edit', 'delete']
      const permissionActions = actionsSeq.filter(action => {
        return this.checkActions.find(el => el === action)
      })
      if (this.customAction && this.customAction.length) {
        this.customAction.forEach(action => {
          permissionActions.unshift(action)
        })
      }
      return permissionActions
    },
    buttonsWidth() {
      const buttonWidth = 45  // 空按鈕寬度
      const wordsWidth = 12   // 全形文字寬度
      const paddingWidth = 25 // 左右padding寬度

      const buttonCount = this.getTableActions.length  // 按鈕數量
      const marginRight = (buttonCount - 1) * 10  // margin寬度

      const words = this.getTableActions.reduce((pre, cur) => { // 按鈕文字數量
        const curWords = this.$t(`functionalButton.${cur}`)
        return pre + curWords
      }, '')

      const EN = words.match(/[A-Z,a-z]/g)
      const ENCount = EN ? EN.length : 0

      const CNwidth = (words.length - ENCount) * wordsWidth
      const ENwidth = ENCount * (wordsWidth / 2)
      return buttonCount * buttonWidth + ENwidth + CNwidth + paddingWidth + marginRight
    },
  },
  created() {
    if (this.getTableActions.length && this.showDefaultAction) {
      this.setFunctionColumn()
    }
    this.pagination.pageSize = this.pageSizeSelect[this.paginationType]
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
          const { isEnabled } = row
          return (
            <div class="btn-wrap">
              {
                this.getTableActions.map(action => {
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
    setTableHeight() {
      const searchHeight = this.$refs.searchBlock.offsetHeight
      const viewHeight = this.$refs.view.offsetHeight
      this.tableHeight = viewHeight - searchHeight - 90
    },
    pageChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.getList()
    },
    async pageSizeChange(pageSize) {
      const params = {
        key: this.paginationType,
        value: pageSize,
      }
      await this.$store.dispatch('app/setPageSizeSelect', params)
      this.$store.dispatch('updateUserPreferences')
      this.pagination.pageSize = pageSize
      this.pagination.pageNum = 1
      this.getList()
    },
    sortChange(sort) {
      this.condition.sortName = sort.prop
      if (sort.order) {
        this.condition.sort = sort.order === 'descending' ? 'DESC' : 'ASC'
      } else {
        this.condition.sort = null
      }
      this.getList()
    },
    getListWithDebounce: debounce(async function (action) {
      /**
       * 新增時，排序搜尋條件更改為'更新時間'、'降冪' ，並將頁面回到第一頁
       * 編輯/刪除時，使用相同搜尋條件搜尋 (若資料不足，則pageNum - 1 至上一頁)
       * 非CRUD操作時，將頁面回到第一頁
       */
      switch (action) {
        case 'edit':
        case 'delete':
          await this.getList()
          if (this.tbData.list.length) return
          break
        case 'create':
          this.condition.sortName = 'updatedOn'
          this.condition.sort = 'DESC'
          this.pagination.pageNum = 1
          break
        default:
          this.pagination.pageNum = 1
          break
      }
      await this.getList()
    }, 500),
    async delete(id, deleteApi) {
      try {
        await this.$confirm('確認刪除？', '提示', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        await deleteApi(id)
        if (this.tbData.list.length === 1) {
          const page = this.pagination.pageNum
          this.pagination.pageNum = (page !== 1) ? page - 1 : 1
        }
        this.getListWithDebounce('delete')
        this.$message({
          message: '刪除成功',
          type: 'success',
        })
      } catch (action) {
        if (action === 'cancel') {
          this.$message({
            message: '取消刪除',
            type: 'info',
          })
        }
      }
    },
    showPageNum(sum, action) {
      if (action !== 'toLastPage') {
        const totalSize = this.tbData.totalSize
        const pageNum = this.pagination.pageNum
        const pageSize = this.pagination.pageSize
        if (pageSize * pageNum - pageSize === totalSize) {
          this.pagination.pageNum = pageNum - 1
        }
      } else {
        const pageNum = Math.ceil(sum / 10)
        this.pagination.pageNum = pageNum
      }
    },
    getHeaderTitle({
      action, page, title, id = null,
    }) {
      const actionList = {
        create: '新增',
        view: '檢視',
        edit: '編輯',
        copy: '複製',
        record: '記錄',
      }
      if (id) {
        if (title !== '') {
          return `${actionList[action]}${page} - ${title} - #${id}`
        }
        return `${actionList[action]}${page} - #${id}`
      }
      return `${actionList[action]}${page}`
    },
  },
}
