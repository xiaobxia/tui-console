<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :title="dialogType==='add'?'新增类别':'编辑类别'" append-to-body width="50%">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" @submit.native.prevent>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="50" @keyup.enter.native="okHandler"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" size="small" type="primary" @click="okHandler">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
function createForm(tar) {
  let raw = {
    name: ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'CertTmpEditDialog',
  data() {
    return {
      dialogVisible: false,
      dialogType: 'add',
      form: createForm(),
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 50, message: '长度50个字符以内', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {},
  created() {
  },
  methods: {
    open(row) {
      if (row) {
        this.dialogType = 'edit'
        this.form = createForm(row)
      } else {
        this.dialogType = 'add'
        this.form = createForm()
      }
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'account/certTmp/addTmpType'
          if (this.dialogType === 'edit') {
            url = 'account/certTmp/updTmpType'
          }
          this.$http.post(url, {
            ...this.form,
            bookId: this.$commonQueryParam.bookId
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.dialogVisible = false
            this.$emit('ok')
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
