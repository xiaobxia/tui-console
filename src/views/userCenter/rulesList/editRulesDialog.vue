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
        <!--<el-form-item label="角色编码：" prop="code">-->
        <!--<el-input-->
        <!--v-model="form.code"-->
        <!--:maxlength="20"-->
        <!--@input="$inputFilterNumberText(form, 'code')"-->
        <!--/>-->
        <!--</el-form-item>-->
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="form.name" :maxlength="20"/>
        </el-form-item>
        <el-form-item label="部门：" prop="deptId">
          <el-select
            v-model="form.deptId"
            style="width: 100%"
            size="small"
          >
            <el-option
              v-for="item of deptList"
              :key="item.id"
              :value="item.id"
              :label="item.deptName"
            />
          </el-select>
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
    'deptId': '',
    'id': '',
    'name': '',
    'status': 1
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'EditRulesDialog',
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
        ],
        deptId: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      loading: false,
      source: '',
      deptList: []
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑角色' : '添加角色'
    }
  },
  created() {
  },
  methods: {
    open(row) {
      this.form = createForm(row)
      this.queryDeptList()
      this.dialogVisible = true
    },
    queryDeptList() {
      this.$http.get('dataCenter/dept/findAllPageByCondition', {
        pageIndex: 1,
        pageSize: 9999
      }).then((res) => {
        const data = res.data || {}
        this.deptList = data.records || []
      })
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'dataCenter/role/add'
          if (this.form.id) {
            url = 'dataCenter/role/edit'
          }
          this.$http.post(url, {
            ...this.form
          }).then(() => {
            this.$oLog(
              this.dialogTitle,
              `角色名：${this.form.name}`
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
