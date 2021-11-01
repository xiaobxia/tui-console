<template>
  <div class="container-card">
    <div class="filter-container">
      <div class="left-block">
        <el-input
          v-model="searchForm.searchKey"
          style="width: 160px"
          placeholder="请输入编码或名称"
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
          v-if="$hasPerm('010301')"
          size="small"
          type="primary"
          @click="openEditDialog"
        >添加部门
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
      <!--<el-table-column align="center" label="是否推荐">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ formatShiFou(scope.row.is_recommend) }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="添加时间" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ formatDateTime(scope.row.create_at) }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="状态">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="formatStatusType(scope.row.status)">{{ formatStatus(scope.row.status) }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        v-if="$hasPerm('010303') || $hasPerm('010302')"
        align="left"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="$hasPerm('010303')"
            type="text"
            @click="openEditDialog(row)"
          >编辑</el-button>
          <el-button
            v-if="$hasPerm('010302')"
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
  name: 'UserCenterDepList',
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
      delete data.dateRange
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
        this.$http.post('dataCenter/dept/delete', params).then(() => {
          this.$oLog(
            '删除部门',
            `部门名：${this.tableData.filter((v) => {
              return deleteIds.indexOf(v.id) !== -1
            }).map((v) => {
              return v.deptName
            }).join('，')}`
          )
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
.left-block {
  line-height: 32px;
}
</style>
