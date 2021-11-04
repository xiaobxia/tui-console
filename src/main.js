// 兼容ie
// import 'babel-polyfill'
import Vue from 'vue'

// 平台组件样式
import ElementUI from 'element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import '@/styles/theme/project-theme.scss'

import App from './App'
import router from './router'
import store from './store'

// import i18n from './lang' // Internationalization
import './permission' // permission control
import Http from '@/utils/httpUtil'
import numberUtil from '@/utils/numberUtil'
import fileUtil from '@/utils/fileUtil'
import typeValue from '@/common/typeValue'
import inputFilter from '@/common/inputFilter'
import dataFormat from '@/common/dataFormat'
import userPerm from '@/common/userPerm'
import sysSetting from '@/setting'

// 指令部分
import Clipboard from '@/directive/clipboard'

Vue.use(ElementUI, {
  // size: 'small'
})

Vue.use(Clipboard)

Vue.directive('highlight', function(el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    window.hljs.highlightBlock(block)
  })
})

// HTTP工具
Vue.prototype.$http = Http

function registerUtil(util) {
  for (const key in util) {
    if (util.hasOwnProperty(key)) {
      Vue.prototype['$' + key] = util[key]
    }
  }
}

// 数字工具
registerUtil(numberUtil)
// 文件工具
registerUtil(fileUtil)
// 枚举常量
registerUtil(typeValue)
// 输入过滤
registerUtil(inputFilter)
// 数据格式化
registerUtil(dataFormat)
// 用户权限
registerUtil(userPerm)

Vue.prototype.$getDocumentHtml = function() {
  return document.getElementsByTagName('html')[0]
}

Vue.prototype.$deepClone = function(data) {
  return JSON.parse(JSON.stringify(data))
}

Vue.prototype.$sysSetting = sysSetting

// 全局日志方法
Vue.prototype.$oLog = function(content, detail) {
  return store.dispatch('operationLog', {
    content: content || '',
    detail: detail || ''
  })
}

// 全局数据
window.$nowYear = new Date().getFullYear()

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  render: h => h(App)
})
