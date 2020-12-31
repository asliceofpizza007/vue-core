<template lang="pug">
  #systemConfig.views(ref="view" v-loading="listLoading")
    ScrollBar.tableSection(
      :style="{height: tableHeight + 'px'}"
      :alwaysShowTracks="true"
    )
      .rule
        span 變數名稱：僅接受大寫英文、底線、數字，且必須為英文開頭
      .tableColumn
        el-form.tableGroup(
          ref="editForm"
          v-for="(list,index) in formData"
          :model="list"
          :key="index"
        )
          el-form-item.name-content.side-error(
            prop="name"
            :rules="getNameValidation(index)"
          )
            el-input(
              v-model="list.name"
              placeholder="請輸入變數名稱"
            )
          el-form-item.value-content.side-error(
            prop="value"
            :rules="{ required: true, message: '請輸入值', trigger: 'blur' }"
          )
            el-input(
              v-model="list.value"
              placeholder="請輸入值"
            )
          el-form-item.description-content.side-error(
            prop="description"
            :rules="{ required: true, message: '請輸入描述', trigger: 'blur' }"
          )
            el-input(
              v-model="list.description"
              placeholder="請輸入描述，限 100 字"
              maxlength="100"
            )
          el-form-item.action-content
            el-button(
              @click="checkDeletList(list,index)"
              size="small"
              type="bd-cancel"
              icon="el-icon-delete"
            ) {{`${!list.isEnter ? '刪除' : '確認刪除?'}`}}
    .btnBlock(ref="btnBlock")
      .btnWrap
        el-button(
          type="edit"
          @click="appendList"
        ) 新增列表
        el-button(
          type="success"
          @click="checkValidate"
        ) 儲存
</template>
<script>
import ScrollBar from '@c/ScrollBar'
import debounce from 'lodash/debounce'
import apiSystemConfig from '@api/apiSystemConfig'

export default {
  name: 'SystemConfig',
  components: {
    ScrollBar,
  },
  data() {
    return {
      tableHeight: 0,
      listLoading: false,
      formData: [],
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
  },
  beforeDestroy() {
    this.$store.dispatch('JsPanels/closePanelByParent', this.$options.name)
    this.$bus.$off('resize-table-height')
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const res = await apiSystemConfig.getSystemConfigsList()
        if (res && res.length) {
          this.formData = res.map(item => {
            return {
              name: item.name,
              value: item.value,
              description: item.description,
              isEnter: null,
              timer: null,
            }
          })
        } else {
          this.appendList()
        }
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    appendList() {
      const originInputData = {
        name: null,
        value: null,
        description: null,
        isEnter: null,
        timer: null,
      }
      this.formData.push(originInputData)
    },
    checkDeletList(list, idx) {
      const checkList = list
      checkList.isEnter += 1
      if (checkList.isEnter === 1) {
        checkList.timer = setTimeout(() => {
          this.restDeletList(checkList)
          checkList.timer = null
        }, 3000)
      }
      if (checkList.isEnter === 2 && checkList.timer) {
        this.formData.splice(idx, 1)
      }
    },
    restDeletList(list) {
      const checkList = list
      if (checkList.timer !== null) {
        checkList.isEnter = null
        clearTimeout(checkList.timer)
      }
    },
    getNameValidation(i) {
      return [{
        required: true,
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('請輸入變數名稱'))
          } else if (!(this.checkValidator(value, i))) {
            callback(new Error('格式不正確'))
          } else {
            callback()
          }
        },
      }]
    },
    checkValidator(val, i) {
      const value = val.toUpperCase()
      const checkVal = new RegExp('^[A-Z][A-Z0-9_]*$')
      this.formData[i].name = value
      return checkVal.test(value)
    },
    setTableHeight() {
      const searchHeight = this.$refs.btnBlock.offsetHeight
      const viewHeight = this.$refs.view.offsetHeight
      this.tableHeight = viewHeight - searchHeight - 40
    },
    checkValidate() {
      const refList = this.$refs.editForm
      let validateCount = 0
      refList.forEach(ref => {
        ref.validate(valid => {
          if (valid) {
            validateCount += 1
          }
        })
      })
      if (refList.length === validateCount) {
        this.submitWhenValidate()
      }
    },
    submitWhenValidate: debounce(async function () {
      const getPayLoad = []
      this.formData.forEach(item => {
        getPayLoad.push({
          name: item.name,
          value: item.value,
          description: item.description,
        })
      })
      try {
        await apiSystemConfig.updateSystemConfigs(getPayLoad)
        this.$message({
          message: '資料更新成功',
          type: 'success',
        })
        this.getList()
      } catch {
        // pass
      }
    }, 600),
  },
}
</script>

<style lang="scss" scoped>
#systemConfig::v-deep {
  .btnBlock {
    @include Flex();

    margin: 0.7rem 0 0;
    border-top: 1px solid #e4e7ed;

    .btnWrap {
      padding: 0.7rem 0 0;
      margin-bottom: 0;
    }
  }

  .tableSection {
    padding: 0 1rem;
    width: 100%;
    background: #fafafa;

    .tableColumn {
      margin: 0.5rem 0 1rem;
      padding-bottom: 1rem;
      width: 100%;
    }

    .rule {
      display: flex;
      align-items: center;
      margin-top: 3px;
      margin-top: 1rem;
      font-size: 13px;
      color: #888b89;
      line-height: 20px;

      &.invalid {
        color: #f56c6c;
      }

      > i {
        margin-top: 3px;
        margin-right: 5px;
      }
    }
  }

  .tableGroup {
    @include Flex(flex-start,flex-start);

    > div + div {
      margin-left: 10px;
    }

    .name-content,
    .value-content {
      flex: 1;
    }

    .description-content {
      flex: 2;
    }

    .action-content {
      width: 100px;
    }
  }

  .buttonWrapper {
    @include Flex;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .side-error {
    .el-form-item__error {
      top: 7px;
      right: 12px;
      left: auto;
      pointer-events: none;
    }
  }
}
</style>
