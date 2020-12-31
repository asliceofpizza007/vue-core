<template lang="pug">
  .panelContent
    .contentWrapper
      .contentInner
        .btn-group
          .left
            el-radio-group(
              v-model="expandedType"
              class="el-radio-group-parallel"
              @change="handleExpandTypeChange"
            )
              el-radio-button(:label="'all'")
                i.el-icon-plus
                span 全部展開
              el-radio-button(:label="'one'")
                i.el-icon-plus
                span 展開一層
              el-radio-button(:label="'collapse'")
                i.el-icon-minus
                span 收合

          el-button(
            type="refresh"
            icon='el-icon-refresh'
            @click='refresh'
          ) 重新整理

        .tree-container(v-loading="loading")
          el-tree(
            :data="dataSource"
            :props="treeProps"
            :indent="0"
            draggable
            @node-drop="handleDrop"
            :allow-drop="allowDrop"
            node-key="id"
            class="tree"
            ref="tree-sort-nav"
            icon-class="el-icon-folder"
          )
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        type="success"
        @click="submit"
      ) 儲存
</template>
<script>
import apiSysNav from '@api/apiSysNav'
import debounce from 'lodash/debounce'

export default {
  name: 'SystemNavSequence',
  props: {
    id: {
      type: Number,
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      treeProps: {
        label: 'title',
      },
      dataSource: [],
      expandedType: 'all',
      dataSequence: {},
      get: {
        SystemNavSetting: apiSysNav.getSystemNavSequence,
      },
      update: {
        SystemNavSetting: apiSysNav.updateSystemNavSequence,
      },
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    /** 取得樹狀選單 */
    async getTreeData() {
      try {
        this.loading = true
        const res = await this.get[this.parent]()
        this.dataSource = res.list
        await this.$nextTick()
        this.handleExpandTypeChange(this.expandedType)
      } catch {
        // pass
      } finally {
        this.loading = false
      }
    },
    /** 重新整理 */
    refresh: debounce(function () {
      this.getTreeData()
    }, 200),
    handleExpandTypeChange(type) {
      // eslint-disable-next-line no-underscore-dangle
      const treeNodes = this.$refs['tree-sort-nav'].store._getAllNodes()
      treeNodes.forEach(treeNode => {
        const node = treeNode
        switch (type) {
          case 'all':
            node.expanded = true
            break
          case 'one':
            if (node.level === 1 && node.childNodes.length) {
              node.expanded = true
            } else {
              node.expanded = false
            }
            break
          case 'collapse':
            node.expanded = false
            break
          default:
        }
      })
    },
    /** 處理 拖動結束事件，以不同type區分，inner時改寫父節點id */
    handleDrop(draggingNode, dropNode, dropType) {
      const currentNode = draggingNode
      switch (dropType) {
        case 'before':
        case 'after':
          if (currentNode.data.parentId !== dropNode.data.parentId) {
            currentNode.data.parentId = dropNode.data.parentId
          }
          break
        case 'inner':
          currentNode.data.parentId = dropNode.data.id
          break
        default:
          break
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      // 阻止移動到page層
      if (type === 'inner' && dropNode.data.menuType !== 1) {
        return false
      }
      // 阻止page自己一個tab
      if (draggingNode.data.menuType === 2 && dropNode.level === 1 && type !== 'inner') {
        return false
      }
      // 禁止把整個根功能目錄搬進其他目錄裡
      if (draggingNode.level === 1) {
        if (dropNode.level > 1) {
          return false
        }
        if (type === 'inner') {
          return false
        }
      }
      return true
    },
    /** 送出編輯資料 */
    async submit() {
      this.dataFormat(this.dataSource)
      const params = this.dataSequence
      try {
        await this.update[this.parent](params)
        this.$message({
          showClose: true,
          type: 'success',
          message: '編輯選單排序成功',
        })
        this.$emit('refresh-page')

        this.closePanel()
      } catch (resp) {
        // interceptor handle
      }
    },
    /** 整理資料格式 */
    dataFormat(dataList, objArray = []) {
      dataList.forEach(element => {
        const obj = {
          'id': element.id,
          'parentId': element.parentId,
          'sequence': objArray.length + 1,
        }
        objArray.push(obj)
        if (element.children && element.children.length > 0) {
          this.dataFormat(element.children, objArray)
        }
      })
      this.dataSequence = {
        list: objArray,
      }
    },
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.contentInner {
  .btn-group {

    @include Flex(space-between);

    margin-bottom: 2vmin;
  }
}

.tree-container /deep/ .el-tree > .el-tree-node::after {
  border-top: unset;
}

.tree {
  overflow: hidden;
  margin-left: -16px;

  /deep/ {
    .el-tree-node {
      position: relative;
      padding-left: 16px;

      &::before,
      &::after {
        position: absolute;
        right: auto;
        left: -4px;
        border-width: 1px;
        content: '';
      }

      &::before {
        top: -26px;
        bottom: 0;
        width: 1px;
        height: 100%;
        border-left: 1px dashed #4386c6;
      }

      &::after {
        top: 12px;
        width: 18px;
        height: 20px;
        border-top: 1px dashed #4386c6;
      }

      &__expand-icon.is-leaf {
        margin-right: -16px;
      }

      &__content {
        position: relative;
        margin: 3px 0;
        width: 100%;
        height: 28px;
        z-index: 0;
        cursor: move;

        &.root-node {
          font-weight: 700;
          color: #fff;

          &::after {
            background: #3c8cbc;
          }
        }

        &::after {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background: #e7eef3;
          border-radius: 2px;
          z-index: -1;
          content: '';
        }

        .root {
          display: block;
          padding-left: 1em;
          font-weight: bold;
          color: #fff;
          background: #3c8cbc;
          border: unset;
        }

        & > .el-tree-node__expand-icon {
          font-size: 18px;
          z-index: 1;

          &.expanded {
            transform: none;

            &::before {
              content: '\e784';
            }
          }
        }
      }
    }

    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node :last-child::before {
      height: 38px;
    }

    .el-tree > .el-tree-node::before {
      border-left: unset;
    }
  }
}
</style>
