<template lang="pug">
  #notifications
    .header
      p 通知
    ScrollBar.content(v-loading="loading")
      el-collapse(v-model="activePanels")
        el-collapse-item(
          v-if="unReadList.length > 0"
          :title="`未讀取(${unReadList.length})`"
          name="notRead"
        )
          .context(
            v-for="item in unReadList"
            :key="item.fromEmployeeId"
          )
            .context-left
              i(:class="contextIconName(item.type)")
            .context-right
              .frame
                .title {{ `${item.fromEmployeeId}${ item.title }` }}
                .subject {{ item.message }}
              .time {{ changeFormat(item.createdOn) }}
        el-collapse-item(
          v-if="isReadList.length > 0"
          title="已讀取"
          name="hasRead"
        )
          .context(
            v-for="(item, index) in isReadList"
            :key="item.fromEmployeeId"
          )
            .context-left
              i(:class="contextIconName(item.type)")
            .context-right
              .frame
                .title {{ `${item.fromEmployeeId}${ item.title }` }}
                .subject {{ item.message }}
              .time {{ changeFormat(item.createdOn) }}
    .fixed-footer
      DesktopNotifySwitch
</template>

<script>
import ScrollBar from '@c/ScrollBar'
import moment from 'moment'
import DesktopNotifySwitch from './DesktopNotifySwitch'

export default {
  name: 'Notify',
  components: {
    ScrollBar,
    DesktopNotifySwitch,
  },
  data() {
    return {
      loading: false,
      activePanels: ['notRead'],
      unReadList: [
        {
          createdOn: '2020-03-23 10:55:29',
          fromEmployeeId: '上仁',
          message: 'test',
          title: '取消行程',
          type: 3,
        },
      ],
      isReadList: [
        {
          createdOn: '2020-03-23 10:55:29',
          fromEmployeeId: '上仁',
          message: 'test',
          title: '取消行程',
          type: 3,
        },
      ],
    }
  },
  computed: {
    changeFormat() {
      return date => moment(date).locale('zh-cn').calendar(null, {
        sameDay: '[今天] kk:mm',
        nextDay: '[明天] kk:mm',
        nextWeek: '[下]dddd kk:mm',
        lastDay: '[昨天] kk:mm',
        lastWeek: '[上]dddd kk:mm',
        sameElse: 'YYYY-MM-DD kk:mm',
      })
    },
  },
  methods: {
    contextIconName(type) {
      switch (type) {
        case 1:
          return 'el-icon-circle-plus-outline'
        case 2:
          return 'el-icon-edit-outline'
        case 3:
          return 'el-icon-circle-close'
        case 4:
          return 'el-icon-remove-outline'
        case 5:
          return 'el-icon-warning'
        default:
          return 'el-icon-right'
      }
    },
  },
}
</script>
<style lang="scss">
.el-popover.notifications {
  padding: 0;

  .popper__arrow::after {
    border-bottom-color: #2d253a !important;
  }
}

#notifications {
  width: 28rem;
  height: auto;

  .fixed-footer {
    padding: 7px;
    height: 36px;
    text-align: right;
    background: #e7eef3;
    border-bottom: 1px solid #cfd2d4;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
    color: #fff;
    background: #2d253a;
    letter-spacing: 0.2vmin;
  }

  .content {
    overflow-y: auto;
    max-height: 55vh;

    .loading-space {
      min-height: 15vh;
    }

    .el-collapse-item__header {
      padding: 5px 10px;
      height: 32px;
      font-size: 12px;
      font-weight: bold;
      background: #e4e7e9;
      line-height: 32px;
      letter-spacing: 0.1vmin;
    }

    .el-collapse-item__content {
      padding: 0;
      border-bottom: 1px solid #e4e7e9;
      transition: height 0.2s;
    }
  }

  .context {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 10px;

    &:hover {
      background: #f3f9fc;
    }

    .context-left {
      margin-right: 10px;
      width: 5%;
      font-size: 18px;
    }

    .context-right {
      position: relative;
      overflow: hidden;
      padding-right: 5px;
      width: 95%;

      .title,
      .subject {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .title {
        font-weight: bolder;
        line-height: 1.5rem;
      }

      .subject {
        width: 65%;
      }

      .time {
        position: absolute;
        bottom: 0;
        right: 5px;
        font-size: 0.75rem;
      }
    }
  }
}
</style>
