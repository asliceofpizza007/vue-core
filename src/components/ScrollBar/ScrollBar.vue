<template lang="pug">
  section.smooth-scroll
    slot
</template>
<script>
import ScrollBar from 'smooth-scrollbar'
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll'

export default {
  name: 'ScrollBar',
  props: {
    overscroll: {
      type: Boolean,
      default: undefined,
    },
    alwaysShowTracks: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
      position: [],
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.uninit()
  },
  methods: {
    init() {
      const vm = this
      if (!this.scroll) {
        const option = {
          plugins: {
            alwaysShowTracks: this.alwaysShowTracks,
            overscroll: {
              effect: 'glow',
            },
          },
        }
        if (this.overscroll) {
          ScrollBar.use(OverscrollPlugin)
          option.plugins.overscroll.onScroll = function (position) {
            vm.checkIfReachEnd(position)
          }
        }
        this.scroll = ScrollBar.init(this.$el, option)
      }
    },
    uninit() {
      if (this.scroll) {
        this.scroll.destroy()
        this.scroll = null
      }
    },
    scrollToTop() {
      this.scroll.scrollTo(0, 0, 500)
    },
    scrollToView(dom) {
      if (this.scroll) {
        this.scroll.scrollIntoView(dom, {
          alignToTop: true,
        })
      }
    },
    checkIfReachEnd(position) {
      if (!position.y && this.position[this.position.length - 1] > 0) {
        this.$emit('reach-end')
        this.position = []
      } else {
        this.position.push(position.y)
      }
    },
    reposition() {
      if (this.scroll) {
        this.scroll.setPosition(0, 0)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.smooth-scroll {
  position: relative;

  /deep/ .scroll-content {
    @include size(100%, 100%, null);
  }
}
</style>
