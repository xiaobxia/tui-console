<template>
  <div class="app-container">
    <div style="font-size: 20px;padding: 20px;">
      <span style="margin-right: 15px">今日注册:{{ todayInfo.dayR }}</span>
      <span style="margin-right: 15px">今日活跃:{{ todayInfo.dayA }}</span>
      <span style="margin-right: 15px">今日注册现金贷:{{ todayInfo.dayRX }}</span>
      <span style="margin-right: 15px">今日活跃现金贷:{{ todayInfo.dayAX }}</span>
    </div>
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" label-position="left" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item prop="time" label="申请时间：">
              <el-date-picker
                v-model="searchForm.time"
                style="width: 100%"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="time" label="活跃时间：">
              <el-date-picker
                v-model="searchForm.timeA"
                style="width: 100%"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="mobile" label="手机号：">
              <el-input v-model="searchForm.mobile"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="source" label="来源：">
              <el-select v-model="searchForm.source" :style="{width: '100%'}" class="filter-item">
                <el-option label="全部" value=""/>
                <el-option value="xjd" label="现金贷"/>
                <el-option value="dc" label="贷超"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button class="filter-item" icon="el-icon-refresh" type="primary" @click="handleResetSearch">重置
            </el-button>
            <el-button
              :loading="searchLoading"
              class="filter-item"
              icon="el-icon-search"
              type="primary"
              @click="handleSearch">搜索
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源">
        <template slot-scope="scope">
          <span>{{ formatUserSource(scope.row.source) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名">
        <template slot-scope="scope">
          <el-tag :type="formatShiFouType(scope.row.if_true_name)">{{ formatShiFou(scope.row.if_true_name) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下款">
        <template slot-scope="scope">
          <el-tag :type="formatShiFouType(scope.row.if_down)">{{ formatShiFou(scope.row.if_down) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回款">
        <template slot-scope="scope">
          <el-tag :type="formatShiFouType(scope.row.if_back)">{{ formatShiFou(scope.row.if_back) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活跃时间">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.active_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.create_at) }}</span>
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
  timeA: ['', ''],
  source: '',
  mobile: ''
}
export default {
  name: 'WhiteUser',
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
      this.$http.get('whiteUser/getTodayCount').then(response => {
        this.todayInfo = response.data
      })
      this.queryList()
    },
    queryList() {
      this.listLoading = true
      this.$http.get('whiteUser/getWhiteUsers', {
        ...this.formatSearch(this.searchForm),
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
