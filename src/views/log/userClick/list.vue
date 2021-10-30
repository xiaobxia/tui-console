<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" size="small" label-position="left" label-width="80px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="channel_code" label="渠道">
              <el-select v-model="searchForm.channel_code" :style="{width: '100%'}" class="filter-item">
                <el-option label="全部" value=""/>
                <el-option
                  v-for="(item) in channelList"
                  :key="item._id"
                  :disabled="item.status !== 1"
                  :value="item.channel_code"
                  :label="item.channel_name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="phone" label="手机号">
              <el-input v-model="searchForm.phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="time" label="时间">
              <el-date-picker
                v-model="searchForm.time"
                style="width: 100%"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              class="filter-item"
              size="small"
              icon="el-icon-refresh"
              type="primary"
              @click="handleResetSearch">重置
            </el-button>
            <el-button
              :loading="searchLoading"
              class="filter-item"
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="handleSearch">搜索
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="渠道名">
        <template slot-scope="scope">
          <span>{{ channelMap[scope.row.channel_code] || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ip">
        <template slot-scope="scope">
          <span>{{ scope.row.ip || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台">
        <template slot-scope="scope">
          <span>{{ scope.row.platform || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.product_id || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
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
import excel from '@/vendor/Export2Excel'
import moment from 'moment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const searchFormBase = {
  time: ['', ''],
  phone: '',
  channel_code: ''
}
export default {
  name: 'DownUser',
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
      channelMap: {},
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
      this.queryChannel()
      this.queryList()
    },
    queryList() {
      this.listLoading = true
      this.$http.get('log/getUserClickByPage', {
        ...this.formatSearch(this.searchForm),
        ...this.listQuery
      }).then(response => {
        this.list = response.data.list
        this.listTotal = response.data.count
        this.listLoading = false
      })
    },
    queryChannel() {
      this.$http.get('channel/getChannelsAll').then((res) => {
        this.channelList = res.data.list
        const channelMap = {}
        this.channelList.forEach((v) => {
          channelMap[v.channel_code] = v.channel_name
        })
        this.channelMap = channelMap
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

    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        switch (j) {
          case 'down_at':
            return this.formatDateTime(v[j])
        }
        return v[j] || ''
      }))
    },
    handleExportToday() {
      this.$http.get('whiteUser/getDownUsers', {
        current: 1,
        pageSize: 1000,
        // beginTime: '2019-07-11 00:00:00',
        // endTime: '2019-07-12 00:00:00'
        beginTime: moment(moment().format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(moment().add(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss')
      }).then((res) => {
        const list = res.data.list
        const tHeader = ['号码', '姓名', '下款时间']
        const filterVal = ['mobile', 'name', 'down_at']
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '下-' + moment().format('YYYY-MM-DD') + `-${parseInt(Math.random() * 10)}`,
          autoWidth: true,
          bookType: 'xlsx'
        })
      }).catch(() => {
      })
    },
    handleExportTodayNo() {
      const start = moment(moment().format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss')
      const end = moment(moment().add(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss')
      this.$http.get('whiteUser/getDownUsers', {
        current: 1,
        pageSize: 1000,
        beginTime: start,
        endTime: end
        // beginTime: moment(moment().format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss'),
        // endTime: moment(moment().add(1, 'days').format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss')
      }).then((res) => {
        const list = res.data.list
        const newList = []
        for (let i = 0; i < list.length; i++) {
          if (!(list[i]['back_at'] && moment(list[i]['back_at']).isAfter(start) && moment(list[i]['back_at']).isBefore(end))) {
            newList.push(list[i])
          }
        }
        const tHeader = ['号码', '姓名', '下款时间']
        const filterVal = ['mobile', 'name', 'down_at']
        const data = this.formatJson(filterVal, newList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '下n-' + moment().format('YYYY-MM-DD') + `-${parseInt(Math.random() * 10)}`,
          autoWidth: true,
          bookType: 'xlsx'
        })
      }).catch(() => {
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
