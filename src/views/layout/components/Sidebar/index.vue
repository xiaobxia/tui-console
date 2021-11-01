<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      unique-opened
      mode="vertical"
    >
      <sidebar-item v-for="(route, index) in routers" :key="route.path + index" :item="route" :base-path="route.basePath" :is-collapse="isCollapse"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    routers() {
      const basePath = this.$route.matched[0].path
      const res = []
      this.permission_routers.forEach((v) => {
        if (!v.hidden && v.path && v.path === basePath) {
          v.children = v.children || []
          v.children.forEach((item) => {
            item.basePath = `${basePath}/${item.path}`
            res.push(item)
          })
        }
      })
      console.log('this.permission_routers', res)
      return res
    }
  }
}
</script>
