<template lang="pug">
.inputList
  el-form(
    :rules="inputListRule"
    :model="inputList"
    ref="listForm"
    :disabled="inputDisabled"
  )
    el-form-item(
      v-for="(item,index) in inputListArray"
      :key="`${item}${index}`"
      :prop="item"
      :class="item"
    )
      el-input(
        v-model="inputList[item]"
        clearable
        @clear="deleteInput(item)"
        @blur="inputBlur(item)"
        @input="inputKeyup"
        :placeholder="placeholder"
      )
</template>

<script>
export default {
  props: {
    propData: {
      type: Array,
    },
    inputType: {
      type: String,
      default: 'text',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    inputDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputList: {},
      newKey: 0,
      placeholder: this.inputType === 'url' ? '請輸入完整網址，例：http://www.123.com' : '',
    }
  },
  computed: {
    inputListArray() {
      return Object.keys(this.inputList)
    },
    inputListRule() {
      const rule = {}

      if (this.inputType === 'url') {
        Object.keys(this.inputList).forEach(item => {
          rule[item] = [{ type: 'url', message: '請輸入正確的網址' }]
        })
      }

      return rule
    },
    lastKey() {
      return this.inputListArray[this.inputListArray.length - 1]
    },
    lastList() {
      return this.inputList[this.lastKey]
    },
  },
  watch: {
    async loading() {
      await this.getInputList()
      this.$refs.listForm.validate(valid => {
        this.$emit('check-valid', valid)
      })
    },
  },
  created() {
    if (!this.loading) {
      this.getInputList()
    }
  },
  methods: {
    getInputList() {
      this.propData.forEach((item, index) => {
        this.$set(this.inputList, 'list' + index, item)
      })
      this.newKey = this.propData.length
      if (!this.inputDisabled) {
        this.$set(this.inputList, 'list' + this.newKey, '') // 不管怎樣都會有新增
        this.newKey += 1
      }
    },
    async inputKeyup() {
      this.emitData()

      // 如果是列表最後一個，新增新的
      if (this.lastList) {
        this.$set(this.inputList, 'list' + this.newKey, '')
        this.newKey += 1
      }
    },
    inputBlur(key) {
      if (!this.inputList[key] && key !== this.lastKey) {
        this.deleteInput(key)
      }
    },
    deleteInput(key) {
      this.$delete(this.inputList, key)
      this.emitData()
    },
    async emitData() {
      const data = Object.keys(this.inputList).map(key => {
        return this.inputList[key]
      })

      this.$emit('emit-data', data.filter(item => {
        return item !== ''
      }))

      await this.$nextTick()
      this.$refs.listForm.validate(valid => {
        this.$emit('check-valid', valid)
      })
    },
  },
}
</script>
<style lang="scss" scoped>

.is-disabled::v-deep {
  opacity: 1;

  .el-input__inner {
    color: #606266;
    background-color: #fff;
    border-color: rgba(91, 81, 107, 0.25);
  }
}

.inputList {
  counter-reset: num;

  .el-form-item {
    position: relative;
    counter-increment: num;
    display: flex;
    padding: 0 0 0 20px;

    /deep/ .el-form-item__content {
      padding-right: 0 !important;
      width: 100% !important;
    }

    &::before {
      content: counter(num) '.';
      position: absolute;
      top: 0;
      right: calc(100% - 15px);
      display: block;
      width: 20px;
      text-align: right;
    }

    &:not(:last-of-type) {
      margin: 0 0 22px;

      &::before {
        content: counter(num) '.';
      }
    }

    &:last-of-type:not(:first-of-type)::before {
      content: '\e6d9';
      font-family: 'element-icons' !important;
      color: #b3b3b3;
    }

  }
}
</style>
