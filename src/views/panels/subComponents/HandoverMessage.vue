<template lang="pug">
  .messageBox
    h4 留言板
      i.el-icon-edit
    el-button.sortButton(
      tpye="info"
      :icon="sortOption.sort==='ASC'?'el-icon-caret-bottom':'el-icon-caret-top'"
      :title="`排序改留言時間${sortOption.sort==='ASC'?'由近到遠':'由遠到近'}`"
      :disabled='loading'
      @click="sortChange"
    ) 排序
    .commentaryBlock
      .messageList(:class="{ 'noPaddingBottom': messages !== null}")
          p.noMessage(v-if="messageList.length === 0") 無留言訊息
          .messageItem(
            v-for="(item, index) in messageList"
            :key="item.id"
          )
            p.systemMessage(v-if="item.systemMessage")
              |＃{{ item.updatedByName }} 於 {{ item.updatedOn }} {{ item.content }}
            template(v-else)
              .messageHeader
                p.nickName {{ item.updatedByName }}
                p.dateTime {{ item.updatedOn }}
                .buttons(v-if="item.canEdited")
                  button(
                    type="button"
                    title="編輯"
                    :disabled="show"
                    :class="{ disabled: show }"
                    @click="openFroalaEditor(item)"
                  )
                    i.el-icon-edit-outline
                  button(
                    type="button"
                    title="刪除"
                    @click="deleted(item.id)"
                  )
                    i.el-icon-delete
              .messageConten(
                v-html="item.content"
              )
              .fileDownload
                .file(
                  v-for="file in item.files"
                  :key="file.id"
                  @click="downloadFile(file.link,file.name)"
                )
                  i.el-icon-paperclip
                  | {{ file.name }}

</template>

<script>
import apiHandovers from '@api/apiHandovers'
import { PanelMixin } from '@/mixins'
import { mapState } from 'vuex'
import { saveAs } from 'file-saver'
import { contentReformat } from '@/utils'
import { cloneDeep } from 'lodash'

export default {
  name: 'HandoverMessage',
  mixins: [PanelMixin],
  props: {
    id: {
      type: Number,
      default: null,
    },
    isFinish: {
      type: Boolean,
      default: null,
    },
    messages: {
      type: Array,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      resList: [],
      showFroalaEditor: false,
      sortOption: {
        sortName: 'updatedOn',
        sort: 'ASC',
      },
      accessKey: this.$route.query.accessKey,
    }
  },
  computed: {
    ...mapState('app', {
      handoverMessageSort: state => state.handoverMessageSort,
    }),
    messageList() {
      const Lists = this.messages ?? this.resList
      Lists.forEach(item => {
        const message = item
        item.content = contentReformat(message.content)
        item.systemMessage = !message.content.match(/</)
        if (item.systemMessage) {
          item.content = message.content === '未完成' ? '延後結案' : '手動結案'
        }
      })
      const reveserList = cloneDeep(Lists).reverse()
      return (this.sortOption.sort === 'DESC' && !!this.accessKey) ? reveserList :  Lists
    },
  },
  watch: {
    isFinish() {
      if (!this.$route.query.accessKey) {
        this.getList()
      }
    },
  },
  created() {
    this.sortOption.sort = this.handoverMessageSort
    if (!this.$route.query.accessKey) {
      this.getList()
    }
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const res = await apiHandovers.getHandoverMsgsList(this.id, this.sortOption)
        this.resList = res.list
      } catch {
        // pass
      } finally {
        this.loading = false
      }
    },
    async sortChange() {
      const sort = this.handoverMessageSort === 'ASC' ? 'DESC' : 'ASC'
      this.sortOption.sort = sort
      if (!this.accessKey) {
        await this.getList()
        await this.$store.dispatch('app/setHandoverMessageSort', sort)
        this.$store.dispatch('updateUserPreferencesDirectly')
      }
    },
    async deleted(messageId) {
      await this.$confirm('確認刪除？', '提示', {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'confirmButton',
        type: 'error',
      })
      await apiHandovers.deleteHandoverMsgs(messageId)
      this.$message({
        message: '刪除成功',
        type: 'success',
      })
      this.getList()
    },
    openFroalaEditor(item) {
      this.$emit('handle-row-data', item)
    },
    downloadFile(url, fileName) {
      saveAs(url, fileName)
    },
  },
}
</script>

<style lang="scss" scoped>
  .messageBox::v-deep {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 980px;
    background-color: #f1f1f1;

    h4 {
      margin: 0 1rem 0.5rem;
      font-size: 18px;
      line-height: 3;
      text-align: center;
      border-bottom: 1px solid #e4e7e9;

      i {
        margin: 0 0 0 5px;
        font-size: 20px;
      }
    }

    .sortButton {
      position: absolute;
      top: 10px;
      right: 1rem;
    }

    .commentaryBlock {
      padding: 0 1rem 1rem;
    }

    .messageList {
      &.noPaddingBottom {
        padding: 0 1rem;
      }

      .noMessage {
        padding: 10px 0 0;
        text-align: center;
      }

      .messageItem {
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
        margin-bottom: 1rem;

        .systemMessage {
          padding: 0.5rem;
          color: #878787;
          background-color: #f1f1f1;
        }

        .messageHeader {
          display: flex;
          align-items: center;
          padding: 1rem 1rem 0;
          border-radius: 5px;

          .nickName {
            padding: 0 10px;
            height: auto;
            font-size: 14px;
            color: #fff;
            background-color: #5b8698;
            line-height: 2;
            border-radius: 4px;
            letter-spacing: 0.5px;
          }

          .dateTime {
            margin: 0 0 0 5px;
            font-size: 13px;
          }

          .buttons {
            margin: 0 0 0 auto;

            button {
              padding: 5px;
              font-size: 18px;
              color: #8c8c8c;

              &:hover {
                color: #3c8dbc;
              }

              &.disabled {
                color: #f1f1f1;
                cursor: not-allowed;
              }
            }
          }
        }

        .messageConten {
          margin: 0.5rem 1rem;
          padding: 1rem;
          color: #464c55;
          border: 1px solid #dcdfe6;
          border-radius: 4px;

          p,
          li,
          span {
            max-width: 100%;
            word-break: break-all;;
          }
        }

        .fileDownload {
          padding: 0 1rem 1rem;

          .file {
            display: flex;
            align-items: center;
            margin: 5px 22px 5px 0;
            color: #307095;
            cursor: pointer;

            .el-icon-paperclip {
              margin: 0 5px 0 0;
              font-size: 16px;
            }
          }
        }
      }
    }

    .footerButtons {
      position: relative;
      flex: 1 1 0;
      background: #f1f1f1;

      .floatButton {
        position: absolute;
        top: -4rem;
        right: 1rem;
        width: 45px;
        height: 45px;
        background-color: #43725a;
        border-radius: 50%;

        &:focus {
          outline: none;
        }

        i {
          font-size: 22px;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
</style>
