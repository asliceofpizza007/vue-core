<template lang="pug">
  ScrollBar(v-if="$route.query.sideTab"
    style="height: 100%"
  )
    components(:is="$route.query.sideTab")
  #indexLayout(v-else)
    .sideWrapper(
      v-if="notIframe"
      :class="{sideShow: isMobile && isSideBarCollapse}"
      @click.self="toggleSideBar"
    )
      SideBar
    ScrollBar.main
      .mainViewFix(:class="{ 'iframe': !notIframe }")
        Header(v-if="notIframe")
        .mainContent
          ScrollBar.defaultMain
            .mainScroll(:class="`fontSize-${fontSize}p`")
              transition(
                :duration="300"
                name="fade"
                mode="out-in"
                enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut"
              )
                keep-alive(:include="getActiveTab")
                  router-view(:key="$route.path")
          .sideWrapper(v-if="!isMobile && notIframe && useSideTabs")
            SideTab
    .sideWrapper(
      v-if="isMobile && notIframe && useSideTabs"
      :class="{sideShow: isMobile && isSideTabCollapse}"
      @click.self="toggleSideTab"
    )
      SideTab
    JsPanels
</template>
<script>
import ScrollBar from '@c/ScrollBar'
import JsPanels from '@c/Panels'
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'
import { Socket } from '@/mixins'
import Header from './header'
import SideBar from './sideBar'
import SideTab from './sideTab'
import BulletinSummary from './sideTab/subComponents/BulletinSummary'

export default {
  name: 'IndexLayout',
  components: {
    Header,
    SideBar,
    SideTab,
    JsPanels,
    ScrollBar,
    BulletinSummary,
  },
  mixins: [Socket],
  data() {
    return {
      useSideTabs: process.env.VUE_APP_USESIDETABS === 'true',
    }
  },
  computed: {
    ...mapState('app', {
      fontSize: state => state.fontSize,
      isMobile: state => state.isMobile,
      isSideBarCollapse: state => state.isSideBarCollapse,
      isSideTabCollapse: state => state.isSideTabCollapse,
    }),
    ...mapState('tabs', {
      tabs: state => state.tabs,
    }),
    getActiveTab() {
      const activeTab = []
      this.tabs.forEach(tab => {
        // 僅 keep 權限路由
        if (!tab.viewType) {
          activeTab.push(tab.link)
        }
      })
      return activeTab
    },
    notIframe() {
      return !this.$route.query.iframe
    },
  },
  mounted() {
    if (window.innerWidth < 996 && !this.isMobile) {
      this.$store.dispatch('app/setIsMobile')
    }
    window.addEventListener('resize', this.windowResizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.windowResizeHandler)
  },
  methods: {
    windowResizeHandler: debounce(function (e) {
      this.$bus.$emit('resize-table-height')
      this.checkWidth(e)
    }, 200),
    checkWidth(e) {
      this.$bus.$emit('check-tab-nav-width')
      const case1 = e.target.innerWidth > 996 && this.isMobile
      const case2 = e.target.innerWidth < 996 && !this.isMobile
      if (case1 || case2) {
        this.$store.dispatch('app/setIsMobile')
      }
      if (this.isMobile && this.isSideBarCollapse) {
        this.toggleSideBar()
      }
      if (this.isMobile && this.isSideTabCollapse) {
        this.toggleSideTab()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/setSideBarCollapse')
      this.$store.dispatch('updateUserPreferences')
    },
    toggleSideTab() {
      this.$store.dispatch('app/setSideTabCollapse')
      this.$store.dispatch('updateUserPreferences')
    },
  },
}
</script>
