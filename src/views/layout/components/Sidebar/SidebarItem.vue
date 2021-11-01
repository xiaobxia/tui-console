<template>
  <div
    v-if="!item.hidden&&item.children"
    class="menu-wrapper">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <i
            v-if="onlyOneChild.meta"
            :class="onlyOneChild.meta.icon||item.meta.icon"
            class="m-i"/>
          <span v-if="onlyOneChild.meta" slot="title">{{ onlyOneChild.meta.title }}</span>
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="submenu" :index="resolvePath(item.path)">
      <template slot="title">
        <i v-if="item.meta" :class="item.meta.icon" class="m-i"/>
        <span v-if="item.meta && !isCollapse">{{ item.meta.title }}</span>
      </template>
      <el-menu-item-group>
        <span v-if="isCollapse" slot="title" class="groupTitle">{{ item.meta.title }}</span>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            v-if="child.children&&child.children.length>0"
            :is-nest="true"
            :item="child"
            :key="child.path"
            :base-path="resolvePath(child.path)"
            class="nest-menu"/>
          <app-link v-if="(!child.children || child.children.length === 0 )" :to="resolvePath(child.path)" :key="child.name">
            <el-menu-item :index="resolvePath(child.path)">
              <i v-if="child.meta" :class="child.meta.icon" class="m-i"/>
              <span v-if="child.meta" slot="title">{{ child.meta.title }}</span>
            </el-menu-item>
          </app-link>
        </template>
      </el-menu-item-group>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  computed: {
  },
  methods: {
    hasOneShowingChild(children, parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          onlyOneChild = item
          return true
        }
      })
      if (onlyOneChild) {
        this.onlyOneChild = onlyOneChild
      }
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .m-i {
    margin-right: 5px;
  }
</style>
