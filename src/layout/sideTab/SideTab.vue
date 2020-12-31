<template lang="pug">
  #sideTab(:collapse="isSideTabCollapse")
    ul.tabList
      li(v-for="tab in tabs"
        :key="tab.name"
        :class="{active: activeTab === tab.name}"
        @click="switchTab(tab.name)"
      )
        span {{ tab.label }}
        el-badge(
          v-if="tab.name === 'BulletinSummary'"
          :hidden="!totalUnread"
          :value="totalUnread"
          :max="99"
        )
    ScrollBar.sideTabContent
        transition(
          :duration="200"
          name="fade"
          mode="out-in"
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        )
          components(
            :is="activeTab"
            :style="{animationDuration: `.2s`}"
          )
</template>
<script>
import ScrollBar from '@c/ScrollBar'
import { mapState } from 'vuex'
import BulletinSummary from './subComponents/BulletinSummary'

export default {
  name: 'SideTab',
  components: {
    ScrollBar,
    BulletinSummary,
  },
  data() {
    return {
      activeTab: 'BulletinSummary',
      tabs: [
        {
          label: '公告摘要',
          name: 'BulletinSummary',
        },
      ],
    }
  },
  computed: {
    ...mapState('app', {
      isSideTabCollapse: state => state.isSideTabCollapse,
    }),
    ...mapState('bulletinSummaries', {
      totalUnread: state => state.totalUnread,
    }),
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
    },
  },
}
</script>
<style lang="scss" scoped>
  #sideTab {
    .tabList {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #e4e7ed;
      }

      li {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffffb3;
        background-color: #445d6fcc;
        cursor: pointer;

        &:hover {
          color: #fff;
          background-color: #445d6f;
        }

        &.active {
          color: #022132;
          background: transparent;
          box-shadow: 0 0 20px 5px #0000001a;
        }

        .el-badge /deep/ {
          margin-left: 5px;

          .el-badge__content {
            border: unset;
          }
        }
      }
    }

    .sideTabContent {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
</style>
