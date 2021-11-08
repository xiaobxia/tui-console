<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="dialogTitle"
    append-to-body
    width="600px"
  >
    <div v-if="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item label="编码：" prop="code">
          <el-input
            v-model="form.code"
            :maxlength="20"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" :maxlength="20" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="channel_id" label="渠道">
          <el-select
            v-model="form.channel_id"
            style="width: 100%"
            placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item._id"
              :label="item.name"
              :value="item._id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="platform_id" label="平台">
          <el-select
            v-model="form.platform_id"
            style="width: 100%"
            placeholder="请选择">
            <el-option
              v-for="item in platformList"
              :key="item._id"
              :label="item.name"
              :value="item._id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="扣量基数：" prop="deduction_base">
          <el-input v-model="form.deduction_base" :maxlength="20" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="单价日间：" prop="unit_price_daytime">
          <el-input v-model="form.unit_price_daytime" :maxlength="20" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="单价夜间：" prop="unit_price_nighttime">
          <el-input v-model="form.unit_price_nighttime" :maxlength="20" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="dayTimeRange" label="日间价时间">
          <el-time-picker
            v-model="form.dayTimeRange"
            is-range
            value-format="HH:mm:ss"
            arrow-control
            style="width: 100%"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"/>
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
import { mapGetters } from 'vuex'
import { createChannelPlatformEditForm } from '@/common/models/channelPlatform'

export default {
  name: 'EditDialog',
  data() {
    return {
      dialogVisible: false,
      form: createChannelPlatformEditForm(),
      rules: {
        code: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      loading: false,
      source: ''
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑渠道平台' : '添加渠道平台'
    },
    ...mapGetters([
      'platformList',
      'channelList'
    ])
  },
  created() {
  },
  methods: {
    open(row) {
      this.form = createChannelPlatformEditForm(row)
      this.dialogVisible = true
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let url = 'tuiServer/admin/channelPlatform/addChannelPlatform'
          if (this.form._id) {
            url = 'tuiServer/admin/channelPlatform/editChannelPlatform'
          }
          this.$http.post(url, {
            ...this.form
          }).then(() => {
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
