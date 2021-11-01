<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destory-on-close="true"
    append-to-body
    title="修改密码"
    width="600px"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
    >
      <el-form-item
        label="旧密码："
        prop="passWord"
      >
        <el-input
          v-model="form.passWord"
          clearable
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="新密码："
        prop="newPassWord"
      >
        <el-input
          v-model="form.newPassWord"
          type="password"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="确认密码："
        prop="checkPass"
      >
        <el-input
          v-model="form.checkPass"
          type="password"
          clearable
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="save"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import authUtil from '@/utils/authUtil'
import formValidate from '@/utils/formValidate'
import DES from '@/lib/DES'
import { mapGetters } from 'vuex'

function createForm(tar) {
  let raw = {
    'newPassWord': '',
    'passWord': '',
    'checkPass': '',
    'userId': ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'EditPwd',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassWord) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: createForm(),
      rules: {
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        newPassWord: [
          { required: true, validator: formValidate.validatePassWord, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$http.post('dataCenter/user/updatePassword', {
            'newPassWord': DES.encrypt(this.form.newPassWord),
            'passWord': DES.encrypt(this.form.passWord),
            userId: this.userInfo.uid
          }).then((res) => {
            this.$message.success('修改成功，3秒后将跳转至登录页，请重新登录！')
            this.dialogVisible = false
            setTimeout(() => {
              authUtil.removeUser()
              window.location.reload()
            }, 3000)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
