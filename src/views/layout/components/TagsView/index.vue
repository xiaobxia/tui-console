<template>
  <div
    id="tags-view-container"
    ref="tagView"
    class="tags-view-container"
  >
    <div class="tag-view-left">
      <i
        class="el-icon-d-arrow-left tab-tag"
        @click="toLeft"
    /></div>
    <div class="tag-view-right-left">
      <i
        class="el-icon-d-arrow-right tab-tag"
        @click="toRight"
    /></div>
    <div class="tag-view-right-right">
      <el-dropdown :hide-on-click="true" @command="handleClose">
        <span class="el-dropdown-link">
          <i class="el-icon-more-outline tab-tag"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="visitedViews.length === 1" command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
      >
        <span class="tab-title">{{ tag.title }}</span>
        <span
          v-if="!isAffix(tag) && !isDashBoard(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'

export default {
  name: 'TagsView',
  components: { ScrollPane },
  data() {
    return {
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routers
    }
  },
  watch: {
    $route() {
      // 添加标签栏
      this.addTags()
      // 高亮当前标签栏
      this.moveToCurrentTag()
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    isDashBoard(tag) {
      return tag.name === 'Dashboard' || tag.title === '首页'
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name, sysConfig } = this.$route
      // 账本内的路由才会添加
      if (name && !sysConfig) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      if (view.name !== 'Dashboard') {
        this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
      }
    },
    closeOthersTags() {
      // this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.addTags()
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        if (view.name === 'Dashboard') {
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    toLeft() {
      this.$refs.scrollPane.scrollHandler(true)
    },
    toRight() {
      this.$refs.scrollPane.scrollHandler(false)
    },
    handleClose(type) {
      if (type === 'other') {
        this.closeOthersTags()
      } else {
        this.closeAllTags(this.$route)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  position: relative;
  margin-bottom: 10px;
  height: 36px;
  width: 100%;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);
  padding: 0 65px 0 45px;

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      min-width: 80px;
      height: 24px;
      line-height: 24px;
      border-radius: 13px;
      color: #fff;
      font-size: 13px;
      margin-left: 5px;
      margin-top: 6px;
      margin-bottom: 6px;
      opacity: 0.5;
      padding: 0 24px 0 24px;
      text-align: center;
      transition: 0.3s ease all;

      .tab-title {
        display: inline-block;
      }

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        opacity: 1;
      }

      &:hover {
        transition: 0.3s ease all;
        opacity: 0.8;

        .el-icon-close {
          display: inline-block;
          transition: 0.3s ease all;
        }
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    &.active {
      .el-icon-close {
        display: block;
      }
    }

    .el-icon-close {
      display: none;
      width: 12px;
      height: 12px;
      font-size: 12px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      position: absolute;
      right: 5px;
      color: #fff;
      top: 6.5px;
      transition: 0.3s ease all;
    }
  }
}

.tag-view-left,
.tag-view-right-left,
.tag-view-right-right {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 10px;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
  }
}

.tag-view-left {
  left: 14px;
}

.tag-view-right-left {
  right: 38px;
}

.tag-view-right-right {
  right: 14px;
}
</style>
