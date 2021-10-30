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
            <el-form-item prop="name" label="产品名称：">
              <el-input v-model="searchForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" class="filter-item" icon="el-icon-refresh" type="primary" @click="handleResetSearch">重置
            </el-button>
            <el-button
              :loading="searchLoading"
              class="filter-item"
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="handleSearch">搜索
            </el-button>
            <el-button size="small" class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="排序值">
        <template slot-scope="scope">
          <span>{{ scope.row.sortIndex || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          <img v-if="scope.row.icon_url" :src="scope.row.icon_url" class="list-img-icon" alt="">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否推荐">
        <template slot-scope="scope">
          <span>{{ formatShiFou(scope.row.is_recommend) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="200">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="formatStatusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <router-link :to="'/product/edit/'+scope.row._id">
            <el-button type="primary" size="mini">编辑详情</el-button>
          </router-link>
          <el-button size="mini" @click="handleChangeStatus(scope.row)">{{ scope.row.status === 1?'下架':'上架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="queryList"/>
    <add-dialog ref="addDialog" @ok="reQueryList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddDialog from './components/addDialog'

const searchFormBase = {
  name: '',
  status: '',
  type: ''
}
const dialogFormBase = {
  name: '',
  url: '',
  unit_price: '',
  introduction: ''
}
export default {
  name: 'ProductList',
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
      dialogFormVisible: false,
      dialogForm: Object.assign({}, dialogFormBase),
      dialogFormRules: {
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        unit_price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      listQuery: {
        current: 1,
        pageSize: 20
      },
      channelList: []
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
      this.$http.get('product/getProductsByPage', {
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
    handleChangeStatus(row) {
      let newStatus = 1
      if (row.status === 1) {
        newStatus = 2
      }
      this.$http.post('product/updateProductStatus', {
        product_id: row._id,
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
    handleCreate() {
      this.$refs.addDialog.open()
    },
    handleConfirm() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(
            'product/addProduct',
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
