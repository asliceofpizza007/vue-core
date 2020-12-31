<template lang="pug">
  .panelContent.emsTheme(v-loading="loading")
    ScrollBar.contentWrapper(ref="scrollbar")
      el-form.complex-group(v-if="!readOnly")
        el-form-item.appendBox
          el-input(
            v-model="filterText"
            placeholder="請輸入..."
            clearable
          )
            el-button(
              slot="append"
              icon="el-icon-search"
              :loading="isFiltering"
          ) 搜尋
      el-collapse.top-chiefs(
        v-if="showMember.compManagers.length > 0"
        :accordion="!readOnly"
      )
        el-collapse-item(name="高層")
          .title(slot="title")
            template(v-if="numberLimit")
              el-checkbox(
                v-model="compManagersData.status"
                :indeterminate="indeterminateCompChief"
                @change="toggleCheckedComp($event)"
              ) 高層
            template(v-else)
              span 高層
          .members
            .staffs
              .chiefs
                span.chief.top(v-for="manager in showMember.compManagers"
                  :key="manager.id"
                )
                  el-checkbox(
                    v-model="compCheckedList"
                    :label="manager.id"
                    :disabled="checkDisabled(manager.id)"
                    @change="toggleCheckedCompanyManager($event)"
                ) {{ manager.name }}
      .allChecked(v-if="!numberLimit && !readOnly")
        el-checkbox(
          v-for="(checkItem, index) in headerCheckboxData"
          :key="index"
          v-model="headerCheckboxData[index].status"
          :disabled="filterText !==''"
          @change="toggleCheckedAll($event, checkItem.params)"
        ) {{ checkItem.label }}
      el-collapse.memberTree(
        :accordion="!readOnly"
        v-model="activeBlocks"
        @change="onCollapseChange"
      )
        el-collapse-item(
          v-for="dept in showMember.departments"
          :key="dept.departmentId"
          :name="dept.departmentId"
        )
          .title(slot="title")
            template(v-if="!numberLimit")
              el-checkbox(
                v-model="deptCheckedList"
                :label="dept.departmentId"
                @change="toggleCheckedDept($event,dept.departmentId)"
                :disabled="readOnly"
                :indeterminate="getIndeterminatedStatus('dept',dept.departmentId)"
              ) {{ dept.departmentName }}
            template(v-else) {{ dept.departmentName }}
          .members
            .staffs
              .chief
                el-checkbox(
                  v-for="item in dept.deptManagers"
                  :disabled="checkDisabled && check(item.id) || readOnly"
                  :label="item.id"
                  :key="item.id"
                  v-model="checkedList"
                  @change="toggleEmployees($event,item.id,dept.departmentId)"
                ) {{ item.name }}
            .group(
              v-for="group in dept.groups"
              :key="group.groupCode"
            )
              .title
                template(v-if="!numberLimit")
                  el-checkbox(
                    v-model="groupCheckedList"
                    :label="group.groupCode"
                    :disabled="readOnly"
                    @change="toggleCheckedGroup($event, group.groupCode,dept.departmentId)"
                    :indeterminate="getIndeterminatedStatus('group',group.groupCode)"
                  ) {{ group.groupName }}
                template(v-else) {{ group.groupName }}
              .staffs
                .chief
                  el-checkbox(
                    v-for="item in group.groupManagers"
                    :disabled="checkDisabled && check(item.id) || readOnly"
                    :label="item.id"
                    :key="item.id"
                    v-model="checkedList"
                    @change="toggleEmployees($event,item.id,dept.departmentId,group.groupCode)"
                  ) {{ item.name }}
                .member
                  el-checkbox(
                    v-for="item in group.employees"
                    :disabled="checkDisabled && check(item.id) || readOnly"
                    :label="item.id"
                    :key="item.id"
                    v-model="checkedList"
                    @change="toggleEmployees($event,item.id,dept.departmentId,group.groupCode)"
                  ) {{ item.name }}
    p(v-if="numberLimit") 已選{{ checkedList.length }}員，最多可選{{ numberLimit }}員
    .buttonWrapper
      el-button(
        v-if="!readOnly"
        type="success"
        @click="submit"
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
import ScrollBar from '@c/ScrollBar'
import { cloneDeep } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'MembersChoose',
  components: {
    ScrollBar,
  },
  props: {
    selectedMembers: {
      type: Array,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
    apiProp: {
      type: Object,
      default: null,
    },
    numberLimit: {
      type: Number,
      default: null,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      filterText: '',
      isFiltering: false,
      allChecked: false,
      allMemberList: null,
      activeCompBlocks: ['高層'],  // 高層摺疊面板展開，預設展開
      activeBlocks: null,           // 當前摺疊面板展開的區塊
      checkedList: [],            // 已勾選的人員
      compCheckedList: [],        // 以勾選的高階主管
      deptCheckedList: [],        // 所有全選的部門
      groupCheckedList: [],       // 已勾選的group
      compManagersData: { label: '高階主管', params: 'Boss', status: false },
      headerCheckboxData: [
        { label: '所有部門人員', params: 'All', status: false },
        { label: '所有主管', params: 'Chiefs', status: false },
        { label: '所有部主管', params: 'DeptChiefs', status: false },
        { label: '所有組主管', params: 'GroupChiefs', status: false },
      ],
    }
  },
  computed: {
    ...mapState('app', {
      allEmployees: state => state.allEmployees,
    }),
    checkDisabled() {
      return this.numberLimit && this.checkedList.length > this.numberLimit - 1
    },
    showMember() {
      const allMember = cloneDeep(this.allMemberList)
      if (this.filterText || this.readOnly) {
        const selectFunction = this.readOnly ? this.filterById : this.filterByRegexp
        allMember.departments = allMember.departments.filter(dept => {
          const tempDept = dept
          const { groups, deptManagers } = tempDept
          const hasDeptManager = Array.isArray(deptManagers)
          const hasGroup = Array.isArray(groups)

          if (hasDeptManager) {
            tempDept.deptManagers = selectFunction(deptManagers, 'name')
          }

          if (hasGroup) {
            tempDept.groups = groups.filter(group => {
              const tempGroup = group
              const { groupManagers, employees } = tempGroup
              tempGroup.groupManagers = selectFunction(groupManagers, 'name')
              tempGroup.employees = selectFunction(employees, 'name')
              return tempGroup.groupManagers.length || tempGroup.employees.length
            })
          }

          return tempDept.deptManagers.length || tempDept.groups.length
        })
      }
      return allMember
    },
    allIDList() {
      return [
        ...this.compCheckedList,
        ...this.checkedList,
      ]
    },
  },
  created() {
    this.setInitialData()
  },
  methods: {
    onCollapseChange() {
      this.$refs.scrollbar.reposition()
    },
    async setInitialData() {
      this.allMemberList = this.allEmployees
      this.checkedList = this.selectedMembers ?? []
      if (this.apiProp) {
        const {
          id,
          api,
        } = this.apiProp
        try {
          this.loading = true
          const res = await api(id)
          this.checkedList = res.list
        } catch {
          // interceptor handle
        } finally {
          this.loading = false
        }
      }
      this.checkAllCheckedState()
    },
    filterByRegexp(arrayList, key) {
      const keyword = this.filterText.toLowerCase()
      if (Array.isArray(arrayList)) {
        const filters = arrayList.filter(item => {
          const value = item[key].toLowerCase()
          return value.indexOf(keyword) > -1
        })
        return filters.length ? filters : []
      }
      return []
    },
    filterById(arrayList) {
      if (Array.isArray(arrayList)) {
        const filters = arrayList.filter(item => {
          return this.checkedList.indexOf(item.id) > -1
        })
        return filters.length ? filters : []
      }
      return []
    },
    /** 關閉視窗 */
    closePanel() {
      this.$parent.$emit('close')
    },
    /** 全選 */
    toggleCheckedAll(checked, type = 'All') {
      switch (type) {
        case 'All':
          const departments = this.allMemberList.departments
          // 高層人員直接忽略
          // 呼叫 toggleCheckedDept 往下處理各部門所有人員
          departments.forEach(dept => {
            if (checked) {
              this.addToList(this.deptCheckedList, dept.departmentId)
            } else {
              this.removeFromList(this.deptCheckedList, dept.departmentId)
            }
            this.allChiefsChecked = checked
            this.toggleCheckedDept(checked, dept.departmentId, false, true, false)
          })
          this.checkAllStatus()
          this.checkAllChiefsStatus()
          this.checkDeptChiefsStatus()
          this.checkGroupChiefsStatus()
          break
        case 'Chiefs':
          /** 全選/全不選 所有主管
           *  呼叫 toggleCheckedDept 往下處理 */
          this.allMemberList.departments.forEach(dept => {
            this.toggleCheckedDept(checked, dept.departmentId, true, true, false)
          })
          this.headerCheckboxData[1].status = checked
          this.headerCheckboxData[2].status = checked
          this.headerCheckboxData[3].status = checked
          break
        case 'DeptChiefs':
          // 全選/全不選 所有部級主管
          /** 全選/全不選 所有部級主管
           *  呼叫 toggleCheckedDept 往下處理 */
          this.allMemberList.departments.forEach(dept => {
            this.toggleCheckedDept(checked, dept.departmentId, true, false, false)
          })
          this.headerCheckboxData[2].status = checked
          this.checkAllChiefsStatus()
          break
        case 'GroupChiefs':
          /** 全選/全不選 所有組主管
           *  呼叫 toggleCheckedGroup 往下處理 */
          this.allMemberList.departments.forEach(dept => {
            const { departmentId } = dept
            const groups = dept.groups || []
            groups.forEach(group => {
              const { groupCode } = group
              this.toggleCheckedGroup(checked,  groupCode, departmentId, true, false, false)
            })
            this.checkDeptStatus(dept.departmentId)
          })
          this.headerCheckboxData[3].status = checked
          this.checkAllChiefsStatus()
          break
        default:
      }
    },
    toggleCheckedCompanyManager() {
      this.compManagersData.status = this.allMember.compManagers.every(manager => {
        return this.compCheckedList.includes(manager.id)
      })
      this.checkCompManagerStatus()
    },
    toggleCheckedComp(checked) {
      this.showMember.compManagers.forEach(manager => {
        if (checked) {
          this.addToList(this.compCheckedList, manager.id)
        } else {
          this.removeFromList(this.compCheckedList, manager.id)
        }
      })
      this.checkCompManagerStatus()
      this.checkAllStatus()
    },
    /** 單一部門 */
    toggleCheckedDept(
      event,
      deptId,
      onlyManager = false,
      toNextLayer = true,
    ) {
      const actionDept = this.showMember.departments.find(dept =>  dept.departmentId === deptId)

      const filterText = this.filterText
      const { deptManagers, groups } = actionDept
      const filterDeptManagers = filterText ? this.filterByRegexp(deptManagers, 'name') : [...deptManagers]

      let allGroupOrManagerInDept = []
      if ((onlyManager && !toNextLayer) || !Array.isArray(groups)) {
        allGroupOrManagerInDept = filterDeptManagers
      } else {
        allGroupOrManagerInDept = filterDeptManagers.concat(groups)
      }

      allGroupOrManagerInDept.forEach(item => {
        const id = onlyManager ? item.id : item.groupCode || item.id
        if (item.groupCode) {
          if (event) {
            this.addToList(this.groupCheckedList, item.groupCode)
          } else {
            this.removeFromList(this.groupCheckedList, item.groupCode)
          }
          const groupCode = item.groupCode
          this.toggleCheckedGroup(event, groupCode, deptId,  onlyManager)
        } else if (event) {
          this.addToList(this.checkedList, id)
        } else {
          this.removeFromList(this.checkedList, id)
        }
      })

      this.checkDeptStatus(deptId)
    },
    /** 單一組別 */
    toggleCheckedGroup(
      checked,  groupCode, deptId,
      onlyManager = false, toNextLayer = true
    ) {
      const filterText = this.filterText
      const actionGroup = this.showMember.departments.find(dept =>  {
        return dept.departmentId === deptId
      }).groups.find(group => {
        return group.groupCode === groupCode
      })
      const { groupManagers, employees } = actionGroup
      const filterGroupManagers =  filterText ? this.filterByRegexp(groupManagers, 'name') : [...groupManagers]

      let allManagerOrEmployeeInGroup
      if (onlyManager || !toNextLayer || !Array.isArray(employees)) {
        allManagerOrEmployeeInGroup = filterGroupManagers
      } else {
        const filterEmployees = filterText ? this.filterByRegexp(employees, 'name') : [...employees]
        allManagerOrEmployeeInGroup = [...filterGroupManagers, ...filterEmployees]
      }
      allManagerOrEmployeeInGroup.forEach(item => {
        if (checked) {
          this.addToList(this.checkedList, item.id)
        } else {
          this.removeFromList(this.checkedList, item.id)
        }
      })

      this.checkGroupStatus(deptId, groupCode)
    },
    /** 單人選擇 */
    toggleEmployees(event, id, deptId, groupCode) {
      if (event) {
        this.addToList(this.checkedList, id)
      } else {
        this.removeFromList(this.checkedList, id)
      }
      if (groupCode) {
        this.checkGroupStatus(deptId, groupCode)
      } else {
        this.checkDeptStatus(deptId)
      }
    },
    /** 檢查各級全選狀態 */
    async checkAllCheckedState() {
      await this.$nextTick()
      await this.showMember.departments.forEach(dept => {
        const hasGroup = Array.isArray(dept.groups) && dept.groups.length > 0
        if (hasGroup) {
          dept.groups.forEach(group => {
            this.checkGroupStatus(dept.departmentId, group.groupCode, false)
          })
        } else {
          this.checkDeptStatus(dept.departmentId)
        }
      })
      this.checkCompManagerStatus()
      this.checkAllChiefsStatus()
      this.checkDeptChiefsStatus()
      this.checkGroupChiefsStatus()
    },
    /** 檢查"所有人員"是否應該是勾選的狀態 */
    checkAllStatus() {
      const { departments }  = this.allMemberList
      const checkDept = departments.every(dept => {
        return this.deptCheckedList.includes(dept.departmentId)
      })
      this.headerCheckboxData[0].status = checkDept
    },
    /** 檢查"所有主管"是否應該是勾選的狀態 */
    checkAllChiefsStatus() {
      this.headerCheckboxData[1].status = this.allMemberList.departments.every(dept => {
        const hasDeptManager = Array.isArray(dept.deptManagers) && dept.deptManagers.length > 0
        const dmID = hasDeptManager ? dept.deptManagers.map(e => e.id) : []

        let checkDeptPass = false
        let checkGroupPass = false
        checkDeptPass = hasDeptManager ? dmID.every(id => this.checkedList.includes(id)) : true
        if (!checkDeptPass) {
          return false
        }
        if (Array.isArray(dept.groups) && dept.groups.length > 0) {
          checkGroupPass = dept.groups.every(group => {
            const { groupManagers } = group
            const hasGroupManager = Array.isArray(groupManagers) && groupManagers.length > 0
            const mID = hasGroupManager ? groupManagers.map(e => e.id) : []
            const checked = hasGroupManager ? mID.every(id => this.checkedList.includes(id)) : true
            return checked
          })
        } else {
          checkGroupPass = true
        }
        return checkGroupPass
      })
    },
    /** 檢查"所有部主管"是否應該是勾選的狀態 */
    checkDeptChiefsStatus() {
      let noDeptChiefs = true
      const deptChiefsChecked = this.allMemberList.departments.every(dept => {
        const { deptManagers } = dept
        const hasDeptManager = Array.isArray(deptManagers) && deptManagers.length > 0
        const managers = hasDeptManager ? deptManagers.map(e => e.id) : []
        if (hasDeptManager) {
          noDeptChiefs = false
          return  managers.every(id => this.checkedList.includes(id))
        }
        return true
      })
      this.headerCheckboxData[2].status = noDeptChiefs ? false : deptChiefsChecked
      this.checkAllStatus()
      this.checkAllChiefsStatus()
    },
    /** 檢查"所有組主管"是否應該是勾選的狀態 */
    checkGroupChiefsStatus() {
      let noGroupChiefs = true
      const groupChiefsChecked = this.allMemberList.departments.every(dept => {
        let checkGroupPass = true
        if (Array.isArray(dept.groups) && dept.groups.length > 0) {
          checkGroupPass = dept.groups.every(group => {
            const { groupManagers } = group
            const hasGroupManager = Array.isArray(groupManagers) && groupManagers.length > 0
            const managers = hasGroupManager ? groupManagers.map(e => e.id) : []
            if (hasGroupManager) {
              noGroupChiefs = false
              return managers.every(id => this.checkedList.includes(id))
            }
            return true
          })
        }
        return checkGroupPass
      })
      this.headerCheckboxData[3].status = noGroupChiefs ? false : groupChiefsChecked
      this.checkAllChiefsStatus()
      this.checkAllStatus()
    },
    /** 檢查指定部門是否應該是勾選的狀態
     *  須往上檢查"所有人員"是否需要被勾選 */
    checkDeptStatus(deptId) {
      const actionDept = this.showMember.departments.find(dept =>  dept.departmentId === deptId)
      const { deptManagers, groups } = actionDept
      const hasGroup = Array.isArray(groups) && groups.length > 0
      const allGroupOrManagerInDept = hasGroup ? deptManagers.concat(groups) : deptManagers

      const checked = allGroupOrManagerInDept.every(item => {
        let included = true
        if (item.id) {
          included = this.checkedList.includes(item.id)
        }
        if (item.groupCode) {
          included = this.groupCheckedList.includes(item.groupCode)
        }
        return included
      })

      if (checked) {
        this.addToList(this.deptCheckedList, deptId)
      } else {
        this.removeFromList(this.deptCheckedList, deptId)
      }

      if (this.readOnly) {
        this.activeBlocks = this.deptCheckedList
      } else if (this.showMember.departments.length === 1) {
        this.activeBlocks = this.showMember.departments[0].departmentId
      }

      this.checkAllStatus()
    },
    /** 檢查指定群組是否應該是勾選的狀態
     *  須往上檢查所屬部門是否需要被勾選 */
    checkGroupStatus(deptId, groupCode) {
      const actionGroup = this.showMember.departments.find(dept => {
        return dept.departmentId === deptId
      }).groups.find(group => {
        return group.groupCode === groupCode
      })
      const { groupManagers, employees } = actionGroup
      const hasManagers = Array.isArray(groupManagers) && groupManagers.length > 0
      let allID = employees.map(employee => employee.id)

      if (hasManagers) {
        allID = allID.concat(groupManagers.map(manager => manager.id))
      }
      const checked = allID.every(id => this.checkedList.includes(id))
      if (checked) {
        this.addToList(this.groupCheckedList, groupCode)
      } else {
        this.removeFromList(this.groupCheckedList, groupCode)
      }
      this.checkDeptStatus(deptId)
    },
    /** 檢查"高層"是否應該是勾選的狀態 */
    checkCompManagerStatus() {
      this.compManagersData.status = this.allMemberList.compManagers.every(manager => {
        return this.compCheckedList.includes(manager.id)
      })
    },
    addToList(targetList, id) {
      if (!targetList.includes(id)) {
        targetList.push(id)
      }
    },
    removeFromList(targetList, id) {
      const index = targetList.indexOf(id)
      if (index !== -1) {
        targetList.splice(index, 1)
      }
    },
    indeterminateCompChief() {
      const checkedCount = this.compCheckedList.length
      return checkedCount > 0 && checkedCount < this.allMember.compManagers.length
    },
    getIndeterminatedStatus(type, id) {
      let allCount = []
      const matches = []
      switch (type) {
        case 'dept':
          const showDept = this.showMember.departments.find(dept => dept.departmentId === id)

          if (Array.isArray(showDept.deptManagers)) {
            allCount = allCount.concat(showDept.deptManagers)
            showDept.deptManagers.forEach(item => {
              if (this.checkedList.includes(item.id)) {
                matches.push(item)
              }
            })
          }

          showDept.groups.forEach(item => {
            if (Array.isArray(item.groupManagers)) {
              allCount = allCount.concat(item.groupManagers)
              item.groupManagers.forEach(manager => {
                if (this.checkedList.includes(manager.id)) {
                  matches.push(manager)
                }
              })
            }
            if (Array.isArray(item.employees)) {
              allCount = allCount.concat(item.employees)
              item.employees.forEach(employe => {
                if (this.checkedList.includes(employe.id)) {
                  matches.push(employe)
                }
              })
            }
          })

          break
        case 'group':
          const showGroup = this.showMember.departments.find(dept => {
            return dept.groups.find(group => group.groupCode === id)
          }).groups.find(group => group.groupCode === id)

          if (Array.isArray(showGroup.groupManagers)) {
            allCount = allCount.concat(showGroup.groupManagers)
            showGroup.groupManagers.forEach(item => {
              if (this.checkedList.includes(item.id)) {
                matches.push(item)
              }
            })
          }

          if (Array.isArray(showGroup.employees)) {
            allCount = allCount.concat(showGroup.employees)
            showGroup.employees.forEach(item => {
              if (this.checkedList.includes(item.id)) {
                matches.push(item)
              }
            })
          }

          break
        default:
      }
      return (matches.length > 0 && matches.length < allCount.length)
    },
    submit() {
      this.$emit('update-member-chosen-list', this.allIDList)
      this.closePanel()
    },
    check(id) {
      return this.allIDList.every(item => {
        return item !== id
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.searchBlock::v-deep {
  margin: 0 0 10px;
  font-size: 15px;

  .el-input__inner {
    height: auto;
    line-height: 2;
  }
}

.allChecked::v-deep {
  margin: 10px 0;
}

.memberTree::v-deep {
  .el-checkbox__label,
  .title {
    font-size: 15px;
  }

  .el-collapse-item__header {
    padding: 0 10px;
    height: 36px;
    background-color: #e2edf6;
    border-top: 2px solid #aacade;
    border-bottom: 3px solid #fff;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    line-height: 36px;

    .el-checkbox__inner {
      border: 1px solid #abbbc5;
    }

    .el-collapse-item__arrow,
    .el-checkbox .el-checkbox__input + .el-checkbox__label {
      color: #4c606b;
    }

    .el-collapse-item__arrow {
      margin: 0 0 0 auto;
      font-size: 14px;
    }
  }

  .el-collapse-item__wrap {
    padding: 0.5rem;
    border: 1px solid #ccc;

    .staffs {
      background-color: #f8f7f7;
    }
  }

  .group {
    .title {
      padding: 0 15px;
      color: #fff;
      background-color: #6c94ad;
      line-height: 2.2;

      .el-checkbox {
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
  }

  .chief,
  .member {
    padding: 5px 15px;
  }

  .member {
    border-top: 1px solid #ccc;
    line-height: 2.2;
  }
}
</style>
