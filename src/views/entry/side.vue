<template>
  <div :class="{group: group}" class="a-w">
    <div class="s-w">
      <el-menu
        class="el-menu-vertical-demo"
        @select="handleOpen">
        <template v-for="(item) in list">
          <template v-if="item.childList && item.childList.length > 0">
            <el-submenu :index="item.id" :key="item.id">
              <template slot="title">
                <div style="font-weight: bold">
                  <i class="el-icon-folder" style="font-weight: bold"/>
                  <i class="el-icon-folder-opened" style="font-weight: bold"/>
                  <span>{{ item.note }}</span>
                </div>
              </template>
              <el-menu-item
                v-for="(subItem) in item.childList"
                :index="subItem.id"
                :key="subItem.id"
              >{{ subItem.note }}</el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.id" :key="item.id">
              <span slot="title">{{ item.note }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
    <div class="c-w">
      <detail :select="select" :list="list"/>
    </div>
  </div>
</template>
<script>
import Detail from './detail'
export default {
  components: {
    Detail
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    group: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: [0],
      select: ''
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      this.select = key
    }
  }
}
</script>
<style lang="scss" scoped>
  .c-c {
    padding: 0 20px;
  }
  .a-w {
    height: 100vh;
    display: flex;
    align-content: flex-start;
    .s-w {
      width: 200px;
      height: 100%;
      background-color: #fff;
      overflow-y: auto;
      overflow-x: hidden;
      /deep/ {
        .el-menu {
          height: 100%;
        }
        .el-icon-folder {
          display: inline-block;
        }
        .el-icon-folder-opened {
          display: none;
        }
        .is-opened {
          .el-icon-folder {
            display: none;
          }
          .el-icon-folder-opened {
            display: inline-block;
          }
        }
      }
    }
    .c-w {
      flex: 1;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    &.group {
      height: calc(100vh - 55px);
    }
  }
</style>
