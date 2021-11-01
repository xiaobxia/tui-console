<template>
  <div class="container-card">
    <div class="filter-container">
      <div class="left-block">
        <span class="label-text">操作人</span>
        <el-input
          v-model="searchForm.operateName"
          style="width: 120px"
          size="small"
          maxlength="20"
        />
        <span class="label-text">操作时间</span>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          size="small"
          style="width: 240px"
          range-separator="至"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"/>
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
      <el-table-column
        prop="pubCreatorName"
        label="操作人"
      />
      <el-table-column
        min-width="150"
        prop="operationContent"
        label="操作内容"
      />
      <el-table-column
        min-width="200"
        prop="contentDetail"
        label="内容详情"
      />
      <el-table-column
        prop="pubCreatorDt"
        label="操作时间"
      />
    </el-table>
    <div class="page-pagination">
      <pagination
        :page="current"
        :limit="size"
        :total="total"
        @pagination="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

function createSearchForm(tar) {
  let raw = {
    'operateName': '',
    'startTime': '',
    'endTime': '',
    dateRange: ['', '']
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'UserCenterLogList',
  components: {
    Pagination
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
      const startTime = (this.searchForm.dateRange && this.searchForm.dateRange[0]) || ''
      const endTime = (this.searchForm.dateRange && this.searchForm.dateRange[1]) || ''
      const data = {
        ...this.searchForm,
        pageIndex: this.current,
        pageSize: this.size,
        startTime: startTime ? `${startTime} 00:00:00` : '',
        endTime: endTime ? `${endTime} 23:59:59` : ''
      }
      delete data.dateRange
      return data
    },
    queryList() {
      this.$http.post('dataCenter/OperateLog/findAllPageByCondition', {
        ...this.formatSearchForm()
      }).then((res) => {
        const data = res.data || {}
        this.total = parseInt(data.totalCount) || 0
        this.tableData = data.records || []
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
