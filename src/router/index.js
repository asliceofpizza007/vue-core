import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@v/pages/login'),
  },
  {
    path: '/themes',
    name: 'Themes',
    component: () => import('@v/pages/Themes'),
  },
  {
    path: '/401',
    name: 'Page401',
    component: () => import('@v/errorPage/Page401'),
  },
  {
    path: '/403',
    name: 'Page403',
    component: () => import('@v/errorPage/Page403'),
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@v/errorPage/Page404'),
  },
  {
    path: '/publicHandovers',
    name: 'PublicHandovers',
    component: () => import('@v/panels/ShowHandover'),
  },
]

export const createRouter = () => new Router({
  mode: 'history',
  routes: staticRoutes,
})

const router = createRouter()

export default router
