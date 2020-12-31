import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const http = axios.create({
  baseURL: process.env.VUE_APP_APIPATH,
  timeout: 10000,
})

http.interceptors.request.use(config => {
  if (!config.headers.Authorization && !config.dropBearerToken) {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem('ctlToken')}`,
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(
  response => {
    const hasDisposition = response.request.getResponseHeader('Content-Disposition')
    if (hasDisposition && hasDisposition.indexOf("utf-8''") > -1) {
      const data = response.data
      data.fileName = decodeURIComponent(hasDisposition.split("utf-8''")[1].split('.')[0])
      return data
    }
    return response.data
  },
  error => {
    const { response } = error
    const errorMsg = {
      message: response.data,
      type: 'error',
      duration: 3000,
      showClose: false,
    }
    switch (response.status) {
      case 304:
        // API:refreshtoken 甚麼都不做
        return false
      case 400:
        errorMsg.message = response.data.error.message
        break
      // token 過期 or 帳號密碼輸入錯誤
      case 401:
        if (router.currentRoute.path !== '/login') {
          localStorage.clear()
          router.push({
            path: '/401',
          })
        } else {
          errorMsg.message = '帳號/密碼輸入錯誤'
        }
        break
      // 429 too many request dont trigger error message
      case 429:
        errorMsg.duration = 0
        errorMsg.showClose = true
        break
      default:
        break
    }
    Message(errorMsg)
    const parse = JSON.stringify({ status: response.status })
    return Promise.reject(new Error(parse), response)
  }

)

export default http
