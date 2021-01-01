<template lang="pug">
  #app
    routerView
</template>
<script>
export default {
  name: 'app',
  created() {
    this.$router.push({
      path: '/login',
    })
  },
}
</script>
