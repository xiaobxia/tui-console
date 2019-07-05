<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="明文密码">
        <template slot-scope="scope">
          <span>{{ scope.row.password_raw || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span>{{ formatRoles(scope.row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleChangeStatus(scope.row)">{{ scope.row.status === 1?'禁用':'启用' }}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="listTotal>0" :total="listTotal" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getUsers" />
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogFormType === 'add' ? '添加后台管理员': '修改后台管理员'" @closed="handleCancel">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-position="right" label-width="120px">
        <el-form-item prop="roles" label="角色：">
          <el-select v-model="dialogForm.roles" :style="{width: '100%'}" class="filter-item">
            <el-option value="admin" label="管理员"/>
            <el-option value="test" label="测试"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="登录名">
          <el-input v-model="dialogForm.name"/>
        </el-form-item>
        <el-form-item prop="password" label="登录密码">
          <el-input v-model="dialogForm.password"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const dialogFormBase = {
  roles: '',
  name: '',
  password: ''
}
export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      list: null,
      listTotal: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogFormType: 'add',
      dialogForm: Object.assign({}, dialogFormBase),
      dialogFormRules: {
        roles: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        name: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
      },
      listQuery: {
        current: 1,
        pageSize: 20
      },
      loading: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.getUsers()
    },
    getUsers() {
      this.listLoading = true
      this.$http.get('admin/getAdminUsers', this.listQuery).then(response => {
        this.list = response.data.list
        this.listTotal = response.data.count
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getUsers()
    },
    handleUpdate(row) {
      this.dialogFormType = 'edit'
      this.dialogFormVisible = true
      this.dialogForm = Object.assign({}, row)
      this.dialogForm.roles = row.roles[0]
    },
    closeForm() {
      this.dialogFormVisible = false
      this.dialogForm = Object.assign({}, dialogFormBase)
    },
    handleCreate() {
      this.dialogFormType = 'add'
      this.dialogFormVisible = true
    },
    handleCancel() {
      this.closeForm()
    },
    handleConfirm() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(
            this.dialogFormType === 'add' ? 'admin/addAdminUser' : 'admin/updateAdminUser',
            this.dialogForm
          ).then(() => {
            this.loading = false
            this.closeForm()
            this.initPage()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    verifyAfterDelete() {
      if (this.currentSize < 2) {
        if (this.paging.pageNo > 1) {
          this.paging.pageNo = this.paging.pageNo - 1
        }
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('admin/deleteAdminUser', {
          user_id: row._id
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.verifyAfterDelete()
          this.initPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChangeStatus(row) {
      let newStatus = 1
      if (row.status === 1) {
        newStatus = 2
      }
      this.$http.post('admin/updateAdminUser', {
        name: row.name,
        status: newStatus
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.initPage()
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
