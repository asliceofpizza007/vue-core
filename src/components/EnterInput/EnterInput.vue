<template lang="pug">
  .enterInput(v-show="!disable")
    el-input(
      v-model="inputValue"
      :disabled="disable"
      :maxlength="10"
      placeholder="輸入完成後按Enter鍵送出"
      @keyup.enter.native="submitInput"
      @blur="submitInput")
</template>
<script>
export default {
  name: 'EnterInput',
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
    }
  },
  methods: {
    submitInput() {
      if (this.inputValue !== '') {
        this.$emit('enter', this.inputValue.trim())
        this.inputValue = ''
      }
    },
    clear() {
      this.inputValue = ''
    },
  },
}
</script>
<style lang="scss" scoped>
  .input::v-deep {
    display: inline-flex;
    width: 100%;
  }

</style>
