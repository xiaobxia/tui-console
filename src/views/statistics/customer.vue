<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" :model="searchForm" label-position="left" label-width="100px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="status" label="激活状态：">
              <el-select v-model="searchForm.status" :style="{width: '100%'}" class="filter-item">
                <el-option label="全部" value=""/>
                <el-option :value="1" label="激活"/>
                <el-option :value="2" label="未激活"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="device_type" label="渠道名称：">
              <el-select v-model="searchForm.source_channel_id" :style="{width: '100%'}" class="filter-item">
                <el-option v-for="(item, index) in channelList" :label="item.channel_name" :value="item._id" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column align="center" label="渠道名">
        <template slot-scope="scope">
          <span>{{ scope.row.source_channel_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最近验证码">
        <template slot-scope="scope">
          <span>{{ scope.row.verification_code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下载app">
        <template slot-scope="scope">
          <el-tag :type="formatShiFouType(scope.row.has_download)">{{ formatShiFou(scope.row.has_download) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用app">
        <template slot-scope="scope">
          <el-tag :type="formatShiFouType(scope.row.has_app)">{{ formatShiFou(scope.row.has_app) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="页面浏览次数">
        <template slot-scope="scope">
          <span>{{ scope.row.view_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品点击">
        <template slot-scope="scope">
          <span>{{ scope.row.click_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活跃度">
        <template slot-scope="scope">
          <span>{{ scope.row.brisk_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上次活跃">
        <template slot-scope="scope">
          <span>{{ scope.row.last_brisk_day }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="激活状态">
        <template slot-scope="scope">
          <el-tag :type="formatStatusType(scope.row.status)">{{ scope.row.status === 1 ? '激活':'未激活' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间" width="200">
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
  status: '',
  source_channel_id: '',
  time: ['', '']
}
export default {
  name: 'StatisticsCustomer',
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
      this.$http.get('user/getCustomers', {
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
    formatPage(page) {
      if (page === 'register') {
        return '注册页'
      } else if (page === 'home') {
        return '首页'
      } else if (page === 'loan') {
        return '借款'
      } else {
        return '-'
      }
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
