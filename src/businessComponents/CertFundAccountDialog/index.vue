<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="1360px"
    title="经费凭证录入"
  >
    <div v-if="dialogVisible">
      <div class="filter-container">
        <div class="left-block">
          <span class="label">经费组织</span>
          <el-select
            v-model="orgId"
            style="width: 120px"
            size="small"
            class="theme-select"
            @change="orgChange"
          >
            <el-option
              v-for="(item, index) in orgList"
              :key="index"
              :label="item.orgName"
              :value="item.phid"
            />
          </el-select>
          <el-button
            type="text"
            size="small"
            @click="toFundsOrg"
          >新增</el-button>
          <el-button
            type="text"
            size="small"
            @click="queryOrgList"
          >刷新</el-button>
          <span class="label-text">月份</span>
          <el-date-picker
            v-model="yearMonth"
            :clearable="false"
            type="month"
            size="small"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            @change="yearMonthChange"
          />
          <el-select
            v-model="editType"
            style="width: 120px"
            size="small"
            class="theme-select"
            @change="editTypeChange"
          >
            <el-option
              label="手工录入"
              value="1"
            />
            <el-option
              label="从经费管理模块获取数据"
              value="2"
            />
          </el-select>
        </div>
      </div>
      <div
        v-loading="canEditLoading"
        element-loading-text="数据载入中"
        style="margin-right: 30px"
      >
        <el-table
          :data="certFundList"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}"
          border
          class="visible-table voucher-edit-table has-row-btn"
          style="width: 100%"
        >
          <el-table-column label="单位名称">
            <template slot-scope="scope">
              <div
                class="cell-input-wrap with-click"
                style="text-align: left"
              >
                <el-autocomplete
                  :disabled="editType === '2'"
                  v-model="scope.row.orgName"
                  :fetch-suggestions="querySearchAsync"
                  :maxlength="50"
                  placeholder=""
                  style="width: 100%"
                  class="input-h"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="拨缴经费收入">
            <el-table-column label="金额（元）">
              <template slot-scope="scope">
                <div class="cell-input-wrap">
                  <span
                    :class="$numberClass(scope.row.upperFund)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyEmpty(scope.row.upperFund) }}</span>
                  <el-input
                    :maxlength="16"
                    v-model="scope.row.upperFund"
                    :class="$numberClass(scope.row.upperFund)"
                    class="input-h number-input f-h"
                    size="small"
                    @change="()=>{upperFundChange(scope.row)}"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="拨缴经费收入（留成）">
            <el-table-column label="比例（%）">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.selfKeepRate"
                  class="no-border-input"
                  @change="()=>{rateChange(scope.row, 'selfKeep')}"
                />
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <div class="cell-input-wrap">
                  <span
                    :class="$numberClass(scope.row.selfKeep)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyEmpty(scope.row.selfKeep) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="应付上级经费">
            <el-table-column label="比例（%）">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.superFundRate"
                  class="no-border-input"
                  @change="()=>{rateChange(scope.row, 'superFund')}"
                />
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <div class="cell-input-wrap">
                  <span
                    :class="$numberClass(scope.row.superFund)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyEmpty(scope.row.superFund) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="应付下级转拨经费">
            <el-table-column label="比例（%）">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.lowFundRate"
                  class="no-border-input"
                  @change="()=>{rateChange(scope.row, 'lowFund')}"
                />
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <div class="cell-input-wrap">
                  <span
                    :class="$numberClass(scope.row.lowFund)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyEmpty(scope.row.lowFund) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="应付建会筹备金">
            <el-table-column label="比例（%）">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.fundPayableRate"
                  class="no-border-input"
                  @change="()=>{rateChange(scope.row, 'fundPayable')}"
                />
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <div class="cell-input-wrap">
                  <span
                    :class="$numberClass(scope.row.fundPayable)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyEmpty(scope.row.fundPayable) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="税务代收手续费">
            <el-table-column label="比例（%）">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.taxCollectionRate"
                  class="no-border-input"
                  @change="()=>{rateChange(scope.row, 'taxCollection')}"
                />
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <div class="cell-input-wrap btn-cell">
                  <span
                    :class="$numberClass(scope.row.taxCollection)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyEmpty(scope.row.taxCollection) }}</span>
                  <div class="right-btn-wrap">
                    <el-button
                      :disabled="editType === '2'"
                      tabindex="-1"
                      type="success"
                      icon="el-icon-plus"
                      size="mini"
                      @click="addItem(scope.$index)"
                    />
                    <el-button
                      :disabled="editType === '2' || certFundList.length === 1 && scope.$index === 0"
                      tabindex="-1"
                      type="danger"
                      icon="el-icon-close"
                      size="mini"
                      @click="deleteItem(scope.$index)"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        :disabled="btnDisabled"
        :loading="loading"
        size="small"
        type="primary"
        @click="okHandler"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import commonMixins from '@/mixins/common'
import { createCertFundAccount } from '@/common/create'
export default {
  name: 'CertFundAccountDialog',
  mixins: [commonMixins],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      certFundList: [],
      editType: '1',
      orgList: [],
      subOrgList: [],
      yearMonth: '',
      orgId: '',
      orgIds: [],
      fundsSubjectInfo: {},
      canEditLoading: false,
      fundsUUid: '',
      fundsSubjectList: [],
      btnDisabled: false
    }
  },
  computed: {
    ...mapGetters([
      'subjectListLast'
    ])
  },
  created() {
  },
  methods: {
    // 打开
    open(data) {
      const certDate = data.certDate || ''
      this.initData()
      this.fundsUUid = data.fundsUUid || ''
      const fundFormData = data.fundFormData || {}
      this.yearMonth = fundFormData.yearMonth || moment(certDate).format('YYYY-MM')
      this.orgId = fundFormData.orgId || ''
      this.editType = fundFormData.editType || '1'
      this.certFundList = fundFormData.certFundList || []
      // 获取经费组织
      Promise.all([
        this.queryAllFundsSubject(),
        this.queryOrgList()
      ]).then(() => {
        if (this.orgId) {
          // 经费科目的子级科目
          this.getChildTree(this.orgId)
          // 获取组织下的经费科目配置
          this.getOrgOtherData()
        }
      })
      this.dialogVisible = true
    },
    // 初始化数据
    initData() {
      this.dialogVisible = false
      this.loading = false
      this.certFundList = []
      this.editType = '1'
      this.orgList = []
      this.subOrgList = []
      this.yearMonth = ''
      this.orgId = ''
      this.orgIds = []
      this.fundsUUid = ''
      this.fundsSubjectInfo = {}
      this.canEditLoading = false
      this.btnDisabled = false
    },
    // 查询经费管理那边的科目
    queryAllFundsSubject() {
      return this.$http.get('funds/MsYsDictDtl/findAllByCondition', {
        pageIndex: 1,
        pageSize: 9999,
        year: moment(this.yearMonth).format('YYYY'),
        orgId: this.$commonQueryParam.orgId,
        type: 'subject',
        status: 0
      }).then((res) => {
        this.canEditLoading = false
        this.fundsSubjectList = res.data || []
      })
    },
    // 匹配获取经费科目信息
    getFundsSubject(id) {
      if (!id) {
        return {}
      }
      for (let i = 0; i < this.fundsSubjectList.length; i++) {
        if (this.fundsSubjectList[i].phid === id) {
          return this.fundsSubjectList[i]
        }
      }
      return {}
    },
    // 查询经费组织
    queryOrgList() {
      return this.$http.get('funds/org/findByToOrgId', {
        toOrgId: this.$commonQueryParam.orgId
      }).then((res) => {
        this.orgList = res.data || []
      })
    },
    // 获取组织经费科目配置信息
    queryFundsSubjectInfo() {
      return this.$http.get('funds/basic/findAllByCondition', {
        orgId: this.orgId,
        year: moment(this.yearMonth).format('YYYY')
      }).then((res) => {
        const data = res.data || []
        const info = data[0] || {}
        // 根据id匹配经费科目的code
        const fundPayableSubCode = this.getFundsSubject(info.appropriated).code || ''
        const lowFundSubCode = this.getFundsSubject(info.needDown).code || ''
        const selfKeepSubCode = this.getFundsSubject(info.needFundarion).code || ''
        const superFundSubCode = this.getFundsSubject(info.needUp).code || ''
        const taxCollectionSubCode = this.getFundsSubject(info.taxCollection).code || ''
        if (fundPayableSubCode && lowFundSubCode && selfKeepSubCode && superFundSubCode && taxCollectionSubCode) {
          // 根据经费科目的code匹配核算科目的code
          const fundPayableSubCodeH = this.checkSub(fundPayableSubCode).encode || ''
          const lowFundSubCodeH = this.checkSub(lowFundSubCode).encode || ''
          const selfKeepSubCodeH = this.checkSub(selfKeepSubCode).encode || ''
          const superFundSubCodeH = this.checkSub(superFundSubCode).encode || ''
          const taxCollectionSubCodeH = this.checkSub(taxCollectionSubCode).encode || ''
          if (fundPayableSubCodeH && lowFundSubCodeH && selfKeepSubCodeH && superFundSubCodeH && taxCollectionSubCodeH) {
            this.btnDisabled = false
            this.fundsSubjectInfo = {
              ...this.fundsSubjectInfo,
              fundPayableSubCode: fundPayableSubCodeH,
              lowFundSubCode: lowFundSubCodeH,
              selfKeepSubCode: selfKeepSubCodeH,
              superFundSubCode: superFundSubCodeH,
              taxCollectionSubCode: taxCollectionSubCodeH
            }
          } else {
            this.btnDisabled = true
            this.$message({
              type: 'warning',
              message: '经费科目未能匹配！'
            })
            this.certFundList = []
          }
        } else {
          this.btnDisabled = true
          this.$message({
            type: 'warning',
            message: '缺少经费科目！'
          })
          this.certFundList = []
        }
        return this.$http.get('funds/fundAccound/findByCondition', {
          orgId: this.orgId,
          year: moment(this.yearMonth).format('YYYY'),
          month: moment(this.yearMonth).format('M')
        }).then((res) => {
          const data = res.data || []
          const info = data[0] || {}
          this.fundsSubjectInfo = {
            ...this.fundsSubjectInfo,
            upperFundM: parseFloat(info.upperFundM) || '',
            selfKeepRate: parseFloat(info.selfKeepM) || '',
            superFundRate: parseFloat(info.superFundM) || '',
            fundPayableRate: parseFloat(info.fundPayableM) || '',
            taxCollectionRate: parseFloat(info.taxCollectionM) || '',
            lowFundRate: parseFloat(info.meetLowFundM) || ''
          }
        })
      })
    },
    // 获取组织下的经费科目配置
    getOrgOtherData() {
      return this.queryFundsSubjectInfo()
    },
    // 经费组织切换
    orgChange() {
      this.canEditLoading = true
      Promise.all([
        // 经费科目的子级科目
        this.getChildTree(this.orgId),
        // 获取组织下的经费科目配置
        this.getOrgOtherData()
      ]).then(() => {
        // 自动填充
        if (this.editType === '2') {
          return this.searchFundData()
        } else {
          this.certFundList = [createCertFundAccount({
            ...this.fundsSubjectInfo
          })]
        }
        this.canEditLoading = false
      }).catch((err) => {
        console.log(err)
        this.canEditLoading = false
      })
    },
    yearMonthChange() {
      this.canEditLoading = true
      // 获取经费组织
      Promise.all([
        this.queryAllFundsSubject()
      ]).then(() => {
        if (this.orgId) {
          // 获取组织下的经费科目配置
          return this.getOrgOtherData().then(() => {
            // 自动填充
            if (this.editType === '2') {
              return this.searchFundData()
            } else {
              this.certFundList = [createCertFundAccount({
                ...this.fundsSubjectInfo
              })]
            }
            this.canEditLoading = false
          }).catch((err) => {
            console.log(err)
            this.canEditLoading = false
          })
        }
      }).catch((err) => {
        console.log(err)
        this.canEditLoading = false
      })
    },
    // 添加项
    addItem(index) {
      this.certFundList.splice(index + 1, 0, createCertFundAccount({
        ...this.fundsSubjectInfo
      }))
    },
    // 删除项
    deleteItem(index) {
      this.certFundList.splice(index, 1)
    },
    // 组织过滤
    querySearchAsync(queryString, cb) {
      const subOrgList = this.subOrgList
      const results = queryString ? subOrgList.filter((item) => {
        return item.orgName.indexOf(queryString) !== -1
      }) : subOrgList
      cb(results)
    },
    // 从经费系统获取数据
    searchFundData() {
      return this.$http.post('funds/FundSearch/searchFundData', {
        orgIds: this.orgIds,
        year: moment(this.yearMonth).format('YYYY'),
        month: moment(this.yearMonth).format('M'),
        orgType: 1
      }).then((res) => {
        const rowList = res.data || []
        rowList.forEach((item) => {
          item.selfKeepRate = parseFloat(item.selfKeepRate) || ''
          item.superFundRate = parseFloat(item.superFundRate) || ''
          item.fundPayableRate = parseFloat(item.fundPayableRate) || ''
          item.taxCollectionRate = parseFloat(item.taxCollectionRate) || ''
          item.lowFundRate = parseFloat(item.lowFundRate) || ''
        })
        this.certFundList = rowList
        this.canEditLoading = false
      })
    },
    // 获取某父节点下的子树
    getChildTree(phid) {
      return this.$http.get('funds/org/findTreeById', { phId: phid }).then(({ status, message, data }) => {
        this.orgIds = []
        this.subOrgList = []
        this.flatTree(data)
      }).catch(err => {
        console.log(err.message, 'err')
      })
    },
    // 拉平树
    flatTree(tree) {
      tree.forEach(item => {
        this.orgIds.push(item.phid)
        this.subOrgList.push({
          orgName: item.orgName,
          value: item.orgName
        })
        item.children && item.children.length > 0 && this.flatTree(item.children)
      })
    },
    editTypeChange() {
      if (this.editType === '2') {
        this.searchFundData()
      } else {
        this.certFundList = [createCertFundAccount({
          ...this.fundsSubjectInfo
        })]
      }
    },
    // 科目匹配
    checkSub(code) {
      const sub = this.subjectListLast.filter(item => item.encode === code)[0]
      return sub || {}
    },
    // 科目匹配
    checkSubById(id) {
      const sub = this.subjectListLast.filter(item => item.phid === id)[0]
      return sub || {}
    },
    toFundsOrg() {
      window.open('/fundsWeb/#/expenditureManage/orgMaintenance')
    },
    getClearNumberInput(row, key) {
      const value = this.$clearToNumber(row[key])
      row[key] = value
      return value || 0
    },
    getRateMoney(all, rate) {
      return (all * rate).toFixed(2)
    },
    upperFundChange(row) {
      const upperFund = this.getClearNumberInput(row, 'upperFund')
      const selfKeepRate = this.getClearNumberInput(row, 'selfKeepRate')
      const superFundRate = this.getClearNumberInput(row, 'superFundRate')
      const fundPayableRate = this.getClearNumberInput(row, 'fundPayableRate')
      const taxCollectionRate = this.getClearNumberInput(row, 'taxCollectionRate')
      const lowFundRate = this.getClearNumberInput(row, 'lowFundRate')
      const all = selfKeepRate + superFundRate + fundPayableRate + taxCollectionRate + lowFundRate
      row.selfKeep = this.getRateMoney(upperFund, selfKeepRate / all)
      row.superFund = this.getRateMoney(upperFund, superFundRate / all)
      row.fundPayable = this.getRateMoney(upperFund, fundPayableRate / all)
      row.taxCollection = this.getRateMoney(upperFund, taxCollectionRate / all)
      row.lowFund = this.getRateMoney(upperFund, lowFundRate / all)
    },
    rateChange(row, key) {
      const upperFund = this.getClearNumberInput(row, 'upperFund')
      let rateValue = this.$clearToNumber(row[`${key}Rate`]) || 0
      if (rateValue > 100) {
        rateValue = 100
      }
      if (rateValue < 0) {
        rateValue = 0
      }
      row[`${key}Rate`] = rateValue || ''
      const selfKeepRate = this.getClearNumberInput(row, 'selfKeepRate')
      const superFundRate = this.getClearNumberInput(row, 'superFundRate')
      const fundPayableRate = this.getClearNumberInput(row, 'fundPayableRate')
      const taxCollectionRate = this.getClearNumberInput(row, 'taxCollectionRate')
      const lowFundRate = this.getClearNumberInput(row, 'lowFundRate')
      const all = selfKeepRate + superFundRate + fundPayableRate + taxCollectionRate + lowFundRate
      if (all > 100) {
        row[`${key}Rate`] = parseFloat(row[`${key}Rate`] || 0) - (all - 100)
      }
      const selfKeepRate1 = this.getClearNumberInput(row, 'selfKeepRate')
      const superFundRate1 = this.getClearNumberInput(row, 'superFundRate')
      const fundPayableRate1 = this.getClearNumberInput(row, 'fundPayableRate')
      const taxCollectionRate1 = this.getClearNumberInput(row, 'taxCollectionRate')
      const lowFundRate1 = this.getClearNumberInput(row, 'lowFundRate')
      const all1 = selfKeepRate1 + superFundRate1 + fundPayableRate1 + taxCollectionRate1 + lowFundRate1
      row['selfKeep'] = this.getRateMoney(upperFund, parseFloat(row['selfKeepRate'] || 0) / all1)
      row['superFund'] = this.getRateMoney(upperFund, parseFloat(row['superFundRate'] || 0) / all1)
      row['fundPayable'] = this.getRateMoney(upperFund, parseFloat(row['fundPayableRate'] || 0) / all1)
      row['taxCollection'] = this.getRateMoney(upperFund, parseFloat(row['taxCollectionRate'] || 0) / all1)
      row['lowFund'] = this.getRateMoney(upperFund, parseFloat(row['lowFundRate'] || 0) / all1)
    },
    // 生成凭证
    createVoucher() {
      // if (this.certFundList.length) {
      const taxCollectionSubject = this.checkSub(this.fundsSubjectInfo.taxCollectionSubCode)
      const taxCollectionItem = {
        subCode: this.fundsSubjectInfo.taxCollectionSubCode,
        subId: taxCollectionSubject.phid,
        balanceType: taxCollectionSubject.balanceType,
        subName: taxCollectionSubject.name,
        debit: 0,
        lender: 0,
        subDetail: taxCollectionSubject,
        targetFundsUUid: this.fundsUUid
      }
      const selfKeepSubject = this.checkSub(this.fundsSubjectInfo.selfKeepSubCode)
      const selfKeepItem = {
        subCode: this.fundsSubjectInfo.selfKeepSubCode,
        subId: selfKeepSubject.phid,
        balanceType: selfKeepSubject.balanceType,
        subName: selfKeepSubject.name,
        debit: 0,
        lender: 0,
        subDetail: selfKeepSubject,
        targetFundsUUid: this.fundsUUid
      }
      const superFundSubject = this.checkSub(this.fundsSubjectInfo.superFundSubCode)
      const superFundItem = {
        subCode: this.fundsSubjectInfo.superFundSubCode,
        subId: superFundSubject.phid,
        balanceType: superFundSubject.balanceType,
        subName: superFundSubject.name,
        debit: 0,
        lender: 0,
        subDetail: superFundSubject,
        targetFundsUUid: this.fundsUUid
      }
      const lowFundSubject = this.checkSub(this.fundsSubjectInfo.lowFundSubCode)
      const lowFundItem = {
        subCode: this.fundsSubjectInfo.lowFundSubCode,
        subId: lowFundSubject.phid,
        balanceType: lowFundSubject.balanceType,
        subName: lowFundSubject.name,
        debit: 0,
        lender: 0,
        subDetail: lowFundSubject,
        targetFundsUUid: this.fundsUUid
      }
      const fundPayableSubject = this.checkSub(this.fundsSubjectInfo.fundPayableSubCode)
      const fundPayableItem = {
        subCode: this.fundsSubjectInfo.fundPayableSubCode,
        subId: fundPayableSubject.phid,
        balanceType: fundPayableSubject.balanceType,
        subName: fundPayableSubject.name,
        debit: 0,
        lender: 0,
        subDetail: fundPayableSubject,
        targetFundsUUid: this.fundsUUid
      }
      let targetDtlDebit = 0
      this.certFundList.forEach((item) => {
        targetDtlDebit += parseFloat(item.upperFund || 0).toFixed(2)
        taxCollectionItem.lender += parseFloat(item.taxCollection || 0).toFixed(2)
        selfKeepItem.lender += parseFloat(item.selfKeep || 0).toFixed(2)
        superFundItem.lender += parseFloat(item.superFund || 0).toFixed(2)
        lowFundItem.lender += parseFloat(item.lowFund || 0).toFixed(2)
        fundPayableItem.lender += parseFloat(item.fundPayable || 0).toFixed(2)
        // certDtlVOList = certDtlVOList.concat([
        //   {
        //     subCode: item.taxCollectionSubCode,
        //     subId: this.checkSub(item.taxCollectionSubCode).phid,
        //     balanceType: this.checkSub(item.taxCollectionSubCode).balanceType,
        //     subName: this.checkSub(item.taxCollectionSubCode).name,
        //     debit: item.taxCollection || '0',
        //     lender: '0',
        //     subDetail: this.checkSub(item.taxCollectionSubCode),
        //     targetFundsUUid: this.fundsUUid
        //   },
        //   {
        //     subCode: item.selfKeepSubCode,
        //     subId: this.checkSub(item.selfKeepSubCode).phid,
        //     balanceType: this.checkSub(item.selfKeepSubCode).balanceType,
        //     subName: this.checkSub(item.selfKeepSubCode).name,
        //     debit: '0',
        //     lender: item.selfKeep || '0',
        //     subDetail: this.checkSub(item.selfKeepSubCode),
        //     targetFundsUUid: this.fundsUUid
        //   },
        //   {
        //     subCode: item.superFundSubCode,
        //     subId: this.checkSub(item.superFundSubCode).phid,
        //     balanceType: this.checkSub(item.superFundSubCode).balanceType,
        //     subName: this.checkSub(item.superFundSubCode).name,
        //     debit: '0',
        //     lender: item.superFund || '0',
        //     subDetail: this.checkSub(item.superFundSubCode),
        //     targetFundsUUid: this.fundsUUid
        //   },
        //   {
        //     subCode: item.lowFundSubCode,
        //     subId: this.checkSub(item.lowFundSubCode).phid,
        //     balanceType: this.checkSub(item.lowFundSubCode).balanceType,
        //     subName: this.checkSub(item.lowFundSubCode).name,
        //     debit: '0',
        //     lender: item.lowFund || '0',
        //     subDetail: this.checkSub(item.lowFundSubCode),
        //     targetFundsUUid: this.fundsUUid
        //   },
        //   {
        //     subCode: item.fundPayableSubCode,
        //     subId: this.checkSub(item.fundPayableSubCode).phid,
        //     balanceType: this.checkSub(item.fundPayableSubCode).balanceType,
        //     subName: this.checkSub(item.fundPayableSubCode).name,
        //     debit: '0',
        //     lender: item.fundPayable || '0',
        //     subDetail: this.checkSub(item.fundPayableSubCode),
        //     targetFundsUUid: this.fundsUUid
        //   }
        // ])
      })
      const resultList = []
      if (taxCollectionItem.lender) {
        resultList.push(taxCollectionItem)
      }
      if (selfKeepItem.lender) {
        resultList.push(selfKeepItem)
      }
      if (superFundItem.lender) {
        resultList.push(superFundItem)
      }
      if (lowFundItem.lender) {
        resultList.push(lowFundItem)
      }
      if (fundPayableItem.lender) {
        resultList.push(fundPayableItem)
      }
      this.$emit('ok', {
        certDtlVOList: this.$deepClone(resultList),
        targetDtlDebit,
        fundFormData: {
          certFundList: this.$deepClone(this.certFundList),
          orgId: this.orgId,
          yearMonth: this.yearMonth,
          editType: this.editType
        }
      })
      // }
    },
    okHandler() {
      const flag = this.certFundList.every(item => item.upperFund && +item.upperFund > 0 && item.orgName)
      if (this.certFundList.length && flag) {
        this.createVoucher()
        this.dialogVisible = false
      } else {
        this.$message.warning('请正确录入经费凭证数据！')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
