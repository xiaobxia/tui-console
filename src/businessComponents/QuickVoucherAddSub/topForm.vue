<template>
  <el-form ref="form" :model="hsCertTmpDataEntityTemp" :rules="rules" label-width="90px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="hsCertTmpDataEntityTemp.name"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="模板类别" prop="remark">
          <el-select v-model="hsCertTmpDataEntityTemp.certTmpType" class="theme-select">
            <el-option v-for="(item, index) in certTmpList" :key="index" :label="item.name" :value="item.phid"/>
            <div class="select-b-btn-wrap">
              <el-button style="width: 100%" type="text" icon="el-icon-plus" size="small" @click="addNewCertTmpType">新增类别</el-button>
            </div>
            <div slot="empty" style="margin: 10px 0" class="select-b-btn-wrap">
              <el-button style="width: 100%" type="text" icon="el-icon-plus" size="small" @click="addNewCertTmpType">新增类别</el-button>
            </div>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input :maxlength="200" v-model="hsCertTmpDataEntityTemp.remark"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-if="!+bookInfo.isNewAccounts" :span="12">
        <el-form-item label="凭证类型">
          <el-select v-model="certTmpParaVOTemp.certType" class="theme-select">
            <el-option v-for="(item, index) in certTypeList" :key="index" :label="item.certValue" :value="item.phid"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="!+bookInfo.isNewAccounts ? 12 : 24">
        <el-form-item label="关联科目">
          <el-select v-model="subMap.subIds" style="width: 100%" multiple placeholder="" collapse-tags>
            <el-option
              v-for="item in subjectListLast"
              :key="item.phid"
              :disabled="item.status !== '1'"
              :label="`${item.encode} - ${item.name}`"
              :value="item.phid"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="+bookInfo.isNewAccounts" :gutter="20">
      <el-col :span="12">
        <el-form-item label="凭证类型：" style="margin:0">
          <div>财记</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="凭证类型：" style="margin:0">
          <div>预记</div>
        </el-form-item>
      </el-col>
    </el-row>
    <cert-tmp-dialog ref="certTmpDialog" @ok="certTmpDialogOk"/>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { createCertTmpParaVO, createHsCertTmpDataEntity } from '@/common/create'
import CertTmpDialog from './certTmpDialog'
export default {
  name: 'TopForm',
  components: {
    CertTmpDialog
  },
  props: {
    hsCertTmpDataEntityTemp: {
      type: Object,
      default: function() {
        return createHsCertTmpDataEntity()
      }
    },
    certTmpParaVOTemp: {
      type: Object,
      default: function() {
        return createCertTmpParaVO()
      }
    },
    subMap: {
      type: Object,
      default: function() {
        return {
          subIds: []
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      options: [],
      rules: {
        remark: [
          { max: 200, message: '长度200个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      // 只能选择末级科目
      'bookInfo',
      'subjectListLast',
      'certTypeList',
      'certTmpList'
    ])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('initCertTmpList', { bookId: this.$commonQueryParam.bookId })
  },
  methods: {
    certTmpDialogOk(phid) {
      this.hsCertTmpDataEntityTemp.certTmpType = phid
    },
    addNewCertTmpType() {
      this.$refs.certTmpDialog.open()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .select-b-btn-wrap {
    margin-top: 10px;
  }
</style>
