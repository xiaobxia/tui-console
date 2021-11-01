<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="dialogTitle"
    append-to-body
    width="800px"
  >
    <div v-if="dialogVisible">
      <el-button size="small" type="primary" @click="openEditPermItemDialog">添加平台</el-button>
      <el-tree
        :data="treeData"
        :expand-on-click-node="false"
        :allow-drop="allowDrop"
        style="margin-top: 12px"
        node-key="id"
        draggable
        default-expand-all
        @node-drag-end="handleDragEnd">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <span>{{ data.permName }} - </span>
            <el-button
              v-clipboard="data.permUrl"
              v-clipboard:success="handleSuccess"
              type="text"
            >{{ data.permUrl }}</el-button>
            <span> - {{ permTypeMap[data.permType] }}</span>
          </span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              添加子级
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => edit(data)">
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => deleteRow(data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
      <edit-perm-item-dialog ref="editPermItemDialog" @ok="queryPermTree"/>
    </div>
  </el-dialog>
</template>

<script>
import EditPermItemDialog from './editPermItemDialog'
import treeUtil from '@/utils/treeUtil'

export default {
  name: 'EditPermDialog',
  components: {
    EditPermItemDialog
  },
  data() {
    return {
      dialogVisible: false,
      treeData: [],
      rules: {
        code: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      permTypeMap: {
        1: '目录',
        2: '菜单',
        3: '按钮',
        4: '数据查看'
      },
      loading: false,
      source: ''
    }
  },
  computed: {
    dialogTitle() {
      return '管理权限树（开发）'
    }
  },
  created() {
  },
  methods: {
    open() {
      this.dialogVisible = true
      this.queryPermTree()
    },
    queryPermTree() {
      this.$http.get('dataCenter/perm/allTree').then((res) => {
        const list = res.data || []
        treeUtil.sortTree(list)
        this.treeData = list
      })
    },
    openEditPermItemDialog(row) {
      row = row || {}
      let sort = 0
      this.treeData.forEach((v) => {
        if (v.sort > sort) {
          sort = v.sort
        }
      })
      row.sort = row.sort || (sort + 1)
      this.$refs.editPermItemDialog.open(row)
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'dataCenter/role/add'
          if (this.form.id) {
            url = 'dataCenter/role/edit'
          }
          this.$http.post(url, {
            ...this.form
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.dialogVisible = false
            this.$emit('ok')
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        }
      })
    },
    append(row) {
      let sort = 0
      row.children = row.children || []
      row.children.forEach((v) => {
        if (v.sort > sort) {
          sort = v.sort
        }
      })
      this.$refs.editPermItemDialog.open({
        'parentId': row.id,
        'parentCode': row.permUrl,
        'moduleName': row.moduleName || row.permUrl,
        'sort': sort + 1
      })
    },
    edit(row) {
      this.$refs.editPermItemDialog.open(row)
    },
    deleteRow(row) {
      this.deleteHandler([row.id])
    },
    deleteHandler(deleteIds) {
      this.$confirm('一旦删除，将不可恢复，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        const params = {
          ids: deleteIds
        }
        this.$http.post('dataCenter/perm/deleteBatch', params).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.queryPermTree()
        })
      })
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      const draggingNodeData = draggingNode.data
      const nodes = treeUtil.getChildren(this.treeData, 'id', draggingNodeData.parentId)
      nodes.forEach((v, index) => {
        this.$http.post('dataCenter/perm/edit', {
          id: v.id,
          parentId: v.parentId,
          permName: v.permName,
          permType: v.permType,
          permUrl: v.permUrl,
          sort: index + 1
        })
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      const draggingNodeData = draggingNode.data
      const dropNodeData = dropNode.data
      if (draggingNodeData.parentId === dropNodeData.id) {
        // 父子
        return type === 'inner'
      }
      if (draggingNodeData.parentId === dropNodeData.parentId) {
        // 同级
        return type !== 'inner'
      }
      return false
    },
    handleSuccess() {
      this.$message({
        type: 'success',
        message: '复制成功！'
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
