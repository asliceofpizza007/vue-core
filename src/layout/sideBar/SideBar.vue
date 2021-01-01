<template lang="pug">
  el-aside#sideBar(
    :style="{width: !isMobile && isSideBarCollapse ? '64px' : 'auto'}"
    :collapse="isMobile ? false : isSideBarCollapse")
    .sideBarLogo
      .systemName {{ getProjectName }}
      i(
        v-if="!isMobile"
        :collapse="isSideBarCollapse"
        class="el-icon-s-fold"
        @click="toggleSideBar"
      )
    i.toggle(v-if="isMobile"
      :collapse="isSideBarCollapse"
      class="el-icon-arrow-right"
      @click="toggleSideBar")
    ScrollBar.menuList
      el-menu.el-menu(
        :default-active="activeIndex"
        :collapse="isMobile ? false : isSideBarCollapse"
        :router="false"
        :collapse-transition="false"
        @transitionend.native='emitCheckTabNav')
        el-menu-item-group.menuGroup
          el-menu-item(
            :index="'1'"
            @click="switchRoute('/index')"
          )
            i.el-icon-s-home
            span(slot="title") 首頁
          //- a(href="/Themes" target="_blank"
          //-   style="'text-decoration': 'none'"
          //- )
          //-   el-menu-item(v-if="environment === 'development'")
          //-     i.fa.fa-heart
          //-     span(slot="title") 主題樣式
        el-menu-item-group.menuGroup(v-for="list in menuList" :key="list.id")
          template(slot="title")
            span(v-if="isMobile ? true : !isSideBarCollapse")
              |{{ getMenuTitle(list.i18n, list.title) }}
            span(v-else) {{ getMenuTitle(list.i18n, list.title).slice(0, 2) }}
          template(v-for="listItem in list.children")
            MenuNode(:nodeData="listItem" :key="listItem.id")
</template>
<script>
import ScrollBar from '@c/ScrollBar'
import { mapState } from 'vuex'
import MenuNode from './MenuNode'

export default {
  name: 'SideBar',
  components: {
    ScrollBar,
    MenuNode,
  },
  data() {
    return {
      activeIndex: '1',
      environment: process.env.NODE_ENV,
    }
  },
  computed: {
    ...mapState('app', {
      isMobile: state => state.isMobile,
      isSideBarCollapse: state => state.isSideBarCollapse,
    }),
    ...mapState('tabs', {
      tabs: state => state.tabs,
    }),
    ...mapState('menu', {
      menuList: state => state.menuList,
    }),
    getProjectName() {
      return process.env.VUE_APP_PROJECT_NAME
    },
    getActiveTab() {
      return this.tabs.find(tab => {
        let path = `/${tab.link}`
        if (tab.viewType) {
          path = `/${tab.menuCode}`
        }
        return this.$route.path === path
      })
    },
  },
  watch: {
    $route: {
      handler() {
        this.setMenuIndex()
      },
      deep: true,
    },
    tabs: {
      handler() {
        this.setMenuIndex()
      },
      deep: true,
    },
  },
  created() {
    this.setMenuIndex()
  },
  methods: {
    setMenuIndex() {
      const match = this.getActiveTab
      this.activeIndex = match ? String(match.id) : '1'
    },
    toggleSideBar() {
      this.$store.dispatch('app/setSideBarCollapse')
      // this.$store.dispatch('updateUserPreferences')
    },
    emitCheckTabNav(e) {
      if (e.propertyName === 'width') {
        this.$bus.$emit('check-tab-nav-width')
      }
    },
    switchRoute(path) {
      if (this.$route.path !== path) {
        if (this.isMobile) {
          this.$store.dispatch('app/setSideBarCollapse')
          // this.$store.dispatch('updateUserPreferences')
        }
        this.$router.push({
          path,
        })
        this.$bus.$emit('check-tab-nav-width')
      }
    },
    getMenuTitle(i18n, title) {
      const lang = this.$i18n.locale
      if (i18n && i18n[lang]) {
        return i18n[lang]
      }
      return title
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
  min-height: 100%;
  border-right: unset;
  background-color: unset;
}

#sideBar {
  .menuList {
    /deep/.scroll-content {
      background-color: #2d253a;
    }
  }

  &[collapse='true'] {
    .el-menu::v-deep {
      border-right: 0;

      .el-menu-item-group {
        .el-menu-item-group__title {
          padding-right: 10px;
        }

      }
    }
  }
}
</style>
