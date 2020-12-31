<template lang="pug">
  #errorPage
    .box
      .textArea
        .title Oops!
        .section 您的登入已過期
          p(v-if="hasLoginPage") 將於{{ second/1000 }}秒後跳轉至登入頁
      figure
        img(src="~@img/mistake.jpg")
</template>
<script>
export default {
  name: 'Page401',
  data() {
    return {
      hasLoginPage: (process.env.VUE_APP_LOGIN_PAGE === 'true'),
      second: 5000, // 倒數計時毫秒數
      timer: null,
    }
  },
  beforeRouteLeave(to, from, next) {
    if (process.env.VUE_APP_LOGIN_PAGE === 'true') {
      next()
    } else {
      window.history.forward()
    }
  },
  mounted() {
    if (this.hasLoginPage) {
      this.setTimer()
    }
  },
  methods: {
    setTimer() {
      const vm = this
      this.timer = setInterval(() => {
        vm.second -= 1000
        if (vm.second === 0) {
          vm.stopTimer()
        }
      }, 1000)
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.$router.push({
          path: '/login',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#errorPage {

  @include size(100%, 100%, null);
  @include Flex;

  position: fixed;

  .box {
    @include Flex;

    display: inline-flex;
    flex-wrap: wrap;

    .title {
      font-size: 110px;
      font-family: arial;
      font-weight: bold;
      text-align: center;
      color: #484848;
    }

    .section {
      margin: 40px 0;
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      line-height: 1.5;
    }

    .goback {
      text-align: center;

      a {
        display: inline-block;
      }
    }
  }

  figure {
    margin-left: 5rem;
  }
}
</style>
