<template lang="pug">
  #handoverInfoMagement.views.emsTheme(ref="view")
    .searchBlock(ref="searchBlock")
      div
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item.commonlySearch
            el-radio-group(
              v-model="commonlySearchType"
              @change="doCommonlySearch"
            )
              el-radio-button(label="all") 全部
              el-radio-button(label="notfinished") 未完成
              el-radio-button(label="finished") 已結案
              el-radio-button(label="unread") 未讀
              el-radio-button(label="mine") 我的
              el-radio-button(label="collect") 收藏
              el-radio-button(v-if="commonlySearchType === 'advanced'" label="advanced") 進階篩選結果
          el-form-item.selectTimer-group
            el-select(
              slot="label"
              v-model="condition.dateType"
              @change="getListWithDebounce"
            )
              el-option(
                :label="'交辦日期'"
                :value="1"
              )
              el-option(
                :label="'完成日期'"
                :value="2"
              )
            el-date-picker(v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              @change="dateRangeChange"
            )
            el-input.searchTitle(
              v-model="condition.keyword"
              placeholder="請輸入關鍵字"
              @keyup.native.enter="getListWithDebounce"
              clearable
              @clear="getListWithDebounce"
              maxlength="20"
            )
            el-button(
              type="search"
              icon="el-icon-search"
              @click="getListWithDebounce(true)"
            ) 搜尋
          el-form-item
            el-button(
              class="advancedSearch"
              type="search"
              @click="openSearchPanel"
            ) 進階搜尋
      .btnWrap
        el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
          el-form-item(label="交接類別")
            el-select(
              v-model="condition.typeId"
              clearable
              @change="typeIdChange"
            )
              el-option(
                label="全部"
                :value="null"
              )
              el-option(
                v-for="item in handoverTypeList.list"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId"
              )
          el-form-item.tagIdSet(
            :class="{ 'toggleShow': isExpandTags }"
          )
            el-checkbox-group(
              v-model="condition.tagIdSet"
              @change="getListWithDebounce"
            )
              el-checkbox(
                v-for="item in tagIdSetList"
                :label="item.id"
                :key="item.id"
                border
              ) {{ item.name }}
          el-form-item
            el-button(
              v-if="showAlltags"
              class="filter"
              :icon="toggleArrow"
              @click="toggleExpand()"
            )
        el-button(
          class="filter"
          type="info"
          icon="el-icon-view"
          @click="readAll"
        )
        el-button(
          v-if="getActions && getActions.create"
          class="newItem filter"
          type="add"
          icon="el-icon-plus"
          @click="handleAction({ action: 'create' })"
        ) 新增交接

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
        :isSortable="true"
        :currentSort="getSorter"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
        @sort-change="sortChange"
      )
</template>
<script>
import apiHandovers from '@api/apiHandovers'
import TableWrapper from '@c/TableWrapper'
import { debounce } from 'lodash'
import { replaceToDate, delay } from '@/utils'
import columnModule from '@js/tableProp'
import { CommonMixin } from '@/mixins'
import { mapState } from 'vuex'

export default {
  name: 'HandoverInfoManagement',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      test: [],
      tableHeight: 0,
      commonlySearchType: 'notfinished',
      condition: {
        sortName: 'id',
        sort: 'DESC',
        keyword: null,
        dateBegin: null,
        dateEnd: null,
        dateType: 1,
        isRead: null,
        isCollected: null,
        isFinish: false,
        typeId: null,
        tagIdSet: [],
        titleSet: [],
        contentSet: null,
        publisherIdSet: [],
        isMatchAll: true,
      },
      dateRange: null,
      tbData: {
        totalSize: 0,
        list: [],
      },
      columnSetting: [
        columnModule.id(70, 'left'),
        {
          prop: 'typeName',
          label: 'th.typeName',
          width: 100,
          fixed: 'left',
        },
        {
          prop: 'tagName',
          label: 'th.tagName',
          width: 100,
          fixed: 'left',
        },
        {
          prop: 'title',
          label: 'th.subject',
          fixed: 'left',
          minWidth: 300,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            const tags = [
              {
                prop: 'isNewResponse',
                text: '新回應',
                type: 'info',
              },
              {
                prop: 'isRead',
                text: '未閱讀',
                type: 'danger',
              },
            ]
            return (
              <div class="titleBlock" onClick={() => { this.openHandover(row) }}>
                <span>
                  { val }
                </span>
                <div class="tagBlock">
                  {
                    tags.map((tag, i) => {
                      if ((i === 0 && !row[tag.prop]) || (i === 1 && row[tag.prop])) return false
                      return (
                        <el-tag key={tag.prop}
                          size="small"
                          type={tag.type}
                        >
                          { tag.text }
                        </el-tag>
                      )
                    })
                  }
                </div>
              </div>
            )
          },
        },
        {
          prop: 'isFinish',
          label: 'th.isEnabled',
          width: 70,
          sortable: true,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span class={val ? 'enable' : 'error'}>
                { val ? '已結案' : '未完成' }
              </span>
            )
          },
        },
        {
          prop: 'importance',
          label: 'th.importance',
          width: 100,
          sortable: true,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <el-rate value={val}
                max={3}
                disabled={true}
              />
            )
          },
        },
        {
          prop: 'publishDate',
          label: 'th.assignDate',
          width: 100,
          sortable: true,
        },
        {
          prop: 'finishDate',
          label: 'th.completionDate',
          width: 100,
          sortable: true,
        },
        {
          prop: 'publisher',
          label: 'th.publisher',
          width: 110,
        },
        columnModule.readerCount(),
        {
          prop: 'isCollected',
          label: 'th.collected',
          width: 60,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <div class="collectButton">
                <button onClick={() => { this.toggleCollected(row) }}>
                  <i class={`fa fa-heart ${val ? 'collect' : 'not-collect'}`}/>
                </button>
              </div>
            )
          },
        },
      ],
      paginationType: 'large',
      listLoading: false,
      isExpandTags: false,
      showAlltags: false,
      showDefaultAction: false, // to disable functional column
      autoReload: null, // auto reload interval
    }
  },
  computed: {
    ...mapState('options', {
      handoverTagList: state => state.handoverTagList,
      handoverTypeList: state => state.handoverTypeList,
    }),
    getPayLoad() {
      const load = {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      Object.keys(this.condition).forEach(key => {
        let value = this.condition[key]
        const arraykey = /tagIdSet|titleSet|publisherIdSet/
        if (arraykey.test(key) && value.length === 0) {
          value = null
        } else if (value && typeof value === 'string') {
          value = value.trim()
          this.condition[key] = value
        }
        load[key] = value
      })
      return load
    },
    tagIdSetList() {
      if (!this.condition.typeId) {
        return this.handoverTagList
      }
      const typeId = this.handoverTypeList.list.find(item => {
        return item.typeId === this.condition.typeId
      })
      const tagsList = typeId ? this.handoverTagList.filter(item => {
        return typeId.tagIdSet.indexOf(item.id) > -1
      }) : null

      return tagsList
    },
    toggleArrow() {
      return this.isExpandTags ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
  },
  watch: {
    tagIdSetList() {
      this.$nextTick(() => {
        const height = document.querySelector('.tagIdSet .el-checkbox-group')
        this.showAlltags = height.offsetHeight > 44
      })
    },
    condition: {
      handler() {
        this.$nextTick(() => {
          if (this.condition.dateBegin) {
            this.dateRange = [this.condition.dateBegin, this.condition.dateEnd]
          } else {
            this.dateRange = null
          }
        })
      },
      deep: true,
    },
  },
  created() {
    this.getList()
    this.initInterval()
    this.$bus.$on('resize-table-height', this.setTableHeight)
    this.$bus.$on('refresh-handover-list', this.getListWithDebounce)
  },
  mounted() {
    this.setTableHeight()
  },
  activated() {
    this.setTableHeight()
    this.$refs.tableWrapper.forceLayoutUpdate()
  },
  beforeDestroy() {
    this.stopInterval()
    this.$store.dispatch('JsPanels/closePanelByParent', this.$options.name)
    this.$bus.$off('resize-table-height')
    this.$bus.$off('refresh-handover-list')
  },
  methods: {
    initInterval() {
      this.autoReload = setInterval(() => {
        this.pagination.pageNum = 1
        this.getList()
      }, 5 * 60 * 1000)
    },
    stopInterval() {
      if (this.autoReload) {
        clearInterval(this.autoReload)
      }
    },
    async getList() {
      this.listLoading = true
      try {
        const res = await apiHandovers.getHandoversInfoList(this.getPayLoad)
        res.list = this.listRetouch(res.list)
        this.tbData = res
      } catch {
        console.log('列表取得失敗')
      } finally {
        this.listLoading = false
      }
    },
    getListWithDebounce: debounce(function (fromSearchBtn = false) {
      if (fromSearchBtn !== true && this.commonlySearchType === 'advanced') {
        switch (this.condition.isFinish) {
          case null:
            this.commonlySearchType = 'all'
            break
          case true:
            this.commonlySearchType = 'finished'
            break
          case false:
            this.commonlySearchType = 'notfinished'
            break
          default:
        }
      }
      this.getList()
    }, 500, {
      leading: true,
      trailing: false,
    }),
    handleAction({ action, id = null }) {
      if (action !== 'delete') {
        const headerTitle = (action === 'create') ?  '新增交接資訊' : `交接資訊 - #${id}`

        const settings = {
          component: 'EditHandoverInfo',
          headerTitle,
          contentSize: {
            width: '960px',
            height: '80%',
          },
          bgPanel: '#05517c',
        }
        const props = {
          action,
        }

        if (id !== null) {
          settings.id = id
          props.id = id
        } else {
          settings.id = 'only'
        }

        if (id) {
          settings.id = id
          props.id = id
        } else {
          settings.id = 'only'
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props })
      } else {
        const deleteApi = apiHandovers.deleteHandoversInfo
        this.delete(id, deleteApi)
      }
    },
    async doCommonlySearch() {
      this.condition.isFinish = null
      this.condition.isRead = null
      this.condition.isCollected = null
      this.condition.publisherIdSet = []
      switch (this.commonlySearchType) {
        case 'all':
          this.condition.isFinish = null
          break
        case 'notfinished':
          this.condition.isFinish = false
          break
        case 'finished':
          this.condition.isFinish = true
          break
        case 'unread':
          this.condition.isRead = false
          break
        case 'mine':
          const userData = localStorage.getItem('userData')
          const userId = JSON.parse(userData).adminId
          this.condition.publisherIdSet.push(userId)
          break
        case 'collect':
          this.condition.isCollected = true
          break
        default:
          break
      }
      this.$nextTick(() => {
        this.getListWithDebounce()
      })
    },
    toggleExpand() {
      this.isExpandTags = !this.isExpandTags
      this.$nextTick(() => {
        this.setTableHeight()
      })
    },
    listRetouch(list) {
      list.forEach(item => {
        const row = item
        row.publishDate = replaceToDate(item.publishDate)
        row.finishDate = replaceToDate(item.finishDate)
      })
      return list
    },
    openSearchPanel() {
      const settings = {
        component: 'AdvancedFilter',
        headerTitle: '進階篩選',
        bgPanel: '#05517c',
      }

      const events = {
        search: async val => {
          this.condition.isRead = null
          Object.keys(val).forEach(key => {
            this.condition[key] = val[key]
          })
          await this.getList()

          this.commonlySearchType = 'advanced'

          this.condition.titleSet = []
          this.condition.contentSet = null
          this.condition.publisherIdSet = []
          this.condition.isRead = null
          this.condition.isCollected = null
          this.condition.isMatchAll = true
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, events })
    },
    openHandover(row) {
      const {
        id,
        title,
        oldId,
        isNewResponse,
        isRead,
      } = row

      const width = (window.innerWidth > 1080) ? '980px' : '80%'
      const oldIdTitle = oldId ? ` 舊系統編號：${oldId}` : ''
      const settings = {
        id,
        component: 'ShowHandover',
        headerTitle: `編號 ${id} - ${title}${oldIdTitle}`,
        contentSize: {
          height: '80%',
          width,
        },
        bgPanel: '#05517c',
        isMaximizeControlHidden: true,
      }
      const props = {
        id,
        row,
      }

      const events = {
        'handle-action': async val => {
          // trigger after panel close
          await delay(0)
          this.handleAction(val)
        },
        'refresh-list': () => {
          this.getList()
        },
      }

      const targetList =  this.tbData.list.find(item => {
        return item.id === id
      })
      if (isNewResponse) {
        targetList.isNewResponse = !isNewResponse
      }
      if (!isRead) {
        targetList.isRead = true
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
    async toggleCollected(row) {
      const {
        id,
      } = row
      const list = this.tbData.list.find(item => item.id === id)
      list.isCollected = !list.isCollected
      try {
        if (list.isCollected) {
          await apiHandovers.addHandoversRcollect(id)
        } else {
          await apiHandovers.deleteHandoverscollect(id)
        }
        this.getList()
      } catch {
        // pass
      }
    },
    async readAll() {
      const h = this.$createElement
      const finishTitle = {
        true: '已結案',
        false: '未完成',
        null: '全部',
      }
      const isFinish = h('b', null, `交接狀態：${finishTitle[this.condition.isFinish]}`)
      const type = this.handoverTypeList.list.find(item => {
        return item.typeId === this.condition.typeId
      })
      const typeName = type ? type.typeName : '全部'
      const handoverTypeId = h('b', null, `交接類別：${typeName}`)
      try {
        await this.$msgbox({
          title: '是否將所有',
          message: h('div', { class: 'info' }, [
            isFinish,
            handoverTypeId,
            h('p', null, '之項目標示已讀？'),
          ]),
          showCancelButton: true,
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
        })

        const params = {
          isFinished: this.condition.isFinish,
          handoverTypeId: this.condition.typeId,
        }
        await apiHandovers.updateHandoversRead(params)
        this.getList()
      } catch {
        // pass
      }
    },
    async dateRangeChange(value) {
      if (value) {
        this.condition.dateBegin = value[0]
        this.condition.dateEnd = value[1]
      } else {
        this.condition.dateBegin = null
        this.condition.dateEnd = null
      }
      this.getListWithDebounce()
    },
    typeIdChange() {
      this.condition.tagIdSet = []
      this.getListWithDebounce()
    },
  },
}
</script>

<style lang="scss" scoped>
  #handoverInfoMagement::v-deep {
    .complex-group {
      width: 100%;

      .selectTimer-group {
        margin-left: auto;

        .el-select {
          width: 110px;
        }
      }

      .el-form-item:last-child {
        margin-right: 0;
      }
    }

    .el-radio-button__inner {
      padding: 9px 20px;
    }

    .searchTitle {
      width: auto;
    }

    .btnWrap {
      display: flex;
      align-items: flex-start;
      margin-top: 15px;

      .el-form {
        flex: 1;
        align-items: flex-start;

        .el-form-item {
          margin: 0 0.7em 0 0;
        }

        .tagIdSet {
          flex: 1;

          &.toggleShow .el-form-item__content {
            height: auto;
          }

          .el-form-item__content {
            line-height: normal;
            overflow: hidden;
            height: 34px;
          }

          .el-checkbox {
            display: inline-flex;
            align-items: center;
            height: 34px;
            margin-bottom: 10px;

            &:not(:last-child) {
              margin-right: 10px;
            }
          }
        }
      }
    }

    .advancedSearch {
      margin-left: 0.3em;
    }

    .filter {
      padding: 0 0.7em;

      &+.filter {
        margin-left: 0.4em;
      }
    }

    td {
      .enable,
      .stopped,
      .notyet,
      .error {
        padding: 0;
        background: none;
      }
    }

    /deep/ .el-table {
      td {
        .titleBlock {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          cursor: pointer;

          >span {
            text-align: left;
            text-decoration: underline;
            color: #004ba9;
          }

          .tagBlock {
            .el-tag {
              margin: 0 5px;
            }
          }
        }

        .collectButton {
          >button {
            cursor: pointer;
          }
        }
      }
    }
  }

  .el-message-box__wrapper {
    .el-message-box__status {
      display: none;
    }

    .el-message-box__content {
      .info {
        b {
          display: block;
          line-height: 2;
          padding-left: 25%;
        }

        p {
          padding-left: 60%;
        }
      }
    }
  }

</style>
