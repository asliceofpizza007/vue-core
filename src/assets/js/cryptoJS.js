import CryptoJS from 'crypto-js'

export default {
  // 解析 Jwt
  parseJwt(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(jsonPayload)
  },
  // 解密
  aesDecrypt(text, key, iv) {
    // 將key轉成utf8
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key)
    // 將iv轉成utf8
    const ivUtf8  = CryptoJS.enc.Utf8.parse(iv)
    // 將暗文轉成hex
    const oldHexStr = CryptoJS.enc.Hex.parse(text)
    // 將暗文轉成base64
    const base64Str = CryptoJS.enc.Base64.stringify(oldHexStr)
    // 參數
    const options = {
      iv: ivUtf8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }
    // // 解密
    const bytes = CryptoJS.AES.decrypt(base64Str, keyUtf8, options)
    // // utf8轉譯
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

    return decryptedData
  },
  // 加密
  aesEncrypt(text, key, iv) {
    // 將key轉成utf8
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key)
    // 將iv轉成utf8
    const ivUtf8  = CryptoJS.enc.Utf8.parse(iv)
    // 將明文轉成utf8
    const ciphertext = CryptoJS.enc.Utf8.parse(text)
    // 加密
    const Crypt = CryptoJS.AES.encrypt(ciphertext, keyUtf8, {
      mode: CryptoJS.mode.CBC,
      iv: ivUtf8,
      padding: CryptoJS.pad.ZeroPadding,
    })
    // 轉成hexstr
    const hexStr = Crypt.ciphertext.toString()

    return hexStr
  },
}
