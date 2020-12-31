<template lang="pug">
  el-container#Themes
    el-aside(width="200px")
      ScrollBar.menuSide
        .menu
          a(v-for="(list,index) in titleName"
            :class="{ 'enable': current === index }"
            @click="slidePage(index)") {{ list }}
    el-main
      el-card.buttons
        .el-card-header(slot="header")
          .title 按鈕樣式
        div
          .item ＃預設按鈕
          el-button(type="add") 新增
          el-button(type="danger") 刪除
          el-button(type="save") 儲存
          el-button(type="edit") 編輯
          el-button(type="copy") 複製
          el-button(type="view") 檢視
          el-button(type="refresh") 重新整理
          el-button(type="view") 觀看條件設定
          el-button(type="back") 返回主類別
          el-button(type="save") 批次操作
          el-button(type="excel") 匯出Excel
          el-button(type="info") 依搜尋次數排行
        br
        div
          .item ＃邊框按鈕
          el-button(type="bd-sub") 子類別
          el-button(type="bd-record") 記錄
          el-button(type="bd-cancel") 刪除
          el-button(type="bd-edit") 編輯
          el-button(type="bd-copy") 複製
          el-button(type="bd-view") 檢視
          el-button(type="bd-save") 儲存
          el-button(type="bd-add") 新增
          el-button(type="bd-send") 寄送資料
      el-card
        .el-card-header(slot="header")
          .title 多選框
        div
          el-checkbox.checkAll(v-model="condition.checkAll" @change="checkAll") 全部
          el-checkbox-group(v-model="condition.checkedCities" :disabled="condition.checkAll")
            el-checkbox(v-for="(item, index) in condition.cities"
              :label="item"
              :key="index") {{ item }}
      el-card
        .el-card-header(slot="header")
          .title 單選框
        div
          el-radio-group(v-model="condition.checkedRadio")
            el-radio(v-for="(item, index) in condition.cities"
              :label="item"
              :key="index") {{ item }}
      el-card
        .el-card-header(slot="header")
          .title 單選組合
        div
          el-radio-group(v-model="condition.radioGroup")
            el-radio-button(label="all") 全部
            el-radio-button(label="notfinished") 未完成
            el-radio-button(label="finished") 已結案
      el-card
        .el-card-header(slot="header")
          .title 控制列表展示
        div
          .item ＃一列
          .searchBlock
            div
              el-form(class="complex-group" :model="condition")
                el-form-item(label="名稱")
                  el-input(v-model="condition.name")
                el-form-item(:label="$t('th.isEnabled')")
                  el-select(v-model="condition.isEnabled" clearable)
                    el-option(:label="'上架'" :value="1") 上架
                    el-option(:label="'下架'" :value="0") 下架
                el-button(
                  type="search"
                  icon="el-icon-search"
                ) 搜尋
              .btnWrap
                el-button(
                  type="refresh"
                  icon="el-icon-refresh-right"
                ) 重新整理
                el-button(
                  type="add"
                  icon="el-icon-plus"
                ) 新增
        br
        div
          .item ＃多列
          .searchBlock
            div
              el-form(class="complex-group" :model="condition")
                el-form-item(label="註冊來源")
                  el-select(v-model="condition.sourceType" clearable)
                    el-option(:label="'AV註冊'" :value="1") AV註冊
                    el-option(:label="'平台註冊'" :value="2") 平台註冊
                el-form-item(label="名稱")
                  el-input(v-model="condition.name2")
            div
              el-form(class="complex-group" :model="condition")
                el-form-item(label="名稱")
                  el-input(v-model="condition.name3")
                el-form-item(class="selectTimer-group")
                  el-select(slot="label" v-model="condition.dateType2")
                    el-option(:label="'註冊時間'" :value="0") 註冊時間
                    el-option(:label="'觀看時間'" :value="1") 觀看時間
                  el-date-picker(
                    v-model="condition.date3"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="開始日期"
                    end-placeholder="結束日期")
                el-button(
                  type="search"
                  icon="el-icon-search"
                  ) 搜尋
              .btnWrap
                el-button(
                  type="success"
                  icon="el-icon-document-copy"
                ) 匯出Excel
                el-button(
                  type="view"
                  icon="el-icon-edit"
                ) 觀看條件設定
                el-button(
                  type="add"
                  icon="el-icon-plus"
                ) 新增帳號
        ul.tip
          li 最外層加上
            font.fontBold 「searchBlock」
            |的class名稱。
          li 每一列的組合為:
            font.fontBold 「searchBlock > div」
            |。div 裡面再依需求生成架構。
          li 右側按鈕的外層需為
            font.fontBold 「btnWrap」
            |的class名稱。
      el-card
        .el-card-header(slot="header")
          .title 關鍵字搜尋框
        div
          el-form(class="complex-group" :model="condition")
            el-form-item(class="searchBox" label="關鍵字")
              el-input(v-model="condition.keyword")
                el-button(slot="append" icon="el-icon-search")
          ul.tip
            li 在
              font.code el-form
              |加上
              font.fontBold 「complex-group」
              |的class名稱。
            li 在
              font.code el-form-item
              |加上
              font.fontBold 「searchBox」
              |的class名稱，所屬輸入框及子層內的按鈕即為上方顯示之樣式。
      el-card
        .el-card-header(slot="header")
          .title 選擇器
        div
          el-form(class="complex-group" :model="condition")
            el-form-item(label="選擇器")
              el-select(v-model="condition.isEnabled" clearable)
                el-option(:label="'啟用中'" :value="true") 啟用中
                el-option(:label="'已停用'" :value="false") 已停用
          ul.tip
            li 在
              font.code el-form
              |加上
              font.fontBold 「complex-group」
              |的class名稱。
      el-card
        .el-card-header(slot="header")
          .title 輸入框
        div
          el-form(class="complex-group" :model="condition")
            el-form-item(label="輸入框")
              el-input(v-model="condition.name4")
          ul.tip
            li 在
              font.code el-form
              |加上
              font.fontBold 「complex-group」
              |的class名稱。
      el-card
        .el-card-header(slot="header")
          .title 日期選擇
        div
          el-form(:model="condition")
            el-form-item(class="selectTimer-group")
              el-date-picker(
                v-model="condition.date2"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期")
          ul.tip
            li 在
              font.code el-form-item
              |加上
              font.fontBold selectTimer-group」
              |的class名稱。
      el-card
        .el-card-header(slot="header")
          .title 複合式組合框
        div
          el-form(class="complex-group" :model="condition")
            el-form-item(label="選擇器")
              el-select(v-model="condition.isEnabled" clearable)
                el-option(:label="'啟用中'" :value="true") 啟用中
                el-option(:label="'已停用'" :value="false") 已停用
            el-form-item(label="輸入框")
              el-input(v-model="condition.name5")
            el-form-item(class="selectTimer-group")
              el-select(slot="label" v-model="condition.dateType")
                el-option(:label="'註冊時間'" :value="0") 註冊時間
                el-option(:label="'觀看時間'" :value="1") 觀看時間
              el-date-picker(
                v-model="condition.date"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期")
            el-button(
              type="search"
              icon="el-icon-search"
              ) 搜尋
          ul.tip
            li 在
              font.code el-form
              |加上
              font.fontBold 「complex-group」
              |的class名稱。
            li
              font.txt-red 注意!!
              |日期選擇必須在
              font.code el-form-item
              |加上
              font.fontBold 「selectTimer-group」
              |的class名稱。
      el-card
        .el-card-header(slot="header")
          .title 開關
        div
          el-switch(
            class="switch-group"
            v-model="swtichState"
            active-text="啟用"
            inactive-text="停用")
          ul.tip
            li 在
              font.code el-switch
              |加上
              font.fontBold 「switch-group」
              |的class名稱。
      el-card
        .el-card-header(slot="header")
          .title 頁碼
        div.pageWrap
          el-pagination(
            layout="sizes, prev, pager, next, jumper"
            :total="50"
          )
      el-card
        .el-card-header(slot="header")
          .title 麵包屑
        div
          .breadcrumbBlock
            i.el-icon-s-order
            el-breadcrumb(separator-class="el-icon-arrow-right")
              el-breadcrumb-item 主類別
          ul.tip
            li 在
              font.code el-breadcrumb的上一層
              |加上
              font.fontBold 「breadcrumbBlock」
              |的class名稱。
</template>
<script>
import ScrollBar from '@c/ScrollBar'

const cityOptions = ['選項A', '選項B', '選項C', '選項D']
export default {
  name: 'Themes',
  components: {
    ScrollBar,
  },
  data() {
    return {
      titleName: [],
      current: 0,
      swtichState: '',
      condition: {
        checkedCities: [],
        cities: cityOptions,
        checkAll: false,
        checkedRadio: '',
        radioGroup: '',
        isEnabled: null,
        keyword: null,
        data: null,
        data2: null,
        data3: null,
        dateType: 0,
        dateType2: 0,
        name: null,
        name2: null,
        name3: null,
        name4: null,
        name5: null,
        sourceType: null,
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.querySelectorAll('.el-card-header .title').forEach(elm => {
        this.titleName.push(elm.innerText)
      })
    })
  },
  methods: {
    slidePage(idx) {
      this.current = idx
      const wrap = document.querySelectorAll('.el-main')[0]
      const gotop = document.querySelectorAll('.el-card')[idx].offsetTop
      wrap.scrollTop = gotop
    },
    pushAllTypes() {
      cityOptions.forEach(type => {
        this.condition.checkedCities.push(type)
      })
    },
    checkAll() {
      if (this.condition.checkAll) {
        this.pushAllTypes()
      } else {
        this.condition.checkedCities = []
      }
    },
  },
}
</script>
<style lang="scss" scope>
#Themes {
  margin: 0 auto;
  min-height: 100%;
  background-color: $grayBg;

  .buttons {
    .el-button {
      margin: 0.25em;
    }
  }

  .menuSide {
    width: 200px;
    height: 100vh;
    background-color: $mainCrl;
  }

  .menu {
    height: 100%;
    min-height: 100%;
    background-color: $mainCrl;

    a {
      position: relative;
      padding: 1.2em;
      color: #a29cab;
      border-bottom: 1px solid rgba($mainCrlLight, 0.15);

      &.enable {
        color: #fff;
        background-color: $mainCrlLight;

        &::after {
          @include PosAbs;
          @include size(3px, 100%);

          right: 0;
          left: auto;
          background-color: $orangeCrl;
          content: '';
        }
      }
    }
  }

  .el-main {
    overflow: auto;
    height: 100vh;

    .el-card {
      margin: 1em 1em 4em;

      .el-card__header {
        padding: 18px 20px;
        border-bottom: 1px solid rgba($mainCrlLight, 0.15);
      }

      .el-card-header {
        @include Flex(flex-start);

        .title {
          font-size: 24px;
          font-weight: 700;
          color: $darkGrayTxt;
          letter-spacing: 0.05em;
        }
      }
    }

    .item {
      margin: 1em 0;
      font-size: 16px;
    }
  }

  .checkAll {
    margin-bottom: 10px;
  }

  .pageWrap {
    position: relative;
    height: 65px;
  }

  .tip {
    margin: 2em 0 1em;
    padding: 1em 1em 1em 2em;
    font-size: 14px;
    background: #fafafa;
    line-height: 1.5em;
    border-left: 5px solid $orangeCrl;
    list-style-type: decimal;

    li {
      list-style-type: decimal;

      & + li {
        margin-top: 1em;
      }
    }
  }

  .txt-red {
    color: red;
  }

  .fontBold {
    font-weight: 700;
  }

  .code {
    margin: 0 6px;
    padding: 3px 8px;
    color: #b7391b;
    background-color: #fae4df;
    border-radius: 3px;
  }

  .searchBlock {
    display: inline-flex;
    margin: 0.5rem 0;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: column;

    > div {
      @include Flex(space-between, center);

      position: relative;
      width: 100%;

      & + div {
        margin-top: 15px;
      }
    }
  }

  .btnWrap {
    margin-left: 10px;
    margin-bottom: 0.5em;
  }

  .newItem {
    position: absolute;
    right: 0;
  }
}
</style>
