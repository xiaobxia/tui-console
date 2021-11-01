<template>
  <el-row :gutter="15">
    <el-col :span="6">
      <div class="container-card" style="padding: 0">
        <div class="c-title">角色列表</div>
        <div class="c-w">
          <div class="s-w">
            <el-input v-model="rulesText" size="small" placeholder="请输入名称" @change="filterRulesList"/>
            <el-button
              v-if="$hasPerm('010201')"
              class="a-b"
              type="text"
              @click="openEditRulesDialog"
            ><i class="el-icon-circle-plus" style="margin-right: .5em"/>添加</el-button>
          </div>
          <div class="detail-wrap">
            <el-table
              ref="detailTable"
              :highlight-current-row="true"
              :show-header="false"
              :data="rulesShowList"
              class="item-table"
              style="width: 100%"
              @current-change="currentChange"
            >
              <el-table-column>
                <template slot-scope="{row}">
                  <div class="c-cell">
                    <span class="right-text">
                      <el-button
                        v-if="$hasPerm('010203')"
                        type="text"
                        icon="el-icon-edit"
                        @click="openEditRulesDialog(row)"
                      />
                      <el-button
                        v-if="$hasPerm('010202')"
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteRow(row)"
                      />
                    </span>
                    <i v-if="row.status === 1" class="st-icon-yhgl"/>
                    <i v-else class="st-icon-disable"/>
                    <span :title="row.name" class="main-text ellipsis-text">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div class="container-card" style="padding: 0">
        <div class="c-title">功能权限配置</div>
        <div v-loading="treeLoading" class="c-w">
          <div class="t-w">
            <div v-if="$sysSetting.isDev" style="margin-bottom: 12px">
              <el-button size="small" type="primary" @click="openEditPermDialog">管理权限树（开发使用）</el-button>
            </div>
            <el-tree
              ref="tree"
              :data="treeData"
              :expand-on-click-node="false"
              show-checkbox
              node-key="id"
              default-expand-all>
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                  <span>{{ data.permName }}</span>
                </span>
              </span>
            </el-tree>
          </div>
          <div style="margin-top: 20px;text-align: right;height: 32px">
            <el-button v-if="$hasPerm('010204')" style="width: 120px" size="small" type="primary" @click="saveRulesMenu">保存</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <edit-rules-dialog ref="editRulesDialog" @ok="queryList"/>
    <edit-perm-dialog ref="editPermDialog" @ok="queryPermTree"/>
  </el-row>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import EditRulesDialog from './editRulesDialog'
import EditPermDialog from './editPermDialog'
import treeUtil from '@/utils/treeUtil'

export default {
  name: 'UserCenterRulesList',
  components: {
    Pagination,
    EditRulesDialog,
    EditPermDialog
  },
  props: {
  },
  data() {
    return {
      rulesList: [],
      rulesShowList: [],
      treeData: [],
      current: 1,
      size: 10,
      total: 0,
      multipleSelection: [],
      rulesText: '',
      currentRow: null,
      treeLoading: false
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  created() {
    this.queryList()
    this.queryPermTree()
  },
  methods: {
    currentChange(row) {
      this.currentRow = row
      this.queryRulesMenu(row.id)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    filterRulesList() {
      const text = this.rulesText
      const res = []
      this.rulesList.forEach((v) => {
        if (text && v.name.indexOf(text) === -1) {
          return
        }
        res.push(v)
      })
      this.rulesShowList = res
      this.$nextTick(() => {
        this.$refs.detailTable.setCurrentRow(res[0])
        if (res.length === 0) {
          this.currentRow = null
          this.$refs.tree.setCheckedKeys([])
        }
      })
    },
    queryList() {
      this.$http.get('dataCenter/role/findByCondition').then((res) => {
        this.rulesList = res.data || []
        this.filterRulesList()
      })
    },
    openEditRulesDialog(row) {
      this.$refs.editRulesDialog.open(row)
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
        this.$http.post('dataCenter/role/deleteBatch', params).then(() => {
          this.$oLog(
            '删除角色',
            `角色名：${this.rulesList.filter((v) => {
              return deleteIds.indexOf(v.id) !== -1
            }).map((v) => {
              return v.name
            }).join('，')}`
          )
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.queryList()
        })
      })
    },
    queryPermTree() {
      this.$http.get('dataCenter/perm/allTree').then((res) => {
        const list = res.data || []
        treeUtil.sortTree(list)
        this.treeData = list
      })
    },
    openEditPermDialog(row) {
      this.$refs.editPermDialog.open(row)
    },
    queryRulesMenu(roleId) {
      this.treeLoading = true
      this.$http.get('dataCenter/perm/findByRoleId', {
        roleId: roleId
      }).then((res) => {
        const list = res.data || []
        const keys = list.map((v) => {
          return v.id
        })
        this.$refs.tree.setCheckedKeys(keys)
        this.treeLoading = false
      }).catch((err) => {
        console.log(err)
        this.treeLoading = false
      })
    },
    saveRulesMenu() {
      if (!this.currentRow) {
        this.$message({
          type: 'warning',
          message: '请选择角色！'
        })
        return
      }
      const permIds = this.$refs.tree.getCheckedKeys()
      this.$http.post('dataCenter/role/saveRolePerm', {
        'permIds': permIds,
        'roleId': this.currentRow.id
      }).then(() => {
        this.$oLog(
          '修改角色权限',
          `角色名：${this.currentRow.name}`
        )
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .c-title {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    border-bottom: 1px solid #E4E7ED;
  }
.c-w {
  padding: 12px;
  .s-w {
    position: relative;
    padding-right: 70px;
    .a-b {
      position: absolute;
      top: 9px;
      right: 0;
    }
  }
  .detail-wrap {
    height: calc(100vh - 180px);
    overflow-y: auto;
    margin-top: 12px;
    .c-cell {
      position: relative;
      height: 23px;
      line-height: 23px;
    }
    .right-text {
      float: right;
    }
    .main-text {
      display: inline-block;
      width: calc(100% - 70px);
      min-width: 155px;
    }
    i {
      vertical-align: top;
      top: 0.3em;
      margin-right: 5px;
    }
  }
}
  .st-icon-disable {
    color: $red;
  }
  .t-w {
    height: calc(100vh - 190px);
    overflow-y: auto;
  }
</style>
