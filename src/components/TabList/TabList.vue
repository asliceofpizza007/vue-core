<template lang="pug">
  .tagList
      el-tag(
        v-for="(tag,index) in infoList"
        :closable="true"
        :title="tag"
        @close="removeTag(tag)"
        :key="index"
      ) {{ tag }}
</template>
<script>
import { remove, cloneDeep } from 'lodash'

export default {
  name: 'TabList',
  props: {
    infoList: {
      type: Array,
      default: null,
    },
  },
  methods: {
    removeTag(value) {
      const newList = cloneDeep(this.infoList)
      remove(newList, tag => tag === value)
      this.$emit('update:infoList', newList)
    },
  },
}
</script>
<style lang="scss" scoped>
  .tagList::v-deep {
    line-height: 1rem;
    vertical-align: middle;

    .el-tag {
      position: relative;
      overflow: hidden;
      margin-right: 0.5rem;
      padding-right: 1.5rem;
      max-width: 12rem;
      font-size: 0.9rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      background-color: #3c8dbc;
      border: 1px solid #3c8dbc;

      i.el-tag__close {
        color: #c5c7e7;

        &:hover {
          color: #fff;
          background-color: red;
        }
      }

    }
  }
</style>
