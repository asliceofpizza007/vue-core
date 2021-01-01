// import common from '@api/common'
import { delay } from '@/utils'
import { menuList } from '@js/mockData'
import {
  SET_MENU_LIST
} from '../mutation-types'

function menuToRoutes(menu, routes = [], alias = []) {
  if (Array.isArray(menu)) {
    menu.forEach(list => {
      const {
        menuType,
        openType,
        viewType,
        link,
        children,
        menuCode,
      } = list
      if (menuType === 2 && openType === 3) {
        if (viewType === 4) {
          const componentPath = `${link.charAt(0).toLowerCase()}${link.slice(1)}`
          const route = {
            path: `/${link}`,
            name: link,
            component: () => import('@/views/pages/' + componentPath),
          }
          routes.push(route)
        } else { // viewType === 5
          alias.push(`/${menuCode}`)
        }
      }
      if (children.length) {
        menuToRoutes(children, routes, alias)
      }
    })
  }
  return { asyncRoutes: routes, alias }
}

const state = {
  menuList: [],
}

const mutations = {
  [SET_MENU_LIST](state, menu) {
    state.menuList = menu
  },
}

const actions = {
  async generateRoutes({ commit }) {
    try {
      // const menuList = await common.getMenuList()
      await delay(300)
      commit(SET_MENU_LIST, menuList)
      const {
        asyncRoutes,
        alias,
      }  = menuToRoutes(menuList)
      const routes = [
        {
          path: '/',
          name: 'layout',
          component: () => import('@/layout/MainLayout'),
          children: [
            {
              path: '/index',
              component: () => import('@/layout/IndexLayout'),
              children: [
                {
                  path: '',
                  name: 'index',
                  component: () => import('@v/pages/index'),
                },
                ...asyncRoutes,
                {
                  path: '/iframe',
                  name: 'iframe',
                  component: () => import('@c/Iframe'),
                  alias,
                },
              ],
            },
          ],
        },
        {
          path: '*',    // 未匹配頁面導至404
          redirect: '/404',
        },
      ]
      return routes
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
