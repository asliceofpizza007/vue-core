<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        :disabled="action === 'view'"
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="名稱"
          prop="name"
          :rules="[{ required: true, message: '↑此項必填' }]"
        )
          el-input(v-model="formData.name"
            ref="firstColumn"
            maxLength="10"
          )
        el-form-item(label="描述")
          el-input(
            v-model="formData.description"
            maxLength="100"
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
        el-form-item(label="管理權限")
          PermissionTable(
            v-if="formData.permissions.length"
            ref="permissionTable"
            :permissions="formData.permissions"
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
      ) {{ action !== 'edit' ? '新增' : '儲存' }}
</template>
<script>
import axios from 'axios'
import apiGroup from '@api/apiGroup'
import common from '@api/common'
import { debounce, cloneDeep } from 'lodash'
import { PanelMixin } from '@/mixins'
import PermissionTable from './subComponents/PermissionTable'

export default {
  name: 'EditGroup',
  components: {
    PermissionTable,
  },
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
  },
  data() {
    return {
      formData: {
        name: null,
        description: null,
        isEnabled: true,
        permissions: [],
      },
      tmpPermissions: [],
      loading: false,
    }
  },
  created() {
    if (this.id) {
      this.getRowData()
    } else {
      this.getPermissionList()
    }
  },
  methods: {
    async getPermissionList() {
      this.loading = true
      try {
        const res = await common.getPermissionList()
        this.formData.permissions = res
      } catch {
        // pass
      } finally {
        this.loading = false
      }
    },
    async getRowData() {
      const requests = [
        apiGroup.getPermissionGroup(this.id),
        common.getPermissionList(),
      ]
      try {
        this.loading = true
        const [rowData, permissionList] = await axios.all([...requests])
        Object.keys(this.formData).forEach(key => {
          if (key === 'permissions') {
            this.formData[key] = this.permissionMapping(rowData[key], permissionList)
          } else {
            this.formData[key] = rowData[key]
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
    permissionMapping(data, list) {
      const cloneData = cloneDeep(data)
      const cloneList = cloneDeep(list)
      cloneData.forEach(row => {
        const listIndex = cloneList.findIndex(item => item.systemMenuId === row.systemMenuId)
        if (listIndex !== -1) {
          const tmp = cloneList[listIndex]
          tmp.isVisible = row.isVisible
          try {
            if (tmp.actions) {
              Object.keys(tmp.actions).forEach(key => {
                tmp.actions[key] = row.actions[key] || tmp.actions[key]
              })
            }
          } catch {
            // pass
          }
        }
      })
      return cloneList
    },
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitWhenValidate()
        }
      })
    },
    submitWhenValidate: debounce(async function () {
      const tmp = { ...this.formDataPayload }
      tmp.permissions = this.$refs.permissionTable.getParams()
      const postData = [tmp]
      let api = apiGroup.addPermissionGroup
      let message = '新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiGroup.updatePermissionGroup
        message = '更新成功'
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
  },
}
</script>
