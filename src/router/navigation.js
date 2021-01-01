import store from '@/store'
import common from '@api/common'
import router, { createRouter } from './index'

// 判斷是否需要重新註冊路由
let isRegistered = false

// const getVerifiedToken = async emsToken => {
//   try {
//     const postAuth = await common.getVerifiedToken({ emsToken })
//     localStorage.setItem('ctlToken', postAuth.ctlToken)
//     localStorage.setItem('userData', JSON.stringify(postAuth))
//   } catch {
//     throw (new Error('Login Fail'))
//   }
// }

export const registerRouter = async () => {
  isRegistered = true
  try {
    const asyncRoutes = await store.dispatch('menu/generateRoutes')
    router.addRoutes(asyncRoutes)
  } catch {
    // interceptor handle
  }
}

// set global next() to
// let nextFunc
// let toRoute

// const checkRoute = () => {
//   const path = toRoute.path
//   const query = { ...toRoute.query }
//   if (!toRoute.name) {
//     nextFunc({
//       path,
//       query,
//     })
//   } else {
//     nextFunc()
//   }
// }

// const handleWithoutToken = async () => {
//   const pattern = /401|403|404|login|publicHandovers/
//   if (pattern.test(toRoute.path)) {
//     await store.dispatch('JsPanels/closeAllPanel')
//     nextFunc()
//   } else if (toRoute.query.token) {
//     try {
//       await getVerifiedToken(toRoute.query.token)
//       await registerRouter()
//       checkRoute()
//     } catch {
//       // interceptor handle
//     }
//   } else {
//     nextFunc({
//       path: '/login',
//     })
//   }
// }

// const handleWithToken = async () => {
//   if (!isRegistered) {
//     await registerRouter()
//   }
//   checkRoute()
// }

// const handleIframe = async () => {
//   if (localStorage.ctlToken) {
//     if (toRoute.query.hash === localStorage.emsHash) {
//       handleWithToken()
//     } else {
//       // override emsToken
//       localStorage.setItem('emsHash', toRoute.query.hash)
//       try {
//         await getVerifiedToken(toRoute.query.token)
//         await registerRouter()
//         checkRoute()
//       } catch {
//         // interceptor handle
//       }
//     }
//   } else {
//     handleWithoutToken()
//   }
// }

// const handleLocal = () => {
//   if (localStorage.ctlToken) {
//     handleWithToken()
//   } else {
//     handleWithoutToken()
//   }
// }

router.beforeEach(async (to, from, next) => {
  // nextFunc = next
  // toRoute = to

  // if (to.query.hash) {
  //   if (!localStorage.emsHash) {
  //     localStorage.setItem('emsHash', to.query.hash)
  //   }
  //   handleIframe()
  // } else {
  //   handleLocal()
  // }
  if (!isRegistered) {
    await registerRouter()
  }
  next()
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export async function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  await registerRouter()
}
