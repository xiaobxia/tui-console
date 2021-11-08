import Http from '@/utils/httpUtil'

const common = {
  state: {
    platformList: [],
    channelList: [],
    productList: []
  },
  mutations: {
    SET_platformList: (state, list) => {
      state.platformList = list
    },
    SET_channelList: (state, list) => {
      state.channelList = list
    },
    SET_productList: (state, list) => {
      state.productList = list
    }
  },
  actions: {
    // 平台列表
    initPlatformList({ commit }, query) {
      return Http.get('tuiServer/admin/platform/getPlatformsAll', { ...query }).then(res => {
        commit('SET_platformList', res.data)
        return res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    // 渠道列表
    initChannelList({ commit }, query) {
      return Http.get('tuiServer/admin/channel/getChannelsAll', { ...query }).then(res => {
        commit('SET_channelList', res.data)
        return res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    // 产品列表
    initProductList({ commit }, query) {
      return Http.get('tuiServer/admin/product/getProductsAll', { ...query }).then(res => {
        commit('SET_productList', res.data)
        return res.data
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}

export default common
