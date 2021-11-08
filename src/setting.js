import urlUtil from '@/utils/urlUtil'

export default {
  platformKey: 'tui-console',
  // 开发模式控制后门
  // isDev: false,
  isDev: !!urlUtil.getQueryStringArgs('isDev') || process.env.NODE_ENV === 'development',
  // 是否开启权限
  permission: false,
  // 七牛云上传储存区域的上传域名
  upload_qiniu_url: 'http://up-z0.qiniup.com',
  // 七牛云返回储存图片的子域名
  upload_qiniu_addr: 'http://tuiinfo.xiaobxia.com/'
}
