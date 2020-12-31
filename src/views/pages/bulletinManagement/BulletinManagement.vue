<template lang="pug">
  #bulletinManagement.views.emsTheme(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )

          el-form-item(label="主分類")
            el-select(
              v-model="condition.mainClassId"
              clearable
              @change="onMainClassChange"
            )
              el-option(
                v-for="item in bulletinClassList"
                :key="item.mainClassId"
                :label="item.mainClassName"
                :value="item.mainClassId"
              )
          el-form-item(
            label="次分類"
          )
            el-select(
              v-model="condition.subClassId"
              :disabled="!condition.mainClassId"
              clearable
              @change="getListWithDebounce"
            )
              el-option(
                v-for="item in subClassIdList"
                :key="item.subClassId"
                :label="item.subClassName"
                :value="item.subClassId"
              )
          el-form-item(:label="$t('th.publishStatus')")
            el-select(
              v-model="condition.publishStatus"
              clearable
              @change="getListWithDebounce"
            )
              el-option(:label="'未上架'" :value="1") 未上架
              el-option(:label="'上架中'" :value="2") 上架中
              el-option(:label="'已下架'" :value="3") 已下架
          el-form-item.appendBox(:label="$t('th.title')")
            el-input(
              v-model="condition.title"
              placeholder="請輸入標題"
              clearable
              maxlength="15"
              @keyup.native.enter="getListWithDebounce"
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
            v-if="getActions && getActions.create"
            class="newItem"
            type="add"
            icon="el-icon-plus"
            @click="handleAction({ action: 'create' })"
          ) 新增公告
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
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import apiBulletins from '@api/apiBulletins'
import TableWrapper from '@c/TableWrapper'
import { listRetouch } from '@/utils'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'
import { mapState } from 'vuex'

export default {
  name: 'BulletinManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      tableHeight: 0,
      condition: {
        title: null,
        mainClassId: null,
        subClassId: null,
        publishStatus: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {
        totalSize: 0,
        list: [],
      },
      columnSetting: [
        {
          prop: 'mainClassName',
          label: 'th.mainClassName',
          width: 120,
          fixed: 'left',
        },
        {
          prop: 'subClassName',
          label: 'th.subClassName',
          width: 120,
          fixed: 'left',
        },
        {
          prop: 'title',
          label: 'th.title',
          minWidth: 200,
          fixed: 'left',
        },
        columnModule.publishedOn(100),
        columnModule.finishedOn(100),
        columnModule.publishStatus(110),
        {
          prop: 'createdByName',
          label: 'th.createdByName',
          width: 120,
        },
        {
          prop: 'createdOn',
          label: 'th.createdTime',
          sortable: true,
          width: 100,
        },
        columnModule.readerCount(),
        columnModule.updatedByName(120),
        columnModule.updatedOn(100),
      ],
      paginationType: 'large',
      listLoading: false,
    }
  },
  computed: {
    ...mapState('options', {
      bulletinClassList: state => state.bulletinClassList,
    }),
    subClassIdList() {
      const mainClass = this.bulletinClassList.find(item => {
        return item.mainClassId === this.condition.mainClassId
      })

      return mainClass ? mainClass.subClasses : null
    },
  },
  created() {
    this.getList()
    this.$bus.$on('resize-table-height', this.setTableHeight)
    this.$bus.$on('refresh-bulletin-list', this.getListWithDebounce)
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
    this.$bus.$on('refresh-bulletin-list')
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const res = await apiBulletins.getBulletinsList(this.getPayLoad)
        res.list = listRetouch(res.list, 'dateTime')
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
          titleProp.title = row.title
          titleProp.id = row.id
        }
        const headerTitle = this.getHeaderTitle(titleProp)

        const settings = {
          component: 'EditBulletin',
          headerTitle,
          contentSize: {
            width: '1100px',
            height: '75%',
          },
          bgPanel: '#05517c',
        }
        const props = {
          action,
        }
        let id = 'only'
        if (row !== null) {
          const rowData = row
          id = rowData.id
          props.id = id
          props.mainClassName = rowData.mainClassName
          props.createdByName = rowData.createdByName
          props.updatedByName = rowData.updatedByName
          props.createdOn = rowData.createdOn
          props.updatedOn = rowData.updatedOn
        }
        settings.id = id

        this.$store.dispatch('JsPanels/addPanel', { settings, props })
      } else {
        const id = row.id
        const deleteApi = apiBulletins.deleteBulletins
        this.delete(id, deleteApi)
      }
    },
    onMainClassChange() {
      this.condition.subClassId = null
      this.getListWithDebounce()
    },
  },
}
</script>
