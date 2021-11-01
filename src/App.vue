<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
export default{
  name: 'App',
  data() {
    return {
    }
  },
  created() {
    Vue.prototype.$commonQueryParam = {
    }
  },
  methods: {
  }
}
</script>
