<template lang="pug">
  #bulletinSummary(v-loading="loading")
    .refresh(v-if="isError")
      el-button(icon="el-icon-refresh-left"
        type="info"
        @click="getBulletinSummaries"
      )
    el-collapse(
      v-model="activeMainCollapse"
      v-if="bulletinSummaries.length"
    )
      template(v-for="main in bulletinSummaries")
        MainClassWrapper(:key="main.mainClassName"
          :mainClass="main"
          :activeMainCollapse="activeMainCollapse"
        )
    .noBulletins(v-else) 沒有任何新公告
</template>
<script>
import { mapState } from 'vuex'
import MainClassWrapper from './MainClassWrapper'

export default {
  name: 'BulletinSummary',
  components: {
    MainClassWrapper,
  },
  data() {
    return {
      loading: false,
      activeMainCollapse: [],
      isError: false,
    }
  },
  computed: {
    ...mapState('bulletinSummaries', {
      bulletinSummaries: state => state.bulletinSummaries,
    }),
  },
  created() {
    // this.getBulletinSummaries()
    // this.$bus.$on('refresh-bulletin-summary', this.getBulletinSummaries)
  },
  beforeDestroy() {
    // this.$bus.$off('refresh-bulletin-summary')
  },
  methods: {
    async getBulletinSummaries() {
      try {
        this.isError = false
        this.loading = true
        await this.$store.dispatch('bulletinSummaries/getBulletinSummaries')
      } catch {
        this.isError = true
        // pass
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  #bulletinSummary {
    padding: 0.5rem;

    > .el-collapse /deep/ {
      border: unset;
    }

    .refresh {
      text-align: right;
      margin-bottom: 10px;

      > .el-button {
        line-height: 1;
        padding: 5px;
      }
    }

    .noBulletins {
      text-align: center;
    }
  }
</style>
