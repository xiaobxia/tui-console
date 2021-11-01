import Cookies from 'js-cookie'
import setting from '@/setting'
import storageUtil from '@/utils/storageUtil'

const TokenKey = `${setting.platformKey}-token`

export default {
  getToken() {
    return Cookies.get(TokenKey)
  },
  setToken(token) {
    return Cookies.set(TokenKey, token)
  },
  removeToken() {
    return Cookies.remove(TokenKey)
  },
  removeUser() {
    this.removeToken()
    storageUtil.setData('userInfo', {})
  },
  getUser() {
    return storageUtil.getData('userInfo') || {}
  },
  setUser(data) {
    storageUtil.setData('userInfo', data || {})
  }
}
