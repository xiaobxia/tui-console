<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="600px"
    title="编辑"
  >
    <el-form ref="dialogForm" :model="form" :rules="dialogFormRules" size="small" label-position="right" label-width="120px">
      <el-form-item prop="channel_code" label="渠道编码">
        <el-input v-model="form.channel_code"/>
      </el-form-item>
      <el-form-item prop="channel_name" label="渠道名称">
        <el-input v-model="form.channel_name"/>
      </el-form-item>
      <el-form-item prop="unit_price" label="单价">
        <el-input v-model="form.unit_price"/>
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
    channel_code: '',
    channel_name: '',
    unit_price: ''
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
      form: createForm(),
      dialogFormRules: {
        channel_code: [{ required: true, message: '必填', trigger: 'blur' }],
        channel_name: [{ required: true, message: '必填', trigger: 'blur' }],
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
      this.form = createForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'channel/addChannel'
          if (this.form._id) {
            url = 'channel/updateChannel'
          }
          this.$http.post(url, {
            ...this.form
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
