<template>
  <div class="login-container">
    <img src="../../assets/login-bg.png" alt="" class="login-bg">
    <div class="login-wrap">
      <div class="left-img">
        <img src="../../assets/login-left.png" alt="">
      </div>
      <div class="form-wrap">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <div class="title-img">
            <span>三六五生活服务平台</span>
          </div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user" class="login-input" placeholder="请输入账号"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" class="login-input" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <div>
            <el-button :loading="loading" class="login-btn" type="primary" @click="handleLogin">登 &nbsp;&nbsp;&nbsp; 录</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="copy-right">
      <div style="margin-bottom: 12px">版权所有 © 三六五集团公司</div>
      <div>浙ICP证150175号</div>
    </div>
  </div>
</template>

<script>
import DES from '@/lib/DES'
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
        password: DES.encrypt(this.loginForm.password)
      }
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.getParams()).then(() => {
            return this.$store.dispatch('getUserInfo').then((data) => {
              this.$router.replace({
                path: '/home'
              })
              this.loading = false
              // 侧边菜单打开
              this.$store.dispatch('setSideBar', true)
            })
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
   position: relative;
   height: 100vh;
   min-height: 645px;
   .login-bg {
     z-index: -1;
     position: absolute;
     bottom: 0;
     width: 100%;
     min-height: 100%;
   }
 }
 .b-i {
   border-top: none;
   border-left: none;
   border-right: none;
 }
 .login-wrap {
   position: absolute;
   left: 0;
   right: 0;
   top: 0;
   bottom: 0;
   margin: auto;
   width: 850px;
   height: 432px;
   background-color: #fff;
   border-radius:10px;
   box-shadow: 0 0 5px rgba(0,0,0,0.2);
   padding: 45px;
   .left-img {
     vertical-align: top;
     display: inline-block;
     width: 380px;
     height: 340px;
     img {
       width: 100%;
       height: 100%;
     }
   }
   .form-wrap {
     vertical-align: top;
     display: inline-block;
     width: 310px;
     height: 340px;
     margin-left: 55px;
   }
   .label {
     color: #484848;
     i {
       font-size: 26px;
       vertical-align: middle;
     }
     span{
       font-size: 18px;
       vertical-align: middle;
       margin-left: 5px;
     }
   }
 }
 .login-btn {
   margin-top: 20px;
   width:310px;
   height:48px;
   background:rgba(1,153,255,1);
   box-shadow:0 4px 6px 0 rgba(0,166,255,0.3);
   border-radius:27px;
   font-size: 18px;
 }
  .copy-right {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #FFF;
  }
  .title-img {
    margin: 30px 0;
    font-size: 20px;
    color: #0199ff;
    font-weight: 600;
    text-align: center;
    img {
      width: 30px;
    }
  }
</style>
