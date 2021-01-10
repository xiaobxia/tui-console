<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" icon="el-icon-back" @click="handleBack">返回</el-button>
      <el-button style="float: right" class="filter-item" icon="el-icon-check" type="primary" @click="handleSave">保存</el-button>
    </div>
    <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-position="right" label-width="100px">
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
            <el-input v-model="dialogForm.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="url" label="链接">
            <el-input v-model="dialogForm.url"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="introduction" label="简介">
            <el-input v-model="dialogForm.introduction"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item prop="status" label="上架状态：">
            <el-select v-model="dialogForm.status" :style="{width: '100%'}" class="filter-item">
              <el-option :value="1" label="上架"/>
              <el-option :value="2" label="下架"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="is_recommend" label="是否推荐：">
            <el-select v-model="dialogForm.is_recommend" :style="{width: '100%'}" class="filter-item">
              <el-option :value="true" label="是"/>
              <el-option :value="false" label="否"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="is_activity" label="是否活动：">
            <el-select v-model="dialogForm.is_activity" :style="{width: '100%'}" class="filter-item">
              <el-option :value="true" label="是"/>
              <el-option :value="false" label="否"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="sortIndex" label="排序值">
            <el-input v-model="dialogForm.sortIndex"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item prop="unit_price" label="单价">
            <el-input v-model="dialogForm.unit_price"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="today_register_count" label="今日注册数">
            <el-input v-model="dialogForm.today_register_count"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="type" label="类型：">
            <el-select v-model="dialogForm.type" :style="{width: '100%'}" class="filter-item">
              <el-option :value="1" label="现金贷"/>
              <el-option :value="2" label="贷超"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="platform" label="平台：">
            <el-select v-model="dialogForm.platform" :style="{width: '100%'}" class="filter-item">
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
            <el-input v-model="dialogForm.min_quota"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="max_quota" label="最高额度">
            <el-input v-model="dialogForm.max_quota"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="daily_rate" label="日利率">
            <el-input v-model="dialogForm.daily_rate"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="success_rate" label="放款成功率">
            <el-input v-model="dialogForm.success_rate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item prop="min_term" label="最低期限">
            <el-input v-model="dialogForm.min_term"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="max_term" label="最高期限">
            <el-input v-model="dialogForm.max_term"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="term_unit" label="期限单位">
            <el-select v-model="dialogForm.term_unit" :style="{width: '100%'}" class="filter-item">
              <el-option value="日" label="日"/>
              <el-option value="周" label="周"/>
              <el-option value="月" label="月"/>
              <el-option value="年" label="年"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="zhi_ma" label="芝麻分">
            <el-input v-model="dialogForm.zhi_ma"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item prop="lending_time" label="下款时间">
            <el-input v-model="dialogForm.lending_time"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="lending_time_unit" label="下款时间单位">
            <el-select v-model="dialogForm.lending_time_unit" :style="{width: '100%'}" class="filter-item">
              <el-option value="分钟" label="分钟"/>
              <el-option value="小时" label="小时"/>
              <el-option value="日" label="日"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
export default {
  name: 'ProductDetail',
  data() {
    return {
      rawDetail: {},
      dialogForm: {},
      dialogFormRules: {
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        unit_price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      icon_url: '',
      qiniuData: {
        key: '',
        token: ''
      },
      // 七牛云上传储存区域的上传域名
      upload_qiniu_url: 'http://up-z2.qiniup.com',
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: 'http://tuiinfo.menghe.top/'
    }
  },
  computed: {},
  created() {
    this.initPage()
  },
  methods: {
    getQiniuToken() {
      this.$http.get('qiniu/getUploadToken').then((res) => {
        console.log(res.data.token)
        this.qiniuData.token = res.data.token
      })
    },
    initPage() {
      this.getQiniuToken()
      this.queryDetail()
    },
    queryDetail() {
      const params = this.$router.history.current.params
      this.$http.get('product/getProduct', {
        product_id: params.id
      }).then((res) => {
        this.rawDetail = Object.assign({}, res.data)
        this.dialogForm = Object.assign({}, res.data)
        this.icon_url = res.data.icon_url
      })
    },
    handleBack() {
      this.$router.history.go(-1)
    },
    handleSave() {
      this.dialogForm.icon_url = this.icon_url
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.$http.post(
            'product/updateProduct',
            this.dialogForm
          ).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.initPage()
          }).catch(() => {
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.icon_url = this.upload_qiniu_addr + res.key
    },
    beforeAvatarUpload(file) {
      this.qiniuData.key = uuidv1() + file.name
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能是图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

