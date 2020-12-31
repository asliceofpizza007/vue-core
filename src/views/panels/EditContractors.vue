<template lang="pug">
  .panelContent(v-loading="loading")
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
        el-form-item.codeFrame(
          label="代碼"
          prop="code"
          :rules="[{ required: true, validator }]"
        )
          el-input(
            v-model.trim="formData.code"
            maxLength="10"
          )
          el-button(
            type="bd-record"
            class="getList-btn"
            :disabled="getUsefulCode"
            @click="getLiaisonWithDebounce"
          ) 獲取負責人名單
        el-form-item(
          label="可見區域"
        )
          el-checkbox-group(v-model="formData.areaIdSet")
            el-checkbox(
              v-for="item in enumRefs.areaCode"
              :key="item.id"
              :label="item.id"
            ) {{ item.code }}
        el-form-item(
          label="狀態"
          prop="isEnabled"
        )
          el-switch(
            class="switch-group"
            v-model="formData.isEnabled"
            active-text="啟用"
            inactive-text="停用"
          )
        el-form-item(
          class="owner"
          label="負責人"
          prop="ownerInfoSet"
        )
          template(v-if="liaisons.length === 0")
            p 請輸入代碼，並點擊「獲取負責人名單」按鈕。
          template(v-else)
            .searchBox
              el-input(
                v-model="filterText"
                placeholder="請輸入關鍵字篩選"
                class="search"
              )
              i(class="el-icon-search" v-show="!filterText")
              i(
                class="el-icon-circle-close close"
                v-show="filterText"
                @click="clearFiterText"
              )
            el-checkbox(
              v-model="checkAll"
              @change="selectAll"
              :indeterminate="isIndeterminate"
            ) 全部
            el-checkbox-group(v-model="formData.ownerInfoSet")
              el-checkbox(
                v-for="item in filterLiaisonsData"
                :label="item.info"
                :key="item.info"
                @change="checkSelectAll"
              ) {{ item.name }}
            template(v-if="filterLiaisonsData.length === 0")
              span 暫無項目
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
import apiContractors from '@api/apiContractors'
import { mapState } from 'vuex'
import { PanelMixin } from '@/mixins'
import { alphabetValidator } from '@/utils'

export default {
  name: 'AddContractors',
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
    return {
      formData: {
        name: null,
        code: null,
        areaIdSet: [],
        isEnabled: true,
        ownerInfoSet: [],
      },
      loading: false,
      validator: alphabetValidator,
      liaisons: [],
      filterText: '',
      checkAll: false,
      isIndeterminate: true,
    }
  },
  computed: {
    ...mapState('app', {
      enumRefs: state => state.enumRefs,
    }),
    filterLiaisonsData() {
      if (!this.filterText) {
        return this.liaisons
      }
      return this.liaisons.filter(ele => {
        return ele.name.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0
      })
    },
    getUsefulCode() {
      const checkVal = new RegExp('^[a-z]+$')
      if (!this.formData.code) {
        return true
      }
      if (checkVal.test(this.formData.code)) {
        return false
      }
      return true
    },
  },
  created() {
    if (this.id) {
      this.getRowData()
    }
  },
  methods: {
    clearFiterText() {
      this.filterText = ''
    },
    async getRowData() {
      this.loading = true
      try {
        const res = await apiContractors.getContractors(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        if (this.formData.ownerInfoSet.length) {
          await this.getLiaisonList()
        }
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
    async getLiaisonList() {
      const code = this.formData.code
      try {
        const res = await apiContractors.getLiaisonsOptions(code)
        this.liaisons = res
        // filter liaison which is not on the list
        this.formData.ownerInfoSet = this.formData.ownerInfoSet.filter(id => {
          return this.liaisons.find(liaison => liaison.info === id)
        })
        this.checkSelectAll()
      } catch {
        this.liaisons = []
        this.formData.ownerInfoSet = []
      }
    },
    getLiaisonWithDebounce: debounce(async function () {
      this.loading = true
      await this.getLiaisonList()
      this.loading = false
    }, 600, {
      leading: true,
      trailing: false,
    }),
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitWhenValidate()
        }
      })
    },
    submitWhenValidate: debounce(async function () {
      const postData = [this.formDataPayload]
      let api = apiContractors.addContractorsList
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiContractors.updateContractors
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
    checkSelectAll() {
      const checkedCount = this.formData.ownerInfoSet.length
      this.checkAll = checkedCount === this.filterLiaisonsData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.filterLiaisonsData.length
    },
    async selectAll(val) {
      this.allSelectInfo = this.filterLiaisonsData.map(item => item.info)
      this.formData.ownerInfoSet = val ? this.allSelectInfo : []
      this.isIndeterminate = false
    },
  },
}
</script>

<style lang="scss" scoped>
.codeFrame {
  .el-input {
    width: 200px;
  }

  .getList-btn {
    margin-left: 10px;
  }
}

.searchBox {
  position: relative;

  .search {
    /deep/ input {
      margin-bottom: 5px;
    }
  }

  i {
    position: absolute;
    top: 10px;
    right: 13px;
    font-size: 16px;
    color: rgba($grayTxt, 0.8);

    &.close {
      cursor: pointer;

      &:hover {
        color: $darkGrayTxt;
      }
    }
  }
}

.owner.el-form-item.is-error {
  /deep/ .el-input__inner {
    border-color: rgba($mainCrlLight, 0.25);
  }
}
</style>
