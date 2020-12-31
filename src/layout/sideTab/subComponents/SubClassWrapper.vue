<template lang="pug">
  .subClassWrapper
    .subTitle {{ subClass.subClassName }}
    el-collapse
      el-collapse-item(v-for="(bulletin,index) in computedBulletin"
        :key="bulletin.id"
        @click.native="handleBulletinRead(bulletin.id, bulletin.isRead)"
      )
        template(slot="title")
          span.dot(v-if="!bulletin.isRead")
          span {{ bulletin.title }}
        .content.fr-view(v-html="contentReformat(bulletin.content)"
          ref="content"
          @click="handleContentClick($event, index)"
        )
        .lastModify
          span 最後修改：
          el-tag(type="info")
            i.el-icon-user-solid
            span {{ bulletin.updatedByName }}
</template>
<script>
import apiBulletins from '@api/apiBulletins'
import { contentReformat } from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'SubClassWrapper',
  props: {
    subClass: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapState('bulletinSummaries', {
      totalUnread: state => state.totalUnread,
    }),
    computedBulletin() {
      return this.subClass.list.filter(el => !!el)
    },
  },
  watch: {
    totalUnread: {
      handler() {
        this.postUnreadMessage()
      },
    },
  },
  created() {
    this.postUnreadMessage()
  },
  methods: {
    postUnreadMessage() {
      if (this.$route.query.sideTab) {
        const postData = {
          type: 'unreadCount',
          payload: {
            unreadCount: this.totalUnread,
          },
        }
        window.top.postMessage(postData, '*')
      }
    },
    handleContentClick(e, index) {
      const node = e.target
      if (node.tagName === 'IMG') {
        if (this.$route.query.sideTab) {
          const imgSrcList = [...this.$refs.content[index].querySelectorAll('img')].map(dom => dom.src)
          const imgIndex = imgSrcList.findIndex(src => node.src === src)
          const postData = {
            type: 'lightBox',
            payload: {
              imgSrcList,
              imgIndex,
            },
          }
          window.top.postMessage(postData, '*')
        } else {
          // open lightbox locally
        }
      }
    },
    contentReformat,
    async handleBulletinRead(id, isRead) {
      if (!isRead) {
        try {
          await apiBulletins.updateBulletinsRead(id)
          this.$store.dispatch('bulletinSummaries/updateUnread', id)
        } catch {
          // pass
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .subClassWrapper::v-deep {
    position: relative;
    padding: 1rem 0.5rem 0.5rem;
    background-color: #fff;

    &:not(:first-child) {
      margin-top: 20px;
    }

    .subTitle {
      position: absolute;
      top: -10px;
      left: 0.5rem;
      padding: 0 0.5rem;
      color: #fff;
      background-color: #3c8dbc;
      border-radius: 3px;
    }

    .el-collapse {
      border: unset;

      .el-collapse-item {
        &:not(:last-child) {
          border-bottom: 1px dashed #ddd;
        }

        .el-collapse-item__header {
          position: relative;
          padding: 0.5rem;
          border-bottom: unset;
          height: auto;
          line-height: 1;

          &.is-active {
            color: #fff;
            background-color: #1d5676;
          }

          &:hover:not(.is-active) {
            background-color: #f1f1f1;
          }

          .dot {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            background-color: #f33;
            border-radius: 50%;
          }
        }

        .el-collapse-item__wrap {
          border-bottom: unset;
          padding: 0.5rem;

          .el-collapse-item__content {
            padding-bottom: unset;

            .content {
              word-break: break-all;
              line-height: 34px;

              /deep/ img {
                cursor: pointer;
              }
            }

            .lastModify {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-top: 10px;
            }
          }
        }
      }
    }

    .el-tag {
      padding: 0 5px;
      height: 28px;
      line-height: 28px;

      &--info {
        color: #fff;
        background-color: #697d8c;
      }
    }
  }
</style>
