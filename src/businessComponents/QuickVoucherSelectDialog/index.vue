<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" append-to-body width="800px" title="凭证模板">
    <div class="filter-container">
      <div class="left-block">
        <el-input v-model="name" style="width: 200px;" suffix-icon="el-icon-search" size="small" placeholder="模板名称" @change="reQueryList"/>
      </div>
      <div class="right-block">
        <el-button type="primary" size="small" @click="addNew">新增</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :border="true"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      tooltip-effect="dark"
      style="width: 100%"
      @row-dblclick="useRow">
      <el-table-column
        label="模板名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="useRow(scope.row)">使用</el-button>
          <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pp">
      <pagination :page="current" :limit="size" :total="total" @pagination="paginationChange"/>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="innerVisible"
      :title="addTitle"
      width="1300px"
      append-to-body>
      <div class="c-b">
        <old v-if="innerVisible && type === 'old'" :edit-type="innerEditType" :phid="innerPhid" mode="dialog" @ok="innerOk"/>
        <new v-if="innerVisible && type === 'new'" :edit-type="innerEditType" :phid="innerPhid" mode="dialog" @ok="innerOk"/>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import Old from '@/businessComponents/QuickVoucherAddSub/old'
import New from '@/businessComponents/QuickVoucherAddSub/new'
export default {
  name: 'QuickVoucherSelectDialog',
  components: {
    Pagination,
    Old,
    New
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      current: 1,
      size: 10,
      total: 0,
      name: '',
      type: 'old',
      innerVisible: false,
      innerEditType: 'add',
      innerPhid: '',
      addTitle: '新增凭证模板'
    }
  },
  computed: {
    ...mapGetters([
      'bookInfo'
    ])
  },
  created() {
    if (this.bookInfo.isNewAccounts === '1') {
      this.type = 'new'
    }
  },
  methods: {
    open() {
      this.current = 1
      this.size = 10
      this.queryList().then(() => {
        this.dialogVisible = true
      })
    },
    reQueryList() {
      this.current = 1
      this.size = 10
      this.queryList()
    },
    queryList() {
      return this.$http.post('account/certTmp/findCertTmpList', {
        bookId: this.$commonQueryParam.bookId,
        phCurorgid: this.$commonQueryParam.orgId,
        year: this.$commonQueryParam.year,
        name: this.name,
        current: this.current,
        size: this.size
      }).then((res) => {
        const data = res.data
        this.tableData = data.records
        this.total = data.total
      })
    },
    paginationChange(info) {
      this.current = info.page
      this.size = info.limit
      this.queryList()
    },
    useRow(row) {
      return this.$http.post(`account/certTmp/useCertTmp/${row.phid}`).then((res) => {
        this.$emit('ok', res.data)
        this.dialogVisible = false
      })
    },
    editRow(row) {
      this.innerVisible = true
      this.innerEditType = 'edit'
      this.innerPhid = row.phid
      this.addTitle = '编辑凭证模板'
    },
    innerOk() {
      this.innerVisible = false
      this.reQueryList()
    },
    addNew() {
      this.innerVisible = true
      this.innerEditType = 'add'
      this.innerPhid = ''
      this.addTitle = '新增凭证模板'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .pp {
    text-align: right;
    margin-top: 10px;
  }
  .c-b {
    max-height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
