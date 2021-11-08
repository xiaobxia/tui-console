<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="dialogTitle"
    append-to-body
    width="600px"
  >
    <div v-if="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="渠道编码：" prop="code">
          <el-input
            v-model="form.code"
            :maxlength="20"
            placeholder="请输入渠道编码"
          />
        </el-form-item>
        <el-form-item label="渠道名称：" prop="name">
          <el-input v-model="form.name" :maxlength="20" placeholder="请输入渠道名称"/>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" size="small" type="primary" @click="okHandler">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
function createForm(tar) {
  let raw = {
    'code': '',
    'name': '',
    'status': 1
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'EditDialog',
  data() {
    return {
      dialogVisible: false,
      form: createForm(),
      rules: {
        code: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      loading: false,
      source: ''
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑渠道' : '添加渠道'
    }
  },
  created() {
  },
  methods: {
    open(row) {
      this.form = createForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'tuiServer/admin/channel/addChannel'
          if (this.form._id) {
            url = 'tuiServer/admin/channel/editChannel'
          }
          this.$http.post(url, {
            ...this.form
          }).then(() => {
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
