import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

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
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: {
      title: '管理员',
      icon: 'fas fa-user',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/list'),
        name: 'UserList',
        meta: { title: '管理员列表', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/channel',
    component: Layout,
    redirect: '/channel/list',
    name: 'Channel',
    meta: {
      title: '渠道管理',
      icon: 'fas fa-handshake',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/channel/list'),
        name: 'ChannelList',
        meta: { title: '渠道列表', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: {
      title: '产品管理',
      icon: 'fab fa-app-store-ios',
      roles: ['admin']
    },
    children: [
      {
        path: 'edit/:id',
        component: () => import('@/views/product/edit'),
        name: 'EditProduct',
        meta: { title: '编辑产品', noCache: true, roles: ['admin'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/product/list'),
        name: 'ProductList',
        meta: { title: '产品列表', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/viewLog',
    name: 'Statistics',
    meta: {
      title: '统计',
      icon: 'fas fa-database'
    },
    children: [
      {
        path: 'viewLog',
        component: () => import('@/views/statistics/viewLog'),
        name: 'StatisticsViewLog',
        meta: { title: '页面浏览', roles: ['admin'] }
      },
      {
        path: 'userClick',
        component: () => import('@/views/statistics/userClick'),
        name: 'StatisticsUserClick',
        meta: { title: '产品点击', roles: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
