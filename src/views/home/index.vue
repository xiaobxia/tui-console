<template>
  <div
    class="home-container"
  >
    <div class="top-wrap">
      <img
        src="../../assets/home-bg.png"
        alt=""
        class="a-bg"
      >
      <div class="main-title">三六五生活服务平台</div>
      <div class="right-top clearfix">
        <div
          class="top-item"
          @click="userChange"
        >
          <i class="st-icon-yhgl"/>
          <span>退出登录</span>
        </div>
      </div>
    </div>
    <div class="bottom-wrap">
      <div class="card-list">
        <div
          class="card-item"
          @click="toEntry('/userCenter')"
        >
          <i class="st-icon-yhzx module-icon"/>
          <div class="text module-text">用户中心</div>
        </div>
        <div
          class="card-item"
          @click="toPath('/accountBook/index')"
        >
          <i class="st-icon-sjck module-icon"/>
          <div class="text module-text">数据仓库</div>
        </div>
        <div
          class="card-item"
          @click="toPath('/accountBook/index')"
        >
          <i class="st-icon-yxpt module-icon"/>
          <div class="text module-text">营销平台</div>
        </div>
        <div
          class="card-item"
          @click="toPath('/accountBook/index')"
        >
          <i class="st-icon-sjdp module-icon"/>
          <div class="text module-text">数据大屏</div>
        </div>
      </div>
      <div class="copy-right">
        <div style="margin-bottom: 12px">版权所有 © 三六五集团公司</div>
        <div>浙ICP证150175号</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import authUtil from '@/utils/authUtil'

export default {
  name: 'Home',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    toEntry(basePath) {
      this.$store.dispatch('getEntryByBasePath', basePath).then((route) => {
        if (route) {
          this.$router.push({
            name: route.name
          })
        } else {
          this.$message({
            type: 'error',
            message: '您没有该模块权限！'
          })
        }
      })
    },
    toPath(path) {
      if (this.userInfo.uid) {
        this.$router.push({
          path
        })
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    },
    userChange() {
      authUtil.removeUser()
      window.location.reload()
    },
    toUserCenter() {
    }
  }
}
</script>

<style lang="scss" scoped>
.top-wrap {
  position: relative;
  height: 65vh;
  min-height: 335px;
  overflow: hidden;
  .a-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: auto;
    min-height: 100%;
    z-index: -1;
  }
  .main-title {
    font-size: 65px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 91px;
    text-shadow: 0 3px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
    margin-top: 110px;
  }
}
.bottom-wrap {
  position: relative;
  height: 35vh;
  min-height: 225px;
  .copy-right {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    font-size: 16px;
  }
}
.card-list {
  position: absolute;
  width: 100%;
  margin: auto;
  top: 0;
  bottom: 0;
  height: 160px;
  text-align: center;
  .card-item {
    display: inline-block;
    width: 94px;
    cursor: pointer;
    margin-right: 160px;
    transition: all .3s;
    &:hover{
      transform:scale(1.1);
    }
    .module-icon {
      font-size: 56px;
    }
    &:last-child {
      margin-right: 0;
    }
    img {
      width: 94px;
      height: 94px;
    }
    .text {
      margin-top: 15px;
      font-size: 20px;
    }
  }
}
.right-top {
  position: absolute;
  top: 40px;
  right: 40px;
  .top-item {
    line-height: 24px;
    cursor: pointer;
    display: inline-block;
    margin-left: 30px;
    color: #fff;
    font-size: 18px;
    span {
      margin-left: 5px;
    }
    i, span {
    }
  }
}
</style>
