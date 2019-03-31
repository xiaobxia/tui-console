import Vue from 'vue'
import moment from 'moment'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '../static/web-fonts-with-css/css/fontawesome-all.css'
import './theme/index.css'
import Element from 'element-ui'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters
import Http from '@/utils/httpUtil.js'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$http = Http
Vue.prototype.formatDateTime = function(str) {
  if (str) {
    return moment(str).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return '-'
  }
}

Vue.prototype.formatRoles = function(roles) {
  if (roles && roles.length) {
    const value = roles[0]
    const rolesMap = {
      'admin': '管理员',
      'test': '测试',
      'channel': '渠道',
      'user': '客户'
    }
    return rolesMap[value]
  } else {
    return '-'
  }
}

Vue.prototype.formatStatus = function(status) {
  if (status === 1) {
    return '已上架'
  } else if (status === 2) {
    return '已下架'
  } else {
    return '未知'
  }
}

Vue.prototype.formatStatusType = function(status) {
  if (status === 1) {
    return 'success'
  } else if (status === 2) {
    return 'info'
  } else {
    return 'danger'
  }
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
