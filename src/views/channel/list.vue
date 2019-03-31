<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" label-position="right" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="channel_name" label="渠道名称：">
              <el-input v-model="searchForm.channel_name"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button :loading="searchLoading" class="filter-item" icon="el-icon-search" type="primary" @click="handleSearch">搜索</el-button>
            <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="渠道名">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录名">
        <template slot-scope="scope">
          <span>{{ (scope.row.user&& scope.row.user.name) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码">
        <template slot-scope="scope">
          <span>{{ (scope.row.user&& scope.row.user.password_raw) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览注册次数">
        <template slot-scope="scope">
          <span>{{ scope.row.register_view_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="验证码发送次数">
        <template slot-scope="scope">
          <span>{{ scope.row.verification_code_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册数">
        <template slot-scope="scope">
          <span>{{ scope.row.register_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备数">
        <template slot-scope="scope">
          <span>{{ scope.row.device_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览首页次数">
        <template slot-scope="scope">
          <span>{{ scope.row.home_view_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="点击链接次数">
        <template slot-scope="scope">
          <span>{{ scope.row.click_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="200">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扣量结果">
        <template slot-scope="scope">
          <span>{{ scope.row.register_count_c }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreateUrl(scope.row)">生成链接</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="listTotal>0" :total="listTotal" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="queryList" />
    <el-dialog :visible.sync="dialogFormVisible" title="添加渠道" @closed="handleCancel">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-position="right" label-width="120px">
        <el-form-item prop="channel_name" label="渠道名称">
          <el-input v-model="dialogForm.channel_name"/>
        </el-form-item>
        <el-form-item prop="channel_name" label="登录名">
          <el-input v-model="dialogForm.name"/>
        </el-form-item>
        <el-form-item prop="channel_name" label="登录密码">
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
const searchFormBase = {
  channel_name: ''
}
const dialogFormBase = {
  channel_name: '',
  name: '',
  password: ''
}
export default {
  name: 'ChannelList',
  components: { Pagination },
  data() {
    return {
      loading: false,
      searchLoading: false,
      searchForm: Object.assign({}, searchFormBase),
      list: null,
      listTotal: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogForm: Object.assign({}, dialogFormBase),
      dialogFormRules: {
        channel_name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
      },
      listQuery: {
        current: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.queryList()
    },
    queryList() {
      this.listLoading = true
      this.$http.get('channel/getChannels', {
        ...this.searchForm,
        ...this.listQuery
      }).then(response => {
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
    handleSearch() {
      this.queryList()
    },
    handleCancel() {
      this.closeForm()
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('channel/deleteChannel', {
          channel_id: row._id
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
    closeForm() {
      this.dialogFormVisible = false
      this.dialogForm = Object.assign({}, dialogFormBase)
    },
    handleEdit(row) {
      this.dialogFormVisible = true
      this.dialogFormStatus = 'edit'
      this.dialogForm = Object.assign({}, row)
      this.dialogForm.routeType = parseInt(this.dialogForm.routeType || '1')
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogFormStatus = 'add'
    },
    verifyAfterDelete() {
      if (this.currentSize < 2) {
        if (this.paging.pageNo > 1) {
          this.paging.pageNo = this.paging.pageNo - 1
        }
      }
    },
    handleCreateUrl(row) {
      this.$alert(`http://aaaa.com?cc=${row._id}`, '渠道连接', {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    },
    handleConfirm() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(
            'channel/addChannel',
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
