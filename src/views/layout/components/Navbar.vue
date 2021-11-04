<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="item in matchRoutes"
        :key="item"
      >{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="right-menu">
      <el-dropdown @command="userChange">
        <span class="el-dropdown-link right-item">
          <span>
            <i class="el-icon-user" style="margin-right: 5px"/>
            <span>{{ userInfo.name }}</span>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item command="changeCloth">换肤</el-dropdown-item>-->
          <el-dropdown-item command="fullPage">
            <i class="st-icon-fullscreen"/>
            <span>{{ isFullscreen ? '退出全屏' : '显示全屏' }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="editPwd">
            <i class="st-icon-resetPassword"/>
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item command="out">
            <i class="st-icon-logout"/>
            <span>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <edit-pwd ref="editPwd"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import screenfull from 'screenfull'
import authUtil from '@/utils/authUtil'
import EditPwd from '@/businessComponents/EditPwd'

export default {
  components: {
    Hamburger,
    EditPwd
  },
  data() {
    return {
      isFullscreen: screenfull.isFullscreen || false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ]),
    matchRoutes() {
      const list = []
      this.$route.matched.forEach((p) => {
        if (p.meta && p.meta.title) {
          list.push(p.meta.title)
        }
      })
      return list
    }
  },
  watch: {
  },
  created() {
    console.log('navbar created')
  },
  mounted() {
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    userChange(command) {
      if (command === 'out') {
        authUtil.removeUser()
        window.location.reload()
      } else if (command === 'fullPage') {
        screenfull.toggle().then(() => {
          this.isFullscreen = screenfull.isFullscreen
        })
      } else if (command === 'editPwd') {
        this.$refs.editPwd.open()
      } else if (command === 'changeCloth') {
        this.$router.push('/sysConfig/changeCloth')
      }
    },
    toPath(url) {
      this.$router.push({
        path: url
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 52px;
  z-index: 10;
  line-height: 52px;
  border-radius: 0 !important;
  background-size: cover;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);
  /deep/ {
    .el-breadcrumb {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .user-center{
    cursor: pointer;
    font-size: 14px;
    vertical-align: bottom;
    height: 52px;
    line-height: 52px;
    display: inline-block;
    padding: 0 12px;
    transition: all .3s;
    &:hover {
      background-color: rgba(0,0,0,.025);
    }
  }

  .hamburger-container {
    line-height: 52px;
    height: 52px;
    float: left;
    padding: 0 20px;
  }

  .breadcrumb-container {
    float: left;
  }

  .app-icon {
    height: 26px;
    vertical-align: middle;
  }

  .period {
    margin-left: 30px;
    font-size: 16px;
    vertical-align: middle;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    line-height: 52px;
    padding-right: 15px;
    &:focus {
      outline: none;
    }

    .right-item {
      cursor: pointer;
      height: 52px;
      line-height: 52px;
      display: inline-block;
      padding: 0 12px;
      transition: all .3s;
      &:hover {
        background-color: rgba(0,0,0,.025);
      }
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }

    .screenfull {
      height: 20px;
    }

    .international {
      vertical-align: top;
    }

    .theme-switch {
      vertical-align: 15px;
    }

    .avatar-container {
      height: 55px;
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.filter-content {
  margin-bottom: 15px;
}

.infinite-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
