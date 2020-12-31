<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(label="帳號")
          el-input(v-model="formData.account"
            disabled
          )
        el-form-item(label="名稱")
          el-input(
            v-model="formData.name"
            disabled
          )
        el-form-item.groupId(
          label="權限群組"
          prop="groupId"
        )
          el-select(v-model="formData.groupId")
            el-option(
              v-for="item in groupsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ) {{ item.name }}
          el-button(
            @click="openPermission"
          ) 權限檢視
        el-form-item(
          label="描述"
          prop="description"
          :rules="[{max: 100, message: '最多只能100個字'}]"
        )
          el-input(v-model="formData.description"
            ref="firstColumn"
          )
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
import debounce from 'lodash/debounce'
import apiAdmin from '@api/apiAdmin'
import { PanelMixin } from '@/mixins'

export default {
  name: 'EditAdmin',
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
    groupsList: {
      type: Array,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      formData: {
        groupId: null,
        isEnabled: true,
        account: null,
        name: null,
        description: null,
      },
    }
  },
  created() {
    this.getAdmin()
  },
  methods: {
    async getAdmin() {
      try {
        const res = await apiAdmin.getAdmin(this.id)
        res.account = res.account.split('_')[1]
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
      } catch {
        // pass
      }
      this.loading = false
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
        const reformPayLoad = { ...this.formDataPayload }
        delete reformPayLoad.account
        delete reformPayLoad.name
        await apiAdmin.updateAdmin(reformPayLoad, this.id)
        this.$message({
          message: '資料更新成功',
          type: 'success',
        })
        this.$emit('refresh-page')
        this.closePanel()
      } catch (e) {
        // interceptor handle
      } finally {
        this.loading = false
      }
    }, 600),
    closePanel() {
      this.$parent.$emit('close')
    },
    openPermission() {
      const title = this.groupsList.find(item => {
        return item.id === this.formData.groupId
      }).name

      const settings = {
        component: 'EditGroup',
        id: this.formData.groupId,
        headerTitle: `帳號層級 - ${title} - #${this.formData.groupId}`,
        contentSize: {
          width: '70%',
          height: '80%',
        },
      }
      const props = {
        action: 'edit',
        id: this.formData.groupId,
      }
      this.$store.dispatch('JsPanels/addPanel', { settings, props })
    },
  },
}
</script>

<style lang="scss" scoped>
.groupId /deep/ .el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
