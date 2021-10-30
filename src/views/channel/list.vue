<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" size="small" label-position="left" label-width="100px">
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
            <el-button size="small" class="filter-item" icon="el-icon-refresh" type="primary" @click="handleResetSearch">重置
            </el-button>
            <el-button :loading="searchLoading" size="small" class="filter-item" icon="el-icon-search" type="primary" @click="handleSearch">搜索</el-button>
            <el-button size="small" class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="渠道码">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_code || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="渠道名">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单价">
        <template slot-scope="scope">
          <span>{{ scope.row.unit_price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="formatStatusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleChangeChannel(scope.row)">修改</el-button>
          <el-button size="mini" @click="handleChangeStatus(scope.row)">{{ scope.row.status === 1?'下架':'上架' }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="listTotal>0" :total="listTotal" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="queryList" />
    <add-dialog ref="addDialog" @ok="reQueryList"/>
  </div>
</template>

<script>
import qs from 'qs'
import Pagination from '@/components/Pagination'
import AddDialog from './components/addDialog'
const searchFormBase = {
  channel_name: '',
  status: ''
}

const dialogFormBase2 = {
  channel_id: '',
  unit_price: 0,
  today_register_count_c: 0
}

export default {
  name: 'ChannelList',
  components: {
    Pagination,
    AddDialog
  },
  data() {
    return {
      loading: false,
      searchLoading: false,
      searchForm: Object.assign({}, searchFormBase),
      list: null,
      listTotal: 0,
      listLoading: true,
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
    reQueryList() {
      this.listQuery = {
        current: 1,
        pageSize: 20
      }
      this.queryList()
    },
    queryList() {
      this.listLoading = true
      this.$http.get('channel/getChannelsByPage', {
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
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
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
          this.reQueryList()
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
        this.queryList()
      })
    },
    handleChangeChannel(row) {
      this.$refs.addDialog.open(row)
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
      this.$refs.addDialog.open()
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
    createUrl(row) {
      const query = { cc: row._id }
      if (row.channel_platform === 'h5') {
        query.h5 = 'true'
      }
      return `http://tuimobile.menghe.top/#/?${qs.stringify(query)}`
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
