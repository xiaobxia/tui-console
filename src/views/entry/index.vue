<template>
  <div v-loading="true" class="entry"/>
</template>

<script>
export default {
  name: 'Entry',
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
    const userRoutes = this.$router.getRoutes()
    console.log('userRoutes', userRoutes)
    this.$router.replace({
      name: 'UserList'
    })
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .entry {
    width: 100vw;
    height: 100vh;
  }
</style>
