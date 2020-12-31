<template lang="pug">
  .relatedMemberTagsList
    template(v-if="categorizeByDept")
      .categorizeByDept
        template(v-for="dept in memberList")
          template(v-if="dept.chosenChiefs.length + dept.chosenMembers.length > 0")
            .deptTitle {{dept.name}}
            .member
              el-tag.chiefs(
                v-for="member in dept.chosenChiefs"
                :key="member.id"
                type="bd-success"
                :closable="true"
                @close="removeMemberTag(member.id)") {{ member.name }}
              el-tag.employees(
                v-for="member in dept.chosenMembers"
                :key="member.id"
                type="bd-success"
                :closable="true"
                @close="removeMemberTag(member.id)") {{ member.name }}
    template.non-categorize(v-else)
      template(v-for="dept in memberList")
        el-tag(
          v-for="member in dept.chosenChiefs"
          type="bd-success"
          :key="member.id"
          :closable="true"
          @close="removeMemberTag(member.id)") {{ member.name }}
        el-tag(
          v-for="member in dept.chosenMembers"
          type="bd-success"
          :key="member.id"
          :closable="true"
          @close="removeMemberTag(member.id)") {{ member.name }}
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'RelatedMemberTagsList',
  props: {
    'memberChosenList': {
      type: Array,
      default: null,
    },
    'categorizeByDept': {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState('app', {
      allEmployees: state => state.allEmployees,
    }),
    managerData() {
      const deptData = {
        id: -1,
        name: '高層',
        chosenChiefs: [],
        chosenMembers: this.allEmployees.compManagers,
      }
      return deptData
    },
    memberList() {
      const list = []
      const { compManagers, departments } = this.allEmployees
      if (compManagers === undefined && departments === undefined) return []

      departments.forEach(dept => {
        const deptData = {
          id: dept.departmentId,
          name: dept.departmentName,
          chosenChiefs: [],
          chosenMembers: [],
        }

        const { deptManagers, groups } = dept

        /** 填入部主管 */
        const hasDeptManager = Array.isArray(deptManagers) && deptManagers.length > 0
        if (hasDeptManager) {
          deptManagers.forEach(manager => {
            if (this.memberChosenList.includes(manager.id)) {
              deptData.chosenChiefs.push(manager)
            }
          })
        }

        if (Array.isArray(groups) && groups.length > 0) {
          /** 填入組主管 */
          groups.forEach(group => {
            const { groupManagers, employees } = group
            const hasGroupManager = Array.isArray(groupManagers) && groupManagers.length > 0
            if (hasGroupManager) {
              groupManagers.forEach(manager => {
                if (this.memberChosenList.includes(manager.id)) {
                  deptData.chosenChiefs.push(manager)
                }
              })
            }
            employees.forEach(employee => {
              if (this.memberChosenList.includes(employee.id)) {
                deptData.chosenMembers.push(employee)
              }
            })
          })
        }
        list.push(deptData)
      })

      if (Array.isArray(compManagers) && compManagers.length > 0) {
        const data = {
          id: 0,
          name: '高層',
          chosenChiefs: compManagers.filter(manager => this.memberChosenList.includes(manager.id)),
          chosenMembers: [],
        }
        list.unshift(data)
      }
      return list
    },
  },
  methods: {
    removeMemberTag(id) {
      // eslint-disable-next-line vue/no-mutating-props
      this.memberChosenList.splice(this.memberChosenList.indexOf(id), 1)
      this.$emit('update:memberChosenList', this.memberChosenList)
    },
  },
}
</script>

<style lang="scss">

.relatedMemberTagsList {
  display: inline-block;
  width: 100%;
  height: 100%;

  &.h-unset {
    .categorizeByDept {
      height: unset;
    }
  }

  .categorizeByDept {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    border: #dcdfe6 1px solid;
    border-radius: 4px;

    .deptTitle {
      padding-left: 1rem;
      font-size: 14px;
      color: #f0f0f0;
      background: #609279;
      line-height: 2;
    }

    .member {
      padding: 0.5em;
    }

    .employees:empty,
    .chiefs:empty {
      padding: 0;
    }

    .el-tag {
      margin: 0.5em;
      color: #3c8dbc;
      background: #f0f8ff;
      border: 1px solid #3c8dbc;
    }
  }

  .el-tag {
    margin: 0 5px;
    font-size: 13px;

    &.employees {
      color: #609279;
      background-color: #dff1e8;
      border: 1px solid #609279;

      &:hover .el-icon-close {
        color: #fff;
        background-color: #7ca993;
      }

      .el-icon-close {
        color: #609279;
      }
    }
  }
}
</style>
