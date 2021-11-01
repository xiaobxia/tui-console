const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  // 标签
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // 权限
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menuList: state => state.permission.menuList,
  menuKeyMap: state => state.permission.menuKeyMap,
  ifAddRouters: state => state.permission.ifAdd,
  // 公共
  rulesList: state => state.common.rulesList
}
export default getters
