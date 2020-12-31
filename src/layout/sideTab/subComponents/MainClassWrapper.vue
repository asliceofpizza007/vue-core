<template lang="pug">
  el-collapse-item.mainClass(:name="mainClass.mainClassName")
    template(slot="title")
      el-badge(is-dot :hidden="checkDotShow")
        span {{ mainClass.mainClassName }}
        span {{ `(${unreadCount}/${totalCount})` }}
    .mainClassWrapper
      template(v-for="sub in mainClass.list")
        SubClassWrapper(:key="sub.subClassName"
          :subClass="sub"
        )
</template>
<script>
import SubClassWrapper from './SubClassWrapper'

export default {
  name: 'MainClassWrapper',
  components: {
    SubClassWrapper,
  },
  props: {
    mainClass: {
      type: Object,
      default: null,
    },
    activeMainCollapse: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {}
  },
  computed: {
    unreadCount() {
      return this.mainClass.list.reduce((acc, curr) => {
        return acc + curr.list.filter(ele => ele && !ele.isRead).length
      }, 0)
    },
    totalCount() {
      return this.mainClass.list.reduce((acc, curr) => {
        return acc + curr.list.filter(ele => ele).length
      }, 0)
    },
    checkDotShow() {
      return !!this.activeMainCollapse.find(el => {
        return el === this.mainClass.mainClassName
      }) || !this.unreadCount
    },
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
  .mainClass /deep/ {
    margin-bottom: 15px;

    > div {
      > .el-collapse-item__header {
        padding: 0.5rem;
        height: auto;
        line-height: 1;
        font-size: 1rem;
        font-weight: bold;
        letter-spacing: 0.5px;
        border: 1px solid #ebeef5;
        border-top: 3px solid #3c8dbc;

        .el-badge {
          width: 100%;
          height: 100%;
        }

        .el-collapse-item__arrow {
          display: none;
        }
      }
    }

    > .el-collapse-item__wrap {
      border-bottom: unset;

      .el-collapse-item__content {
        padding-bottom: unset;
      }

      .mainClassWrapper {
        padding: 1rem 0.5rem;
        background-color: #e7eef3;
      }
    }
  }
</style>
