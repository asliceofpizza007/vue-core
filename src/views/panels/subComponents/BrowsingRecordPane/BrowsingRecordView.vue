<template lang="pug">
  .pane
    .searchBlock
      el-form.complex-group(
          :model="condition"
          @submit.native.prevent
        )
        el-form-item.searchBox(label="關鍵字")
          el-input(v-model="condition.keyword")
        el-form-item(label="時間")
          el-date-picker(
            v-model="condition.date"
            type="daterange"
            range-separator="至"
            start-placeholder="開始時間"
            end-placeholder="結束時間"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
          )
        el-button(
          type="search"
          icon="el-icon-search"
          @click="getList"
        ) 搜尋
    .tableBlock
      TableWrapper(
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
import TableWrapper from '@c/TableWrapper'
import debounce from 'lodash/debounce'
import apiBrowsingRecord from '@api/apiBrowsingRecord'
import { fromRange } from '@/utils'
import { CommonMixin } from '@/mixins'

export default {
  name: 'BrowsingRecordView',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  data() {
    return {
      condition: {
        keyword: null,
        date: null,
        sortName: 'updatedOn',
        sort: 'DESC',
      },
      tbData: {},
      columnSetting: [
        {
          prop: 'account',
          label: 'th.account',
        },
        {
          prop: 'date',
          label: 'th.date',
          sortable: true,
        },
        {
          prop: 'article',
          label: 'th.article',
        },
      ],
      listLoading: false,
    }
  },
  computed: {
    getPayLoad() {
      const params = {
        page: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      const dateTime = fromRange(this.condition)
      if (dateTime.endOn) {
        dateTime.endOn.replace('00:00:00', '23:59:59')
      }

      Object.keys(this.condition).forEach(key => {
        let value = this.condition[key]
        if (value && typeof value === 'string') {
          value = value.trim()
          this.condition[key] = value
        }
        params[key] = value
      })
      delete params.date

      const load = {}
      return Object.assign(load, params, dateTime)
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList: debounce(async function () {
      this.listLoading = true
      try {
        const resp = await apiBrowsingRecord.getViewerPerDay(this.getPayLoad)
        this.tbData = resp
      } catch {
        // pass
      }
      this.listLoading = false
    }, 600, {
      leading: true,
      trailing: false,
    }),
  },
}
</script>
