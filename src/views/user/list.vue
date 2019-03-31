<template>
  <div class="app-container">
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
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="listTotal>0" :total="listTotal" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getUsers" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserList',
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
