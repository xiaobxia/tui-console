<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="dialogTitle"
    append-to-body
    width="1200px"
  >
    <div v-if="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px" label-suffix="：">
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
              <img v-if="form.icon_url" :src="form.icon_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="name" label="名称">
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="status" label="状态">
              <el-select v-model="form.status" :style="{width: '100%'}" class="filter-item">
                <el-option :value="1" label="上架"/>
                <el-option :value="2" label="下架"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="url" label="链接">
              <el-input v-model="form.url"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="type" label="产品类型">
              <el-select v-model="form.type" :style="{width: '100%'}" class="filter-item">
                <el-option :value="1" label="现金贷"/>
                <el-option :value="2" label="贷超"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="is_recommend" label="是否推荐">
              <el-select v-model="form.is_recommend" :style="{width: '100%'}" class="filter-item">
                <el-option :value="true" label="是"/>
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="is_activity" label="是否活动">
              <el-select v-model="form.is_activity" :style="{width: '100%'}" class="filter-item">
                <el-option :value="true" label="是"/>
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="is_rotation" label="是否轮播">
              <el-select v-model="form.is_rotation" :style="{width: '100%'}" class="filter-item">
                <el-option :value="true" label="是"/>
                <el-option :value="false" label="否"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item prop="timeRange" label="上架时间段">
              <el-time-picker
                v-model="form.timeRange"
                is-range
                value-format="HH:mm:ss"
                arrow-control
                style="width: 100%"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="unit_price_daytime" label="单价日间">
              <el-input v-model="form.unit_price_daytime"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="unit_price_nighttime" label="单价夜间">
              <el-input v-model="form.unit_price_nighttime"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item prop="platform" label="上架平台">
              <el-select
                v-model="form.platform"
                multiple
                collapse-tags
                style="width: 100%"
                placeholder="请选择">
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item prop="sort" label="排序值">
              <el-input v-model="form.sort"/>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="introduction" label="简介">
              <el-input v-model="form.introduction"/>
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
import setting from '@/setting'
import { createProductEditForm } from '@/common/models/product'

export default {
  name: 'EditDialog',
  data() {
    return {
      dialogVisible: false,
      platformList: [],
      form: createProductEditForm(),
      rules: {
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        unit_price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      loading: false,
      source: '',
      qiniuData: {
        key: '',
        token: ''
      },
      // 七牛云上传储存区域的上传域名
      upload_qiniu_url: setting.upload_qiniu_url,
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: setting.upload_qiniu_addr
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑产品' : '添加产品'
    }
  },
  created() {
  },
  methods: {
    getQiniuToken() {
      this.$http.get('tuiServer/admin/qiniu/getUploadToken').then((res) => {
        this.qiniuData.token = res.data.token
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.icon_url = this.upload_qiniu_addr + res.key
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
      this.form = createProductEditForm(row)
      this.getQiniuToken()
      this.dialogVisible = true
    },
    formatForm() {
      const startTime = (this.form.timeRange && this.form.timeRange[0]) || '00:00:00'
      const endTime = (this.form.timeRange && this.form.timeRange[1]) || '23:59:59'
      const data = {
        ...this.form,
        startTime: startTime,
        endTime: endTime
      }
      delete data.timeRange
      return data
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'tuiServer/admin/product/addProduct'
          if (this.form._id) {
            url = 'tuiServer/admin/product/editProduct'
          }
          this.$http.post(url, {
            ...this.formatForm()
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
  .avatar-uploader {
    /deep/ {
      .el-upload {
        border: 1px dashed #d9d9d9;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-upload:hover {
        border-color: #409EFF;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
</style>
