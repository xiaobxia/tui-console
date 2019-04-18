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
        title="渠道设置"
        type="info"/>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item prop="deduction_base" label="扣量基数">
            <el-input v-model="dialogForm.deduction_base"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="today_register_count_c" label="今日扣量结果">
            <el-input v-model="dialogForm.today_register_count_c"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="unit_price" label="今日单价">
            <el-input v-model="dialogForm.unit_price"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="channel_platform" label="跳转模式：">
            <el-select v-model="dialogForm.channel_platform" :style="{width: '100%'}" class="filter-item">
              <el-option value="下载app" label="下载app"/>
              <el-option value="h5" label="h5"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'ChannelDetail',
  data() {
    return {
      rawDetail: {},
      dialogForm: {},
      dialogFormRules: {}
    }
  },
  computed: {},
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.queryDetail()
    },
    queryDetail() {
      const params = this.$router.history.current.params
      this.$http.get('channel/getChannel', {
        channel_id: params.id
      }).then((res) => {
        this.rawDetail = Object.assign({}, res.data)
        this.dialogForm = Object.assign({}, res.data)
      })
    },
    handleBack() {
      this.$router.history.go(-1)
    },
    handleSave() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.$http.post(
            'channel/updateChannel',
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
    }
  }
}
</script>

<style>
</style>

