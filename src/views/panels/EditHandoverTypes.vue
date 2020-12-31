<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="名稱"
          prop="name"
          :rules="[{ required: true, message: '↑此項必填' },{max: 10, message: '最多只能 10 個字'}]"
        )
          el-input(v-model="formData.name"
            ref="firstColumn"
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
          label="狀態"
          prop="isEnabled"
          :rules="[{ validator: checkValidator}]"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
        el-form-item(
          label="風險等級"
          prop="riskLevel"
        )
          el-radio-group(
            v-model="formData.riskLevel"
            class="risk-level"
          )
            el-radio-button(v-for="risk in 4"
              :key="risk"
              :label="risk"
            ) {{ '' }}
        el-form-item(
          label="標籤"
          prop="tagIdSet"
          :rules="[{ required: formData.isEnabled, message: '↑此項必填' }]"
        )
          template(v-if="handoverTagList.length === 0")
            p 未有可用標籤，請先新增標籤或啟用已有標籤
          el-checkbox-group(v-model="formData.tagIdSet" v-else)
            el-checkbox(
              v-for="item in handoverTagList"
              :label="item.id"
              :key="item.id"
            ) {{ item.name }}
        el-button.addTags-btn(
          type="add"
          icon="el-icon-plus"
          size="mini"
          @click="addHandoverTag()"
        ) 新增標籤
    .buttonWrapper
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="checkValidate"
      )
        i.fa.fa-save
        span 儲存
      el-button(
        type="cancel"
        icon="el-icon-close"
        @click="closePanel"
      ) 取消
</template>
<script>
import debounce from 'lodash/debounce'
import { numberValidator } from '@/utils'
import apiHandoverTypes from '@api/apiHandoverTypes'
import { PanelMixin } from '@/mixins'
import { mapState } from 'vuex'

export default {
  name: 'EditHandoverTypes',
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
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    const checkValidator = (rule, value, callback) => {
      if (!value) {
        this.$refs.editForm.validateField('tagIdSet')
      }
      callback()
    }
    return {
      formData: {
        name: null,
        sequence: null,
        isEnabled: true,
        riskLevel: 1,
        tagIdSet: [],
      },
      loading: false,
      validator: numberValidator,
      checkValidator,
    }
  },
  computed: {
    ...mapState('options', {
      handoverTagList: state => state.handoverTagList,
    }),
  },
  created() {
    if (this.id) {
      this.getRowData()
    }
  },
  methods: {
    async getRowData() {
      try {
        this.loading = true
        const res = await apiHandoverTypes.getHandoverTypes(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        // tagIdSet 若不存在 handoverTagList，排除該 Id
        const tagIdSet = this.formData.tagIdSet.filter(el => {
          return !!this.handoverTagList.find(element => element.id === el)
        })
        this.formData.tagIdSet = tagIdSet
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
      const postData = [this.formDataPayload]
      let api = apiHandoverTypes.addHandoverTypesList
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiHandoverTypes.updateHandoverTypes
        message = '資料更新成功'
      }
      try {
        this.loading = true
        await api(...postData)
        this.$message({
          message,
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
    addHandoverTag() {
      const settings = {
        component: 'EditHandoverTags',
        id: 'only',
        headerTitle: '新增交接標籤',
        contentSize: 'M',
        bgPanel: '#05517c',
      }
      const props = {
        action: 'create',
      }

      const events = {
        refreshHandoverTypes: () => {
          this.getList()
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
  },
}
</script>
<style lang="scss" scoped>
.addTags-btn {
  margin-left: 110px;
}
</style>
