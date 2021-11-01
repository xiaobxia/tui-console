import Http from '@/utils/httpUtil'
import authUtil from '@/utils/authUtil'

const userInfo = authUtil.getUser()

const user = {
  state: {
    token: '',
    userInfo: userInfo
  },

  mutations: {
    SET_USER_INFO: (state, info) => {
      state.userInfo = {
        ...state.userInfo,
        ...info
      }
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const param = {
        platform: 'PC',
        account: userInfo.username.trim(),
        password: userInfo.password.trim()
      }
      return Http.post('tuiServer/admin/auth/login', {
        ...param
      }).then((res) => {
        const data = res.data || {}
        commit('SET_USER_INFO', data)
        authUtil.setUser(data)
        window._token = data.token
        authUtil.setToken(data.token)
      })
    },
    getUserInfo({ commit }, noAuth) {
      return Http.get('dataCenter/userLogin/findUserInfoByToken', {}).then((res) => {
        commit('SET_USER_INFO', res.data)
        authUtil.setUser(res.data)
        return res.data
      }).catch((err) => {
        console.log('err', err)
      })
    },
    operationLog({ commit }, info) {
      return Http.post('dataCenter/OperateLog/add', {
        'contentDetail': info.detail,
        'operationContent': info.content
      })
    }
  }
}

export default user
