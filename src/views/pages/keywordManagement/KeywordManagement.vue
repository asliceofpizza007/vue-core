<template lang="pug">
  #keywordManagement.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item.searchBox(label="關鍵字")
            el-input(
              v-model="condition.word"
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
            type="info"
            icon="el-icon-sort"
            @click="createKeywordSequence('count')"
          ) 依搜尋次數排行
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
        :hasKeywordSequence="hasKeywordSequence"
        :isSortable="true"
        :currentSort="getSorter"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
        @sequence-change="sequenceChange"
      )
</template>
<script>
import apiKeyword from '@api/apiKeyword'
import { cloneDeep, debounce } from 'lodash'
import TableWrapper from '@c/TableWrapper'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'

export default {
  name: 'KeywordManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        word: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      columnSetting: [
        columnModule.id(80),
        {
          prop: 'word',
          label: 'th.word',
          sortable: true,
        },
        {
          prop: 'searchCount',
          label: 'th.searchCount',
          sortable: true,
        },
        columnModule.sequence(),
        columnModule.updatedOn(200),
        columnModule.updatedByName(),
      ],
      customAction: ['deleteRank', 'keywordSequence'], // to render custom action button
      showDefaultAction: false, // to disable functional column
      listLoading: false,
      hasKeywordSequence: false,
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
        const res = await apiKeyword.getKeywordList(this.getPayLoad)
        this.tbData = res
        const sequenceArray = this.tbData.list.filter(item => {
          return item.sequence
        }).map(item => {
          return item.sequence
        })
        this.hasKeywordSequence = Math.max(...sequenceArray) < 6

        await this.$nextTick()
        this.removeDragClassName()
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    createKeywordSequence: debounce(async function (sort) {
      const text = {
        count: '搜尋次數',
        random: '亂數',
      }
      try {
        await this.$confirm(`是否依${text[sort]}重新排行?`, '操作確認', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        const params = {
          sortBy: sort,
        }
        const res = await apiKeyword.createKeywordSequence(params)
        this.tbData = res
        await this.$nextTick()
        this.removeDragClassName()
      } catch {
        // pass
      }
    }, 600),
    keywordSequence: debounce(async function (id) {
      const sequenceArray = this.tbData.list.filter(item => {
        return item.sequence
      }).map(item => {
        return item.sequence
      })

      const sequence = sequenceArray.length ? Math.max(...sequenceArray) + 1 : 1
      const params = {
        sequence,
      }
      await apiKeyword.keywordSequence(params, id)
      this.getList()
    }, 600),
    async sequenceChange({ oldIndex, newIndex }) {
      // 先複製params需要的列表資料
      const paramsList = cloneDeep(this.tbData.list)
      // 先複製params需要的列表資料
      const arr = cloneDeep(this.tbData.list)
      const targetRow = arr.splice(oldIndex, 1)[0]
      arr.splice(newIndex, 0, targetRow)

      this.tbData.list = arr

      // 拖拉後隨機產一個key
      this.tableKey = Math.random()
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
        await apiKeyword.keywordSequence(params, id)
      } catch {
        // pass
      }
    },
    removeDragClassName() {
      const tableTr = document.querySelectorAll('#keywordManagement .tableSection .el-table__row')
      this.tbData.list.forEach((item, index) => {
        if (item.sequence === 0) {
          tableTr[index].childNodes[0].classList.remove('drag-handler')
          tableTr[index].childNodes[0].classList.add('no-drag')
        } else {
          tableTr[index].childNodes[0].classList.add('drag-handler')
          tableTr[index].childNodes[0].classList.remove('no-drag')
        }
      })
    },
    handleAction({ action, row = null }) {
      const id = row.id
      if (action === 'deleteRank') {
        this.deleteRank(id)
      } else {
        this.keywordSequence(id)
      }
    },
    async deleteRank(id) {
      try {
        await this.$confirm('是否移除目前排行，依搜尋次數重新排行?', '操作確認', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          type: 'error',
        })
        await apiKeyword.removeKeyowordRank(id)
        if (this.tbData.list.length === 1) {
          const page = this.pagination.pageNum
          this.pagination.pageNum = (page !== 1) ? page - 1 : 1
        }
        this.getList()
        this.$message({
          message: '刪除成功',
          type: 'success',
        })
        this.getList()
      } catch {
        // pass
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.views .btnWrap::v-deep {
  flex: 1;
  display: flex;
  justify-content: space-between;
}
</style>
