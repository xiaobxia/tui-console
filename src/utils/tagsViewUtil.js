import tagsViewStorageUtil from '@/utils/tagsViewStorageUtil'

function routerObj(item) {
  return {
    path: item.path,
    query: item.query,
    fullPath: item.fullPath,
    meta: item.meta,
    name: item.name,
    title: item.title
  }
}

function checkRouterObj(item) {
  return item.path && item.title && item.fullPath && item.query && item.meta && item.name
}

const tagsViewUtil = {
  setViewsCache(state) {
    const visitedViews = []
    state.visitedViews.forEach((item) => {
      visitedViews.push(routerObj(item))
    })
    const cachedViews = []
    state.cachedViews.forEach((item) => {
      cachedViews.push(routerObj(item))
    })
    tagsViewStorageUtil.setData('accountWebVisitedViews', visitedViews)
    tagsViewStorageUtil.setData('accountWebCachedViews', cachedViews)
  },
  getViewsCache() {
    const visitedViews = tagsViewStorageUtil.getData('accountWebVisitedViews') || []
    const cachedViews = tagsViewStorageUtil.getData('accountWebCachedViews') || []
    const newVisitedViews = []
    const newCachedViews = []
    visitedViews.forEach((item) => {
      if (checkRouterObj(item)) {
        newVisitedViews.push(item)
      }
    })
    cachedViews.forEach((item) => {
      if (checkRouterObj(item)) {
        newCachedViews.push(item)
      }
    })
    return {
      visitedViews: newVisitedViews,
      cachedViews: newCachedViews
    }
  }
}
export default tagsViewUtil
