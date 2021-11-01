<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    title="新增摘要"
  >
    <div v-if="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="encode">
          <el-input v-model="form.encode" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="摘要" prop="value">
          <el-input v-model="form.value" :maxlength="200"/>
        </el-form-item>
        <el-form-item label="备注" prop="attrValue2">
          <el-input v-model="form.attrValue2" :maxlength="200"/>
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
import formValidate from '@/utils/formValidate'
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
  name: 'AddDigestDialog',
  data() {
    return {
      dialogVisible: false,
      form: createForm(),
      rules: {
        encode: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 50, message: '长度50个字符以内', trigger: 'blur' },
          { validator: formValidate.validateNumberText, trigger: 'blur' }
        ],
        value: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 200, message: '长度200个字符以内', trigger: 'blur' }
        ]
      },
      loading: false,
      source: ''
    }
  },
  computed: {},
  created() {
  },
  methods: {
    open(source) {
      this.form = createForm()
      this.source = source !== '' ? source : ''
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post('account/baseData/addDataDtl', {
            ...this.form,
            bookId: this.$commonQueryParam.bookId,
            dataEncode: 'summarySetting',
            isAuto: '1',
            phCurorgid: this.$commonQueryParam.orgId,
            source: this.source !== '' ? this.source : 1
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
