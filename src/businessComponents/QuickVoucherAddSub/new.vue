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
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="a-2">
          <div class="table-title has-sub">
            <span>财务会计</span>
          </div>
          <div class="table-wrap">
            <voucher-add-table
              :model="'cai'"
              :dtl-list="certDtlVOCaiList"
              :if-business-date="false"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="a-2">
          <div class="table-title has-sub">
            <span>预算会计</span>
          </div>
          <div class="table-wrap">
            <voucher-add-table
              :is-tmp-model="true"
              :model="'yu'"
              :dtl-list="certDtlVOYuList"
              :if-business-date="false"
            />
          </div>
        </div>
      </el-col>
    </el-row>
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
    }
  ]
}

// 是否开新政府时插入不同的最后一行的值
function createDifferentLastChild(type) {
  if (type === 'new') {
    return [
      {
        ...createHsCertTmpDtlVO(),
        hsCertDtlAstList: [createCertAstVO()]
      }
    ]
  } else {
    return [
      {
        ...createHsCertTmpDtlVO({
          digest: '合计',
          last: true
        }),
        hsCertDtlAstList: []
      }
    ]
  }
}

export default {
  name: 'New',
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
      certTmpParaVOYu: createCertTmpParaVO(),
      certDtlVOCaiList: createCertDtlVOList(),
      certDtlVOYuList: createCertDtlVOList(),
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
      'certTypeList',
      'bookInfo'
    ])
  },
  watch: {
  },
  created() {
    console.log(this.bookInfo)
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
    if (+this.bookInfo.isNewAccounts === 0) {
      this.certDtlVOCaiList = [...createCertDtlVOList(), ...createDifferentLastChild('old')]
      this.certDtlVOYuList = [...createCertDtlVOList(), ...createDifferentLastChild('old')]
    }
    this.initPage()
  },
  methods: {
    // 凭证类型被禁用的需要清空
    resetNewAccountCertType() {
      this._resetCertType(this.certTmpParaVO)
      this._resetCertType(this.certTmpParaVOYu)
    },
    initPage() {
      if (this.type === 'edit') {
        // 编辑
        this.$http.post(`account/certTmp/findCertTmpById/${this.localPhid.split('-')}`).then((res) => {
          const data = res.data
          this.hsCertTmpDataEntity = filterObject(createHsCertTmpDataEntity(), data)
          if (data.hsCertTmpSubEntityList && data.hsCertTmpSubEntityList.length > 0) {
            const subIds = []
            data.hsCertTmpSubEntityList.forEach((idItem) => {
              subIds.push(idItem.subId)
            })
            this.subMap.subIds = subIds
          }
          // 填充空凭证
          this._resetCertItemNew(data.certTmpVOList)
          // 凭证财
          const dataCai = data.certTmpVOList[0]
          // 凭证预
          const dataYu = data.certTmpVOList[1]
          if (dataCai.phid) {
            this.certTmpParaVO = filterObject(createCertTmpParaVO(), dataCai)
          }
          if (dataYu.phid) {
            this.certTmpParaVOYu = filterObject(createCertTmpParaVO(), dataYu)
          }
          this.resetNewAccountCertType()
          if (dataCai.certTmpDtlVOList && dataCai.certTmpDtlVOList.length > 0) {
            this.certDtlVOCaiList = this._initNewCertTmpDtlVOList(dataCai.certTmpDtlVOList)
            if (this.certDtlVOCaiList.length < 4) {
              for (let i = 0; i < 5 - this.certDtlVOCaiList.length; i++) {
                this.certDtlVOCaiList.push(createHsCertTmpDtlVO())
              }
            }
          }
          if (dataYu.certTmpDtlVOList && dataYu.certTmpDtlVOList.length > 0) {
            // 预算
            this.certDtlVOYuList = this._initNewCertTmpDtlVOList(dataYu.certTmpDtlVOList)
            if (this.certDtlVOYuList.length < 4) {
              for (let i = 0; i < 5 - this.certDtlVOYuList.length; i++) {
                this.certDtlVOYuList.push(createHsCertTmpDtlVO())
              }
            }
          }
        })
      } else {
        // 新增
        this.certTmpParaVO = createCertTmpParaVO({
          ...this.$commonQueryParam,
          ...this.financeConfig,
          certYear: this.$commonQueryParam.year
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
        certDtlVOListCai: this.certDtlVOCaiList,
        // 预算会计也用财政的信息
        certFormYu: {
          ...this.certTmpParaVO,
          phid: this.certTmpParaVOYu.phid
        },
        certDtlVOListYu: this.certDtlVOYuList
      })
      if (+this.bookInfo.certType === 2) {
        const caiPhid = this.certTypeList.filter(item => item.certValue === '财记')[0].phid
        const yuPhid = this.certTypeList.filter(item => item.certValue === '预记')[0].phid
        formatValue.certTmpFormList[0].certType = caiPhid
        formatValue.certTmpFormList[1].certType = yuPhid
      } else {
        for (let i = 0; i < this.certTypeList.length; i++) {
          const certType = this.certTypeList[i]
          if (certType.certValue === '空') {
            formatValue.certTmpFormList[0].certType = certType.phid
            formatValue.certTmpFormList[1].certType = certType.phid
          }
        }
        // 情况二
        if (this.certTypeList.length === 1) {
          const certType = this.certTypeList[0]
          formatValue.certTmpFormList[0].certType = certType.phid
          formatValue.certTmpFormList[1].certType = certType.phid
        }
      }
      !formatValue && (this.saveLoading = false)
      return formatValue
    },
    okHandler() {
      const body = this.formatSaveData()
      // 检查是否两张凭证都没填
      if (!this._checkCertTmpDtlListNew(body.certTmpFormList)) {
        return false
      }
      // 去除空凭证
      this._removeEmptyCertTmpNew(body)
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
  padding: 12px;
  line-height: 23px;
  font-size: 14px;
  color: rgb(96, 98, 102);
  text-align: center;
  span {
    margin-right: 150px;
  }
}
.a-2 {
  //padding-right: 30px;
}
.sub {
  span {
    margin-right: 30px;
  }
}
</style>
