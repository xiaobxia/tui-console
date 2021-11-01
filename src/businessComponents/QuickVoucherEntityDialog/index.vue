<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" :destroy-on-close="true" title="存为模板" width="500px">
    <el-form ref="form" :model="hsCertTmpDataEntity" :rules="rules" size="small" auto-complete="off" label-position="right" label-width="100px">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="hsCertTmpDataEntity.name" maxlength="20"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="hsCertTmpDataEntity.remark" maxlength="200"/>
      </el-form-item>
      <el-form-item label="模板类别" prop="certTmpType">
        <el-select v-model="hsCertTmpDataEntity.certTmpType" class="theme-select">
          <el-option v-for="(item, index) in certTmpList" :key="index" :label="item.name" :value="item.phid"/>
          <div class="select-b-btn-wrap">
            <el-button style="width: 100%" type="text" icon="el-icon-plus" size="small" @click="addNewCertTmpType">新增类别</el-button>
          </div>
          <div slot="empty" style="margin: 10px 0" class="select-b-btn-wrap">
            <el-button style="width: 100%" type="text" icon="el-icon-plus" size="small" @click="addNewCertTmpType">新增类别</el-button>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="凭证类型" prop="mark">
        <el-select v-model="certType" class="theme-select">
          <el-option v-for="(item, index) in certTypeList" :key="index" :label="item.certValue" :value="item.phid"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="loading" size="small" type="primary" @click="okHandler">确定</el-button>
    </div>
    <cert-tmp-dialog ref="certTmpDialog" @ok="certTmpDialogOk"/>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { createHsCertTmpDataEntity } from '@/common/create'
import CertTmpDialog from '@/businessComponents/QuickVoucherAddSub/certTmpDialog'
export default {
  name: 'QuickVoucherEntityDialog',
  components: {
    CertTmpDialog
  },
  data() {
    return {
      dialogVisible: false,
      hsCertTmpDataEntity: createHsCertTmpDataEntity(),
      certType: '',
      loading: false,
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 20, message: '长度20个字符以内', trigger: 'blur' }
        ],
        remark: [
          // { required: true, message: '必填', trigger: 'blur' },
          { max: 200, message: '长度200个字符以内', trigger: 'blur' }
        ],
        certTmpType: [
          { required: true, message: '必选', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'certTypeList',
      'certTmpList'
    ])
  },
  watch: {
  },
  created() {
  },
  methods: {
    open(certType) {
      this.$store.dispatch('initCertTmpList', { bookId: this.$commonQueryParam.bookId })
      this.loading = false
      this.hsCertTmpDataEntity = createHsCertTmpDataEntity({
        ...this.$commonQueryParam,
        tmpYear: this.$commonQueryParam.year
      })
      this.certType = certType
      this.dialogVisible = true
    },
    reset() {
      this.loading = false
    },
    close() {
      this.loading = false
      this.dialogVisible = false
    },
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('ok', {
            hsCertTmpDataEntity: this.hsCertTmpDataEntity,
            certType: this.certType
          })
          this.loading = true
        }
      })
    },
    certTmpDialogOk(phid) {
      this.hsCertTmpDataEntity.certTmpType = phid
    },
    addNewCertTmpType() {
      this.$refs.certTmpDialog.open()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
