<template>
  <div v-if="check" id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  data() {
    return {
      check: false
    }
  },
  created() {
    this.checkUser()
  },
  methods: {
    checkUser() {
      this.$store.dispatch('checkUser').then((res) => {
        console.log(res)
        this.check = true
        if (!(res.success && res.data.isLogin === true)) {
          this.$router.replace({
            path: 'login'
          })
        }
      })
    }
  }
}
</script>
