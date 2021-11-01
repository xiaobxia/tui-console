<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="1000px"
  >
    <span slot="title" class="el-dialog__title">
      <span style="margin-right: 50px">选择摘要</span>
      <!--      <el-checkbox v-if="!isTmpModelDigest" v-model="commonUse" :true-label="1" :false-label="0">每次录入自动添加为常用</el-checkbox>-->
    </span>
    <div v-if="dialogVisible">
      <div class="filter-container">
        <div class="left-block">
          <el-input v-model="condition" style="width: 200px;" suffix-icon="el-icon-search" size="small" placeholder="请输入摘要名称" @change="reQueryList"/>
        </div>
        <div class="right-block">
          <el-button v-if="$hasPermission('/account/basicSetup/abstractLibrary/add')" type="primary" size="small" @click="openAdd">新增</el-button>
          <el-button v-if="$hasPermission('/account/basicSetup/abstractLibrary/delete')" type="primary" size="small" @click="multipleDeleteHandler">删除</el-button>
        </div>
      </div>
      <el-table
        :data="digestList"
        :highlight-current-row="true"
        border
        style="width: 100%"
        @row-dblclick="selectRow"
        @current-change="currentChange">
        <el-table-column
          prop="encode"
          label="编码"
          align="left"
          header-align="center"
          width="150"/>
        <el-table-column
          prop="value"
          align="left"
          header-align="center"
          label="摘要"/>
      </el-table>
      <div class="page-wrap">
        <pagination :page="current" :limit="size" :total="total" @pagination="paginationChange"/>
      </div>
      <add-digest-dialog ref="addDigestDialog" @ok="addDigestDialogOk"/>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import AddDigestDialog from '@/businessComponents/AddDigestDialog'

export default {
  name: 'DigestSelect',
  components: {
    Pagination,
    AddDigestDialog
  },
  props: {
    isTmpModelDigest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      condition: '',
      dialogVisible: false,
      digestList: [],
      current: 1,
      total: 0,
      size: 10,
      commonUse: 0,
      currentRow: {},
      source: ''
    }
  },
  computed: {
    ...mapGetters([
      'digestCommonUse'
    ])
  },
  watch: {
    commonUse(value) {
      this.$store.commit('SET_DIGEST_COMMON_USE', value === 1)
    }
  },
  created() {
  },
  methods: {
    reQueryList() {
      this.current = 1
      this.size = 10
      this.queryList()
    },
    queryList() {
      this.$http.post('account/cert/getDigest', {
        condition: this.condition,
        currPage: this.current,
        pageSize: this.size,
        bookId: this.$commonQueryParam.bookId,
        orgId: this.$commonQueryParam.orgId,
        year: this.$commonQueryParam.year
      }).then((res) => {
        this.digestList = res.data.list
        this.total = parseFloat(res.data.totalNum || 0)
      })
    },
    paginationChange(info) {
      this.current = info.page
      this.size = info.limit
      this.queryList()
    },
    open({ source }) {
      this.multipleSelection = []
      this.commonUse = this.digestCommonUse
      source !== '' && (this.source = source)
      this.queryList()
      this.dialogVisible = true
    },
    selectRow(row) {
      this.$emit('ok', row.value)
      this.dialogVisible = false
    },
    openAdd() {
      this.$refs.addDigestDialog.open(this.source !== '' ? this.source : '')
    },
    addDigestDialogOk() {
      this.reQueryList()
    },
    currentChange(currentRow) {
      this.currentRow = currentRow
    },
    multipleDeleteHandler() {
      if (this.currentRow && this.currentRow.phid) {
        this.deleteHandler([this.currentRow.phid])
        this.currentChange({})
      } else {
        this.$message.warning('请选择一条数据进行操作！')
      }
    },
    deleteHandler(deleteIds) {
      this.$confirm('一旦删除，将不可恢复，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$http.post('account/baseData/batchDelete', {
          deleteIds
        }).then(() => {
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
  .page-wrap {
    padding-top: 10px;
    text-align: right;
  }
</style>
