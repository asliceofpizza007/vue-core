<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="選單名稱"
          prop="title"
        )
          el-input(v-model="formData.title"
            ref="firstColumn"
            placeholder="請輸入名稱"
            clearable
            maxlength="10"
          )
        el-form-item(
          label="多國語系標題"
          prop="i18nTitle"
        )
          el-input(v-for="(lang, key) in langMap"
            :key="key"
            :value="formData.i18n[key]"
            class="i18nInput"
            @input="handleI18nInput($event, key)"
          )
            template(slot="prepend") {{ lang.label }}

        el-form-item(
          label="選單代碼"
          prop="menuCode"
          :rules="[{ required: true, message: '↑此項必填' }]"
        )
          el-select(
            class="menuCodeSelect"
            :value.trim="formData.menuCode"
            placeholder="字元限制 2-50 個英文字母"
            clearable
            filterable
            allow-create
            @change="menuCodeChange"
            @clear="reset"
          )
            el-option(
              v-for="option in filterPermissionRoutes"
              :key="option.menuCode"
              :label="option.menuCode"
              :value="option.menuCode"
            )
        el-form-item(
          label="父層目錄"
          prop="parentId"
        )
          el-select(
            v-model='formData.parentId'
            placeholder="請選擇父層"
            @change="parentIdChange"
          )
            el-option(
              v-for='item in filterParentOptions'
              :key='item.id'
              :value='item.id'
              :label='item.title'
              :disabled="isPermissionMenuCode && item.id === 1"
            )
        el-form-item(
          label="類型"
          prop="menuType"
        )
          el-radio-group(v-model="formData.menuType")
            el-radio(:label="1" :disabled="isPermissionMenuCode") 目錄
            el-radio(:label="2" :disabled="formData.parentId === 1") 頁面

        template(v-if='formData.menuType === 2')
          el-form-item(
            label="開啟方式"
            prop="openType"
          )
            el-radio-group(v-model="formData.openType")
              el-radio(v-for="openType in openTypeMap"
                :key="openType.label"
                :label="openType.label"
                :disabled="openType.label !== 3 && isPermissionMenuCode"
              ) {{ openType.name }}

          el-form-item.attr(v-if="formData.openType !== 1"
            label="顯示方式"
            prop="viewType"
          )
            el-radio-group(v-model="formData.viewType")
              el-radio(v-for="viewType in computedViewType"
                :key="viewType.label"
                :label="viewType.label"
                :disabled="viewType.label !== 4 && isPermissionMenuCode"
              ) {{ viewType.name }}

          template(
            v-if='(formData.openType === 2 && formData.viewType === 2) || formData.openType === 4'
          )
            el-form-item(
              label="彈窗寬度(像素)"
              prop="sizeWidth"
              :rules="[{ required: true, message: '↑此項必填'},{ validator }]"
            )
              el-input(
                v-model.number="formData.sizeWidth"
                placeholder="單位為像素"
                clearable
              )
            el-form-item(
              label="彈窗高度(像素)"
              prop="sizeHeight"
              :rules="[{ required: true, message: '↑此項必填'},{ validator }]"
            )
              el-input(
                v-model.number="formData.sizeHeight"
                placeholder="單位為像素"
                clearable
              )

          //- template(v-if='[1,2,4].indexOf(formData.viewType) > -1')
          //-   el-form-item(label="是否傳送 Token")
          //-     el-switch(
          //-       v-model="formData.needToken"
          //-       active-text="是"
          //-       inactive-text="否"
          //-       inactive-color="#F56C6C"
          //-       active-color="#89C9EE"
          //-     )

          template(v-if='formData.openType === 2 || formData.viewType === 5')
            el-form-item(
              label="URL 位址"
              prop="link"
              :rules="[{ required: true, message: '↑此項必填' },{ type: 'url', message: '請輸入正確的網址' }]"
            )
              el-input(
                v-model='formData.link'
                placeholder="請輸入完整網址，例：http://www.123.com"
                type='url'
                required
                clearable
              )

          template(v-if='[3,4].indexOf(formData.openType) > -1 && formData.viewType === 4')
            el-form-item(
              label="元件名稱"
              prop="link"
            )
              el-select(
                v-model="formData.link"
                placeholder="請選擇元件名稱"
                clearable
                filterable
              )
                el-option(
                  v-for="componentName in avaliableComponents"
                  :key="componentName"
                  :label="componentName"
                  :value="componentName"
                )
        //- el-form-item(
        //-   label="權限類型"
        //-   prop="permissionType"
        //- )
        //-   el-radio-group(v-model="formData.permissionType")
        //-     el-radio(:label="1") 總管
        //-     el-radio(:label="2") 平台
        el-form-item(
          :label="$t('th.riskLevel')"
          props="riskLevel"
          :rules="[{ required: true, message: '↑此項必填' }]"
        )
          el-radio-group(v-model="formData.riskLevel"
            class="risk-level"
          )
            el-radio-button(v-for="risk in 4"
              :key="risk"
              :label="risk"
            ) {{ '' }}
        el-form-item(
          :label="$t('th.isEnabled')"
          prop="isEnabled"
        )
          el-switch(
            v-model="formData.isEnabled"
            class="switch-group"
            active-text="啟用"
            inactive-text="停用"
          )
        el-form-item(
          label="圖示名稱"
          prop="iconName"
        )
          .iconBlock
            el-select.icon-select(
              v-model='formData.iconName'
              filterable
              popper-class="iconDropdown"
              palceholder='請輸入 icon 名稱'
            )
              el-option(
                v-for='(icon, index) in iconOptions'
                :key="index"
                :label="icon"
                :value="icon"
              )
                span(:class="`fa fa-${icon}`")
            .demo(v-if="formData.iconName && formData.title")
              span(:class="`fa fa-${formData.iconName}`")
              span {{ formData.title }}
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
import axios from 'axios'
import apiSysNav from '@api/apiSysNav'
import common from '@api/common'
import debounce from 'lodash/debounce'
import iconOptions from '@/assets/js/iconOptions'
import { PanelMixin } from '@/mixins'
import { numberValidator } from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'EditSystemNav',
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
        title: null,
        link: null,
        parentId: null,
        menuCode: null,
        iconName: null,
        menuType: null,
        openType: 1,
        viewType: 1,
        // permissionType: 1,
        riskLevel: 1,
        isEnabled: true,
        sizeWidth: null,
        sizeHeight: null,
        // needToken: false,
        i18n: {},
      },
      loading: false,
      iconOptions: [],
      selectOptions: [],
      permissionRoutes: [],
      isPermissionRoute: false,
      tmpCode: null,
      validator: numberValidator,
      openTypeMap: [
        {
          name: '另開視窗',
          label: 2,
        },
        {
          name: 'Tab',
          label: 3,
        },
        {
          name: 'JsPanel',
          label: 4,
        },
      ],
      viewTypeMap: [
        {
          name: '分頁',
          label: 2,
        },
        {
          name: '彈窗',
          label: 3,
        },
        {
          name: 'inline',
          label: 4,
        },
        {
          name: 'iFrame',
          label: 5,
        },
      ],
    }
  },
  computed: {
    ...mapState('app', {
      langMap: state => state.langMap,
      availablePanels: state => state.availablePanels,
      availablePages: state => state.availablePages,
    }),
    avaliableComponents() {
      const {
        availablePanels,
        availablePages,
      } = this
      const {
        openType,
        viewType,
      } = this.formData
      if (viewType === 4) {
        if (openType === 3) {
          return availablePages
        }
        if (openType === 4) {
          return availablePanels
        }
      }
      return []
    },
    filterPermissionRoutes() {
      return this.permissionRoutes.filter(route => {
        if (this.id) {
          return !route.title || (route.menuCode === this.tmpCode)
        }
        return !route.title
      })
    },
    filterParentOptions() {
      return this.selectOptions.filter(option => option.title !== this.formData.title)
    },
    computedViewType() {
      return this.viewTypeMap.filter(viewType => {
        return this.formData.openType === 2 ? viewType.label < 4 : viewType.label > 3
      })
    },
    isPermissionMenuCode() {
      const index = this.permissionRoutes.findIndex(route => {
        return route.menuCode === this.formData.menuCode
      })
      return index !== -1 && !!this.formData.menuCode
    },
    validMenuOptions() {
      return this.permissionRoutes.filter(route => !route.menuName)
    },
  },
  created() {
    Object.keys(this.langMap).forEach(key => {
      this.$set(this.formData.i18n, key, null)
    })
    this.getOptions()
    this.iconOptions = iconOptions
  },
  methods: {
    async getRowData() {
      try {
        const res = await apiSysNav.getSystemNav(this.id)
        this.tmpCode = res.menuCode
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            if (key !== 'i18n') {
              this.formData[key] = res[key]
            } else {
              Object.keys(this.formData[key]).forEach(i18nKey => {
                if (res[key][i18nKey]) {
                  // 避免支援語系修增時，取不到值
                  this.formData[key][i18nKey] = res[key][i18nKey]
                }
              })
            }
          }
        })
        this.permissionRoutes.forEach(route => {
          if (route.menuCode === this.formData.menuCode) {
            this.isPermissionRoute = true
          }
        })
      } catch {
        // pass
      }
    },
    async getOptions() {
      const requests = [
        apiSysNav.getSystemNavSequence(),
        common.getPermissionRoutes(),
      ]
      this.loading = true
      try {
        const [navSequence, permissionRoutes] = await axios.all([...requests])
        this.permissionRoutes = permissionRoutes
        let parentList = [{ id: 1, title: '無' }]
        navSequence.list.forEach(list => {
          if (list.parentId === 1) {
            parentList.push({
              id: list.id,
              title: list.title,
            })
          }
          if (list.children.length) {
            parentList = [...parentList, ...this.formatParentCatalog(list.children)]
          }
        })
        this.selectOptions = parentList
        if (this.action === 'addChild') {
          this.formData.parentId = this.id
        } else if (this.id) {
          await this.getRowData()
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
    formatParentCatalog(treeList, objArray = []) {
      treeList.forEach(list => {
        if (list.menuType === 1) {
          const catalog = {
            id: list.id,
            title: list.title,
          }
          objArray.push(catalog)
          if (list.children.length > 0) {
            this.formatParentCatalog(list.children, objArray)
          }
        }
      })
      return objArray
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
      let api = apiSysNav.addSystemNav
      let message = '資料新增成功'
      if (this.action === 'edit') {
        postData.push(this.id)
        api = apiSysNav.updateSystemNav
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
    handleI18nInput(value, key) {
      let tmp = value.trim()
      // handle 空字串
      if (value === '') {
        tmp = null
      }
      this.formData.i18n[key] = tmp
    },
    menuCodeChange(code) {
      const pattern = /[^a-z]/gi
      this.formData.menuCode = code.replace(pattern, '').substring(0, 50)
      const checkPermission = this.permissionRoutes.find(route => route.menuCode === code)
      if (this.isPermissionRoute !== Boolean(checkPermission)) {
        this.isPermissionRoute = Boolean(checkPermission)
        this.reset()
      }
    },
    parentIdChange(id) {
      if (!id) {
        this.reset(true)
      }
    },
    reset(isIdChange = false) {
      const resetKey = [
        'link',
        'menuType',
        'openType',
        'viewType',
        'sizeWidth',
        'sizeHeight',
      ]

      for (let i = 0; i < resetKey.length; i += 1) {
        this.formData[resetKey[i]] = null
      }
      if (!isIdChange) {
        this.formData.parentId = null
      }
    },
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.panelContent .contentWrapper .contentInner /deep/ .el-form-item {
  .el-form-item__label {
    width: 130px;
  }

  .el-form-item__content {
    padding-right: 1rem;
    flex: 1;

    .i18nInput {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    .menuCodeSelect {
      width: 360px;
    }
  }
}

.iconBlock {
  @include Flex(flex-start);

  .demo {
    position: relative;
    margin-left: 20px;
    padding: 0 20px;
    width: 200px;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: #5d6588;
    background-color: #f1f1f1;

    > span:first-child {
      margin-right: 5px;
      width: 24px;
      text-align: center;
    }
  }
}
</style>
