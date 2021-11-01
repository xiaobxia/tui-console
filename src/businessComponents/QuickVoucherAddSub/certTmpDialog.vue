<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="50%" title="模板类别">
    <div class="filter-container">
      <div class="right-block">
        <el-button type="primary" size="small" @click="openAdd">新增</el-button>
      </div>
    </div>
    <el-table
      :data="certTmpList"
      border
      style="width: 100%"
      @row-dblclick="selectRow">
      <el-table-column
        prop="name"
        label="类别"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <cert-tmp-edit-dialog ref="certTmpEditDialog" @ok="certTmpEditDialogOk"/>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import CertTmpEditDialog from './certTmpEditDialog'
function createForm(tar) {
  let raw = {
    encode: '',
    value: '',
    attrValue2: '',
    phid: '',
    dataId: '',
    status: '1'
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'CertTmpDialog',
  components: {
    CertTmpEditDialog
  },
  data() {
    return {
      dialogVisible: false,
      form: createForm(),
      rules: {
        encode: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 50, message: '长度50个字符以内', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 500, message: '长度500个字符以内', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'certTmpList'
    ])
  },
  created() {
  },
  methods: {
    open() {
      this.$store.dispatch('initCertTmpList', { bookId: this.$commonQueryParam.bookId })
      this.form = createForm()
      this.dialogVisible = true
    },
    openAdd() {
      this.$refs.certTmpEditDialog.open()
    },
    editRow(row) {
      this.$refs.certTmpEditDialog.open(row)
    },
    deleteRow(row) {
      this.$confirm('一旦删除，将不可恢复，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$http.post(`account/certTmp/delCertTmpType/${row.phid}`).then(() => {
          this.$store.dispatch('initCertTmpList', { bookId: this.$commonQueryParam.bookId })
        })
      })
    },
    certTmpEditDialogOk() {
      this.$store.dispatch('initCertTmpList', { bookId: this.$commonQueryParam.bookId })
    },
    selectRow(row) {
      this.$emit('ok', row.phid)
      this.dialogVisible = false
    },
    okHandler() {
      this.dialogVisible = false
      this.$emit('ok')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
