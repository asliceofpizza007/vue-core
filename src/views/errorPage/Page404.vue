<template lang="pug">
  #errorPage
    .box
      figure
        img(src="~@img/404.jpg")
      .textArea
        .title Oops!
        .section 找不到這個頁面
        .goback
          router-link(to="/login")
            el-button(
              type="primary"
              icon="el-icon-back"
            ) 回首頁
</template>
<script>
export default {
  name: 'Page404',
  beforeRouteLeave() {
    window.history.forward()
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
      color: #1582f0;
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
}
</style>
