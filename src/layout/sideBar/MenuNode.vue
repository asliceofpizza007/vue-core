<template lang="pug">
  el-submenu(
    v-if="nodeData.children.length"
    :index="String(nodeData.id)"
  )
    template(slot="title")
      i(:class="`fa fa-${nodeData.iconName}`")
      span(slot="title") {{ getMenuTitle }}
    template(v-for="nav in nodeData.children")
      MenuNode(:nodeData="nav" :key="nav.id")
  el-menu-item(
    v-else
    :index="String(nodeData.id)"
    @click="handleNavClick"
  )
    i(:class="`fa fa-${nodeData.iconName}`")
    span(slot="title") {{ getMenuTitle }}
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'MenuNode',
  props: {
    nodeData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapState('app', {
      isMobile: state => state.isMobile,
    }),
    getMenuTitle() {
      const lang = this.$i18n.locale
      if (this.nodeData.i18n && this.nodeData.i18n[lang]) {
        return this.nodeData.i18n[lang]
      }
      return this.nodeData.title
    },
  },
  watch: {
    nodeData: {
      handler(val, oldVal) {
        const newStr = JSON.stringify(val)
        const oldStr = JSON.stringify(oldVal)
        if (newStr !== oldStr) {
          const {
            id,
            menuCode,
            link,
            actions,
          } = val
          this.$store.dispatch('tabs/updateTab', {
            id, menuCode, link, actions, title: this.getMenuTitle,
          })
        }
      },
      deep: true,
    },
  },
  methods: {
    handleNavClick() {
      const {
        id,
        title,
        menuCode,
        openType,
        viewType,
        link,
        sizeWidth,
        sizeHeight,
        actions,
      } = this.nodeData
      /**
       * openType:
       * 1 = 無 (後台預設，前台無用)
       * 2 = 瀏覽器另開
       * 3 = Tab
       * 4 = JsPanel
       */
      switch (openType) {
        case 2:
          if (viewType === 1) {
            window.open('').location = link
          } else if (viewType === 2) {
            const config = {
              width: 800,
              height: 600,
              top: 0,
              left: 0,
            }
            if (sizeWidth) {
              config.width = sizeWidth
              config.left = ((window.innerWidth / 2) - (sizeWidth / 2)) + window.screenLeft
            }
            if (sizeHeight) {
              config.height = sizeHeight
              config.top = ((window.innerHeight / 2) - (sizeHeight / 2)) + window.screenTop
            }
            const configString = `
              resizable=no,
              scrollbars=no,
              width='${config.width}',
              height='${config.height}',
              top='${config.top}',
              left='${config.left}'
            `
            window.open(link, menuCode, configString)
          }
          break
        case 3:
          let nodePath = `/${link}`
          const tabConfig = {
            id,
            menuCode,
            link,
            actions,
            title: this.getMenuTitle,
          }
          if (viewType === 5) {
            nodePath = `/${menuCode}`
            tabConfig.viewType = viewType
          }
          if (this.$route.path !== nodePath) {
            if (this.isMobile) {
              this.$store.dispatch('app/setSideBarCollapse')
            }
            this.$store.dispatch('tabs/setTabs', tabConfig)
            this.$store.dispatch('updateUserPreferences')
            this.$router.push({
              path: nodePath,
            }).then(() => {
              // check tab nav width after router push
              this.$bus.$emit('check-tab-nav-width')
            })
          }
          break
        case 4:
          // default settings as viewType === 4
          const settings = {
            component: link,
            id: 'only',
            headerTitle: title,
            contentSize: {
              width: `${sizeWidth}px`,
              height: `${sizeHeight}px`,
            },
          }

          const props = {
            src: link,
            parent: 'unique', // to prenvent tab closeByParent
          }

          if (viewType === 5) {
            settings.component = 'Iframe'
          }

          this.$store.dispatch('JsPanels/addPanel', { settings, props })
          break
        default:
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-submenu /deep/ {
  * {
    font-size: 16px;
    color: #b1abb9;
    vertical-align: unset;
  }

  .el-submenu__title {
    display: flex;
    align-items: center;
    height: 45px;

    &:hover {
      background-color: #5b516b;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #2d253a;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        margin: auto;
        width: 3px;
        height: 100%;
        background-color: #ff6c5f;
      }
    }

    i {
      margin-right: 5px;
      width: 24px;
      text-align: center;
    }
  }

  .el-menu {
    background: transparent;
  }
}
</style>
