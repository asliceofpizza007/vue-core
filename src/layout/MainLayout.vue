<template lang="pug">
  #layout(v-loading="loading")
    router-view(v-if="isLoaded")
</template>
<script>
import common from '@api/common'
import { mapState } from 'vuex'
import axios from 'axios'
import { flattenTree, delay } from '@/utils'
import { cloneDeep, remove } from 'lodash'
import {
  userPreferences as preference,
  enumRefs,
  hiddenEmp
} from '@js/mockData'

export default {
  name: 'MainLayout',
  data() {
    return {
      loading: false,
      isLoaded: false,
    }
  },
  computed: {
    ...mapState('menu', {
      menuList: state => state.menuList,
    }),
  },
  created() {
    this.getDefaultData()
  },
  methods: {
    async getDefaultData() {
      // const requests = [
      //   common.getUserPreference(),
      //   common.getEnumRefs(),
      //   common.getAllEmployees(),
      // ]
      // const options = [
      //   'getContractorList',
      //   'getSitePlatformList',
      //   'getSiteTypeList',
      //   'getSitePurposeList',
      // ]
      this.loading = true
      try {
        await delay(500)
        // const [preference, enumRefs, allEmployees] = await axios.all([...requests])
        this.$store.dispatch('app/setEnumRefs', enumRefs)
        const Employees = this.removeRepeat(hiddenEmp)
        this.$store.dispatch('app/setAllEmployees', Employees)
        if (preference) {
          const { userPreferences } = preference
          localStorage.setItem('userPreferences', userPreferences)
          if (userPreferences) {
            const {
              appPreferences,
              tabPreferences,
            } = JSON.parse(userPreferences)

            this.$store.dispatch('app/setAppUserPreferences', appPreferences)
            this.$store.dispatch('tabs/setTabUserPreferences', tabPreferences)
          }
        }
        // await Promise.all([...options.map(action => this.$store.dispatch(`options/${action}`))])
        this.redirectRouter()
      } catch {
        // pass
      } finally {
        this.isLoaded = true
        this.loading = false
      }
    },
    removeRepeat(allEmployees, noRepeat = true) {
      const departments = cloneDeep(allEmployees.departments)
      departments.forEach(dept => {
        const { groups } = dept
        const delGroupId = []
        groups.forEach(group => {
          const item = group
          const { groupManagers, groupId, employees } = group
          const hasGroupManagers = groupManagers && groupManagers.length > 0
          if (noRepeat) {
            remove(employees, employee => employee.class !== 0)
            if (!hasGroupManagers && employees.length === 0) {
              delGroupId.push(groupId)
            }
          }
          item.groupCode += groupId
        })
        remove(groups, group => delGroupId.includes(group.groupId))
      })

      return { compManagers: allEmployees.compManagers, departments }
    },
    redirectRouter() {
      const route = this.$route.path
      if (!(route === '/' || route === '/login')) {
        this.checkIfNeedToSetTab()
      } else {
        this.$router.push({
          path: '/index',
        })
      }
    },
    checkIfNeedToSetTab() {
      const route = this.$route.path
      const flat = flattenTree(this.menuList)
      const activeNav = flat.find(nav => {
        return route === `/${nav.link}` || route === `/${nav.menuCode}`
      })
      if (activeNav) {
        const {
          id,
          menuCode,
          link,
          actions,
          viewType,
          i18n,
          title,
        } = activeNav
        const lang = this.$i18n.locale
        const computedTitle = i18n && i18n[lang] ? i18n[lang] : title
        const tabConfig = {
          id,
          menuCode,
          link,
          actions,
          title: computedTitle,
        }
        if (viewType === 5) {
          tabConfig.viewType = viewType
        }
        this.$store.dispatch('tabs/setTabs', tabConfig)
        // this.$store.dispatch('updateUserPreferences')
        this.$bus.$emit('check-tab-nav-width')
      }
    },
  },
}
</script>
