import { asyncRouterMap, constantRouterMap, asyncRouterMapWithRoles } from '@/router'
import permissionUtil from '@/utils/permission'
import Http from '@/utils/httpUtil'

function getRoute(list) {
  for (let j = 0; j < list.length; j++) {
    const item = list[j]
    if (!item.hidden && item.path) {
      if (item.children && item.children.length > 0) {
        const res = getRoute(item.children)
        if (res) {
          return res
        }
      } else {
        return item
      }
    }
  }
  return null
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    ifAdd: false,
    menuList: [],
    menuKeyMap: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      state.ifAdd = true
    },
    SET_MENU_LIST: (state, list) => {
      const menuKeyMap = {}
      list.forEach((v) => {
        menuKeyMap[v] = true
      })
      state.menuList = list
      state.menuKeyMap = menuKeyMap
    }
  },
  actions: {
    getEntryByBasePath({ commit, state }, basePath) {
      for (let i = 0; i < state.routers.length; i++) {
        const v = state.routers[i]
        if (!v.hidden && v.path && v.path === basePath) {
          v.children = v.children || []
          const res = getRoute(v.children)
          if (res) {
            return res
          }
        }
      }
      return null
    },
    generateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        // role
        const roleRouter = permissionUtil.filterAsyncRouter(asyncRouterMapWithRoles, [2])
        // 暂时这个逻辑
        const menuRouter = permissionUtil.filterAsyncRouter(asyncRouterMap, roles)
        // const menuRouter = []
        commit('SET_ROUTERS', [...roleRouter, ...menuRouter])
        resolve()
      })
    },
    generatePermRoutes({ commit }, data) {
      return Http.get('dataCenter/perm/listMenuByUserId', {
        userId: data.userId
      }).then((res) => {
        const list = res.data || []
        const menu = list.map((v) => {
          return v.permUrl
        })
        const menuRouter = permissionUtil.filterAsyncRouterWithMenu(asyncRouterMap, menu)
        commit('SET_MENU_LIST', menu)
        commit('SET_ROUTERS', [...menuRouter])
        return res.data
      })
    },
    generateRoutesWithMenu({ commit }, data) {
      return new Promise(resolve => {
        const { menu } = data
        commit('SET_ROUTERS', permissionUtil.filterAsyncRouterWithMenu(asyncRouterMap, menu))
        resolve()
      })
    }
  }
}

export default permission
