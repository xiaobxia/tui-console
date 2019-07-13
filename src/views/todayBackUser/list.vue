<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回款时间">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.back_at) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="listTotal>0"
      :total="listTotal"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="queryList"/>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const searchFormBase = {
  time: ['', ''],
  mobile: ''
}
export default {
  name: 'TodayBackUser',
  components: { Pagination },
  data() {
    return {
      loading: false,
      searchLoading: false,
      searchForm: Object.assign({}, searchFormBase),
      list: null,
      listTotal: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 20
      },
      channelList: [],
      productList: [],
      todayInfo: {}
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    formatSearch() {
      const data = {}
      for (const key in this.searchForm) {
        if (key === 'time') {
          if (this.searchForm['time'][0]) {
            data.beginTime = moment(this.searchForm.time[0]).format('YYYY-MM-DD HH:mm:ss')
            data.endTime = moment(this.searchForm.time[1]).format('YYYY-MM-DD HH:mm:ss')
          }
        } else if (key === 'timeA') {
          if (this.searchForm['timeA'][0]) {
            data.beginTimeA = moment(this.searchForm.timeA[0]).format('YYYY-MM-DD HH:mm:ss')
            data.endTimeA = moment(this.searchForm.timeA[1]).format('YYYY-MM-DD HH:mm:ss')
          }
        } else {
          data[key] = this.searchForm[key]
        }
      }
      return data
    },
    initPage() {
      this.queryList()
    },
    queryList() {
      this.listLoading = true
      this.$http.get('whiteUser/getTodayBackUsers', {
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
    handleChangeStatus(row) {

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
