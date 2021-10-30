<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="600px"
    title="编辑"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" size="small" label-position="right" label-width="120px">
      <el-form-item prop="name" label="产品名称">
        <el-input v-model="dialogForm.name"/>
      </el-form-item>
      <el-form-item prop="url" label="链接">
        <el-input v-model="dialogForm.url"/>
      </el-form-item>
      <el-form-item prop="unit_price" label="单价">
        <el-input v-model="dialogForm.unit_price"/>
      </el-form-item>
      <el-form-item prop="introduction" label="简介">
        <el-input v-model="dialogForm.introduction"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="okHandler">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
function createForm(tar) {
  let raw = {
    name: '',
    url: '',
    unit_price: '',
    introduction: ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'AddDigestDialog',
  data() {
    return {
      dialogVisible: false,
      dialogForm: createForm(),
      dialogFormRules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        url: [{ required: true, message: '必填', trigger: 'blur' }],
        unit_price: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      loading: false
    }
  },
  computed: {},
  created() {
  },
  methods: {
    open(row) {
      this.dialogForm = createForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'product/addProduct'
          if (this.dialogForm._id) {
            url = 'channel/updateChannel'
          }
          this.$http.post(url, {
            ...this.dialogForm
          }).then(() => {
            this.loading = false
            this.dialogVisible = false
            this.$emit('ok')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
