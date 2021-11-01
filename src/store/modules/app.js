import storageUtil from '@/utils/storageUtil'
let sidebarStatus = storageUtil.getData('appConfig', 'sidebarStatus')
// let sidebarStatus = 1
if (sidebarStatus !== 1 && sidebarStatus !== 0) {
  sidebarStatus = 1
}
const app = {
  state: {
    sidebar: {
      opened: sidebarStatus === 1,
      withoutAnimation: false
    },
    key: Math.random()
  },
  mutations: {
    REFRESH_PAGE(state) {
      state.key = Math.random()
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        storageUtil.setData('appConfig', 'sidebarStatus', 0)
      } else {
        storageUtil.setData('appConfig', 'sidebarStatus', 1)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    SET_SIDEBAR: (state, value) => {
      if (value) {
        storageUtil.setData('appConfig', 'sidebarStatus', 1)
        state.sidebar.opened = true
        state.sidebar.withoutAnimation = false
      } else {
        storageUtil.setData('appConfig', 'sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = false
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      storageUtil.setData('appConfig', 'sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    setSideBar({ commit }, value) {
      commit('SET_SIDEBAR', value)
    }
  }
}

export default app
