<template lang="pug">
  .tableSection
    ScrollBar(
      :style="{height: tableHeight + 'px'}"
      :alwaysShowTracks="true"
    )
      el-table.nav-main-table.main-table(
        v-loading="loading"
        ref="elTable"
        :data="filterTableData"
        border
        :row-style="showTr"
        style="width: 100%"
      )
        el-table-column(
          prop="name"
          key="name"
          :min-width="250"
          fixed="left"
        )
          template(slot="header" slot-scope="scope")
            .custom-header
              span 選單名稱
              el-input(
                v-model="filterText"
                size="mini"
                placeholder="請輸入關鍵字..."
                class="searchBox"
                style="display: inline;"
              )
          template(slot-scope="scope")
            .treeColumn
              span(
                v-for="i in scope.row._level"
                :key="i"
                class="ms-tree-space"
              )
              button(
                class="toggleBtn"
                v-if="toggleIconShow(scope.row)"
                @click="toggle(scope.$index)"
              )
                i.el-icon-plus(v-if="!scope.row._expanded")
                i.el-icon-minus(v-if="scope.row._expanded")
              span(v-if="!toggleIconShow(scope.row)" class="ms-tree-space")
              span(:style="{ marginLeft: !toggleIconShow(scope.row) ? '-3px' : '0' }")
                | {{ scope.row.title }}
        el-table-column(
          v-for="(setting, index) in columnSetting"
          :key="setting.prop"
          :label="$t(setting.label)"
          :prop="setting.prop"
          :min-width="setting.width"
          :fixed="setting.fixed?setting.fixed:false"
        )
          template(slot-scope="scope")
            RenderJSX(
              v-if="setting.render"
              :render="setting.render"
              :scope="scope"
            )
            span(v-else) {{scope.row[setting.prop]}}
</template>

<script>
import ScrollBar from '@c/ScrollBar'
import RenderJSX from '@c/RenderJSX'

export default {
  name: 'TreeColumn',
  components: {
    ScrollBar,
    RenderJSX,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    columnSetting: {
      type: Array,
      default: null,
    },
    treeType: {
      type: String,
      default: 'normal',
    },
    tableData: {
      type: Array,
      default: null,
    },
    tableHeight: {
      type: Number,
      default: 0,
    },
    disableDeletion: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterText: '',
    }
  },
  computed: {
    filterTableData() {
      if (!this.filterText) {
        return this.tableData
      }
      return this.tableData.filter(ele => ele.title.indexOf(this.filterText.trim()) >= 0)
    },
  },
  methods: {
    // 樹狀結構顯示行
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
      const record = this.tableData[trIndex]
      // eslint-disable-next-line no-underscore-dangle
      record._expanded = !record._expanded
    },
    // 樹狀結構顯示層級關係的空格和圖標
    spaceIconShow(index) {
      if (index === 0) {
        return true
      }
      return false
    },
    // 樹狀結構點擊展開和關閉的圖標切換
    toggleIconShow(record) {
      if (record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    forceLayoutUpdate() {
      this.$refs.elTable.doLayout()
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-header::v-deep {
  @include Flex($j: space-between);

  margin: 0 auto 0 0;

  >span {
    width: 80%;
  }
}

.ms-tree-space::v-deep {
  position: relative;
  top: 1px;
  display: inline-block;
  width: 20px;
  height: 14px;
  font-family: 'Glyphicons Halflings';
  font-weight: 400;
  font-style: normal;
  line-height: 1;

  &::before {
    content: '';
  }

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

.toggleBtn::v-deep {
  @include size(16px, 16px, 0);
  @include Flex();

  margin-right: 5px;
  color: #fff;
  background-color: #616284;
  border-radius: 4px;
  cursor: pointer;

  > i {
    font-size: 12px;
  }
}

.el-table::v-deep td.is-center {
  text-align: right;
}

.tableSection::v-deep {
  .main-table td .risk {
    display: inline-block;
  }
}

</style>
