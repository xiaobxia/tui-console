/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
import TempRouter from '@/views/layout/TempRouter'

const router = [
  {
    path: '/userCenter',
    component: Layout,
    meta: {
      title: '用户中心',
      noCache: true,
      menu: '01'
    },
    children: [
      {
        path: 'userList',
        component: TempRouter,
        meta: {
          menu: '0101'
        },
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
        path: 'rulesList',
        component: TempRouter,
        meta: {
          menu: '0102'
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/rulesList'),
            name: 'UserCenterRulesList',
            meta: {
              title: '角色管理',
              noCache: true,
              icon: 'st-icon-jsgl'
            }
          }
        ]
      },
      {
        path: 'productList',
        component: TempRouter,
        meta: {
          menu: '0103'
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/productList'),
            name: 'UserCenterProductList',
            meta: {
              title: '产品管理',
              noCache: true,
              icon: 'st-icon-bmgl'
            }
          }
        ]
      },
      {
        path: 'logList',
        component: TempRouter,
        meta: {
          menu: '0104'
        },
        children: [
          {
            path: 'index',
            component: () => import('@/views/userCenter/logList'),
            name: 'UserCenterLogList',
            meta: {
              title: '日志管理',
              noCache: true,
              icon: 'st-icon-rzgl'
            }
          }
        ]
      }
    ]
  }
]

export default router
