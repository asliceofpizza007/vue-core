<template lang="pug">
  .pane
    .searchBlock
      el-form.complex-group(
        :model="condition"
        @submit.native.prevent
      )
        el-form-item(label="時間")
          el-date-picker(
            v-model="condition.date"
            type="daterange"
            range-separator="至"
            start-placeholder="開始時間"
            end-placeholder="結束時間"
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
        :currentSort="getSorter"
        @page-size-change="pageSizeChange"
        @page-change="pageChange"
      )
</template>
<script>
import TableWrapper from '@c/TableWrapper'
import debounce from 'lodash/debounce'
import apiMemberInfo from '@api/apiMemberInfo'
import { fromRange } from '@/utils'
import { CommonMixin } from '@/mixins'

export default {
  name: 'AccountRecordView',
  components: {
    TableWrapper,
  },
  mixins: [CommonMixin],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      condition: {
        sortName: 'updatedOn',
        sort: 'descending',
      },
      tbData: {},
      columnSetting: [
        {
          prop: 'watchTime',
          label: '觀看時間',
        },
        {
          prop: 'tagNames',
          label: '影片標籤',
        },
        {
          prop: 'companyName',
          label: '片商',
        },
        {
          prop: 'videoTitle',
          label: '片名',
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
        dateTime.endOn = dateTime.endOn.replace('00:00:00', '23:59:59')
      }
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
        const resp = await apiMemberInfo.getMemberViewRecordList(this.getPayLoad, this.id)
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
