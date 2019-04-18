<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" label-position="left" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="status" label="上架状态：">
              <el-select v-model="searchForm.status" :style="{width: '100%'}" class="filter-item">
                <el-option label="全部" value=""/>
                <el-option :value="1" label="上架"/>
                <el-option :value="2" label="下架"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="channel_name" label="渠道名称：">
              <el-input v-model="searchForm.channel_name"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button class="filter-item" icon="el-icon-refresh" type="primary" @click="handleResetSearch">重置
            </el-button>
            <el-button :loading="searchLoading" class="filter-item" icon="el-icon-search" type="primary" @click="handleSearch">搜索</el-button>
            <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="expand" label="展开" width="50">
        <template slot-scope="props">
          <el-form>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="历史验证码发送次数：" style="margin: 0">
                  <span class="value">  {{ props.row.history_verification_code_count }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日验证码发送次数：" style="margin: 0">
                  <span class="value">  {{ props.row.today_verification_code_count }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="历史注册数：" style="margin: 0">
                  <span class="value">  {{ props.row.history_register_count }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日注册数：" style="margin: 0">
                  <span class="value">  {{ props.row.today_register_count }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="历史下载数：" style="margin: 0">
                  <span class="value">  {{ props.row.history_download_count }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日下载数：" style="margin: 0">
                  <span class="value">  {{ props.row.today_download_count }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="历史app激活数：" style="margin: 0">
                  <span class="value">  {{ props.row.history_app_count }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日app激活数：" style="margin: 0">
                  <span class="value">  {{ props.row.today_app_count }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="历史扣量结果：" style="margin: 0">
                  <span class="value">  {{ props.row.history_register_count_c }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日扣量结果：" style="margin: 0">
                  <span class="value">  {{ props.row.today_register_count_c }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="历史链接点击：" style="margin: 0">
                  <span class="value">  {{ props.row.history_click_count }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日链接点击：" style="margin: 0">
                  <span class="value">  {{ props.row.today_click_count }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="渠道名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="跳转类型" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_platform }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录名" width="100">
        <template slot-scope="scope">
          <span>{{ (scope.row.user&& scope.row.user.name) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="100">
        <template slot-scope="scope">
          <span>{{ (scope.row.user&& scope.row.user.password_raw) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="200">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单价" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.unit_price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扣量基数" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.deduction_base }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="formatStatusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="url" label="渠道链接">
        <template slot-scope="scope">
          <span>{{ createUrl(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <router-link :to="'/channel/edit/'+scope.row._id">
            <el-button type="primary" size="mini">修改配置</el-button>
          </router-link>
          <el-button size="mini" @click="handleChangeStatus(scope.row)">{{ scope.row.status === 1?'下架':'上架' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="listTotal>0" :total="listTotal" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="queryList" />
    <el-dialog :visible.sync="dialogFormVisible" title="添加渠道" @closed="handleCancel">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-position="right" label-width="120px">
        <el-form-item prop="channel_name" label="渠道名称">
          <el-input v-model="dialogForm.channel_name"/>
        </el-form-item>
        <el-form-item prop="name" label="登录名">
          <el-input v-model="dialogForm.name"/>
        </el-form-item>
        <el-form-item prop="password" label="登录密码">
          <el-input v-model="dialogForm.password"/>
        </el-form-item>
        <el-form-item prop="channel_platform" label="跳转模式：">
          <el-select v-model="dialogForm.channel_platform" :style="{width: '100%'}" class="filter-item">
            <el-option value="下载app" label="下载app"/>
            <el-option value="h5" label="h5"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible2" title="修改今日扣量结果" @closed="handleCancel2">
      <el-form ref="dialogForm2" :model="dialogForm2" :rules="dialogFormRules2" label-position="right" label-width="120px">
        <el-form-item prop="unit_price" label="单价">
          <el-input v-model="dialogForm2.unit_price"/>
        </el-form-item>
        <el-form-item prop="today_register_count_c" label="今日扣量结果">
          <el-input v-model="dialogForm2.today_register_count_c"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel2">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirm2">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const searchFormBase = {
  channel_name: '',
  status: ''
}
const dialogFormBase = {
  channel_name: '',
  name: '',
  password: '',
  channel_platform: ''
}

const dialogFormBase2 = {
  channel_id: '',
  unit_price: 0,
  today_register_count_c: 0
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
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        channel_platform: [{ required: true, message: '请选择跳转模式', trigger: 'blur' }]
      },
      dialogFormVisible2: false,
      dialogForm2: Object.assign({}, dialogFormBase2),
      dialogFormRules2: {
        unit_price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        today_register_count_c: [{ required: true, message: '请输入结果', trigger: 'blur' }]
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
    handleResetSearch() {
      this.searchForm = Object.assign({}, searchFormBase)
    },
    handleCancel() {
      this.closeForm()
    },
    handleCancel2() {
      this.closeForm2()
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
    handleChangeStatus(row) {
      let newStatus = 1
      if (row.status === 1) {
        newStatus = 2
      }
      this.$http.post('channel/updateChannelStatus', {
        channel_id: row._id,
        status: newStatus
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.initPage()
      })
    },
    closeForm() {
      this.dialogFormVisible = false
      this.dialogForm = Object.assign({}, dialogFormBase)
    },
    closeForm2() {
      this.dialogFormVisible2 = false
      this.dialogForm2 = Object.assign({}, dialogFormBase2)
    },
    handleEdit2(row) {
      this.dialogFormVisible2 = true
      this.dialogForm2 = Object.assign({}, row)
      this.dialogForm2.channel_id = row._id
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    verifyAfterDelete() {
      if (this.currentSize < 2) {
        if (this.paging.pageNo > 1) {
          this.paging.pageNo = this.paging.pageNo - 1
        }
      }
    },
    handleCreateUrl(row) {
      this.$alert(`<div>${row.url || '暂未配置'}</div>`, '渠道连接', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
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
    },
    handleConfirm2() {
      this.$refs.dialogForm2.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(
            'channel/updateChannelRegisterC',
            {
              ...this.dialogForm2
            }
          ).then(() => {
            this.loading = false
            this.closeForm2()
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
    createUrl(row) {
      const query = { cc: row._id }
      if (row.channel_platform === 'h5') {
        query.h5 = 'true'
      }
      return `http://localhost:3001/#/?${qs.stringify(query)}`
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
