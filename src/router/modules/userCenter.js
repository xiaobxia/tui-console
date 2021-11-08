/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
import TempRouter from '@/views/layout/TempRouter'

const router = [
  {
    path: '/userCenter',
    component: Layout,
    meta: {
      title: '用户中心',
      noCache: true
    },
    children: [
      {
        path: 'userList',
        component: TempRouter,
        meta: {},
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/userList'),
            name: 'UserCenterUserList',
            meta: {
              title: '用户管理',
              noCache: true,
              icon: 'st-icon-yhgl'
            }
          }
        ]
      },
      {
        path: 'crontabList',
        component: TempRouter,
        meta: {},
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/crontabList'),
            name: 'UserCenterCrontabList',
            meta: {
              title: '定时任务',
              noCache: true,
              icon: 'st-icon-yhgl'
            }
          }
        ]
      },
      {
        path: 'platformList',
        component: TempRouter,
        meta: {},
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/platformList'),
            name: 'UserCenterPlatformList',
            meta: {
              title: '平台管理',
              noCache: true,
              icon: 'st-icon-yhgl'
            }
          }
        ]
      },
      {
        path: 'channelList',
        component: TempRouter,
        meta: {},
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/channelList'),
            name: 'UserCenterChannelList',
            meta: {
              title: '渠道管理',
              noCache: true,
              icon: 'st-icon-yhgl'
            }
          }
        ]
      },
      {
        path: 'channelPlatformList',
        component: TempRouter,
        meta: {},
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/channelPlatformList'),
            name: 'UserCenterChannelPlatformList',
            meta: {
              title: '渠道平台',
              noCache: true,
              icon: 'st-icon-yhgl'
            }
          }
        ]
      },
      {
        path: 'productList',
        component: TempRouter,
        meta: {},
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/productList'),
            name: 'UserCenterProductList',
            meta: {
              title: '产品管理',
              noCache: true,
              icon: 'st-icon-product'
            }
          }
        ]
      }
    ]
  }
]

export default router
