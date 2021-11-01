import storageUtil from '@/utils/storageUtil'
import authUtil from '@/utils/authUtil'
import urlUtil from '@/utils/urlUtil'
import setting from '@/setting'

export default {
  // 设置登录，为应对不同平台抽象
  setLoginToken(token) {
    authUtil.setToken(token)
  },
  // 设置登录，为应对不同平台抽象
  setLoginInfo(userInfo) {
    storageUtil.setData('userInfo', userInfo)
  },
  // 退出登录，为应对不同平台抽象
  removeLoginAuth() {
    authUtil.removeToken()
    storageUtil.setData('userInfo', {})
  },
  // 返回登录，为应对不同平台抽象
  backToAppLogin(normal) {
    normal = normal || ''
    const sourceKey = urlUtil.getQueryStringArgs('sourceKey')
    if (sourceKey) {
      const url = localStorage.getItem(sourceKey + 'Login')
      if (url) {
        normal = url
      }
    }
    return normal
  },
  // 返回App的首页，为应对不同平台抽象
  backAppHome(bigHomeUrl) {
    bigHomeUrl = bigHomeUrl || ''
    const sourceKey = urlUtil.getQueryStringArgs('sourceKey')
    if (sourceKey) {
      const url = localStorage.getItem(sourceKey + 'Back')
      if (url) {
        bigHomeUrl = url
      }
    }
    return bigHomeUrl
  },
  // 存下回来的路径
  setBackUrl(urlMap) {
    localStorage.setItem(`${setting}Back`, `/${setting}/#${urlMap.back || '/'}`)
    localStorage.setItem(`${setting}Login`, `/${setting}/#${urlMap.login || '/login'}`)
  },
  // 格式化跳转链接
  formatSourceKeyUrl(url) {
    return urlUtil.setQueryStringArgs(url, {
      sourceKey: setting
    })
  }
}
