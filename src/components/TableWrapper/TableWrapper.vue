<template lang="pug">
  #tableWrapper(:key="tableKey")
    ScrollBar(
      :style="{height: tableHeight + 'px'}"
      :alwaysShowTracks="true"
    )
      el-table(
        ref="elTable"
        class="main-table"
        :data="tableData" border
        :stripe="stripe"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        :default-sort="defaultSort"
      )
        el-table-column(
          v-if='needSelection'
          type='selection'
          width='50'
        )
        el-table-column(
          v-for="(setting, i) in columnSetting"
          :key="setting.prop"
          :prop="setting.prop"
          :label="$t(setting.label)"
          :sortable="setting.sortable ? 'custom' : null"
          :width="setting.width ? setting.width : null"
          :min-width="setting.minWidth ? setting.minWidth : null"
          :fixed="setting.fixed ? setting.fixed : false"
        )
          template(v-if="setting.prop === 'sequence' && isSortable"
            slot="header"
          )
            el-tooltip(effect="dark"
              content="若排序類別為此欄位類別時，可使用拖曳排序功能"
              placement="top-start"
            )
              div
                i.el-icon-sort(style="margin-right: 5px")
                span {{ $t(setting.label) }}
          template(slot-scope="scope")
            RenderJSX(
              v-if="setting.render"
              :render="setting.render"
              :scope="scope"
            )
            span(v-else) {{scope.row[setting.prop]}}

    el-pagination(
      v-if="pagination"
      @size-change="pageSizeChange"
      @current-change="pageChange"
      :current-page.sync="pagination.pageNum"
      :page-size="pagination.pageSize"
      :page-sizes="pageSize"
      layout="sizes, prev, pager, next, jumper"
      :total="totalSize"
    )
</template>
<script>
import RenderJSX from '@c/RenderJSX'
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import ScrollBar from '@c/ScrollBar'

export default {
  name: 'TableWrapper',
  components: {
    ScrollBar,
    RenderJSX,
  },
  props: {
    tableHeight: {
      type: Number,
      default: null,
    },
    tableData: {
      type: Array,
      default: null,
    },
    columnSetting: {
      type: Array,
      default: null,
    },
    pagination: {
      type: Object,
      default: null,
    },
    paginationType: {
      type: String,
      default: 'normal',
    },
    totalSize: {
      type: Number,
      default: null,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    needSelection: {
      type: Boolean,
      default: false,
    },
    isSortable: {
      type: Boolean,
      default: false,
    },
    currentSort: {
      type: Object,
      default: () => {
        return { prop: null, order: null }
      },
    },
    listLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableKey: 0,
      sortable: null,
      defaultSort: {},
      tmpSort: {},
      pageSize: [],
    }
  },
  computed: {
    ...mapState('app', {
      pageSizeOption: state => state.pageSizeOption,
    }),
  },
  watch: {
    tableData: {
      handler() {
        this.setSortable()
      },
    },
    async tableKey() {
      await this.$nextTick()
      this.setSortable()
    },
    currentSort: {
      handler(val) {
        this.$refs.elTable.sort(val.prop, val.order)
      },
      deep: true,
    },
  },
  created() {
    this.defaultSort = this.currentSort
    this.pageSize = this.pageSizeOption[this.paginationType]
  },
  mounted() {
    this.setSortable()
  },
  methods: {
    setSortable() {
      if (this.isSortable) {
        const el = this.$refs.elTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          handle: '.drag-handler',
          onEnd: async evt => {
            const { oldIndex, newIndex } = evt
            // 拖拉後隨機產一個key
            this.tableKey = Math.random()
            this.$emit('sequence-change', { oldIndex, newIndex })
          },
        })
      }
    },
    pageChange(pageNum) {
      this.$emit('page-change', pageNum)
    },
    pageSizeChange(pageSize) {
      this.$emit('page-size-change', pageSize)
    },
    sortChange(e) {
      // 當 sort 是因為新增而調整時，直接return
      const matchAll = Object.keys(this.currentSort).every(key => this.currentSort[key] === e[key])
      if (matchAll) return
      let sort = { ...e }
      if (!e.order) {
        sort = { ...this.defaultSort }
        // 排序名稱為預設排序時，降冪調整為升冪
        if (e.prop === this.defaultSort.prop) {
          sort.order = 'ascending'
        }
        this.$refs.elTable.sort(sort.prop, sort.order)
      } else {
        this.tmpSort = sort
        this.$emit('sort-change', sort)
      }
    },
    handleSelectionChange(selectedData) {
      this.$emit('selection-change', selectedData)
    },
    forceLayoutUpdate() {
      this.$refs.elTable.doLayout()
    },
  },
}
</script>

<style lang="scss" scoped>
  #tableWrapper::v-deep {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;

      &>* {
        display: block;
      }

      .tags {
        margin: 0 0 0 auto;

        .el-tag {
          margin: 0 5px;
        }
      }
    }
  }
</style>
