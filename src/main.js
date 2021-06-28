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
import printUtil from '@/utils/printUtil.js'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

function registerUtil(util) {
  for (const key in util) {
    if (util.hasOwnProperty(key)) {
      Vue.prototype['$' + key] = util[key]
    }
  }
}
// 打印工具
registerUtil(printUtil)
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
      'superAdmin': '超级管理员',
      'admin': '管理员',
      'test': '测试',
      'channel': '渠道',
      'user': '客户',
      'buyer-1': '注册买家',
      'buyer-3': '下款买家',
      'buyer-4': '回款买家',
      'buyer-5': '注册回款买家',
      'buyer-6': '注册下款买家',
      'buyer-7': '注册下款回款买家',
      'buyer-8': '回款下款买家'
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

Vue.prototype.formatUserSource = function(status) {
  if (status === 'xjd') {
    return '现金贷'
  } else if (status === 'dc') {
    return '贷超'
  } else {
    return '--'
  }
}

Vue.prototype.formatProductType = function(type) {
  if (type === 1) {
    return '现金贷'
  } else if (type === 2) {
    return '贷超'
  } else {
    return '--'
  }
}

Vue.prototype.formatPlatform = function(type) {
  if (type === 1) {
    return '甲方'
  } else if (type === 2) {
    return '乙方'
  } else {
    return '--'
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

Vue.prototype.formatIfContact = function(status) {
  if (status === true) {
    return 'success'
  } else if (status === false) {
    return 'info'
  } else {
    return 'danger'
  }
}

Vue.prototype.formatShiFouType = function(status) {
  if (status === true) {
    return 'success'
  } else if (status === false) {
    return 'info'
  } else {
    return 'danger'
  }
}

Vue.prototype.formatShiFou = function(status) {
  if (status === true) {
    return '是'
  } else if (status === false) {
    return '否'
  } else {
    return '-'
  }
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
