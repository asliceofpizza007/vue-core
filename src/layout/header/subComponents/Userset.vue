<template lang="pug">
#userset
  h6 使用者偏好設定
  el-form
    el-form-item(:label="$t('userPreference.toggleMenuList')")
      el-switch(
        class="switch-group"
        @change="sideBarCollapse"
        :value="isSideBarCollapse"
      )
    el-form-item(
      v-if="useSideTabs"
      :label="$t('userPreference.toggleTagList')"
    )
      el-switch(
        class="switch-group"
        @change="sideTabCollapse"
        :value="isSideTabCollapse"
      )
    el-form-item(:label="$t('userPreference.recordTabs')")
      el-switch(
        class="switch-group"
        @change="recordtabs"
        :value="isRecordTabs"
      )
    el-form-item.fontSize(
      :label="$t('userPreference.fontSize')"
    )
      el-select(
        @change="changeFontSize"
        :value="fontSize"
      )
        el-option(
          v-for="item in fontSizes"
          :key="item"
          :value="item"
          :label="`${item}%`"
        )
    //- el-form-item.lang(
    //-   label="語系"
    //- )
    //-   el-select(
    //-     @change="changeLang"
    //-     :value="lang"
    //-   )
    //-     el-option(
    //-       v-for="item in Object.keys(langMap)"
    //-       :key="item"
    //-       :label="langMap[item].label"
    //-       :value="item"
    //-     )
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Userset',
  data() {
    return {
      fontSizes: ['100', '110', '125'],
      useSideTabs: process.env.VUE_APP_USESIDETABS === 'true',
    }
  },
  computed: {
    ...mapState('app', {
      fontSize: state => state.fontSize,
      lang: state => state.lang,
      langMap: state => state.langMap,
      isSideBarCollapse: state => state.isSideBarCollapse,
      isSideTabCollapse: state => state.isSideTabCollapse,
    }),
    ...mapState('tabs', {
      isRecordTabs: state => state.isRecordTabs,
    }),
  },
  methods: {
    sideBarCollapse() {
      this.$store.dispatch('app/setSideBarCollapse')
      this.$store.dispatch('updateUserPreferences')
    },
    sideTabCollapse() {
      this.$store.dispatch('app/setSideTabCollapse')
      this.$store.dispatch('updateUserPreferences')
    },
    changeFontSize(fontSize) {
      this.$store.dispatch('app/setFontSize', fontSize)
      this.$store.dispatch('updateUserPreferences')
    },
    recordtabs() {
      this.$store.dispatch('tabs/setRecordtabs')
      this.$store.dispatch('updateUserPreferences')
    },
    changeLang(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLang', lang)
    },
  },
}
</script>

<style lang="scss">
.el-popover.userset {
  padding: 0;

  .popper__arrow::after {
    border-bottom-color: #3b4261 !important;
  }
}

#userset {
  padding: 0 0 20px;
  width: 300px;

  h6 {
    padding: 10px 30px;
    height: 2.5rem;
    font-size: 14px;
    font-weight: normal;
    text-align: center;
    color: #fff;
    background: #3b4261;
  }

  .el-form {
    margin: 10px 0;
    padding: 0 30px;

    &-item {
      display: flex;
      margin: 0;

      &__content {
        margin: 0 0 0 auto;
      }

      &.fontSize {
        margin: 10px 0 0;

        .el-select {
          width: 80px;
        }
      }

      &.lang {
        margin: 10px 0 0;
      }
    }
  }

}
</style>
