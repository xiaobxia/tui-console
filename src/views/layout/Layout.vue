<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div class="main-container">
      <div class="sidebar-container">
        <div class="logo-wrap">
          <img src="../../assets/logo.jpg" alt="">
          <span>三六五生活</span>
        </div>
        <sidebar />
      </div>
      <div class="container-bottom">
        <navbar />
        <section class="app-main">
          <!--<div v-if="pageTitle" class="page-title">{{ pageTitle }}</div>-->
          <!--<tags-view/>-->
          <app-main />
        </section>
      </div>
    </div>
    <!--<div-->
    <!--v-loading.fullscreen.lock="!ifInit"-->
    <!--element-loading-text="数据载入中"-->
    <!--/>-->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import TagsView from './components/TagsView/index'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    return {
      ifInit: false,
      themeList: [], // 当前组织的主题列表
      orgThemeList: [] // 所有组织对应的激活主题
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    pageTitle() {
      return this.$route.meta.title || ''
    },
    key() {
      return this.$store.state.app.key
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
  },
  created() {
    console.log('layout created')
    this.$store.dispatch('setSideBar', true)
  },
  methods: {
    // 初始化前置数据
    async handleInitData() {
      this.refreshPage()
    },
    // 刷新界面
    refreshPage() {
      this.ifInit = false
      this.$nextTick(() => {
        this.ifInit = true
      })
    },
    // 菜单栏状态
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/mixin.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  // height: 100%;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-container {
  min-height: 100%;
  transition: margin-left .28s;
}

.container-bottom {
  transition: margin-left 0.28s;
  position: relative;
  min-height: 100vh;
  top: 0;
  .app-main {
    position: relative;
    padding: 10px 15px;
    overflow-y: scroll;
    padding-top: 62px;
    height: 100vh;
  }
}
  .logo-wrap {
    padding: 0 10px;
    height: 52px;
    font-size: 18px;
    line-height: 52px;
    img {
      vertical-align: top;
      height: 52px;
    }
  }
  .hideSidebar {
    .logo-wrap {
      padding: 0 4px;
      span {
        display: none;
      }
    }
  }
  .page-title {
    font-size: 20px;
    font-weight: 600;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
  }
</style>
