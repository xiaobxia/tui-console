<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="新增数据"
    width="500px"
    append-to-body
  >
    <div class="dialog__body">
      <el-form
        v-if="dialogVisible"
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="70px"
        size="small"
      >
        <el-form-item
          label="编码"
          prop="encode"
        >
          <el-input
            v-model="formData.encode"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="okHandler"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AccountBankAdd',
  data() {
    return {
      dialogVisible: false,
      formData: {
        encode: '',
        name: '',
        levels: 1,
        parentId: 0,
        status: 0,
        type: 1
      },
      rules: {
        encode: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 20, message: '长度20个字符以内', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 20, message: '长度20个字符以内', trigger: 'blur' }
        ]
      },
      query: {},
      type: []
    }
  },
  created() {
  },
  methods: {
    open(query, type) {
      this.query = query
      this.type = type
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http.post('ucenter/dict-data/add', { ...this.query, ...this.formData }).then(({ status, data, message }) => {
            if (status) {
              this.dialogVisible = false
              this.$emit('ok', this.type)
            } else {
              this.$message.error(message)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
