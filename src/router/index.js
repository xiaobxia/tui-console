import Vue from 'vue'
import Router from 'vue-router'
import userCenterRouter from './modules/userCenter'

/* Layout */
import Layout from '@/views/layout/Layout'

Vue.use(Router)

// 都有的路由
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      auth: false
    }
  },
  {
    path: '/home',
    component: () => import('@/views/home/index'),
    hidden: true,
    meta: {
      auth: true
    }
  },
  {
    path: '/entry',
    component: () => import('@/views/entry/index'),
    hidden: true,
    meta: {
      auth: true
    }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true,
    meta: {
      auth: false
    }
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    // 默认去账本列表
    redirect: 'userCenter/userList/index'
  }
]

export const asyncRouterMapWithRoles = [
]

export const asyncRouterMap = [
  ...userCenterRouter,
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
