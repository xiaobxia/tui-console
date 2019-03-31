<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" label-position="left" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="device_type" label="渠道名称：">
              <el-select v-model="searchForm.source_channel_id" :style="{width: '100%'}" class="filter-item">
                <el-option v-for="(item, index) in channelList" :label="item.channel_name" :value="item._id" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="device_type" label="设备类型：">
              <el-select v-model="searchForm.device_type" :style="{width: '100%'}" class="filter-item">
                <el-option label="全部" value=""/>
                <el-option value="苹果" label="苹果"/>
                <el-option value="安卓" label="安卓"/>
                <el-option value="微信" label="微信"/>
                <el-option value="其他" label="其他"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="device_id" label="设备id：">
              <el-input v-model="searchForm.device_id"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item prop="time" label="浏览时间：">
              <el-date-picker
                v-model="searchForm.time"
                style="width: 100%"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
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
      <el-table-column align="center" label="渠道名">
        <template slot-scope="scope">
          <span>{{ scope.row.source_channel_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.device_type }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备id">
        <template slot-scope="scope">
          <span>{{ scope.row.device_id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="200">
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
  source_channel_id: '',
  device_id: '',
  device_type: '',
  time: ['', '']
}
export default {
  name: 'StatisticsRegisterView',
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
      channelList: []
    }
  },
  created() {
    this.queryChannel()
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
        } else {
          data[key] = this.searchForm[key]
        }
      }
      return data
    },
    queryChannel() {
      this.$http.get('channel/getChannelsAll').then(response => {
        const list = [
          {
            channel_name: '全部',
            _id: ''
          },
          {
            channel_name: '系统',
            _id: 'sys'
          }
        ]
        this.channelList = list.concat(response.data.list)
      })
    },
    initPage() {
      this.queryList()
    },
    queryList() {
      this.listLoading = true
      this.$http.get('log/getRegisterViewLog', {
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
