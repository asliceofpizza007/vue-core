<template lang="pug">
  #webSetting
    el-table(
      class="main-table"
      border
      :data="tableData"
    )
      el-table-column(
        prop="keys"
        label="鍵值"
        sortable
        fixed="left"
      )
      el-table-column(
        prop="value"
        label="值"
      )
      el-table-column(
        prop="updatedOn"
        label="更新時間"
      )
      el-table-column(
        prop='updatedByName'
        label="更新者"
      )
</template>
<script>
export default {
  name: 'WebSetting',
  data() {
    return {
      tableData: [
        {
          keys: '我是誰',
          value: '456',
          updatedOn: '2019-12-12 11:11:11',
          updatedByName: '管理員',
        },
        {
          keys: '你是誰',
          value: '789',
          updatedOn: '2019-12-12 11:11:11',
          updatedByName: '管理員',
        },
        {
          keys: '他是誰',
          value: '789',
          updatedOn: '2019-12-12 11:11:11',
          updatedByName: '管理員',
        },
        {
          keys: '我是誰',
          value: '789',
          updatedOn: '2019-12-12 11:11:11',
          updatedByName: '管理員',
        },
        {
          keys: '我是誰',
          value: '789',
          updatedOn: '2019-12-12 11:11:11',
          updatedByName: '管理員',
        },
      ],
    }
  },
  methods: {
    // sortMethod(obj1, obj2) {
    //   console.log(obj1, obj2)
    // },
  },
}
</script>
