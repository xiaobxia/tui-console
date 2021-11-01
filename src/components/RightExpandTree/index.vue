<template>
  <div class="zy-tree__content">
    <el-tooltip
      v-if="breadList.length"
      effect="light"
      placement="top"
      class="zy-tree__tooltip"
    >
      <div
        slot="content"
        class="zy-tree__tooltip-content"
      >
        <p class="zy-tree__selected-title">
          <span
            v-for="(item, index) in breadList"
            :key="index"
            class="zy-tree__selected-bread"
          >
            <span class="zy-tree__selected-item">{{ item.deptName || '' }}</span>
            <span
              v-if="index < breadList.length -1"
              class="zy-tree__selected-separator"
            >{{ separator }}</span>
          </span>
        </p>
      </div>
      <p class="zy-tree__selected-title">
        <span
          v-for="(item, index) in breadList"
          :key="index"
          class="zy-tree__selected-bread"
        >
          <span class="zy-tree__selected-item">{{ item.deptName || '' }}</span>
          <span
            v-if="index < breadList.length -1"
            class="zy-tree__selected-separator"
          >{{ separator }}</span>
        </span>
        <i
          v-if="clearable"
          class="zy-tree__selected-clearable el-icon-circle-close"
          @click="clear"
        />
      </p>
    </el-tooltip>
    <p v-else class="zy-tree__selected-title">
      <span
        v-for="(item, index) in breadList"
        :key="index"
        class="zy-tree__selected-bread"
      >
        <span class="zy-tree__selected-item">{{ item.deptName || '' }}</span>
        <span
          v-if="index < breadList.length -1"
          class="zy-tree__selected-separator"
        >{{ separator }}</span>
      </span>
      <i
        v-if="clearable"
        class="zy-tree__selected-clearable el-icon-circle-close"
        @click="clear"
      />
    </p>
    <el-input
      v-show="false"
      v-model="currentValue"
      class="zy-tree__value"
      size="small"
      placeholder="请选择组织"
    />
    <el-input
      v-model="filterText"
      class="zy-tree__filter"
      size="small"
      placeholder="输入关键字进行过滤"
    />
    <p class="zy-tree__tree-title">
      <span>人员档案</span>
      <span>/</span>
      <span>{{ orgInfo.name || '' }}</span>
    </p>
    <el-tree
      ref="rightExpandTree"
      :data="treeData"
      :props="props"
      :node-key="nodeKey"
      :expand-on-click-node="expandOnClickNode"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandKeys"
      :lazy="lazy"
      :load="load"
      :icon-class="iconClass"
      :filter-node-method="filterNode"
      :accordion="accordion"
      class="zy-tree__right-expand"
      highlight-current
      current-node-key
      @node-click="handleNodeClick"
    >
      <span
        slot-scope="{ node, data }"
        :ref="data.phid"
        class="zy-tree__custom"
      >
        <span
          :title="node.label"
          class="zy-tree__custom-text custom-tree-node"
        >{{ node.label }}</span>
        <span
          v-if="node.childNodes.length"
          class="zy-tree__custom-btn"
        >
          <el-button
            type="text"
            size="mini"
            class="zy-tree__expand-btn"
            @click.stop="() => handleToggleNode(data)"
          >
            <i
              :class="[iconClass]"
              class="iconfont"
            />
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import '@/styles/font/iconfont.css'
import { mapGetters } from 'vuex'
import Emitter from '@/mixins/emitter'
export default {
  name: 'RightExpandTree',
  mixins: [Emitter],
  model: {
    event: 'change'
  },
  props: {
    treeData: { // 树数据
      type: Array,
      default: () => []
    },
    props: { // 对应defaultProps
      type: Object,
      default: () => { }
    },
    selectedNode: { // 当前选中的节点
      type: Object,
      default: () => { }
    },
    selectFlagId: { // 目标数据的字段名
      type: String,
      default: ''
    },
    iconClass: { // 展开按钮的class
      type: String,
      default: ''
    },
    separator: { // 分隔符
      type: String,
      default: '/'
    },
    iconPosition: { // 按钮的位置
      type: String,
      default: 'right'
    },
    nodeKey: { // 获取节点的锚点字段
      type: String,
      default: ''
    },
    expandOnClickNode: { // 是否点击节点展开
      type: Boolean,
      default: false
    },
    accordion: { // 手风琴
      type: Boolean,
      default: false
    },
    lazy: { // 懒加载
      type: Boolean,
      default: false
    },
    defaultExpandAll: { // 是否默认展开全部
      type: Boolean,
      default: false
    },
    clearable: { // 是否可清除
      type: Boolean,
      default: true
    },
    showArrow: { // 是否显示左侧展开标识
      type: Boolean,
      default: true
    },
    load: { // 懒加载时调用的方法
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      filterText: '',
      currentValue: '', // 当前值
      selectDepart: {}, // 选中的部门
      flatDepartTree: [], // 拉平后的部门树
      defaultExpandKeys: [], // 展开的节点
      rootNodeList: [], // 当前节点的根节点
      breadList: [] // 选中的拉平后的部门的列表，按层级排列
    }
  },
  computed: {
    ...mapGetters([
      'orgInfo'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.rightExpandTree.filter(val)
    },
    'treeData': {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.flatTree(newVal)
        if (this.selectedNode[this.selectFlagId]) {
          this.init()
        }
      }
    }
  },
  created() {
    console.log(this.selectedNode)
  },
  mounted() { },
  methods: {
    // 编辑时初始化数据
    init() {
      this.selectDepart = { ...this.selectedNode }
      this.defaultExpandKeys = [this.selectedNode[this.selectFlagId]]
      this.$nextTick(() => {
        this.$refs.rightExpandTree.setCurrentKey(this.selectedNode[this.selectFlagId])
      })
      this.setSelectedName(this.selectedNode, 'init')
    },
    // 检索节点
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].indexOf(value) !== -1
    },
    // 选择节点
    handleNodeClick(data) {
      this.selectDepart = { ...data }
      this.breadList = [{ ...data }]
      this.setSelectedName(data)
      this.currentValue = this.selectDepart.phid
      this.$emit('change', this.currentValue)
      this.dispatch('ElFormItem', 'el.form.change', [this.currentValue])
      this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue])
    },
    // 清空选中
    clear() {
      this.selectDepart = {}
      this.breadList = []
      this.currentValue = ''
      this.$emit('change', '')
    },
    // 拉平
    flatTree(tree) {
      tree.forEach(item => {
        this.flatDepartTree.push(item)
        item.children && item.children.length > 0 && this.flatTree(item.children)
      })
    },
    // 构造层级结构
    setSelectedName(breadNode, type) {
      if (this.flatDepartTree.length && type) {
        this.flatDepartTree.forEach(item => {
          item.phid === this.selectedNode[this.selectFlagId] && (breadNode = {
            ...breadNode,
            ...item
          })
        })
        this.breadList = [{ ...breadNode }]
      }
      if (this.flatDepartTree.length && +breadNode.parentId !== 0) {
        this.flatDepartTree.forEach(item => {
          item.phid === breadNode.parentId && (this.breadList = [
            { ...item },
            ...this.breadList
          ]
          )
        })
        this.setSelectedName(this.breadList[0])
      } else {
        return false
      }
    },
    // 展开节点
    handleToggleNode({ ...data }) {
      const currentNode = this.$refs[data.phid]
      const expandNode = currentNode.parentNode.children[0]
      expandNode.click()
    },
    // 获得根节点
    getRootNode(node) {
      if ((node.data.phid) && this.$refs.rightExpandTree.getNode(node.data.phid).parent) {
        this.getRootNode(this.$refs.rightExpandTree.getNode(node.data.phid).parent)
      } else {
        this.rootNodeList = node.childNodes
        console.log(this.rootNodeList)
      }
    }
  }
}
</script>

<style lang="scss">
.zy-tree__tooltip-content {
  .zy-tree__selected-title {
    margin: 0;
    .zy-tree__selected-bread {
      margin: 0;
      display: inline-block;
      font-size: 12px;
      cursor: default;
      .zy-tree__selected-separator {
        margin: 0 5px;
      }
    }
  }
}
.zy-tree__content {
  width: 300px;
  border: 1px solid #DCDFE6;
  padding: 0 10px;
  height: 350px;
  overflow: hidden;
  .zy-tree__selected-title {
    margin: 0 0 10px 0;
    border-bottom: 1px solid #DCDFE6;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 30px;
    position: relative;
    z-index: 10;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    transition: 0.3s ease all;
    .zy-tree__selected-bread {
      margin: 0;
      // display: inline-block;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      cursor: default;
      .zy-tree__selected-separator {
        margin: 0 5px;
      }
    }
    .zy-tree__selected-clearable {
      font-size: 16px;
      position: absolute;
      z-index: 20;
      right: 8px;
      top: 8px;
      cursor: pointer;
      display: none;
      transition: 0.3s ease all;
    }
    &:hover {
      .zy-tree__selected-clearable {
        display: inline-block;
        transition: 0.3s ease all;
      }
    }
  }
  .zy-tree__filter {
    margin-bottom: 10px;
  }
  .zy-tree__tree-title {
    margin-top: 0;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 10px;
    padding: 0 5px;
    span:first-child {
      // color: #1a84e8;
    }
  }
  .zy-tree__right-expand {
    height: calc(100% - 120px);
    overflow-y: auto;
    padding-bottom: 10px;
    .zy-tree__custom {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 5px;
      .zy-tree__custom-text {
        display: inline-block;
        width: calc(100% - 30px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 26px;
        line-height: 26px;
      }
      .zy-tree__custom-btn {
        height: 26px;
        line-height: 26px;
        .zy-tree__expand-btn {
          color: #DCDFE6;
          transition: 0.3s ease all;
          .iconfont {
            font-size: 12px;
          }
        }
      }
    }
    .el-tree-node__expand-icon {
      display: none;
      padding: 0 6px;
      height: 26px;
      line-height: 26px;
    }
    .el-tree-node__content:hover {
      .zy-tree__custom-btn {
        .zy-tree__expand-btn {
          // color: #1a84e8;
          transition: 0.3s ease all;
        }
      }
    }
    .is-expanded {
      > .el-tree-node__content {
        height: 26px;
        .zy-tree__custom-btn {
          .zy-tree__expand-btn {
            // color: #1a84e8;
            transition: 0.3s ease all;
          }
        }
      }
    }
  }
}

.el-form-item.is-error {
  .zy-tree__selected-title {
    border-color: #f56c6c;
  }
  .zy-tree__filter {
    .el-input__inner {
      border-color: #DCDFE6 !important;
    }
  }
}
</style>
