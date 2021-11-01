<template>
  <div v-loading="treeLoading" class="filter-block-tree" element-loading-text="数据载入中">
    <el-input
      v-model="filterSearch"
      size="small"
      clearable
      placeholder="输入编码或名称搜索"
      prefix-icon="el-icon-search"
      style="margin-bottom: 10px"
      @click="(e) => {e.stopPropagation()}"/>
    <el-tree
      v-show="!filterSearch || filterSearch.length === 0"
      ref="orgTree"
      :data="treeList"
      :props="defaultProps"
      :load="handleLoadNode"
      :show-checkbox="showCheckBox"
      :check-strictly="checkStrictly"
      :style="{'height': treeHeight, 'overflow-y': 'auto'}"
      :expand-on-click-node="expandOnClickNode"
      :highlight-current="filterType === 'single'"
      :check-on-click-node="false"
      :current-node-key="currentTreeCheckedId"
      :default-checked-keys="currentTreeCheckedIdList"
      lazy
      node-key="phid"
      @node-click="handleNodeClick"
      @check="handleNodeCheck"
    >
      <!--      <el-tooltip-->
      <!--        slot-scope="{ node, data }"-->
      <!--        :content="data.encode ? `【${data.encode}】${ node.label }` : ` ${ node.label }`"-->
      <!--        class="item"-->
      <!--        effect="dark"-->
      <!--        placement="right-bottom"-->
      <!--      >-->
      <span slot-scope="{ node, data }" :title="data.encode ? `【${data.encode}】${ node.label }` : ` ${ node.label }`" class="custom-tree-node" >
        <span class="main-text">{{ data.encode ? `【${data.encode}】` : '' }}{{ node.label }}</span>
      </span>
      <!--      </el-tooltip>-->
    </el-tree>
    <tree-filter-list
      v-if="filterSearch && filterSearch.length > 0"
      ref="TreeFilterList"
      :search-value="filterSearch"
      :search-type="searchType"
      :user-id="userId"
      :group-id="groupId"
      :type="filterType"
      :checked-node="currentTreeCheckedNode"
      :disable-key-list="disableKeyList"
      :checked-list="checkedNodeForSearchList"
      :list-height="treeHeight"
      :style="{'height': treeHeight}"
      @hasBeenChecked="filterCallBack"
    />
  </div>
</template>

<script>
import TreeFilterList from './treeFilterList'

export default {
  name: 'FilterBlockTree',
  components: {
    TreeFilterList
  },
  props: {
    hasCallback: { // 是否有回调函数（判断用于查看或用于表单）
      type: Boolean,
      default: false
    },
    currentNode: { // 当前单选中的节点
      type: Object,
      default: () => {
      }
    },
    currentNodeId: { // 当前单选中的id
      type: String,
      default: ''
    },
    currentNodeList: { // 当前多选中的节点
      type: Array,
      default: () => []
    },
    disableKeyList: { // 禁用的节点（id的list）
      type: Array,
      default: () => []
    },
    showCheckBox: { // 是否显示多选框
      type: Boolean,
      default: false
    },
    checkStrictly: { // 父子是否关联
      type: Boolean,
      default: false
    },
    expandOnClickNode: { // 点击节点展开？
      type: Boolean,
      default: false
    },
    hasBackShow: { // 多选时是否有回显（用于编辑）废弃
      type: Boolean,
      default: true
    },
    treeHeight: {
      type: String,
      default: '300px'
    },
    searchType: { // 模糊搜索的类型值 // 1:登入用户有权限访问内的组织查询(部门列表左侧组织搜索、组织单元新增组织搜索，用户右上角组织搜索，用户新增组织定位搜索) 2.组织单元内包含的组织查询，必传组织单元id（组织单元修改查询，组织单元列表包含组织点开组织搜索）3.两个用户过滤查询，传入修改用户id（用户修改时组织搜索，用户角色授权时组织搜索）
      type: [String, Number],
      default: '1'
    },
    treeFirstType: { // 树形查一级数据的场景值（1:新增 2：修改 3：角色授权）
      type: [String, Number],
      default: ''
    },
    filterType: { // 关键字过滤查询时是单选还是多选
      type: String,
      default: 'single'
    },
    firstUrl: { // 关键字过滤查询时是单选还是多选
      type: String,
      default: 'ucenter/org/getNowUserFirstOrg'
    },
    userId: { // 用户模块使用的被操作用户的phid
      type: [String, Number],
      default: ''
    },
    groupId: { // 用户模块使用的被操作用户的phid
      type: [String, Number],
      default: '-1'
    },
    hasFirstData: { // 是否有现成的一级数据，不需要请求一级树接口
      type: Boolean,
      default: false
    },
    firstLevelData: { // 传进来的一级树
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      treeLoading: false,
      filterSearch: '',
      treeList: [], // 树数据
      allTreeList: [], // 全部数据，用于匹配半选
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'end'
      },
      currentTreeCheckedId: '', // 当前单选中项id(编辑)
      currentTreeCheckedNode: {}, // 当前单选中节点(编辑)
      currentTreeCheckedIdList: [], // 当前多选中项id(编辑)
      currentTreeCheckedNodeList: [], // 当前多选中的节点(编辑)
      checkedNodeForSearchList: [] // 当前树选中的节点(用于模糊查询列表值的选中)
    }
  },
  watch: {
    // currentTreeCheckedNode: {
    //   deep: true,
    //   handler: function(newVal) {
    //     if (this.filterType === 'multiple') {
    //       if (newVal && newVal.phid) {
    //         this.currentTreeCheckedNode = this.currentNode
    //         this.currentTreeCheckedId = this.currentNodeId
    //       } else {
    //         this.currentTreeCheckedNode = {}
    //         this.currentTreeCheckedId = ''
    //       }
    //     }
    //   }
    // },
    currentNodeList: function(newVal) {
      this.currentTreeCheckedNodeList = newVal
    },
    filterSearch: function(newVal) {
      if (newVal && newVal.length > 0) {
        this.checkedNodeForSearchList = [...this.currentTreeCheckedIdList, ...this.$refs.orgTree.getCheckedKeys()]
      }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      if (this.filterType === 'multiple') {
        this.currentTreeCheckedIdList = this.currentNodeList.length ? this.currentNodeList.map(item => item.phid) : []
        this.currentTreeCheckedNodeList = this.currentNodeList
      } else {
        this.currentTreeCheckedId = this.currentNodeId
        this.currentTreeCheckedNode = this.currentNode && Object.values(this.currentNode).length ? this.currentNode : {}
      }
    })
  },
  methods: {
    // 树一级数据加载
    handleLoadNode(node, resolve) {
      if (node.level === 0) {
        this.treeLoading = true
        if (this.hasFirstData) { // 外层有传一级数据进来
          resolve(this.firstLevelData)
          this.$nextTick(() => {
            this.$refs.orgTree.setCurrentKey(this.currentNodeId)
          })
          this.treeLoading = false
        } else {
          // 1、用户查组织增改及授权查一级组织要传userId和type(1:新增 2：修改 3：角色授权)，使用post请求
          // 2、组织单元查一级组织，要传groupId和type(1:新增 2：修改)，使用post请求
          // 3、获取当前用户的一级组织，不需要传参，使用get请求
          // wjb写的接口
          const methods = this.treeFirstType
            ? this.$http.post(this.firstUrl, {
              userId: this.userId,
              type: this.treeFirstType,
              groupId: this.groupId
            })
            : this.groupId
              ? this.$http.get(this.firstUrl, { groupId: this.groupId })
              : this.$http.get(this.firstUrl)
          methods.then(({ status, data, message }) => {
            if (status) {
              this.treeList = data.map(item => {
                item.end = !!item.end
                if (this.disableKeyList.length > 0) {
                  this.$set(item, 'disabled', this.disableKeyList.includes(item.phid))
                }
                return item
              })
              this.allTreeList = [...this.treeList]
              resolve(this.treeList)
              this.$nextTick(() => {
                this.handleDefaultCheckedOrg()
                if (this.filterType === 'single') {
                  // 单选时如果有选中值则在树渲染后选中，无则选中第一个
                  this.currentTreeCheckedNode = this.currentNodeId ? this.currentNode : this.treeList[0]
                  this.handleNodeClick(this.currentTreeCheckedNode, null, true)
                }
              })
              this.treeLoading = false
            } else {
              this.$message.error(message)
            }
          })
        }
      } else {
        this.$http.get('ucenter/org/getOrgByParentId', { parentId: node.data.phid }).then(({ status, data, message }) => {
          if (status) {
            const list = data.map(item => {
              item.end = !!item.end
              if (this.disableKeyList.length > 0) {
                this.$set(item, 'disabled', this.disableKeyList.includes(item.phid))
              }
              return item
            })
            this.allTreeList = [...this.allTreeList, ...list]
            resolve(list)
            this.$nextTick(() => {
              this.handleDefaultCheckedOrg()
              if (this.filterType === 'single') {
                // 单选时当选中值不在第一级时，每次加载子级数据的时候找一遍去选中
                this.handleNodeClick(this.currentTreeCheckedNode, null, true)
              }
            })
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    // 编辑时默认勾选的组织
    handleDefaultCheckedOrg(defaultList) {
      this.$nextTick(() => {
        let list = []
        if (defaultList && defaultList.length > 0) {
          list = [...this.currentTreeCheckedNodeList, ...defaultList]
        } else {
          list = [...this.currentTreeCheckedNodeList]
        }
        this.currentTreeCheckedIdList = list.map(item => {
          if (!item.orgId) {
            this.findOrgNodeToHalfCheck(item)
          }
          return item.orgId
        })
      })
    },
    // 半选节点
    findOrgNodeToHalfCheck(node) {
      const nodeId = this.allTreeList.filter(item => item.encode === node.orgCode).length ? this.allTreeList.filter(item => item.encode === node.orgCode)[0].phid : '' // 获取半选节点的数据拿到phid
      const treeNode = nodeId ? this.$refs['orgTree'].getNode(nodeId) : '' // 获取树中的节点
      if (treeNode) { // 此处应判断当前节点的checked属性是否为true，是则不必半选
        treeNode.indeterminate = true
      }
    },
    // 改变当前选中节点 (当前节点的数据，当前节点的 Node 对象) 只有单选才有改变当前选中节点的回调
    handleNodeClick(data, node, doNotEmit) {
      if (this.filterType === 'single') {
        this.$refs.orgTree.setCurrentKey()
        // 选中回调 先置空再重新选中，防止选中值在树里还未渲染，每次加载子数据的时候执行一遍
        this.currentTreeCheckedNode = data
        this.currentTreeCheckedId = this.currentTreeCheckedNode.phid
        this.$refs.orgTree && this.$refs.orgTree.setCurrentKey(this.currentTreeCheckedId)
        doNotEmit !== true && this.$emit('handleNodeClick', data)
      }
    },
    // 多选回调 (传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点)
    handleNodeCheck(node, checkInfo, listBySearch) {
      const checkedList = checkInfo ? checkInfo.checkedNodes : [] // 树里有的
      let list = []
      if (listBySearch && listBySearch.length > 0) {
        list = [...this.currentTreeCheckedNodeList, ...listBySearch]
      } else {
        list = [...this.currentTreeCheckedNodeList]
      }
      const backList = list.map(item => { // 树里没有的
        return {
          phid: item.orgId,
          name: item.orgName,
          encode: item.orgCode
        }
      })
      // 参数： 当前节点，当前树的选中和半选状态，将当前选中节点和搜索中选中节点合并后的数据（防止搜索中的节点在树中没有渲染）
      this.$emit('handleNodeCheck', { node: node, checkInfo: checkInfo, newList: [...checkedList, ...backList] })
    },
    // 搜索状态的回调
    filterCallBack(backData) {
      if (this.filterType === 'single') { // 单选返回对象
        this.currentTreeCheckedNode = backData
        this.handleNodeClick(this.currentTreeCheckedNode)
      } else { // 多选返回数组
        // 将在搜索状态下选中的节点回选到树
        this.handleDefaultCheckedOrg(backData)
        // 构造在搜索状态下选中节点的返回值
        this.handleNodeCheck(null, null, backData)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-tree-node {
  width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .main-text {
    display: inline-block;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 20px);
    font-size: 14px;
    line-height: 30px;
  }
}

.filter-block-tree {
  /deep/ .el-tree-node:not(.is-current) {
    &:focus {
      > /deep/ .el-tree-node__content {
        background: transparent !important;
      }
    }
  }
}
</style>
