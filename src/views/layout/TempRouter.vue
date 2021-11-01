<template>
  <keep-alive :include="includeNames">
    <router-view :key="key"/>
  </keep-alive>
</template>

<script>
export default {
  name: 'TempRouter',
  components: {
  },
  computed: {
    key() {
      return this.$route.fullPath
    },
    includeNames() {
      // const visitedViews = this.$store.getters.visitedViews || []
      // return visitedViews.map((item) => {
      //   return item.name
      // })
      return []
    }
  }
}
</script>

<style scoped>
</style>

