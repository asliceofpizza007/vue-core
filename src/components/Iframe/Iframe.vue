<template lang="pug">
  iframe(:src="currentSrc" width="100%" height="100%")
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    src: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentSrc: null,
    }
  },
  computed: {
    ...mapState('tabs', {
      tabs: state => state.tabs,
    }),
  },
  created() {
    this.$options.name = this.getActiveTab ? this.getActiveTab.menuCode : 'Iframe'
    this.setCurrentSrc()
  },
  activated() {
    this.setCurrentSrc()
  },
  methods: {
    setCurrentSrc() {
      const activeTab = this.tabs.find(tab => {
        let path = `/${tab.link}`
        if (tab.viewType) {
          path = `/${tab.menuCode}`
        }
        return this.$route.path === path
      })
      this.currentSrc = this.src || (activeTab ? activeTab.link : null)
    },
  },
}
</script>
