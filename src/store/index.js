import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import common from './modules/common'
import tagsView from './modules/tagsView'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    user,
    common,
    tagsView
  },
  getters
})

export default store
