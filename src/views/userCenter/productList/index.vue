<template>
  <div class="container-card">
    <div class="filter-container">
      <div class="left-block">
        <span class="label-text">状态</span>
        <el-select v-model="searchForm.status" clearable style="width: 160px" size="small">
          <el-option :value="1" label="已上架"/>
          <el-option :value="2" label="已下架"/>
        </el-select>
        <el-input
          v-model="searchForm.searchKey"
          style="width: 160px"
          placeholder="请输入名称"
          size="small"
          maxlength="20"
        />
        <el-button
          size="small"
          type="primary"
          style="margin-left: 10px"
          @click="reQueryList"
        >搜索
        </el-button>
        <el-button
          size="small"
          @click="resetSearch"
        >重置
        </el-button>
      </div>
      <div class="right-block">
        <el-button
          size="small"
          type="primary"
          @click="openEditDialog(null)"
        >添加产品
        </el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :border="true"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      height="calc(100vh - 190px)"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="100" prop="sort" label="排序值"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="图标">
        <template slot-scope="{row}">
          <el-image
            :src="row.icon_url"
            style="width: 60px; height: 60px"
            fit="fill"/>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="{row}">
          <span>{{ $PRODUCT_TYPE_FORMAT(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_activity === true" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_recommend === true" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="轮播">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_rotation === true" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="success">已上架</el-tag>
          <el-tag v-else type="danger">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="openEditDialog(row)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="deleteRow(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-pagination">
      <pagination
        :page="current"
        :limit="size"
        :total="total"
        @pagination="paginationChange"
      />
    </div>
    <edit-dialog ref="editDialog" @ok="reQueryList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import EditDialog from './editDialog'

function createSearchForm(tar) {
  let raw = {
    searchKey: ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'UserCenterProductList',
  components: {
    Pagination,
    EditDialog
  },
  props: {
  },
  data() {
    return {
      tableData: [],
      current: 1,
      size: 10,
      total: 0,
      searchForm: createSearchForm(),
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  created() {
    this.reQueryList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    paginationChange(info) {
      this.current = info.page
      this.size = info.limit
      this.queryList()
    },
    resetSearch() {
      this.searchForm = createSearchForm()
    },
    reQueryList() {
      this.current = 1
      this.queryList()
    },
    formatSearchForm() {
      const data = {
        ...this.searchForm,
        current: this.current,
        pageSize: this.size
      }
      return data
    },
    queryList() {
      this.$http.get('tuiServer/admin/product/getProductsByPage', {
        ...this.formatSearchForm()
      }).then((res) => {
        const data = res.data || {}
        this.total = parseInt(data.count) || 0
        this.tableData = data.list || []
      })
    },
    openEditDialog(row) {
      this.$refs.editDialog.open(row)
    },
    deleteRow(row) {
      this.deleteHandler([row._id])
    },
    deleteHandler(deleteIds) {
      this.$confirm('一旦删除，将不可恢复，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        const params = {
          _ids: deleteIds
        }
        this.$http.post('tuiServer/admin/product/deleteProduct', params).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.reQueryList()
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.list-img-icon {
  height: 60px;
  width: 60px;
}
</style>
