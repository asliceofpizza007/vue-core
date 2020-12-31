<template lang="pug">
  #AdManagement.views(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(:label="$t('th.position')")
            el-select(
              v-model="condition.position"
              @change="getListWithDebounce"
            )
              el-option(
                v-for="item in enumRefs.adPosition"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ) {{ adPosition[item.id] }}
          el-form-item(:label="$t('th.publishStatus')")
            el-select(
              v-model="condition.publishStatus"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'未上架'" :value="1") 未上架
              el-option(:label="'上架中'" :value="2") 上架中
              el-option(:label="'已下架'" :value="3") 已下架
          el-form-item(:label="$t('th.isEnabled')")
            el-select(
              v-model="condition.isEnabled"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'啟用中'" :value="true") 啟用中
              el-option(:label="'已停用'" :value="false") 已停用
          el-form-item.search-form
            el-button(
              type="search"
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
          ) 新增廣告圖
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
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import apiAdvertise from '@api/apiAdvertise'
import { mapState } from 'vuex'
import { listRetouch } from '@/utils'
import columnModule from '@js/tableProp'
import TableWrapper from '@c/TableWrapper'
import { adPosition } from '@js/enumRefs'
import { CommonMixin } from '@/mixins'

export default {
  name: 'AdManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        isEnabled: true,
        position: 1,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        totalSize: 0,
        list: [],
      },
      columnSetting: [
        columnModule.sequence(),
        {
          prop: 'preViewImg',
          label: 'th.preview',
          width: 150,
          fixed: 'left',
        },
        columnModule.link(),
        {
          prop: 'openType',
          label: 'th.openType',
        },
        columnModule.isEnabled(100),
        columnModule.clickCount(120),
        columnModule.publishStatus(),
        columnModule.publishedOn(null),
        columnModule.finishedOn(),
        columnModule.updatedOn(160),
        columnModule.updatedByName(120),
      ],
      adPosition,
      listLoading: false,
    }
  },
  computed: {
    ...mapState('app', {
      enumRefs: state => state.enumRefs,
    }),
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
        const res = await apiAdvertise.getAdvertiseList(this.getPayLoad)
        res.list = listRetouch(res.list)
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
          component: 'EditAd',
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
        const deleteApi = apiAdvertise.deleteAdvertise
        this.delete(id, deleteApi)
      }
    },
  },
}
</script>
