<template lang="pug">
  #errorPage
    .box
      .textArea
        .title Oops!
        .section 您沒有權限去該頁面
        .goback
          router-link(to="/login")
            el-button(
              type="primary"
              icon="el-icon-back"
            ) 回首頁
      figure
        img(src="~@img/mistake.jpg")
</template>
<script>
export default {
  name: 'Page403',
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
