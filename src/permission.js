import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import authUtil from '@/utils/authUtil'
import appCommonUtil from '@/utils/appCommonUtil'
import setting from '@/setting'

NProgress.configure({ showSpinner: false })

const beforeEach = (to, from, next) => {
  NProgress.start()
  const token = authUtil.getToken()
  const userInfo = authUtil.getUser()
  if (token && userInfo._id) {
    // 没有生成过
    if (store.getters.ifAddRouters) {
      next()
    } else {
      // 是否开启权限的判断
      if (setting.permission) {
        store.dispatch('generatePermRoutes', {
          userId: userInfo.uid
        }).then(() => {
          // router里面原本只有基础的路由，是后来添加的有权限的路由
          router.addRoutes(store.getters.addRouters)
          next({ ...to, replace: true })
        })
      } else {
        store.dispatch('generateRoutes', { roles: [2] }).then(() => {
          router.addRoutes(store.getters.addRouters)
          next({ ...to, replace: true })
        })
      }
    }
    // 没有必要检查了，没有的会直接404
    // if (permissionUtil.checkPermission(userInfo.roles, to)) {
    // } else {
    //   next({ path: '/401', replace: true, query: { noGoBack: true }})
    // }
  } else {
    // 直接进入
    if (to.meta && to.meta.auth === false) {
      next()
    } else {
      NProgress.done()
      // 开发环境跳本项目
      next(`/login`)
    }
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  const queryToken = to.query.token
  if (queryToken) {
    // 单点登录，token从url传入
    window._token = queryToken
    appCommonUtil.setLoginToken(queryToken)
    store.dispatch('getUserInfo').then((data) => {
      // 设置记录
      beforeEach(to, from, next)
    })
  } else {
    // 正常情况下
    beforeEach(to, from, next)
  }
})

router.afterEach((to, from) => {
  NProgress.done() // finish progress bar
})
