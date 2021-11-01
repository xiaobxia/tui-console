<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d' ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
import themeUtil from '@/utils/themeUtil'

export default {
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ''
    }
  },
  computed: {
  },
  watch: {
    async theme(val) {
      this.chalk = themeUtil.changeTheme(val, this.chalk)
    }
  },

  methods: {
  }
}
</script>

<style>
  .theme-message,
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }

  .theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }

  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>
