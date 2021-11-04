<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="dialogTitle"
    append-to-body
    width="1200px"
  >
    <div v-if="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-alert
          :closable="false"
          style="margin-bottom: 20px"
          title="平台设置"
          type="info"/>
        <el-row :gutter="12">
          <el-form-item prop="icon_url" label="app图标">
            <el-upload
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="qiniuData"
              :action="upload_qiniu_url"
              class="avatar-uploader">
              <img v-if="icon_url" :src="icon_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="name" label="产品名称">
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="url" label="链接">
              <el-input v-model="form.url"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="introduction" label="简介">
              <el-input v-model="form.introduction"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="status" label="上架状态：">
              <el-select v-model="form.status" :style="{width: '100%'}" class="filter-item">
                <el-option :value="1" label="上架"/>
                <el-option :value="2" label="下架"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="is_recommend" label="是否推荐：">
              <el-select v-model="form.is_recommend" :style="{width: '100%'}" class="filter-item">
                <el-option :value="true" label="是"/>
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="is_activity" label="是否活动：">
              <el-select v-model="form.is_activity" :style="{width: '100%'}" class="filter-item">
                <el-option :value="true" label="是"/>
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="sortIndex" label="排序值">
              <el-input v-model="form.sortIndex"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="unit_price" label="单价">
              <el-input v-model="form.unit_price"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="today_register_count" label="今日注册数">
              <el-input v-model="form.today_register_count"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="type" label="类型：">
              <el-select v-model="form.type" :style="{width: '100%'}" class="filter-item">
                <el-option :value="1" label="现金贷"/>
                <el-option :value="2" label="贷超"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="platform" label="平台：">
              <el-select v-model="form.platform" :style="{width: '100%'}" class="filter-item">
                <el-option :value="1" label="甲方"/>
                <el-option :value="2" label="乙方"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert
          :closable="false"
          style="margin-bottom: 20px"
          title="产品信息"
          type="success"/>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="min_quota" label="最低额度">
              <el-input v-model="form.min_quota"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="max_quota" label="最高额度">
              <el-input v-model="form.max_quota"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="daily_rate" label="日利率">
              <el-input v-model="form.daily_rate"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="success_rate" label="放款成功率">
              <el-input v-model="form.success_rate"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="min_term" label="最低期限">
              <el-input v-model="form.min_term"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="max_term" label="最高期限">
              <el-input v-model="form.max_term"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="term_unit" label="期限单位">
              <el-select v-model="form.term_unit" :style="{width: '100%'}" class="filter-item">
                <el-option value="日" label="日"/>
                <el-option value="周" label="周"/>
                <el-option value="月" label="月"/>
                <el-option value="年" label="年"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="zhi_ma" label="芝麻分">
              <el-input v-model="form.zhi_ma"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="lending_time" label="下款时间">
              <el-input v-model="form.lending_time"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="lending_time_unit" label="下款时间单位">
              <el-select v-model="form.lending_time_unit" :style="{width: '100%'}" class="filter-item">
                <el-option value="分钟" label="分钟"/>
                <el-option value="小时" label="小时"/>
                <el-option value="日" label="日"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" size="small" type="primary" @click="okHandler">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import uuid from 'uuid/v1'
function createForm(tar) {
  let raw = {
    'name': '',
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
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        unit_price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      loading: false,
      source: '',
      icon_url: '',
      qiniuData: {
        key: '',
        token: ''
      },
      // 七牛云上传储存区域的上传域名
      upload_qiniu_url: 'http://up-z0.qiniup.com',
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: 'http://tuiinfo.xiaobxia.com/'
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑产品' : '添加产品'
    }
  },
  created() {
    this.getQiniuToken()
  },
  methods: {
    getQiniuToken() {
      this.$http.get('qiniu/getUploadToken').then((res) => {
        this.qiniuData.token = res.data.token
      })
    },
    handleAvatarSuccess(res, file) {
      this.icon_url = this.upload_qiniu_addr + res.key
    },
    beforeAvatarUpload(file) {
      this.qiniuData.key = uuid() + file.name
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('只能是图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    open(row) {
      this.form = createForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'tuiServer/admin/product/addProduct'
          if (this.form.id) {
            url = 'dataCenter/dept/edit'
          }
          this.$http.post(url, {
            ...this.form
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
