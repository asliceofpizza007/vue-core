<template lang="pug">
  .panelContent(v-loading="loading")
    MessageSubmitBlock(
      :id="id"
      :show="show"
      :activeMessage="this.editRowData"
      @handle-edit-show="handleEditShow"
      @reload-message="reloadMessage"
    )
    .floatBlock
      button(title="置頂"
        @click="handleGoTop"
      )
        i.el-icon-top
      button(title="留言區"
        @click="handleGoMsg"
      )
        i.el-icon-chat-line-square
      button(title="新增留言"
        :disabled="show"
        :class="{ disabled: show }"
        @click="handleEditShow"
      )
        i.el-icon-plus
    ScrollBar.contentWrapper(ref="scrollbar")
      .infoBox
        .bottom
          .row.infoList
            .item
              .label
                i.el-icon-s-management
                | 交接類別：
              .value {{ information.typeName }}
            .item
              .label
                i.el-icon-user-solid
                | 交辦人員：
              .value {{ information.publisher }}
            .item
              .label
                i.el-icon-edit-outline
                | 負責人員：
              .value
                button(
                  v-if="!queryAccessKey"
                  type="button"
                  @click="openMemberList('editors')"
                ) {{ information.editors.length }} 人
                p(
                  v-else
                ) {{ information.editorsCount }} 人
            .item
              .label
                i.el-icon-date
                | 交辦日期：
              .value {{ information.publishDate }}
            .item
              .label
                i.el-icon-price-tag
                | 交接標籤：
              .value {{ information.tagName }}
            .item
              .label
                i.el-icon-finished
                | 交接狀態：
              .value {{ information.isFinish ? '已結案' : '未完成' }}
            .item
              .label
                i.el-icon-view
                | 閱讀人員：
              .value
                button(
                  v-if="!queryAccessKey"
                  type="button"
                  @click="openMemberList('readers')"
                ) {{ information.readers.length }} 人
                p(
                  v-else
                ) {{ information.readersCount }} 人
            .item
              .label
                i.el-icon-alarm-clock
                | 完成日期：
              .value {{ information.finishDate }}

          .row.inner-content
            .item.handover
              .label
                div
                  i.el-icon-files
                  | 內容：
                .group
                  p 已閱讀人數：{{ information.viewedCount }}
                  el-rate.star(
                    v-model="information.importance"
                    :disabled="true"
                    :max="3"
                  )
              .value
                .content.fr-view(v-html="information.content"
                  ref="content"
                  @click="handleContentClick"
                )

          .row.filePreview(v-show="information.files.length")
            .item
              .label
                i.el-icon-paperclip
                | 附檔：
              .value
                .file(
                  v-for="(file,index) in information.files"
                  :key="file.id"
                    @click="downloadFile(file.link,file.name)"
                    title="下載檔案"
                ) {{ file.name }}

      HandoverMessage(
        ref="handoverMessage"
        :id="id"
        :isFinish="information.isFinish"
        :show="show"
        :messages="messages"
        @handle-row-data="handleRowData"
      )
    .buttonWrapper(v-if="!queryAccessKey")
      el-button(
        type="success"
        @click="buttonEmit('create')"
      )
        i.el-icon-document-copy
        | 複製交接
      el-button(
        type="edit"
        @click="collect"
      )
        i.fa.fa-heart(:class="information.isCollected?'red':''")
        | 收藏
      el-button(
        v-if="information.permission !=='reader'"
        type="refresh"
        @click="buttonEmit('edit')"
      )
        i.el-icon-edit
        | 編輯
      el-button(
        type="info"
        v-if="information.isUrlPublic"
        @click="copyUrl"
      )
        i.el-icon-link
        | 複製連結
        input(
          id="url-box"
          type="hidden"
          v-copy="accessKey"
        )
      el-button(
        v-if=" !information.isFinish && information.permission !=='reader'"
        type="copy"
        @click="closeCase"
      )
        i.el-icon-folder-checked
        | 結案
      el-button(
        v-if="information.permission ==='publisher'"
        type="danger"
        @click="buttonEmit('delete')"
      )
        i.el-icon-delete
        | 刪除
</template>
<script>
import apiHandovers from '@api/apiHandovers'
import ScrollBar from '@c/ScrollBar'
import {
  replaceToDate,
  contentReformat
} from '@/utils'
import { saveAs } from 'file-saver'
import HandoverMessage from './subComponents/HandoverMessage'
import MessageSubmitBlock from './subComponents/MessageSubmitBlock'

export default {
  name: 'ShowHandover',
  components: {
    ScrollBar,
    HandoverMessage,
    MessageSubmitBlock,
  },
  directives: {
    // 因為bind本身延遲，為確保狀態所以自定義
    copy: {
      update(element, binding, vnode) {
        const el = element
        // url 有賦值給value，再接著做複製動作
        if (binding.value !== '') {
          const protocol = window.location.protocol
          const domain = window.location.host
          el.value = `${protocol}//${domain}/publicHandovers?accessKey=${binding.value.accessKey}`
          vnode.context.setCopyUrl(el)
        }
      },
    },
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
    row: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      information: {
        title: null,
        typeId: null,
        tagId: null,
        importance: 1,
        editors: [],
        readers: [],
        isUrlPublic: false,
        isFinish: false,
        finishDate: null,
        content: '',
        files: [],
        contractors: [],
        publishDate: null,
        publisher: null,
        isCollected: false,
        viewedCount: 0,
        permission: null,
      },
      accessKey: '',
      queryAccessKey: this.$route.query.accessKey,
      messages: null,
      editRowData: null,
      show: false,
    }
  },
  created() {
    this.getRowData()
  },
  methods: {
    handleContentClick(e) {
      const node = e.target
      if (node.tagName === 'IMG') {
        if (this.$route.query.iframe) {
          const imgSrcList = [...this.$refs.content.querySelectorAll('img')].map(dom => dom.src)
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
    async getRowData() {
      this.loading = true
      try {
        let res
        if (this.queryAccessKey) {
          res = await apiHandovers.getPublicHandovers(this.queryAccessKey)
          this.messages = res.message
        } else {
          res = await apiHandovers.getHandoversInfo(this.id)
        }
        res.publishDate = replaceToDate(res.publishDate)
        res.finishDate = replaceToDate(res.finishDate)
        res.content = contentReformat(res.content)
        this.information = res
        this.information.typeName = this.row.typeName
        this.information.tagName = this.row.tagName
      } catch (err) {
        const pattern = /^2/
        const error = JSON.parse(err.message)
        if (error.status && !pattern.test(error.status)) {
          this.$emit('refresh-list')
          this.closePanel()
        }
      } finally {
        if (this.row && !this.row.isRead) {
          this.$emit('refresh-list')
        }
        this.loading = false
      }
    },
    buttonEmit(action) {
      const e = {
        action,
        id: this.id,
      }
      this.$emit('handle-action', e)
      this.closePanel()
    },
    async closeCase() {
      try {
        await this.$confirm('確認結案？', '提示', {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          cancelButtonClass: 'cancelButton',
          confirmButtonClass: 'confirmButton',
          type: 'error',
        })
        await apiHandovers.updateHandoversclose(this.id)
        this.$message({
          message: '成功結案',
          type: 'success',
        })
        this.getRowData()
        this.$emit('refresh-list')
      } catch {
        // pass
      }
    },
    async collect() {
      this.information.isCollected = !this.information.isCollected
      try {
        if (this.information.isCollected) {
          await apiHandovers.addHandoversRcollect(this.id)
        } else {
          await apiHandovers.deleteHandoverscollect(this.id)
        }
        this.$emit('refresh-list')
      } catch {
        this.$message({
          message: '無法進行收藏',
          type: 'warning',
        })
      }
    },
    async copyUrl() {
      try {
        // 戳API取得AES ID
        const res = await apiHandovers.getPublicUrl(this.id)
        this.accessKey = res
      } catch {
        this.$message({
          showClose: true,
          message: '複製發生錯誤',
          type: 'error',
        })
      }
    },
    /** 複製公開連結 */
    setCopyUrl(el) {
      // 隱藏欄位無法複製，所以要換成text
      el.setAttribute('type', 'text')
      el.focus()
      el.select()
      const successful = document.execCommand('copy')
      const msg = successful ? '已複製到剪貼簿' : '複製發生錯誤'

      this.$message({
        showClose: true,
        message: msg,
        type: 'success',
      })

      // 把隱藏欄位還原
      el.setAttribute('type', 'hidden')
      // 取消被選取的內容
      window.getSelection().removeAllRanges()
      // url值還原
      this.accessKey = ''
    },
    async openMemberList(val) {
      const memberMap = {
        editors: {
          title: '負責',
          member: this.information.editors,
        },
        readers: {
          title: '閱讀',
          member: this.information.readers,
        },
      }
      const id = this.id ?? this.information.id
      try {
        const settings = {
          component: 'MembersChoose',
          headerTitle: `編號 ${id} - ${this.information.title} - ${memberMap[val].title}人員`,
          contentSize: {
            width: '560px',
            height: '70%',
          },
          bgPanel: '#05517c',
        }

        const props = {
          selectedMembers: memberMap[val].member,
          readOnly: true,
        }

        this.$store.dispatch('JsPanels/addPanel', { settings, props })
      } catch {
        // pass
      } finally {
        this.listLoading = false
      }
    },
    downloadFile(url, fileName) {
      if (!url || !fileName) {
        this.$message({
          showClose: true,
          message: '網址已失效',
          type: 'error',
        })
        return
      }
      saveAs(url, fileName)
    },
    closePanel() {
      this.$parent.$emit('close')
    },
    handleGoTop() {
      this.$refs.scrollbar.scrollToTop()
    },
    handleGoMsg() {
      const dom = this.$el.querySelector('.messageBox')
      this.$refs.scrollbar.scrollToView(dom)
    },
    handleEditShow() {
      this.editRowData = null
      this.show = !this.show
    },
    handleRowData(item) {
      this.handleEditShow()
      this.editRowData = item
    },
    reloadMessage() {
      this.$refs.handoverMessage.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
  .buttonWrapper::v-deep {
    i {
      margin: 0 5px 0 0;

      &.red {
        color: #f56c6c;
      }
    }
  }

  .floatBlock {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 50;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      font-size: 24px;
      color: #ddd;
      background-color: #43725a;
      border-radius: 50%;
      opacity: 0.65;
      cursor: pointer;

      &:not(:first-child) {
        margin-top: 5px;
      }

      &:hover {
        color: #fff;
        opacity: 1;
      }

      &.disabled {
        opacity: 0;
        pointer-events: none;
      }
    }
  }

  .contentWrapper::v-deep {
    display: flex;
    flex-direction: column;
    overflow: auto;
    margin: 0;
    padding: 0;
    height: 100%;

    .infoBox {
      display: flex;
      padding: 1rem 1.5rem;
      width: 980px;
      min-width: 980px;
      flex-direction: column;

      .row {
        padding: 10px 0;

        &:not(:last-child) {
          border-bottom: 1px solid #e4e7e9;
        }

        &.infoList {
          padding: 0 0 10px;
        }

        .label {
          display: flex;
          align-items: center;

          i {
            margin: 0 5px 0 0;
            font-size: 17px;
            color: rgb(59, 66, 97);
          }
        }

        &.inner-content {
          .label {
            justify-content: space-between;
          }

          .group {
            display: inline-flex;
            align-items: center;
            font-size: 16px;
            font-weight: bold;

            i {
              font-size: 20px;
            }

            .el-rate {
              margin-left: 20px;
            }
          }
        }
      }

      .row.top {
        display: flex;
        justify-content: space-between;
        padding: 10px 0 20px;
        font-size: 16px;
        font-weight: bold;

        i {
          font-size: 20px;
        }

        .group {
          display: flex;

          .el-rate {
            margin: 0 0 0 20px;

            .el-rate__icon {
              margin-right: 0;
            }
          }
        }
      }

      .smooth-scroll.bottom {
        flex: 1;
      }

      .infoList {
        display: flex;
        flex-wrap: wrap;

        .item {
          display: flex;
          align-items: center;
          margin: 5px 0;
          width: 25%;

          .value {
            button {
              color: #307095;
              cursor: pointer;
            }
          }
        }
      }

      .content {
        margin: 10px 0 5px;
        padding: 20px;
        border: 1px solid #dcdfe6;
        line-height: 34px;

        p,
        li,
        span {
          max-width: 100%;
          word-break: break-all;;
        }

        /deep/ img {
          cursor: pointer;
        }
      }

      .filePreview {
        .value {
          display: flex;
          align-items: flex-start;
          padding: 5px 0;
          flex-direction: column;

          .file {
            display: flex;
            align-items: center;
            margin: 5px 22px;
            color: #307095;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
