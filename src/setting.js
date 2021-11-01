import urlUtil from '@/utils/urlUtil'

export default {
  platformKey: 'tui-console',
  // 开发模式控制后门
  // isDev: false,
  isDev: !!urlUtil.getQueryStringArgs('isDev') || process.env.NODE_ENV === 'development',
  // 是否开启权限
  permission: false
}
