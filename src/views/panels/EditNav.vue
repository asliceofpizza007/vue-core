<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          :label="$t('th.title')"
          prop="title"
          :rules="[\
            { required: true, message: '↑此項必填' },\
            {max: 10, message: '最多只能10個字'}]"
        )
          el-input(v-model="formData.title"
            ref="firstColumn"
            :maxLength="formData.parentId === 1 ? 20 : 15"
          )
        el-form-item(
          label="排序"
          prop="sequence"
          :rules="[{ validator }]"
        )
          el-input(
            v-model.number="formData.sequence"
            maxLength="3"
            @blur="sequenceReset"
            @keyup.native.delete="sequenceReset"
          )
        el-form-item(
          label="連結項目"
          prop="linkItem"
        )
          el-select(v-model="formData.linkItem" clearable)
            el-option(:label="'連結'" :value="0") 連結
            el-option(:label="'最新影片'" :value="1") 最新影片
            el-option(:label="'免費影片'" :value="2") 免費影片
            el-option(:label="'排行榜'" :value="3") 排行榜
            el-option(:label="'標籤'" :value="4") 標籤
        el-form-item(
          v-if="formData.linkType === 0"
          label="開啟方式"
          prop="openType"
        )
          el-radio-group(v-model="formData.openType")
            el-radio(
              v-for="item in enumRefs.openType"
              :key="item.id"
              :label="item.id"
            ) {{ item.name }}
        el-form-item(
          label="連結網址"
          prop="link"
          :rules="[\
            { required: true, message: '↑此項必填' },\
            { type: 'url', message: '請輸入正確的網址' },\
            {max: 255, message: '最多只能255個字'}]"
        )
          el-input(
            v-model="formData.link"
            placeholder="請輸入完整網址，例：http://www.123.com"
          )
            span(slot="prepend" v-if="formData.linkType === 4") 標籤/
        el-form-item.icon(
          label="圖示"
          prop="iconName"
        )
          el-select(
            v-model="formData.iconName"
            clearable
            filterable
            popper-class="iconDropdown"
            palceholder='請選擇圖示'
          )
            el-option(
              v-for="(icon, index) in iconOptions"
              :key="index"
              :label="icon"
              :value="icon"
            )
              span(:class="`fa fa-${icon}`")
          .demoMenu(v-if="formData.iconName" :style="{color:formData.iconColor}")
            i(:class="`fa fa-${formData.iconName}`")
            p {{ formData.title }}
        el-form-item(
          label="圖示顏色"
          prop="iconColor"
        )
          el-color-picker(v-model="formData.iconColor" size="medium")
        el-form-item(
          :label="$t('th.isEnabled')"
          prop="isEnabled"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="checkValidate"
      ) 儲存
</template>
<script>
import iconOptions from '@/assets/js/iconOptions'
import apiNav from '@api/apiNav'
import debounce from 'lodash/debounce'
import { mapState } from 'vuex'
import { numberValidator } from '@/utils'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditNav',
  mixins: [PanelMixin],
  props: {
    id: {
      type: Number,
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
    list: {
      type: Object,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        title: null,
        sequence: null,
        openType: 1,
        link: null,
        linkItem: null,
        iconName: null,
        iconColor: null,
        isEnabled: true,
      },
      iconOptions,
      loading: false,
      validator: numberValidator,
    }
  },
  computed: {
    ...mapState('app', {
      enumRefs: state => state.enumRefs,
    }),
  },
  created() {
    if (this.id) {
      this.getRowData()
    }
  },
  methods: {
    async getRowData() {
      this.loading = true
      try {
        const res = await apiNav.getNav(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
      } catch (err) {
        const pattern = /^2/
        const error = JSON.parse(err.message)
        if (error.status && !pattern.test(error.status)) {
          this.$emit('refresh-page')
          this.closePanel()
        }
      } finally {
        this.loading = false
      }
    },
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitWhenValidate()
        }
      })
    },
    submitWhenValidate: debounce(async function () {
      try {
        this.loading = true
        await apiNav.updateNav(this.formDataPayload, this.id)
        this.$message({
          message: '資料更新成功',
          type: 'success',
        })
        this.$emit('refresh-page')
        this.closePanel()
      } catch {
        // interceptor handle
      } finally {
        this.loading = false
      }
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
    },
    async sequenceReset(e) {
      await this.$nextTick()
      if (!e.target.value) {
        this.$refs.editForm.clearValidate('sequence')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .icon .el-form-item__content {
  display: flex;

  .demoMenu {
    display: flex;
    align-items: center;
    margin: 0 0 0 10px;
    padding: 0 15px;
    border: 1px solid #000;

    i {
      margin: 0 10px 0 0;
      font-size: 20px;
    }
  }
}
</style>
