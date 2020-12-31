<template lang="pug">
  #helpLayout.views.emsTheme
    .breadcrumbBlock
      i.el-icon-s-order
      el-breadcrumb(separator="：")
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
import { MainClass, SubClass } from './subComponents'

export default {
  name: 'BulletinClass',
  components: {
    MainClass,
    SubClass,
  },
  data() {
    return {
      currentComponent: 'MainClass',
      mainCategoryProp: {},
    }
  },
  methods: {
    switchComponent(obj) {
      this.currentComponent = `${obj.component}Class`
      this.mainCategoryProp = {
        title: obj.title,
        id: obj.id,
      }
    },
  },
}
</script>
