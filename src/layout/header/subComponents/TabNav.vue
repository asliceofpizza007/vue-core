<template lang="pug">
  #tabNav
    .arrow.arrowPre(
      v-if="needArrow"
      @click="slideTabs('pre')"
    )
      i.el-icon-arrow-left
    .tabs(ref="outter")
      ul(
        ref="tabs"
        :style="{transform: 'translateX(' + ulmoves + 'px)'}"
      )
        li(
          :class="{tabActive: checkUrlPath({ link: 'index' })}"
          @click="switchRoute({ link: 'index' })"
        )
          p 首頁
        li.drag-handler(
          v-for="(item,idx) in tabs" :key="item.id"
          :class="{tabActive: checkUrlPath(item)}"
          @mousedown="handleMouseMiddleClick($event, item)"
          @click.prevent="switchRoute(item)"
        )
          p {{ item.title }}
          i.el-icon-close(@click.stop="closeTab(item)")
    .arrow.arrowNext(v-if="needArrow" @click="slideTabs('next')")
      i.el-icon-arrow-right
</template>
<script>
import { mapState } from 'vuex'
import Sortable from 'sortablejs'
import { delay } from '@/utils'

export default {
  name: 'TabNav',
  data() {
    return {
      sortable: null,
    }
  },
  computed: {
    ...mapState('tabs', {
      tabs: state => state.tabs,
      steps: state => state.steps,
      gap: state => state.gap,
    }),
    ulmoves() {
      return -this.steps * 150
    },
    needArrow() {
      return this.gap === 0 ? false : this.gap <= this.tabs.length
    },
  },
  watch: {
    needArrow: {
      async handler() {
        await this.$nextTick()
        this.setSortable()
      },
    },
  },
  mounted() {
    this.initAction()
    this.$bus.$on('check-tab-nav-width', this.checkWidth)
  },
  beforeDestroy() {
    this.$bus.$off('check-tab-nav-width')
  },
  methods: {
    async initAction() {
      await delay(0)
      this.checkWidth()
      this.setSortable()
    },
    setSortable() {
      const el = this.$refs.tabs
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        handle: '.drag-handler',
        onEnd: evt => {
          const { oldIndex, newIndex } = evt
          const load = {
            oldIndex: oldIndex - 1,
            newIndex: newIndex - 1,
          }
          this.$store.dispatch('tabs/sortTabs', load)
          this.$store.dispatch('updateUserPreferences')
        },
      })
    },
    async checkWidth() {
      // wait till render finished
      await delay(0)
      const { offsetWidth } = this.$refs.outter
      const gap = Math.floor(offsetWidth / 150)
      let steps = 0
      // 檢查&調整tab位置
      if (this.needArrow) {
        const routeIndex = this.tabs.findIndex(el => `/${el.link}` === this.$route.path)
        steps = routeIndex === -1 || routeIndex < gap - 1 ? 0 : routeIndex + 2  - gap
      }
      const tabStatus = {
        steps,
        gap,
      }
      this.$store.dispatch('tabs/setTabStatus', tabStatus)
      this.$store.dispatch('updateUserPreferences')
    },
    checkUrlPath({ link, menuCode, viewType = null }) {
      let path = `/${link}`
      if (viewType) {
        path = `/${menuCode}`
      }
      return this.$route.path === path
    },
    slideTabs(str) {
      let tmpSteps = this.steps
      if (str === 'pre' && this.steps > 0) {
        tmpSteps--
      }
      if (str === 'next' && this.steps <= this.tabs.length - this.gap) {
        tmpSteps++
      }
      const tabStatus = {
        steps: tmpSteps,
        gap: this.gap,
      }
      this.$store.dispatch('tabs/setTabStatus', tabStatus)
      this.$store.dispatch('updateUserPreferences')
    },
    closeTab(tab) {
      // 判斷關閉tab是否需要跳頁
      const tabsList = this.tabs
      const tabIndex = tabsList.findIndex(el => el.menuCode === tab.menuCode)
      const isCurrentRoute = (this.$route.path === `/${tabsList[tabIndex].link}`
      || this.$route.path === `/${tabsList[tabIndex].menuCode}`)
      if (isCurrentRoute) {
        let path = '/index'
        if (tabIndex) {
          const {
            viewType = null,
            menuCode,
            link,
          } = tabsList[tabIndex - 1]
          path = `/${viewType ? menuCode : link}`
        }
        this.$router.push({
          path,
        })
      }
      this.checkWidth()
      this.$store.dispatch('tabs/closeTab', tab)
      this.$store.dispatch('updateUserPreferences')
    },
    switchRoute({ link, menuCode, viewType = null }) {
      let path = `/${link}`
      if (viewType) {
        path = `/${menuCode}`
      }
      if (this.$route.path !== path) {
        this.$router.push({
          path,
        })
      }
    },
    handleMouseMiddleClick(e, tab) {
      if (e.button === 1) {
        this.closeTab(tab)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#tabNav {
  .arrow {
    margin-left: 10px;
    color: $darkGrayTxt;
    cursor: pointer;

    &:hover {
      color: $grayTxt;
    }
  }
}
</style>
