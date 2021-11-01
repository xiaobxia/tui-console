<template>
  <div>
    <div class="filter-container">
      <div class="right-block">
        <el-button
          :loading="saveLoading"
          type="primary"
          size="small"
          @click="okHandler"
        >保存</el-button>
      </div>
    </div>
    <top-form
      :hs-cert-tmp-data-entity-temp="hsCertTmpDataEntity"
      :cert-tmp-para-v-o-temp="certTmpParaVO"
      :sub-map="subMap"
    />
    <div class="a-2">
      <div class="table-title has-sub">
        <span>记账凭证</span>
      </div>
      <div class="table-wrap">
        <voucher-add-table
          :is-tmp-model="true"
          :dtl-list="certTmpDtlVOList"
          :card-input="true"
          :if-business-date="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createCertTmpParaVO, createHsCertTmpDtlVO, createHsCertTmpDataEntity, createCertAstVO } from '@/common/create'
import VoucherAddTable from '@/businessComponents/VoucherAddTable'
import commonMixins from '@/mixins/common'
import TopForm from './topForm'
import { filterObject } from '@/utils'

// 创造凭证明细项原始模型
function createCertDtlVOList() {
  return [
    {
      ...createHsCertTmpDtlVO(),
      hsCertDtlAstList: [createCertAstVO()]
    },
    {
      ...createHsCertTmpDtlVO(),
      hsCertDtlAstList: [createCertAstVO()]
    },
    {
      ...createHsCertTmpDtlVO(),
      hsCertDtlAstList: [createCertAstVO()]
    },
    {
      ...createHsCertTmpDtlVO(),
      hsCertDtlAstList: [createCertAstVO()]
    },
    {
      ...createHsCertTmpDtlVO({
        digest: '合计',
        last: true
      }),
      hsCertDtlAstList: []
    }
  ]
}

export default {
  name: 'Old',
  components: {
    VoucherAddTable,
    TopForm
  },
  mixins: [commonMixins],
  props: {
    mode: {
      type: String,
      default: ''
    },
    editType: {
      type: String,
      default: ''
    },
    phid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hsCertTmpDataEntity: createHsCertTmpDataEntity(),
      certTmpParaVO: createCertTmpParaVO(),
      certTmpDtlVOList: createCertDtlVOList(),
      subMap: {
        subIds: []
      },
      type: 'add',
      editRow: {},
      form: {},
      localPhid: '',
      saveLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'financeConfig',
      'subjectListLast',
      'digestCommonUse',
      'certTypeList'
    ])
  },
  watch: {
  },
  created() {
    if (this.mode === 'dialog') {
      this.type = this.editType
      this.localPhid = this.phid
    } else {
      const query = this.$route.query
      if (query.type === 'edit') {
        this.type = 'edit'
        this.localPhid = query.phid
      } else {
        this.type = 'add'
      }
    }
    this.initPage()
    console.log(this.$refs)
  },
  methods: {
    initPage() {
      if (this.type === 'edit') {
        // 编辑
        this.$http.post(`account/certTmp/findCertTmpById/${this.localPhid}`).then((res) => {
          console.log(res.data)
          const data = res.data
          this.hsCertTmpDataEntity = filterObject(createHsCertTmpDataEntity(), data)
          if (data.hsCertTmpSubEntityList && data.hsCertTmpSubEntityList.length > 0) {
            const subIds = []
            data.hsCertTmpSubEntityList.forEach((idItem) => {
              subIds.push(idItem.subId)
            })
            this.subMap.subIds = subIds
          }
          this.certTmpParaVO = filterObject(createCertTmpParaVO(), data.certTmpVOList[0])
          this._resetCertType(this.certTmpParaVO)
          console.log(data.certTmpVOList[0].certTmpDtlVOList)
          this.certTmpDtlVOList = this._initCertTmpDtlVOList(data.certTmpVOList[0].certTmpDtlVOList)
        })
      } else {
        // 新增
        this.certTmpParaVO = createCertTmpParaVO({
          ...this.$commonQueryParam,
          ...this.financeConfig,
          certYear: this.$commonQueryParam.year,
          certCategory: '1'
        })
        this.hsCertTmpDataEntity = createHsCertTmpDataEntity({
          ...this.$commonQueryParam
        })
        this.subMap.subIds = []
      }
    },
    // 保存数据格式化
    formatSaveData() {
      const formatValue = this._formatCertTmpAddBody({
        hsCertTmpDataEntity: this.hsCertTmpDataEntity,
        certType: this.certTmpParaVO.certType,
        subIds: this.subMap.subIds,
        certFormCai: this.certTmpParaVO,
        certDtlVOListCai: this.certTmpDtlVOList
      })
      !formatValue && (this.saveLoading = false)
      return formatValue
    },
    okHandler() {
      const body = this.formatSaveData()
      let url = `account/certTmp/addCertTmp`
      if (this.type === 'edit') {
        url = `account/certTmp/updateCertTmp`
      }
      this.saveLoading = true
      this.$http.post(url, body).then(() => {
        // 返回要刷新
        this.$store.commit('SET_flagVoucherTemplateQuery', true)
        this.saveLoading = false
        this.$message({
          type: 'success',
          message: `${this.type === 'edit' ? '修改' : '新增'}成功!`,
          offset: document.body.clientHeight / 2
        })
        if (this.mode === 'dialog') {
          this.$emit('ok')
        } else {
          this.$router.replace({
            path: `/basicSetup/voucherTemplate`
          })
        }
      }).catch((err) => {
        console.log(err)
        this.saveLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-content {
  margin-bottom: 18px;
}
.input-s {
  width: 80px;
}
.bottom-info {
  background-color: #fff;
  padding: 12px;
  line-height: 23px;
  font-size: 14px;
  color: rgb(96, 98, 102);
  span {
    margin-right: 150px;
  }
}
.a-2 {
  //padding-right: 30px;
}
</style>
