import tagsViewUtil from '@/utils/tagsViewUtil'

const viewsCache = tagsViewUtil.getViewsCache()

const state = {
  visitedViews: viewsCache.visitedViews,
  cachedViews: viewsCache.cachedViews
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return

    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
    tagsViewUtil.setViewsCache(state)
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
    tagsViewUtil.setViewsCache(state)
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
    tagsViewUtil.setViewsCache(state)
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
    tagsViewUtil.setViewsCache(state)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path || v.path === '/dashboard/index'
    })
    tagsViewUtil.setViewsCache(state)
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
    tagsViewUtil.setViewsCache(state)
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix || tag.path === '/dashboard/index')
    state.visitedViews = affixTags
    tagsViewUtil.setViewsCache(state)
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
    tagsViewUtil.setViewsCache(state)
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
    tagsViewUtil.setViewsCache(state)
  }
}

const actions = {
  addView({ dispatch }, view) {
    // console.log('addView')
    // console.log(view)
    if (!(view.meta && view.meta.noViewTag)) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    }
  },
  addVisitedView({ commit }, view) {
    // console.log('addVisitedView')
    if (!(view.meta && view.meta.noViewTag)) {
      commit('ADD_VISITED_VIEW', view)
    }
  },
  addCachedView({ commit }, view) {
    // console.log('addCachedView')
    if (!(view.meta && view.meta.noViewTag)) {
      commit('ADD_CACHED_VIEW', view)
    }
  },
  delView({ dispatch, state }, view) {
    // console.log('delView')
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    // console.log('delVisitedView')
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    // console.log('delCachedView')
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delOthersViews({ dispatch, state }, view) {
    // console.log('delOthersViews')
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    // console.log('delOthersVisitedViews')
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    // console.log('delOthersCachedViews')
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  delAllViews({ dispatch, state }, view) {
    // console.log('delAllViews')
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    // console.log('delAllVisitedViews')
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    // console.log('delAllCachedViews')
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  updateVisitedView({ commit }, view) {
    // console.log('updateVisitedView')
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
