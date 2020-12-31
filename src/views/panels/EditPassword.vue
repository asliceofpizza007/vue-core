<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        .innerLeft
          el-form-item(
            label="站台別"
            prop="platformId"
            :rules="[{ required: true, validator: validatePlatform }]"
          )
            el-select(v-model="formData.platformId"
              ref="firstColumn"
              filterable
            )
              el-option(
                v-for="item in platformOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              )
          el-form-item(
            label="纇別"
            prop="typeId"
            :rules="[{ required: true, validator: validateType }]"
          )
            el-select(
              v-model="formData.typeId"
              filterable
            )
              el-option(
                v-for="item in typeOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              )
          el-form-item(
            label="用途別"
            prop="purposeId"
            :rules="[{ required: true, validator: validatePurpose }]"
          )
            el-select(
              v-model="formData.purposeId"
              filterable
              @change="handleSelectPurpose"
            )
              el-option(
                v-for="item in purposeOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              )
          el-form-item.side-error(
            label="帳號"
            prop="account"
            :rules="[{ required: true, validator: validateAcc }]"
          )
            el-input(
              v-model.trim="formData.account"
              placeholder="請輸入帳號"
            )
            .rule(
              v-show="formData.account"
              v-for="(rule, key) in formRegex.account.validators"
              :class="{ 'invalid': !rule.pass }"
              :key="key"
            )
              i(:class="!rule.pass ? 'el-icon-close' : 'el-icon-check'")
              span.label {{ rule.label }}
            .rule.invalid(v-show="formRegex.account.invalid")
              i.el-icon-close
              span.label 含有不合法字元
          el-form-item.pwd.side-error(
            label="密碼"
            prop="password"
            :rules="[{ required: true, validator: validatePass }]"
          )
            el-input(
              v-model.trim="formData.password"
              :type="!isPasswordVisible ? 'password' : 'text'"
              :readonly="!isPasswordEditable"
              placeholder="請輸入密碼"
            )
              span(
                slot="suffix"
                :title="`${!isPasswordVisible ? '顯示' : '隱藏'}密碼`"
                class="pwd-visible-control"
              )
                div(
                  :class="!isPasswordVisible ? 'fa fa-eye': 'fa fa-eye-slash'"
                  @click="togglePassword"
                  style="cursor: pointer;"
                )
            el-button(
              v-if="showEditPwdBtn"
              :type="!isPasswordEditable ? 'bd-edit' : 'bd-cancel'"
              :icon="!isPasswordEditable ? 'el-icon-edit' : 'el-icon-close'"
              @click="editPassword"
              class="edit-password"
            ) {{ !isPasswordEditable ? '密碼變更' : '取消變更' }}
            .rule(
              v-show="formData.password"
              v-for="(rule, key) in formRegex.password.validators"
              :class="{ 'invalid': !rule.pass }"
              :key="key"
            )
              i(:class="!rule.pass ? 'el-icon-close' : 'el-icon-check'")
              span.label {{ rule.label }}
            .rule.invalid(v-show="formRegex.password.invalid")
              i.el-icon-close
              span.label 含有不合法字元
          .loading-content(
            v-show="isDynamicRequiredLoading"
            v-loading="isDynamicRequiredLoading"
          )
            p 用途必填欄位載入中...
          .purpose-required-field(v-if="isDynamicRequiredLoaded")
            el-form-item(
              label="連結網址"
              prop="link"
              :rules="[{ required: true, message: '請輸入正確的網址格式', type: 'url' }]"
              v-if="selectedPurpose && selectedPurpose.hasLink"
            )
              el-input(
                v-model.trim="formData.link"
                type="url"
                placeholder="請輸入網址"
              )
            el-form-item(
              label="申請日期"
              prop="applyDate"
              v-if="selectedPurpose && selectedPurpose.hasApplyDate"
            )
              el-date-picker(
                v-model="formData.applyDate"
                type="date"
                :picker-options="getPickerOptions"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="選擇日期"
              )
            el-form-item(
              v-for="(field, index) in formData.originDynamicRequiredFields"
              :label="field.name"
              :prop="`originDynamicRequiredFields.${index}.value`"
              :rules="{\
                required: true,\
                message: `請輸入${field.name}`,\
                trigger: [ 'change', 'blur' ],\
              }"
              :key="field.id"
            )
              el-input(
                v-model.trim="field.value"
                maxlength="255"
                placeholder="請輸入"
              )
          el-form-item(
            label="備註"
          )
            el-input(
              type="textarea"
              v-model="formData.remark"
              placeholder="(上限 255 個字元)"
              :maxlength="255"
            )
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
            label="委外廠商"
            v-if="formData.contractors && contractorList.length"
            prop="contractors"
            :rules="[{ validator: contractorValidator }]"
          )
            el-select(
              v-model="formData.contractors"
              multiple
              filterable
            )
              el-option(
                v-for="item in contractorList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              )
        .innerRight
          el-form-item(
            label="閱讀人員"
          )
            div.select-btn
              el-button(
                type="add"
                icon="fa fa-user-plus"
                @click="showChooseMemberPanel()"
              ) {{ !formData.readers.length ? '閱讀人員' : `已選擇 ${formData.readers.length} 人` }}
            MemberTagsList.editors(
              v-if="formData.readers.length"
              :memberChosenList.sync="formData.readers"
            )
            .blank(v-else)
              .title
              .content 尚未選取任何人員
    .buttonWrapper
      template(v-if="action === 'view'")
        el-button(
          type="cancel"
          icon="el-icon-close"
          @click="closePanel"
        ) 關閉
      template(v-else)
        el-button(
          v-if="showAddBtn"
          type="continue"
          @click="checkValidate('continue')"
        )
          i.fa.fa-save
          span 繼續新增
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
import apiSitePassword from '@api/siteApi/apiSitePassword'
import apiSitePurpose from '@api/siteApi/apiSitePurpose'
import { PanelMixin } from '@/mixins'
import { cloneDeep, intersectionBy } from 'lodash'
import MemberTagsList from '@c/MemberTagsList'
import moment from 'moment'
import cryptoJS from '@js/cryptoJS'
import { mapState } from 'vuex'

export default {
  name: 'EditPassword',
  components: {
    MemberTagsList,
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
    const contractorValidator = (rule, value, callback) => {
      if (!value.length) {
        callback()
      } else if (value.every(el => {
        return this.contractorList.find(list => list.id === el)
      })) {
        callback()
      } else {
        callback(new Error('含有未許可廠商，請重新選擇'))
      }
    }
    return {
      loading: false,
      isDynamicRequiredLoading: false,
      isDynamicRequiredLoaded: false,
      isPasswordVisible: false,
      isPasswordEditable: false,          // 是否可以變更密碼
      originPassword: null,              // 取消變更密碼時，改回原密碼
      passwordTimer: null,
      formData: {
        platformId: null,
        typeId: null,
        purposeId: null,
        account: null,
        password: null,
        link: null,
        applyDate: moment().format('YYYY-MM-DD'),
        readers: [],
        isEnabled: true,
        remark: null,
        dynamicFields: null,
        contractors: [],
        originDynamicRequiredFields: [],
      },
      selectedPurpose: null,
      showEditPwdBtn: false,
      getPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        },
      },
      continueAddList: false,
      // 會用到 validators 的 field 可以先寫在這，created 後複製 validators 至此
      formRegex: {
        account: {
          validators: null,
          invalid: false,
        },
        password: {
          validators: null,
          invalid: false,
        },
      },
      validators: {
        count: {
          label: '長度 1 ~ 50',
          regex: [
            new RegExp('^.{1,50}$'),
          ],
          pass: false,
        },
      },
      validateAcc: (rule, value, callback) => {
        if (!value) {
          callback(new Error('請輸入帳號'))
        } else if (!(this.checkValidator(value, 'account') && !this.formRegex.account.invalid)) {
          callback(new Error('格式不正確'))
        } else {
          callback()
        }
      },
      validatePass: (rule, value, callback) => {
        if (!value) {
          callback(new Error('請輸入密碼'))
        } else if (!(this.checkValidator(value, 'password') && !this.formRegex.password.invalid)) {
          callback(new Error('格式不正確'))
        } else {
          callback()
        }
      },
      validatePlatform: (rule, value, callback) => {
        if (!value) {
          callback(new Error('↑此項必填'))
        } else if (!this.platformOptions.find(list => list.id === value)) {
          callback(new Error('站台別已停用，請重新選擇'))
        } else {
          callback()
        }
      },
      validateType: (rule, value, callback) => {
        if (!value) {
          callback(new Error('↑此項必填'))
        } else if (!this.typeOptions.find(list => list.id === value)) {
          callback(new Error('類別已停用，請重新選擇'))
        } else {
          callback()
        }
      },
      validatePurpose: (rule, value, callback) => {
        if (!value) {
          callback(new Error('↑此項必填'))
        } else if (!this.purposeOptions.find(list => list.id === value)) {
          callback(new Error('用途別已停用，請重新選擇'))
        } else {
          callback()
        }
      },
      contractorValidator,
    }
  },
  computed: {
    showAddBtn() {
      return !!this.id
    },
    ...mapState('options', {
      platformOptions: state => state.sitePlatformList,
      purposeOptions: state => state.sitePurposeList,
      typeOptions: state => state.siteTypeList,
      contractorList: state => state.contractorList,
    }),
  },
  watch: {
    'formData.account': {
      handler(acc) {
        if (acc !== null) {
          this.formRegex.account.invalid = this.checkSpecialChar(acc)
        }
      },
    },
    'formData.password': {
      handler(pwd) {
        if (pwd !== null) {
          this.formRegex.password.invalid = this.checkSpecialChar(pwd)
        }
      },
    },
  },
  created() {
    if (this.id) {
      this.isPasswordEditable = false
      this.showEditPwdBtn = true
      this.getRowData()
    } else {
      this.isPasswordEditable = true
    }
    Object.keys(this.formRegex).forEach(key => {
      this.formRegex[key].validators = cloneDeep(this.validators)
    })
  },
  methods: {
    async getRowData() {
      this.loading = true
      try {
        const res = await apiSitePassword.getSitePassword(this.id)
        const resPwd = await apiSitePassword.getPassword(this.id)
        // 密碼解密
        const decryptPassword = this.getDecryptPassword(resPwd.password)
        this.originPassword = decryptPassword
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        // handle if the response contractor is not existed
        this.formData.contractors = this.formData.contractors.filter(id => {
          return this.contractorList.find(list => list.id === id)
        })
        this.formData.password = decryptPassword
        this.formData.applyDate = moment(new Date(res.applyDate)).format('YYYY-MM-DD')
        // 找不到站台別
        if (!this.platformOptions.find(el => el.id === this.formData.platformId)) {
          this.formData.platformId = null
        }
        // 找不到類別
        if (!this.typeOptions.find(el => el.id === this.formData.typeId)) {
          this.formData.typeId = null
        }
        // 找不到用途別
        if (!this.purposeOptions.find(el => el.id === this.formData.purposeId)) {
          this.formData.purposeId = null
          this.formData.originDynamicRequiredFields = []
          this.formData.dynamicFields = ''
        } else {
          await this.getPurposeContent(this.formData.purposeId, this.formData.dynamicFields)
        }
      } catch {
        // pass
      } finally {
        this.loading = false
      }
    },
    handleSelectPurpose() {
      this.getPurposeContent(this.formData.purposeId)
    },
    // 取得用途別內容
    async getPurposeContent(purposeId, dynamicFieldsJSON) {
      this.isDynamicRequiredLoading = true
      this.isDynamicRequiredLoaded = false
      try {
        await this.getDynamicRequiredFields(purposeId, dynamicFieldsJSON)
        const res = await apiSitePurpose.getSitePurpose(purposeId)
        this.selectedPurpose = res
      } catch {
        // pass
      } finally {
        this.isDynamicRequiredLoading = false

        // eslint-disable-next-line max-len
        if (!this.formData.originDynamicRequiredFields.length && !this.selectedPurpose.hasApplyDate && !this.selectedPurpose.hasLink) {
          this.isDynamicRequiredLoaded = false
        } else {
          this.isDynamicRequiredLoaded = true
        }
      }
    },
    // 取得動態必填項目
    async getDynamicRequiredFields(id, dynamicFieldsJSON) {
      try {
        const res = await apiSitePurpose.getSiteDynamicRequireds(id)
        const jsonInput = dynamicFieldsJSON || '[]'
        const dynamicFields = JSON.parse(jsonInput)
        if (dynamicFields && dynamicFields.length > 0) {
          try {
            this.formData.originDynamicRequiredFields = intersectionBy(dynamicFields, res, 'name')
          } catch {
            this.formData.originDynamicRequiredFields = []
            this.formData.dynamicFields = ''
          }
        } else {
          this.formData.originDynamicRequiredFields = res.map(item => {
            return {
              id: item.id,
              name: item.name,
              value: '',
            }
          })
        }
      } catch {
        // pass
      }
    },
    // 整理參數
    getParams() {
      const token = localStorage.getItem('ctlToken')
      const { jti, sub } = cryptoJS.parseJwt(token)
      const params = {
        ...this.formData,
        password: cryptoJS.aesEncrypt(
          this.formData.password,
          jti,
          `${sub.uuid.substring(sub.uuid.length - 8)}${sub.uuid.substring(0, 8)}`,
        ),
        dynamicFields: JSON.stringify(this.formData.originDynamicRequiredFields),
      }
      delete params.originDynamicRequiredFields
      return params
    },
    resetParams() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = null
        this.formData.applyDate = moment().format('YYYY-MM-DD')
        this.formData.readers = []
        this.formData.isEnabled = true
        this.formData.originDynamicRequiredFields = []
        this.formData.contractors = []
      })
      this.selectedPurpose = null
      this.isDynamicRequiredLoaded = false
      this.$refs.editForm.resetFields()

      if (this.action === 'copy' && this.continueAddList) {
        this.showEditPwdBtn = false
        this.isPasswordEditable = true
      }
    },
    submitWhenValidate: debounce(async function () {
      const postData = [this.getParams()]
      let api = apiSitePassword.addSitePasswordList
      let message = '資料上傳成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiSitePassword.updateSitePassword
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
        if (this.continueAddList) {
          this.resetParams()
        } else {
          this.closePanel()
        }
      } catch {
        // interceptor handle
      } finally {
        this.loading = false
      }
    }, 600),
    checkSpecialChar(value) {
      const acceptableSpecialChars = [
        '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', '{', ']', '}', '\\', '|', '\'', '"', '<', '.', '>', '/', '?', ',', ';',
      ]
      const specialCharReg = new RegExp(`[${acceptableSpecialChars.join('\\')}]`, 'g')
      const notAcceptCharReg = new RegExp('[^a-zA-Z0-9]', 'g')

      const filteredPwd = value.replace(specialCharReg, '')
      // 含有特殊不合法字元
      return filteredPwd.match(notAcceptCharReg) !== null
    },
    checkValidator(val, field) {
      let allPass = true
      Object.keys(this.formRegex[field].validators).forEach(key => {
        const { regex } = this.formRegex[field].validators[key]
        const check = this.isMatchRegex(val, regex)
        this.formRegex[field].validators[key].pass = check
        if (!check) {
          allPass = false
        }
      })
      return allPass
    },
    isMatchRegex(value, regex) {
      return regex
        .map(reg => value.match(reg) !== null)
        .every(bool => bool === true)
    },
    closePanel() {
      this.$parent.$emit('close')
    },
    checkValidate(item) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (item === 'continue') {
            this.continueAddList = true
          }
          this.submitWhenValidate()
        }
      })
    },
    async togglePassword() {
      this.isPasswordVisible = !this.isPasswordVisible
      if (this.passwordTimer !== null) {
        clearTimeout(this.passwordTimer)
        this.passwordTimer = null
      }
      // 3秒後自動隱藏
      if (this.isPasswordVisible) {
        this.passwordTimer = setTimeout(() => {
          this.togglePassword()
          this.passwordTimer = null
        }, 3000)
      }
    },
    showChooseMemberPanel() {
      const settings = {
        component: 'MembersChoose',
        headerTitle: '選擇閱讀人員',
        contentSize: {
          width: '560px',
          height: '70%',
        },
        bgPanel: '#05517c',
      }

      const props = {
        selectedMembers: this.formData.readers,
      }

      const events = {
        'update-member-chosen-list': readers => {
          this.formData.readers = readers
        },
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props, events })
    },
    editPassword() {
      this.isPasswordEditable = !this.isPasswordEditable
      if (!this.isPasswordEditable) {
        this.formData.password = this.originPassword
      }
    },
    getDecryptPassword(password) {
      const token = localStorage.getItem('ctlToken')
      const { jti, sub } = cryptoJS.parseJwt(token)
      return cryptoJS.aesDecrypt(
        password,
        jti,
        `${sub.uuid.substring(sub.uuid.length - 8)}${sub.uuid.substring(0, 8)}`,
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.contentInner {
  display: flex;

  .innerLeft {
    width: 500px;
  }

  .el-button {
    /deep/ &--bd {
      &-cancel {
        color: #868686;
        background-color: #f3f3f3;
        border-color: #a1a7a4;

        &:hover,
        &:active,
        &:focus {
          color: #868686;
          background-color: #f3f3f3;
          border-color: #a1a7a4;
        }
      }
    }
  }

  .innerRight {
    flex: 1;

    .select-btn {
      margin-bottom: 5px;
    }
  }

  .rule {
    display: flex;
    align-items: center;
    line-height: 24px;
    font-size: 12px;
    color: $greenBtn;

    &.invalid {
      color: #f56c6c;
    }

    > i {
      margin-top: 3px;
      margin-right: 5px;
    }
  }

  .side-error /deep/ {
    .el-form-item__error {
      top: 7px;
      right: 32px;
      left: auto;
      pointer-events: none;
    }
  }

  .side-error.pwd /deep/ {
    .el-form-item__error {
      right: 50px;
    }
  }

  .loading-content {
    margin: 0 0 1rem;
    font-size: 14px;
    text-align: center;
    color: #888;

    p {
      display: inline-block;
      margin-top: 55px;
    }

    /deep/ {
      .el-loading-mask {
        background-color: transparent;
      }

      .el-loading-spinner {
        margin-top: -35px;
      }
    }
  }

  .purpose-required-field {
    position: relative;
    margin: 1.5rem 1rem 1rem;
    padding: 1.2rem 1rem 0.5rem;
    border: 1px solid #aaa;
    border-radius: 6px;

    &::before {
      content: '用途必填';
      position: absolute;
      top: 0;
      left: 25px;
      display: inline-block;
      transform: translateY(-50%);
      padding: 2px 6px;
      text-align: center;
      color: #fff;
      background: #c11424;
      border-radius: 4px;
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: -16px;
      left: 18px;
      width: 80px;
      height: 32px;
      background: #fff;
      z-index: 0;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-date-editor {
      &.el-input {
        width: 100%;
      }
    }

    /deep/ .el-form-item__error {
      position: relative;
      top: 1px;
    }
  }

  .el-form-item {
    .blank {
      display: inline-block;
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      .title {
        height: 1.5rem;
        color: #f0f0f0;
        background: #609279;
        line-height: 1.5rem;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }

      .content {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5em;
        min-width: unset;
        font-size: 18px;
        color: #aaa;
      }
    }
  }

  .edit-password {
    position: relative;
    top: 7px;
    float: right;
  }
}
</style>
