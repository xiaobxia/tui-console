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
        <!--<el-form-item label="部门编码：" prop="deptCode">-->
        <!--<el-input-->
        <!--v-model="form.deptCode"-->
        <!--:maxlength="20"-->
        <!--placeholder="请输入部门编码"-->
        <!--@input="$inputFilterNumberText(form, 'deptCode')"-->
        <!--/>-->
        <!--</el-form-item>-->
        <el-form-item label="部门名称：" prop="deptName">
          <el-input v-model="form.deptName" :maxlength="20" placeholder="请输入部门名称"/>
        </el-form-item>
        <el-form-item label="部门说明：" prop="deptDesc">
          <el-input
            :rows="4"
            v-model="form.deptDesc"
            :maxlength="200"
            type="textarea"
            placeholder="请输入部门说明"
          />
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
    'deptCode': '',
    'deptDesc': '',
    'deptName': '',
    'id': '',
    'parentId': ''
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
        deptCode: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      loading: false,
      source: ''
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑部门' : '添加部门'
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
          let url = 'dataCenter/dept/add'
          if (this.form.id) {
            url = 'dataCenter/dept/edit'
          }
          this.$http.post(url, {
            ...this.form
          }).then(() => {
            this.$oLog(
              this.dialogTitle,
              `部门名：${this.form.deptName}`
            )
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
