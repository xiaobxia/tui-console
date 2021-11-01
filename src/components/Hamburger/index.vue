<template>
  <div>
    <i :class="{'el-icon-s-fold':isActive, 'el-icon-s-unfold': !isActive}" class="hamburger" @click="toggleClick"/>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  font-size: 24px;
  vertical-align: middle;
}
</style>
