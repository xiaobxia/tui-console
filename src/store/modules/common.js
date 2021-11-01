import Http from '@/utils/httpUtil'

const common = {
  state: {
    rulesList: []
  },
  mutations: {
    SET_rulesList: (state, list) => {
      state.rulesList = list
    }
  },
  actions: {
    // 权限列表
    initRulesList({ commit }, query) {
      return Http.get('dataCenter/role/findByCondition', { ...query }).then(res => {
        commit('SET_rulesList', res.data)
        return res.data
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}

export default common
