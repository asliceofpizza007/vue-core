<template lang="pug">
  #columSetting
    .header 進階列表欄位
    el-form.contentInner
      el-checkbox-group(
        v-model="checkedColumn"
        size="mini"
        @change="setColumns"
      )
        el-checkbox(
          v-for="column in columnSetting"
          :key="column.prop"
          :label="column.prop"
          border
        ) {{ $t(column.label) }}

</template>
<script>
import columnModule from '@js/tableProp'

export default {
  name: 'AdvancedSearch',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      checkedColumn: [],
      columnSetting: [
        columnModule.id(),
        {
          prop: 'account',
          label: 'th.account',
        },
        {
          prop: 'isVIP',
          label: 'th.isVIP',
          width: 100,
          render: (h, scope) => {
            const {
              column,
              row,
            } = scope
            const val = row[column.property]
            return (
              <span>
                { val ? 'VIP 會員' : '一般會員' }
              </span>
            )
          },
        },
        {
          prop: 'createdOn',
          label: 'th.createdOn',
          width: 170,
        },
        {
          prop: 'sourceType',
          label: 'th.sourceType',
        },
        {
          prop: 'loginDayCount',
          label: 'th.loginDayCount',
          width: 100,
        },
        {
          prop: 'viewDayCount',
          label: 'th.viewDayCount',
          width: 100,
          sortable: true,
        },
        {
          prop: 'depositCount',
          label: 'th.depositCount',
          width: 100,
          sortable: true,
        },
        {
          prop: 'depositTotal',
          label: 'th.depositTotal',
          width: 100,
        },
        {
          prop: 'ip',
          label: 'IP',
          width: 100,
        },
        columnModule.updatedOn(170),
        columnModule.isEnabled(100, null),
        columnModule.updatedByName(),
      ],
    }
  },
  mounted() {
    this.checkedColumn = this.columns
  },
  methods: {
    setColumns() {
      const columns = this.columnSetting.filter(column => {
        return this.checkedColumn.includes(column.prop)
      })
      this.$emit('set-columns', columns)
    },
  },
}
</script>
<style lang="scss">
.el-popover.columSetting {
  padding: 0;
  border: 0;

  .popper__arrow::after {
    border-bottom-color: #3b4261 !important;
  }
}

#columSetting {
  width: 28rem;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
    color: #fff;
    background: #3b4261;
    letter-spacing: 0.2vmin;
  }

  .contentInner {
    padding: 10px;
  }
}
</style>
