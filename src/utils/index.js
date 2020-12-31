import Vue from 'vue'
import moment from 'moment'
import 'moment-timezone'
import i18n from '@/language'

export function assemblyParams(params) {
  // api url 組字串
  let str = ''
  Object.keys(params).forEach(key => {
    if (params[key] || params[key] === false) {
      str += `${key}=${params[key]}&`
    }
  })
  return str.substring(0, str.length - 1) // 去結尾&
}

// html最大字數限制
export function htmlWordLimit(val, limit) {
  const wordLength = val == null ? 0 : val.length
  return wordLength < limit
}

// 取開始/結束時間
export function fromRange(params) {
  const load = {}
  load.startOn = params.date ? params.date[0] : null
  load.endOn = params.date ? params.date[1] : null
  return load
}

export function exportExcel(res) {
  // 使用html a tag 將文本掛上a tag 執行download動作
  // 新增一個a tag
  const link = document.createElement('a')
  // 設置display='none'
  link.style.display = 'none'
  // 創建 blob實例，並掛上content-type
  const blob = new Blob([res], {
    // MIME type
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  // 建立blob 連結，並掛上a tag
  link.href = URL.createObjectURL(blob)
  // 設定下載檔案的檔名
  link.download = res.fileName
  // 將a tag 掛上DOM
  document.body.appendChild(link)
  // js操作點擊a tag
  link.click()
  // 移除a tag
  document.body.removeChild(link)
  // 釋放URL
  link.href = URL.revokeObjectURL(blob)
}

// 檢查數字必填
export function numberValidator(rule, value, callback) {
  if (!value && value !== 0) {
    callback()
  } else if (value !== Number(value)) {
    callback(new Error('必須為數字'))
  } else if (value < 1) {
    callback(new Error('必須大於 0'))
  } else {
    callback()
  }
}

// 檢查字母小寫
export function alphabetValidator(rule, value, callback) {
  const pattern = new RegExp('^[a-z]+$')
  if (!value) {
    callback(new Error('↑此項必填'))
  } else if (!pattern.test(value)) {
    callback(new Error('必須為英文小寫'))
  } else {
    callback()
  }
}

export function listRetouch(list, formatType = 'date') {
  const newList = list
  newList.forEach(item => {
    if (item.publishedOn.indexOf('0000-00-00') > -1) {
      item.publishedOn = ''
      item.finishedOn = ''
    } else {
      const formatMap = {
        date: 'YYYY-MM-DD',
        dateTime: 'YYYY-MM-DD HH:mm:ss',
      }
      item.publishedOn = moment(item.publishedOn).format(formatMap[formatType])
      item.finishedOn = moment(item.finishedOn).format(formatMap[formatType])
    }

    const nowTime = new Date().getTime()
    const publishedOn = new Date(item.publishedOn).getTime()
    const finishedOn = new Date(item.finishedOn).getTime()

    let status
    switch (true) {
      case nowTime < publishedOn:
        status = 1
        break
      case (nowTime >= publishedOn && nowTime <= finishedOn):
        status = 2
        break
      case nowTime > finishedOn:
        status = 3
        break
      default:
        status = 0
        break
    }

    item.publishStatus = status
  })
  return newList
}

export function treeNodeAttributeInject(data, expandedAll, key) {
  const tmp = []
  const parentMap = {}
  Array.from(data).forEach(record => {
    // eslint-disable-next-line no-underscore-dangle
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandedAll)
    }

    if (record.parentId !== 0) {
      const parent = parentMap[record.parentId] || data.filter(list => {
        if (list[key] === record.parentId) {
          parentMap[record.parentId] = list
          return true
        }
        return false
      })[0]
      Vue.set(record, '_parent', parent)
    }

    // eslint-disable-next-line no-underscore-dangle
    let _level = 0
    if (record.parent) {
      // eslint-disable-next-line no-underscore-dangle
      _level = record.parent._level + 1
    }
    Vue.set(record, '_level', _level)

    const children = data.filter(list => list.parentId === record[key])
    Vue.set(record, 'children', children)

    tmp.push(record)
  })
  return tmp
}

// 延遲
export function delay(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function convertTimezone(date) {
  const locale = i18n.locale
  // 語系選項
  const langMap = {
    'zh-TW': {
      label: '繁體中文',
      timeZone: 'Asia/Taipei',
    },
    'ja-JP': {
      label: '日本語',
      timeZone: 'Asia/Tokyo',
    },
  }
  return moment(date).tz(langMap[locale].timeZone).format('YYYY-MM-DD HH:mm:ss')
}

export function flattenTree(tree) {
  const flattend = [];
  (function flat(arr) {
    arr.forEach(el => {
      if (el.children.length) {
        flat(el.children)
      } else {
        flattend.push(el)
      }
    })
  }(tree))
  return flattend
}

export function contentReformat(val) {
  let tmp = val

  // reformat img url
  const urlPattern = /#{APIPATH}/gi
  tmp = tmp.replace(urlPattern, process.env.VUE_APP_APIPATH)

  // reformat link target
  const linkPattern = /<a /g
  tmp = tmp.replace(linkPattern, match => `${match}target="_blank" `)
  return tmp
}

export function replaceToDate(value) {
  // 只顯示日期
  const showDate = moment(value).locale('').format('YYYY-MM-DD')
  return showDate
}

export const copyToClipboardByCreateInput = text => new Promise((resolve, reject) => {
  const hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'text')
  hiddenInput.style.display = 'block'
  hiddenInput.value = text
  document.body.appendChild(hiddenInput)
  hiddenInput.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      window.getSelection().removeAllRanges()
      document.body.removeChild(hiddenInput)
      resolve()
    }
  } catch (err) {
    reject(err)
  }
})
