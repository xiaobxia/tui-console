<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          <img v-if="scope.row.icon_url" :src="scope.row.icon_url" alt="">
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="链接">
        <template slot-scope="scope">
          <span>{{ scope.row.url || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="点击次数">
        <template slot-scope="scope">
          <span>{{ scope.row.click_count || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否推荐">
        <template slot-scope="scope">
          <span>{{ scope.row.is_recommend || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否活动">
        <template slot-scope="scope">
          <span>{{ scope.row.is_activity }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册数">
        <template slot-scope="scope">
          <span>{{ scope.row.register_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="listTotal>0" :total="listTotal" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getUsers" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductList',
  components: { Pagination },
  data() {
    return {
      list: null,
      listTotal: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.listLoading = true
      this.$http.get('admin/getChannelUsers', this.listQuery).then(response => {
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
