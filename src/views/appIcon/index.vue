<template>
  <div class="errPage-container">
    <div>
      <el-button style="margin-left: 10px" type="primary" size="small" @click="printHandler">生成图片</el-button>
    </div>
    <div id="i-r-p" class="icon-w">
      <div class="svg-icon">
        <svg t="1624860791319" class="icon" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21733" width="446" height="446"><path d="M623.060697 522.189055c0 56.039801 45.850746 101.890547 101.890547 101.890547h297.010945v-203.781095h-297.010945c-56.039801 0-101.890547 45.850746-101.890547 101.890548z m144.175124 0c0 28.0199-22.925373 50.945274-50.945274 50.945273s-50.945274-22.925373-50.945273-50.945273 22.925373-50.945274 50.945273-50.945274 50.945274 22.925373 50.945274 50.945274z" fill="#ffffff" p-id="21734"/><path d="M695.912438 5.094527h-366.80597C149.269652 5.094527 3.056716 151.307463 3.056716 331.144279v366.80597c0 179.836816 146.212935 326.049751 326.049752 326.049751h366.80597c179.836816 0 326.049751-146.212935 326.049751-326.049751v-22.415921h-297.010945c-84.569154 0-152.835821-68.266667-152.835821-152.835821s68.266667-152.835821 152.835821-152.83582h297.010945V331.144279c0-180.346269-146.212935-326.049751-326.049751-326.049752zM291.916418 654.137313c0 12.736318-9.170149 23.434826-20.37811 23.434826h-40.756218c-11.20796 0-20.378109-10.189055-20.37811-23.434826V374.447761c0-12.736318 9.170149-23.434826 20.37811-23.434826h40.756218c11.20796 0 20.378109 10.189055 20.37811 23.434826v279.689552z" fill="#ffffff" p-id="21735"/></svg>
      </div>
      <div class="bottom-r"/>
      <div class="mt b-t">随借花</div>
    </div>
    <div v-if="imgUrl">
      <img :src="imgUrl" alt="" class="c-i">
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'AppIcon',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      imgUrl: ''
    }
  },
  methods: {
    printHandler() {
      this.$createImageUrl('i-r-p').then((url) => {
        this.imgUrl = url
      })
    },
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .icon-w{
   zoom: 0.5;
   position: relative;
   width: 1024px;
   height: 1024px;
   overflow: hidden;
   background-image: linear-gradient(to bottom right, red, yellow);
 }
  .bottom-r {
    position: absolute;
    margin: auto;
    left: -500px;
    width: 2000px;
    height: 2000px;
    top: 1024px * 0.66;
    border-radius: 100%;
    background-color: #fff;
  }
  .svg-icon {
    text-align: center;
    margin-top: 100px;
  }
  .b-t {
    position: absolute;
    width: 100%;
    bottom: 100px;
    text-align: center;
    font-size: 140px;
    letter-spacing: 1em;
    text-indent: 1em;
    color: rgb(255, 127, 0);
    font-weight: bolder;
  }
</style>
