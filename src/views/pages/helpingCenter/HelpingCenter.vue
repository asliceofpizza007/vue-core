<template lang="pug">
  #helpLayout.views
    .breadcrumbBlock
      i.el-icon-s-order
      el-breadcrumb(separator-class="el-icon-arrow-right")
        el-breadcrumb-item 主類別
        el-breadcrumb-item(v-if="mainCategoryProp.id") {{ mainCategoryProp.title }}
    transition(
      :duration="300"
      name="fade"
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    )
      components(
        :is="currentComponent"
        :style="{animationDuration: `.3s`}"
        :mainCategoryProp="mainCategoryProp"
        @switch-component="switchComponent"
      )
</template>
<script>
import { MainCategories, SubCategories } from './subComponents'

export default {
  name: 'HelpingCenter',
  components: {
    MainCategories,
    SubCategories,
  },
  data() {
    return {
      currentComponent: 'MainCategories',
      mainCategoryProp: {},
    }
  },
  methods: {
    switchComponent(obj) {
      this.currentComponent = `${obj.component}Categories`
      this.mainCategoryProp = {
        title: obj.title,
        id: obj.id,
      }
    },
  },
}
</script>
