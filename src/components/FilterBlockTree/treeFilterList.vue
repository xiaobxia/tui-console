<template>
  <div class="tree-filter-list">
    <!--    单选为列表，无限滚动-->
    <div v-if="type === 'single'" :style="{'max-height': listHeight}" class="single-content infinite-content">
      <ul
        v-infinite-scroll="loadMore"
        class="single-list"
        infinite-scroll-disabled="disabled"
      >
        <li
          v-for="(item, index) in dataList"
          :key="index"
          :class="[item.active ? 'active single-item' : 'single-item']"
          :title="item.encode ? `【${item.encode}】${ item.name }` : ` ${ item.name }`"
          @click="handleClickSingleNode(item, index)"
        >
          【{{ item.encode }}】{{ item.name }}
        </li>
      </ul>
      <p v-if="loading" style="text-align: center; color: #DCDFE6; padding: 5px 0; margin: 0">加载中...</p>
      <p v-if="noMore && !loading" style="text-align: center; color: #DCDFE6; padding: 5px 0; margin: 0">无更多数据</p>
    </div>
    <!--    多选为复选框组-->
    <div v-if="type === 'multiple'" :style="{'max-height': listHeight}" class="multiple-content infinite-content">
      <el-checkbox-group
        v-infinite-scroll="loadMore"
        v-model="currentList"
        class="multiple-list"
        infinite-scroll-disabled="disabled"
        @change="handleCheckMultipleNode">
        <el-checkbox
          v-for="(item, index) in dataList"
          :label="item.phid"
          :key="index"
          :title="item.encode ? `【${item.encode}】${ item.name }` : ` ${ item.name }`"
          class="multiple-item"
        >
          【{{ item.encode }}】{{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <p v-if="loading" style="text-align: center; color: #DCDFE6; padding: 5px 0; margin: 0">加载中...</p>
      <p v-if="noMore && !loading" style="text-align: center; color: #DCDFE6; padding: 5px 0; margin: 0">无更多数据</p>
    </div>
  </div>
</template>

<script>
// import { throttle } from '@/utils'

export default {
  name: 'TreeFilterList',
  props: {
    type: { // 类型 single单选， multiple多选
      type: String,
      default: 'single'
    },
    searchValue: { // 搜索关键词
      type: String,
      default: ''
    },
    checkedNode: { // 已单选节点
      type: Object,
      default: () => {
      }
    },
    checkedList: { // 已多选节点（对象，要转成idist）
      type: Array,
      default: () => []
    },
    isInDialog: { // 是否在弹窗内显示，这个参数好像没什么用
      type: Boolean,
      default: false
    },
    searchType: { // 1:登入用户有权限访问内的组织查询(部门列表左侧组织搜索、组织单元新增组织搜索，用户右上角组织搜索，用户新增组织定位搜索) 2.组织单元内包含的组织查询，必传组织单元id（组织单元修改查询，组织单元列表包含组织点开组织搜索）3.两个用户过滤查询，传入修改用户id（用户修改时组织搜索，用户角色授权时组织搜索）
      type: [String, Number],
      default: '1'
    },
    userId: { // 用户模块使用的被操作用户的phid
      type: [String, Number],
      default: ''
    },
    groupId: { // 组织单元模块使用的被操作用户的phid
      type: [String, Number],
      default: '-1'
    },
    listHeight: { // 高度必传否则会自动触发查询
      type: String,
      default: '300px'
    },
    disableKeyList: { // 禁用的节点（id的list）
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      current: 1,
      size: 20,
      total: 0,
      totalPage: 0,
      loading: false,
      dataList: [], // 数据源
      currentNode: {}, // 当前单选中的节点
      currentList: [], // 当前多选中的节点
      searchFn: () => {
      } // 节流函数
    }
  },
  computed: {
    noMore() {
      return this.dataList.length >= this.total
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    type: function(newVal) {
      if (newVal === 'single') {
        if (this.checkedNode.phid) {
          this.currentNode = this.checkedNode
        }
      } else {
        if (this.checkedList.length > 0) {
          this.currentList = this.checkedList
        }
      }
    },
    searchValue: function(newVal) {
      if (newVal.length > 0) {
        // this.searchFn()
        this.dataList = []
        this.total = 0
        this.current = 1
        this.getList()
      }
    }
  },
  created() {
  },
  mounted() {
    // const _this = this
    // this.searchFn = throttle(() => {
    //   _this.dataList = []
    //   _this.total = 0
    //   _this.current = 1
    //   _this.getList()
    // }, 1000)
    this.getList().then(() => {
      if (this.type === 'multiple' && this.checkedList.length > 0) {
        this.currentList = this.checkedList
      } else if (this.type === 'single') {
        this.dataList.forEach(item => {
          if (item.phid === this.checkedNode.phid) {
            item.active = true
          }
        })
      }
    })
  },
  methods: {
    // 获取数据
    getList() {
      this.loading = true
      return this.$http.post('ucenter/org/getOrgListBySearchName', {
        name: this.searchValue,
        current: this.current,
        size: this.size,
        type: this.searchType,
        userId: this.userId,
        groupId: this.groupId
      }).then(({ status, data, message }) => {
        if (status) {
          const list = data.records.map(item => {
            this.$set(item, 'active', false)
            return item
          })
          this.dataList = this.current === 1 ? list : [...this.dataList, ...list]
          this.total = data.total
        } else {
          this.$message.error(message)
        }
        this.loading = false
      }).catch(err => {
        console.log(err.message)
        this.loading = false
      })
    },
    // 加载更多
    loadMore() {
      if (!this.noMore) {
        this.current++
        this.getList()
      }
    },
    // 点击单选
    handleClickSingleNode(row, index) { // 单选回调传回的是对象
      this.currentNode = row
      this.dataList.forEach((item, Number) => {
        if (index === Number) {
          item.active = true
        } else {
          item.active = false
        }
      })

      this.$emit('hasBeenChecked', this.currentNode)
    },
    // 点击多选
    handleCheckMultipleNode(list) { // 多选回调传回的是对象数组
      this.currentList = list
      const backList = this.currentList.reduce((arr, item) => {
        const node = this.dataList.find(e => e.phid === item)
        arr.push({
          orgId: node.phid,
          orgName: node.name,
          orgCode: node.encode
        })
        return arr
      }, [])

      this.$emit('hasBeenChecked', backList)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.infinite-content {
  overflow-y: auto;
  padding: 0;
  margin: 0;
}

.multiple-item,
.single-item {
  padding: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #606266;
  font-weight: 400;
}

.multiple-list,
.single-list {
  padding: 0;
  margin: 0;
}
</style>
