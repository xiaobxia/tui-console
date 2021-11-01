<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="700px" title="选择科目" append-to-body>
    <div v-loading="dialogLoading" v-if="dialogVisible" element-loading-text="数据载入中" class="content">
      <el-button v-if="isInCertAdd" type="primary" size="small" class="add-new" @click="addHandler">新增</el-button>
      <el-tabs v-model="activeTab" type="card" class="dark-tabs" @tab-click="tabClick">
        <el-tab-pane v-for="(item) in tabList" :key="item" :label="item" :name="item"/>
      </el-tabs>
      <el-input
        v-model="filterText"
        size="small"
        style="margin-bottom: 10px"
        clearable
        placeholder="输入关键字进行过滤"/>
      <div class="wrap">
        <el-tree
          ref="tree"
          :data="subjectTreeTemp"
          :default-expand-all="true"
          :show-checkbox="carryType !== '1' && multiple"
          :check-strictly="last"
          :props="defaultProps"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :filter-node-method="filterNode"
          node-key="phid"
          class="filter-tree subject-tree"
          @check="checkChange">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span :title="`${ data.encode } - ${ node.label }`" class="name" @dblclick="clickNode(node,data)">
              {{ data.encode }} - {{ node.label }}
            </span>
            <span v-if="isInCertAdd" class="tool">
              <el-button :disabled="!!data.originSubId" type="text" @click="handleConfig('edit', data)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" @click="handleConfig('add', data)"><i class="el-icon-plus"/></el-button>
              <el-button :disabled="!!data.originSubId" type="text" @click="handleConfig('del', data)"><i class="el-icon-delete"/></el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="okHandler">确定</el-button>
    </div>
    <subject-add-dialog
      ref="subjectAddDialog"
      @ok="subjectAddDialogOk"
    />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSubjectForm } from '@/common/create'
import SubjectAddDialog from '@/businessComponents/SubjectAddDialog'
import moment from 'moment'

const caiList = ['资产', '负债', '净资产', '收入', '支出']
const newCaiList = ['资产', '负债', '净资产', '收入', '费用']
const yuList = ['预算收入', '预算支出', '预算结余']
// const allList = ['资产', '负债', '净资产', '收入', '支出']
const allList = ['资产', '负债', '净资产', '收入', '支出']
const newAllList = ['资产', '负债', '净资产', '收入', '费用', '预算收入', '预算支出', '预算结余']
export default {
  name: 'SubjectSelectDialog',
  components: { SubjectAddDialog },
  props: {
    // 是否选择末级组织
    last: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      keyword: '',
      dialogVisible: false,
      defaultProps: {
        children: 'childList',
        label: 'name',
        disabled: (data) => {
          if (data.status !== '1') {
            return true
          }
          if (this.last) {
            return data.childList && data.childList.length > 0
          } else {
            return false
          }
        }
      },
      activeTab: '',
      tabList: [],
      subjectTreeTemp: [],
      multiple: false, // 单选多选
      selectAllType: false, // 返不返父级？
      hasEditShow: false, // 编辑后打开需要回显
      type: 'old',
      hasCheckKeysMap: {},
      rawKeys: [], // 已选
      filterParent: false, // 父级可选
      isInCertAdd: false,
      filterText: '',
      year: '',
      carryType: '',
      dialogLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'subjectTree',
      'bookInfo',
      'subjectList'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    if (this.bookInfo.isNewAccounts === '1') {
      this.type = 'new'
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1 || data.encode.indexOf(value) !== -1
    },
    createHasCheckKeysMap() {
      const hasCheckKeysMap = {}
      this.tabList.forEach((item) => {
        hasCheckKeysMap[item] = []
      })
      this.hasCheckKeysMap = hasCheckKeysMap
    },
    createRowCheckKeysMap(rawKeys) {
      rawKeys.forEach((phid) => {
        for (let i = 0; i < this.subjectList.length; i++) {
          const subjectItem = this.subjectList[i]
          if (subjectItem.phid === phid) {
            this.hasCheckKeysMap[subjectItem.subType].push(phid)
          }
        }
      })
    },
    getHasCheckKeysMapKeys() {
      let keys = []
      for (const key in this.hasCheckKeysMap) {
        keys = keys.concat(this.hasCheckKeysMap[key])
      }
      return keys
    },
    getNodesByKeys() {
      const keys = this.getHasCheckKeysMapKeys()
      const nodes = []
      this.subjectList.forEach((item) => {
        if (keys.indexOf(item.phid) !== -1) {
          if (this.filterParent) {
            if (item.end === '1') {
              nodes.push(item)
            }
          } else {
            nodes.push(item)
          }
        }
      })
      return nodes
    },
    open(config) {
      this.dialogLoading = true
      setTimeout(() => {
        this.dialogLoading = false
      }, 1000)
      config = config || {}
      const model = config.model || ''
      const multiple = config.multiple || false
      const selectAllType = config.selectAllType || false
      const rawKeys = config.rawKeys || []
      const filterParent = config.filterParent || false
      const hasEditShow = config.hasEditShow || false
      this.carryType = config.carryType
      if (model === 'cai') {
        // 财务科目
        if (this.type === 'new') {
          this.tabList = newCaiList
        } else {
          this.tabList = caiList
        }
      } else if (model === 'yu') {
        // 预算科目
        this.tabList = yuList
      } else {
        // 不区分（仍然是财务科目）
        // 财务科目
        if (this.type === 'new') {
          this.tabList = newAllList
        } else {
          this.tabList = allList
        }
      }
      this.activeTab = this.tabList[0]
      this.multiple = multiple
      this.selectAllType = selectAllType
      this.hasEditShow = hasEditShow
      this.filterParent = filterParent
      this.hasCheckKeysMap = {}
      if (selectAllType || hasEditShow) {
        this.createHasCheckKeysMap()
        this.createRowCheckKeysMap(rawKeys)
      }
      this.isInCertAdd = config.isInCertAdd
      this.year = config.year || this.$commonQueryParam.year
      this.dialogVisible = true
      this.$nextTick(() => {
        this.tabChange(this.tabList[0])
      })
    },
    okHandler() {
      if (this.selectAllType) {
        const data = this.getNodesByKeys()
        if (data.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择！'
          })
          return false
        }
        this.$emit('ok', data)
      } else {
        const data = this.$refs.tree.getCheckedNodes()
        if (data.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择！'
          })
          return false
        }
        if (!this.multiple) {
          if (data.length > 1) {
            this.$message({
              type: 'warning',
              message: '只能选择一个科目'
            })
            return false
          }
          this.$emit('ok', data[0])
        } else {
          this.$emit('ok', data)
        }
      }
      this.dialogVisible = false
    },
    changeTree(type) {
      // 清空
      this.$refs.tree.setCheckedNodes([])
      const list = []
      this.subjectTree.forEach((item) => {
        if (item.subType === type) {
          list.push(item)
        }
      })
      this.subjectTreeTemp = list
    },
    tabClick(v) {
      this.tabChange(v.label)
    },
    tabChange(label) {
      this.changeTree(label)
      if (this.selectAllType || this.hasEditShow) {
        this.$refs.tree.setCheckedKeys(this.hasCheckKeysMap[this.activeTab])
      }
    },
    // 选中节点
    checkChange(data, checkInfo) {
      // 如果是单选的那就把其他的给关了
      if (!this.multiple) {
        const checkedKeys = checkInfo.checkedKeys
        if (checkedKeys.length === 0) {
          this.$refs.tree.getCheckedKeys([])
        } else {
          if (checkedKeys.indexOf(data.phid) !== -1) {
            this.$refs.tree.setCheckedKeys([data.phid])
          }
        }
      }
      if (this.selectAllType) {
        this.hasCheckKeysMap[this.activeTab] = checkInfo.checkedKeys
      }
    },
    // 双击确定
    clickNode(node, data) {
      if (data.end === '1' && data.status === '1') {
        this.$emit('ok', data)
        this.dialogVisible = false
      } else {
        this.$message.warning('只能选择启用中的末级科目！')
      }
    },
    // 编辑
    handleConfig(type, nodeData) {
      if (type === 'add') {
        this.addSubChildren(nodeData)
      } else if (type === 'edit') {
        this.editSub(nodeData)
      } else {
        this.delSub(nodeData)
      }
    },
    // 科目修改和删除,校验科目是否有数据引用
    checkSubIsAdopt(row) {
      return this.$http.get(`account/subject/checkSubIsAdopt`, {
        subId: row.phid
      })
    },
    // 新增顶级
    addHandler() {
      this.$refs.subjectAddDialog.open({
        dialogType: 'add',
        parentCode: '',
        parentName: '无上级科目',
        dialogTitle: '新增会计科目',
        subYear: this.year,
        ifAdopted: false
      })
    },
    // 新增下级
    addSubChildren(parent) {
      this.checkSubIsAdopt(parent).then((res) => {
        const data = res.data
        if (data.flag === false) {
          if (data.msg === '科目不是末级科目,不能修改') {
            this.openAddChildRow(parent, false)
          } else {
            this.$confirm(`您正在为科目 ${parent.encode} 增加下级科目，系统将把该科目的数据全部转移到新增的下级科目中，该流程不可逆，您是否要继续？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false
            }).then(() => {
              this.openAddChildRow(parent, true)
            })
          }
        } else {
          this.openAddChildRow(parent, false)
        }
      })
    },
    // 获取详细数据
    getParentSub(phid) {
      return this.$http.get(`account/subject/findById/${phid}`)
    },
    // 打开新增子级窗口
    openAddChildRow(row, ifAdopted) {
      // 获取父级完整信息
      this.getParentSub(row.phid).then((resParentData) => {
        const parentData = resParentData.data
        const form = createSubjectForm({
          ...parentData.hsSubEntity,
          phid: '',
          parentId: row.phid,
          subLevels: parseInt(row.subLevels || 1) + 1,
          name: ''
        })
        const forIdList = []
        const subForeignList = parentData.subForeignList || []
        subForeignList.forEach((foreign) => {
          forIdList.push(foreign.astTypeId)
        })
        const assIdList = []
        const subAssistList = parentData.subAssistList || []
        subAssistList.forEach((ass) => {
          assIdList.push(ass.astTypeId)
        })
        this.$refs.subjectAddDialog.open({
          dialogType: 'addChild',
          parentCode: row.encode,
          parentName: `${row.encode} ${row.name}`,
          dialogTitle: '新增下级科目',
          ifAdopted: ifAdopted
        }, {
          ...form,
          assIdList: assIdList,
          forIdList: forIdList
        })
      })
    },
    // 编辑
    editSub(row) {
      // 检查是否被引用
      Promise.all([
        this.checkSubIsAdopt(row),
        // 要查出详情，因为row里面的name是被拼接过的，同时也没有subForeignList和subAssistList
        this.getParentSub(row.phid)
      ]).then((resList) => {
        const adoptDetail = resList[0]
        let subDetail = resList[1].data || {}
        subDetail = {
          ...subDetail,
          ...(subDetail.hsSubEntity || {})
        }
        // 查询父级数据
        const form = createSubjectForm(subDetail)
        const ifAdopted = adoptDetail.data && adoptDetail.data.flag === false
        const forIdList = []
        const subForeignList = subDetail.subForeignList || []
        subForeignList.forEach((foreign) => {
          forIdList.push(foreign.astTypeId)
        })
        const assIdList = []
        const subAssistList = subDetail.subAssistList || []
        subAssistList.forEach((ass) => {
          assIdList.push(ass.astTypeId)
        })
        // 有父级查询父级信息
        if (subDetail.parentId !== '0') {
          this.getParentSub(subDetail.parentId).then((resParentData) => {
            const parentData = resParentData.data.hsSubEntity
            const parentName = `${parentData.encode} ${parentData.name}`
            this.$refs.subjectAddDialog.open({
              dialogType: 'edit',
              parentCode: parentData.encode,
              parentName: parentName,
              dialogTitle: '编辑会计科目',
              ifAdopted
            }, {
              ...form,
              assIdList: assIdList,
              forIdList: forIdList
            })
          })
        } else {
          this.$refs.subjectAddDialog.open({
            dialogType: 'edit',
            parentCode: '',
            parentName: '无上级科目',
            dialogTitle: '编辑会计科目',
            ifAdopted
          }, {
            ...form,
            assIdList: assIdList,
            forIdList: forIdList
          })
        }
      })
    },
    // 删除校验
    delSub(row) {
      if (row) {
        if (row.end === '0' || !!row.originSubId) {
          this.$message({
            type: 'warning',
            message: `未删除科目数据，[${row.encode}]${row.end === '0' ? '有下级科目' : '为共享科目'}不能删除！`
          })
          return false
        } else {
          this.doDelete([row.phid])
        }
      }
    },
    // 删除
    doDelete(phids) {
      this.$confirm('您确定要删除本科目吗？删除后不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        const params = {
          ids: phids
        }
        this.$http.post('account/subject/deleteSubList', params).then(() => {
          this.subjectAddDialogOk()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // 科目操作回调
    subjectAddDialogOk() {
      this.$store.dispatch('initSubjectTree', {
        bookId: this.$commonQueryParam.bookId,
        orgId: this.$commonQueryParam.orgId,
        year: moment(this.year || this.bookInfo).format('YYYY'),
        withParentName: 1
      }).then(() => {
        this.$nextTick(() => {
          this.tabChange(this.activeTab)
          // this.tabChange(this.tabList[0])
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  position: relative;
  .add-new {
    position: absolute;
    right: 0;
    top: 5px;
    z-index: 999;
  }
}
.wrap {
  max-height: 55vh;
  overflow-y: auto;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;

  .name {
    display: inline-block;
    width: 450px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 26px;
  }

  .tool {
    display: none;
    width: 80px;
    transition: all .2s ease;
  }
}

/deep/ .el-tree-node__content:hover {
  .tool {
    display: inline-block;
    transition: all .2s ease;
  }
}
</style>
