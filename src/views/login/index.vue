<template>
  <div class="login-container">
    <div class="navbar">
      <div class="right-wrap">
        <div class="right-item">
          <a href="https://www.3tgroup.cn/index.html" target="_blank">官网首页</a>
        </div>
        <div class="right-item">
          <a
            target="_blank"
            class="btn btn-sm btn-primary btn-emphasis"
            href="http://app.3tlife.cn/3t-wechat/web/wechat/share/download"
          >下载应用</a>
        </div>
      </div>
      <div class="logo-wrap">
        <img src="../../assets/logo.jpg" alt="">
        <span>三六五生活</span>
      </div>
    </div>
    <div class="login-wrap">
      <el-row>
        <el-col :span="12">
          <div class="login-l-img">
            <img src="../../assets/login-l.jpg" alt="">
          </div>
        </el-col>
        <el-col :span="12">
          <div class="form-wrap">
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
              label-position="left"
            >
              <div class="title-img">
                <span>品质生活,全程管家</span>
              </div>
              <div class="sub-text">
                欢迎来到三六五生活服务平台，请登录！
              </div>
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入账号"/>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
              </el-form-item>
              <div>
                <el-button :loading="loading" class="login-btn" type="primary" @click="handleLogin">登 &nbsp;&nbsp;&nbsp; 录</el-button>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="copy-right">
      <div>版权所有 © 三六五集团公司 浙ICP证150175号</div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '账号不能为空！' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
  },
  created() {
    // 清除所有缓存
    sessionStorage.clear()
    localStorage.clear()
  },
  mounted() {
  },
  destroyed() { },
  methods: {
    getParams() {
      return {
        username: this.loginForm.username,
        password: md5(this.loginForm.password)
      }
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.getParams()).then(() => {
            this.$router.replace({
              name: 'UserCenterUserList'
            })
            this.loading = false
            // 侧边菜单打开
            this.$store.dispatch('setSideBar', true)
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background-color: #fff;
  }
  .navbar {
    color: #5E6166;
    border-bottom: 1px solid #E6E9F0;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .04);
    z-index: 1;
    height: 56px;
    line-height: 56px;
    background-color: #fff;
    padding: 0 24px;
    .logo-wrap {
      height: 56px;
      font-size: 18px;
      img {
        height: 55px;
      }
      span {
        vertical-align: top;
      }
    }
  }
  .copy-right {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 25px 10px 25px 10px;
    color: #8F9BB2;
    text-align: center;
  }
  .right-wrap {
    color: #7A8599;
    float: right!important;
    .right-item {
      display: inline-block;
      a {
        padding: 0 15px;
      }
      .btn {
        display: block;
        margin: 12px 24px 12px 18px;
        padding: 5px 16px;
        border: none;
        font-size: 14px;
        line-height: 22px;
        color: #FFF;
        border-radius: 2px;
        background: linear-gradient(270deg, rgba(82, 114, 244, 1) 0%, rgba(0, 170, 231, 1) 100%) rgba(0, 170, 231, .31);
        background-color: rgba(0, 170, 231, .31)!important;
        background-blend-mode: saturation;
      }
    }
  }
  .login-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 1024px;
    height: 560px;
    background-color: #fff;
    border: 1px solid #EEE;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, .08);
    text-align: center;
    .login-l-img {
      position: relative;
      overflow: hidden;
      height: 560px;
      img {
        position: relative;
        left: -50px;
        height: 100%;
      }
    }
    .form-wrap {
      margin: 0 56px;
    }
    .title-img {
      margin-top: 92px;
      color: $original-theme;
      font-size: 32px;
      font-weight: 400;
      text-align: center;
      line-height: 48px;
    }
    .sub-text {
      margin-top: 12px;
      margin-bottom: 64px;
      color: #999;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      line-height: 22px;
    }
    .login-btn {
      width: 100%;
      margin-top: 8px;
      padding: 8px 0;
      border: none;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #FFF;
      border-radius: 2px;
      background: linear-gradient(270deg, rgba(82, 114, 244, 1) 0%, rgba(0, 170, 231, 1) 100%) rgba(0, 170, 231, .31);
      background-color: rgba(0, 170, 231, .31);
      background-blend-mode: saturation;
      border-color: rgba(25, 137, 250, .4);
    }
  }
</style>
