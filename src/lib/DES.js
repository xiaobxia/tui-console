import CryptoJS from 'crypto-js'

const SECRET_KEY = '9C6G1ee4ffb4411f90d3HJ3ff805D4FY'

export default {
  // 随机生成指定数量的16进制key
  generatekey(num) {
    const library =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    for (var i = 0; i < num; i++) {
      const randomPoz = Math.floor(Math.random() * library.length)
      key += library.substring(randomPoz, randomPoz + 1)
    }
    return key
  },

  // 加密
  encrypt(word, keyStr) {
    keyStr = keyStr || SECRET_KEY
    var key = CryptoJS.enc.Utf8.parse(keyStr)
    var encrypted = CryptoJS.DES.encrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })

    return encrypted.toString()
  },
  // 解密
  decrypt(word, keyStr) {
    keyStr = keyStr || SECRET_KEY
    var key = CryptoJS.enc.Utf8.parse(keyStr)
    var decrypt = CryptoJS.DES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }

}
