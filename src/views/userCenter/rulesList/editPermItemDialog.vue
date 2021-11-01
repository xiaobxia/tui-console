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
        <el-form-item label="权限编码：" prop="permUrl">
          <el-input
            v-model="form.permUrl"
            :maxlength="2"
            placeholder="请输入权限编码"
            @input="$inputFilterNumberText(form, 'permUrl')"
          >
            <template v-if="form.parentCode" slot="prepend">{{ form.parentCode }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="权限名称：" prop="permName">
          <el-input v-model="form.permName" :maxlength="20" placeholder="请输入权限名称"/>
        </el-form-item>
        <el-form-item label="类型：" prop="permType">
          <el-radio-group v-model="form.permType">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
            <el-radio :label="4">数据查看</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%"/>
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
    'parentCode': '',
    'icon': '',
    'id': '',
    'moduleName': '',
    'parentId': '',
    'path': '',
    'permHrefUrl': '',
    'permName': '',
    'permType': 1,
    'permUrl': '',
    'sort': 0
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
        permUrl: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        permName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        permType: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      loading: false,
      source: ''
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑权限' : '添加权限'
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
          let url = 'dataCenter/perm/add'
          if (this.form.id) {
            url = 'dataCenter/perm/edit'
          }
          this.$http.post(url, {
            ...this.form,
            permUrl: this.form.parentCode + this.form.permUrl,
            moduleName: this.form.moduleName || this.form.permUrl
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
