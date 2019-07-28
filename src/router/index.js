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
      roles: { include: ['superAdmin'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/list'),
        name: 'UserList',
        meta: { title: '管理员列表', roles: { include: ['superAdmin'] }}
      }
    ]
  },
  // {
  //   path: '/channel',
  //   component: Layout,
  //   redirect: '/channel/list',
  //   name: 'Channel',
  //   meta: {
  //     title: '渠道管理',
  //     icon: 'fas fa-handshake',
  //     roles: { include: ['admin'] }
  //   },
  //   children: [
  //     {
  //       path: 'edit/:id',
  //       component: () => import('@/views/channel/edit'),
  //       name: 'EditChannel',
  //       meta: { title: '编辑渠道', noCache: true, roles: { include: ['admin'] }},
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/channel/list'),
  //       name: 'ChannelList',
  //       meta: { title: '渠道列表', roles: { include: ['admin'] }}
  //     }
  //   ]
  // },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: {
      title: '产品管理',
      icon: 'fab fa-app-store-ios',
      roles: { include: ['admin'] }
    },
    children: [
      {
        path: 'edit/:id',
        component: () => import('@/views/product/edit'),
        name: 'EditProduct',
        meta: { title: '编辑产品', noCache: true, roles: { include: ['admin'] }},
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/product/list'),
        name: 'ProductList',
        meta: { title: '产品列表', roles: { include: ['admin'] }}
      }
    ]
  },
  // {
  //   path: '/statistics',
  //   component: Layout,
  //   redirect: '/statistics/viewLog',
  //   name: 'Statistics',
  //   meta: {
  //     title: '统计',
  //     icon: 'fas fa-database',
  //     roles: { include: ['admin'] }
  //   },
  //   children: [
  //     {
  //       path: 'customer',
  //       component: () => import('@/views/statistics/customer'),
  //       name: 'StatisticsCustomer',
  //       meta: { title: '注册用户', roles: { include: ['admin'] }}
  //     }
  //   ]
  // },
  // {
  //   path: '/agent',
  //   component: Layout,
  //   redirect: '/agent/registerLog',
  //   name: 'Agent',
  //   meta: {
  //     title: '统计',
  //     icon: 'fas fa-database',
  //     roles: { include: ['channel'] }
  //   },
  //   children: [
  //     {
  //       path: 'registerLog',
  //       component: () => import('@/views/agent/registerLog'),
  //       name: 'AgentRegisterLog',
  //       meta: { title: '注册统计', roles: { include: ['channel'] }}
  //     }
  //   ]
  // },
  {
    path: '/allUser',
    component: Layout,
    redirect: '/allUser/list',
    name: 'AllUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['superAdmin'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/allUser/list'),
        name: 'AllUserList',
        meta: { title: '总览', roles: { include: ['superAdmin'] }}
      }
    ]
  },
  {
    path: '/whiteUser',
    component: Layout,
    redirect: '/whiteUser/list',
    name: 'WhiteUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['admin'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/whiteUser/list'),
        name: 'WhiteUserList',
        meta: { title: '注册明细', roles: { include: ['admin'] }}
      }
    ]
  },
  {
    path: '/downUser',
    component: Layout,
    redirect: '/downUser/list',
    name: 'DownUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['superAdmin'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/downUser/list'),
        name: 'DownUserList',
        meta: { title: '下款明细', roles: { include: ['superAdmin'] }}
      }
    ]
  },
  {
    path: '/backUser',
    component: Layout,
    redirect: '/backUser/list',
    name: 'BackUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['superAdmin'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/backUser/list'),
        name: 'BackUserList',
        meta: { title: '回款明细', roles: { include: ['superAdmin'] }}
      }
    ]
  },
  {
    path: '/todayDownUser',
    component: Layout,
    redirect: '/todayDownUser/list',
    name: 'TodayDownUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['buyer-3', 'buyer-6', 'buyer-7', 'buyer-8'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/todayDownUser/list'),
        name: 'TodayDownUser',
        meta: { title: '下款', roles: { include: ['buyer-3', 'buyer-6', 'buyer-7', 'buyer-8'] }}
      }
    ]
  },
  {
    path: '/todayBackUser',
    component: Layout,
    redirect: '/todayBackUser/list',
    name: 'TodayBackUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['buyer-4', 'buyer-5', 'buyer-7', 'buyer-8'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/todayBackUser/list'),
        name: 'TodayBackUser',
        meta: { title: '回款', roles: { include: ['buyer-4', 'buyer-5', 'buyer-7', 'buyer-8'] }}
      }
    ]
  },
  {
    path: '/todayRegisterUser',
    component: Layout,
    redirect: '/todayRegisterUser/list',
    name: 'TodayRegisterUser',
    meta: {
      title: '统计',
      icon: 'fas fa-database',
      roles: { include: ['buyer-1', 'buyer-5', 'buyer-6', 'buyer-7'] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/todayRegisterUser/list'),
        name: 'TodayRegisterUser',
        meta: { title: '注册', roles: { include: ['buyer-1', 'buyer-5', 'buyer-6', 'buyer-7'] }}
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {
      title: '文章',
      icon: 'fas fa-database',
      roles: { include: [] }
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/article/list'),
        name: 'ArticleList',
        meta: { title: '文章', roles: { include: [] }}
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
