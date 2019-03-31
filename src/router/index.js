import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'

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
        path: 'list',
        component: () => import('@/views/product/list'),
        name: 'ProductList',
        meta: { title: '产品列表', roles: ['admin'] }
      }
    ]
  },
  componentsRouter,
  chartsRouter,
  tableRouter,
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'fas fa-table' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: 'fas fa-exclamation-triangle'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'fas fa-file-excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/exportExcel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/selectExcel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'fas fa-file-archive' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },
  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'fas fa-clipboard' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/tui-console',
        meta: { title: 'externalLink', icon: 'fas fa-external-link-alt' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
