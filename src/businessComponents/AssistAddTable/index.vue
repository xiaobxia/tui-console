<template>
  <div class="ass-wrap">
    <div class="table-title">{{ localModel === 'yu' ? '财政辅助核算' : '常用辅助核算' }}</div>
    <div v-loading="!ok" element-loading-text="数据载入中" class="cover">
      <el-table
        v-if="ok"
        ref="table"
        :border="true"
        :data="localRow.hsCertDtlAstList"
        :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}"
        :popper-append-to-body="true"
        class="cell-inner-btn visible-table voucher-edit-table"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in localRow.subDetail.subAstTypeVOList"
          :key="item.astTypeId"
          :resizable="false"
          :label="item.astName"
          min-width="150"
        >
          <template slot-scope="scope">
            <div
              v-if="item.typeProperties === '0'"
              class="cell-input-wrap with-click"
              @dblclick="showCheckDialog(item, scope.row, astValueMap[item.extCode])"
            >
              <el-select
                v-model="scope.row.oldAstMap[item.extCode]"
                :popper-class="astValueMap[item.extCode].length > 0 ? 'ast-select-popper' : ''"
                placeholder
                filterable
                style="height: 100%"
                class="input-h ast-text"
                @change="astValueChange(scope.row, item.extCode)"
              >
                <el-option
                  v-for="(subItem) in astValueMap[item.extCode]"
                  :key="subItem.phid"
                  :label="`【${subItem.encode}】${subItem.name}`"
                  :value="subItem.phid"
                  :disabled="!subItem.canSelect"
                >
                  <span :style="{marginLeft: `${(subItem.levels || 1)-1}em`}">
                    {{
                      `【${subItem.encode}】${subItem.name}`
                    }}
                  </span>
                </el-option>
                <div v-if="item.classify !== '3'" class="select-b-btn-wrap">
                  <el-button
                    style="width: 100%"
                    type="text"
                    icon="el-icon-plus"
                    size="small"
                    @click="addAst(scope.row, item)"
                  >新增</el-button>
                </div>
                <div
                  v-if="item.classify !== '3'"
                  slot="empty"
                  style="margin: 10px 0"
                  class="select-b-btn-wrap"
                >
                  <el-button
                    style="width: 100%"
                    type="text"
                    icon="el-icon-plus"
                    size="small"
                    @click="addAst(scope.row, item)"
                  >新增</el-button>
                </div>
              </el-select>
            </div>
            <div v-else-if="item.typeProperties === '1'" class="cell-input-wrap with-click">
              <el-date-picker
                v-model="scope.row.oldAstMap[item.extCode]"
                class="datePicker"
                type="date"
                value-format="yyyy-MM-dd"
                @input="newAstValueChange(scope.row, item.extCode, item.astName)"
                @change="newAstValueChange(scope.row, item.extCode, item.astName)"
              />
            </div>
            <div v-else class="cell-input-wrap with-click">
              <span
                :class="$numberClass(scope.row.oldAstMap[item.extCode])"
                class="text-n number-text"
              >{{ _formatStandardCurrencyAbs(scope.row.oldAstMap[item.extCode]) }}</span>
              <el-input
                v-model="scope.row.oldAstMap[item.extCode]"
                class="input-h number-input f-h"
                maxlength="20"
                @change="newAstValueChange2(scope.row, item.extCode, item.astName)"
                @focus="handleFocus(index)"
                @input="updateView($event, scope.row.oldAstMap, item.extCode)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ifShowNumRow(localRow)" :resizable="false" width="170" label="数量">
          <template slot-scope="scope">
            <div class="no-p-cell">
              <div>
                <span>数量:</span>
                <div style="width: 100px;" class="input-b-wrap">
                  <span class="text-n number-text">{{ _formatCountEmpty(scope.row.num) }}</span>
                  <el-input
                    v-model="scope.row.num"
                    class="input-b"
                    style="width: 100px;"
                    size="mini"
                    @change="()=>{numChange(scope.row, scope.$index)}"
                  />
                </div>
              </div>
              <div>
                <span>单价:</span>
                <div style="width: 100px;" class="input-b-wrap">
                  <span
                    :class="$numberClass(scope.row.price)"
                    class="text-n number-text"
                  >{{ _formatUnitPriceAbs(scope.row.price) }}</span>
                  <el-input
                    v-model="scope.row.price"
                    class="input-b number-input"
                    size="mini"
                    @input="(value) => { scope.row.price = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')}"
                    @change="()=>{priceChange(scope.row, scope.$index)}"
                  />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="bookInfo.isForeignCurrency === '1' && ifShowForeignCurrencyRow(localRow)"
          :resizable="false"
          width="200"
          label="币别"
        >
          <template slot-scope="scope">
            <div class="no-p-cell">
              <div>
                <el-select
                  v-model="scope.row.foreignKey"
                  placeholder
                  style="width: 80px"
                  size="mini"
                  filterable
                  class="theme-select no-p"
                  @change="()=>{foreignKeyChange(scope.row, scope.$index)}"
                >
                  <el-option
                    v-for="(item, index) in commonForeignKeyList"
                    v-if="_ifSubjectForeign(item, localRow)"
                    :key="index"
                    :label="item.foreignKey"
                    :value="item.foreignKey"
                  />
                </el-select>
                <span>:</span>
                <span
                  style="width: 70px;"
                  class="text-b mini"
                >{{ _formatForeignCurrencyEmpty(scope.row.foreignRate) }}</span>
              </div>
              <div>
                <span>原币:</span>
                <el-tooltip
                  v-if="ifShowForeignPop(scope.row.foreignMoney)"
                  :content="''+scope.row.foreignMoney"
                  placement="top"
                  effect="light"
                >
                  <div style="width: 126px;" class="input-b-wrap">
                    <span
                      :class="$numberClass(scope.row.foreignMoney)"
                      class="text-n number-text"
                    >{{ _formatForeignCurrencyAbs(scope.row.foreignMoney) }}</span>
                    <el-input
                      v-model="scope.row.foreignMoney"
                      class="input-b number-input"
                      size="mini"
                      @input="updateView($event, scope.row, 'foreignMoney')"
                      @change="()=>{foreignMoneyChange(scope.row, scope.$index)}"
                    />
                  </div>
                </el-tooltip>
                <div v-else style="width: 126px;" class="input-b-wrap">
                  <span
                    :class="$numberClass(scope.row.foreignMoney)"
                    class="text-n number-text"
                  >{{ _formatForeignCurrencyAbs(scope.row.foreignMoney) }}</span>
                  <el-input
                    v-model="scope.row.foreignMoney"
                    class="input-b number-input"
                    size="mini"
                    @input="updateView($event, scope.row, 'foreignMoney')"
                    @change="()=>{foreignMoneyChange(scope.row, scope.$index)}"
                  />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" min-width="150" label="本位币金额" align="right">
          <template slot-scope="scope">
            <div style="padding-right: 0" class="cell-input-wrap w-b-i">
              <span
                :class="$numberClass(scope.row.money)"
                class="text-n number-text"
              >{{ _formatStandardCurrencyAbs(scope.row.money) }}</span>
              <el-input
                v-model="scope.row.money"
                :class="$numberClass(scope.row.money)"
                class="input-h number-input f-h"
                size="small"
                @focus="handleMoneyFocus($event,scope.$index)"
                @input="updateView($event, scope.row, 'money')"
                @change="()=>{moneyChange(scope.row, scope.$index)}"
              />
            </div>
            <div class="right-btn-wrap">
              <el-button
                tabindex="-1"
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="addRow(scope.$index)"
              />
              <el-button
                :disabled="localRow.hsCertDtlAstList.length === 1 && scope.$index < 1"
                tabindex="-1"
                type="danger"
                icon="el-icon-close"
                size="mini"
                @click="deleteRow(scope.$index)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--      <div class="btn-box">-->
      <!--        <div-->
      <!--          v-for="(item, index) in btnData"-->
      <!--          :key="index"-->
      <!--          :style="{'height': item.height, 'lineHeight': item.height, 'padding': item.heightValue > 50 ? 'calc(calc(' + item.height + ' - 50px) / 2) 5px' : '0 5px'}"-->
      <!--          class="btn-item"-->
      <!--        >-->
      <!--          <div class="right-btn-wrap">-->
      <!--            <el-button-->
      <!--              type="success"-->
      <!--              icon="el-icon-plus"-->
      <!--              circle-->
      <!--              size="mini"-->
      <!--              @click="addRow(index)"-->
      <!--            />-->
      <!--            <el-button-->
      <!--              :disabled="btnData.length === 1"-->
      <!--              type="danger"-->
      <!--              icon="el-icon-close"-->
      <!--              circle-->
      <!--              size="mini"-->
      <!--              @click="deleteRow(index)"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <choose-dialog ref="chooseDialog" @ok="choosedAsts" />
    <div class="add-dialogs">
      <!--    部门-->
      <!--      <addDepartDialog ref="addDepartDialog"/>-->
      <!--    往来单位-->
      <addCurrentUnitDialog ref="addCurrentUnitDialog" @ok="addAstOk" />
      <!--    往来个人-->
      <addCurrentUserDialog ref="addCurrentUserDialog" @ok="addAstOk" />
      <!--    收入来源-->
      <addIncomeSourceDialog ref="addIncomeSourceDialog" @ok="addAstOk" />
      <!--    拨款种类-->
      <addGrantsTypeDialog ref="addGrantsTypeDialog" @ok="addAstOk" />
      <!--    资产分类-->
      <addAssetClassificationDialog ref="addAssetClassificationDialog" @ok="addAstOk" />
      <!--    支付对象-->
      <addReceiverDialog ref="addReceiverDialog" @ok="addAstOk" />
      <!--    投资类型-->
      <addInvestmentTypeDialog ref="addInvestmentTypeDialog" @ok="addAstOk" />
      <!--    投资对象-->
      <addInvestmentDialog ref="addInvestmentDialog" @ok="addAstOk" />
      <!--    功能科目-->
      <addFunctionalSubjectDialog ref="addFunctionalSubjectDialog" @ok="addAstOk" />
      <!--    经济科目-->
      <addEconomicSubjectDialog ref="addEconomicSubjectDialog" @ok="addAstOk" />
      <!--    资金性质-->
      <addFundsNatureDialog ref="addFundsNatureDialog" @ok="addAstOk" />
      <!--    经费类型-->
      <addFundsTypesDialog ref="addFundsTypesDialog" @ok="addAstOk" />
      <!--    经费渠道-->
      <addFundingChannelsDialog ref="addFundingChannelsDialog" @ok="addAstOk" />
      <!--    预算项目-->
      <addBudgetsDialog ref="addBudgetsDialog" @ok="addAstOk" />
      <!--    经办机构-->
      <addAgencyDialog ref="addAgencyDialog" @ok="addAstOk" />
      <!--    专项类型-->
      <addSpecialTypesDialog ref="addSpecialTypesDialog" @ok="addAstOk" />
      <!--      指标来源-->
      <addIndicatorsSourceDialog ref="addIndicatorsSourceDialog" @ok="addAstOk" />
      <!--      现金流-->
      <addCashFlowDialog ref="addCashFlowDialog" @ok="addAstOk" />
      <!--    预算单位-->
      <!--      <addBudgetsUnitDialog ref="addBudgetsUnitDialog"/>-->
      <!-- 银行账户 bank account -->
      <addBankAccountDialog ref="addBankAccountDialog" @ok="addAstOk" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createHsCertDtlAst } from '@/common/create'
import commonMixins from '@/mixins/common'
import ChooseDialog from './chooseDialog'
import addDepartDialog from '@/views/sysConfig/mailListSub/addDepartDialog'
import addCurrentUnitDialog from '@/views/sysConfig/currentUnit/addDialog'
import addCurrentUserDialog from '@/views/sysConfig/currentUser/addDialog'
import addIncomeSourceDialog from '@/views/sysConfig/incomeSource/addDialog'
import addGrantsTypeDialog from '@/views/sysConfig/grantsType/addDialog'
import addAssetClassificationDialog from '@/views/sysConfig/assetClassification/addDialog'
import addReceiverDialog from '@/views/sysConfig/receiver/addDialog'
import addInvestmentTypeDialog from '@/views/sysConfig/investmentType/addDialog'
import addInvestmentDialog from '@/views/sysConfig/investment/addDialog'
import addFunctionalSubjectDialog from '@/views/sysConfig/functionalSubject/addDialog'
import addEconomicSubjectDialog from '@/views/sysConfig/economicSubject/addDialog'
import addFundsNatureDialog from '@/views/sysConfig/fundsNature/addDialog'
import addFundsTypesDialog from '@/views/sysConfig/fundsTypes/addDialog'
import addFundingChannelsDialog from '@/views/sysConfig/fundingChannels/addDialog'
import addBudgetsDialog from '@/views/sysConfig/budgets/addDialog'
import addAgencyDialog from '@/views/sysConfig/agency/addDialog'
import addSpecialTypesDialog from '@/views/sysConfig/specialTypes/addDialog'
import addIndicatorsSourceDialog from '@/views/sysConfig/indicatorsSource/addDialog'
import addCashFlowDialog from '@/views/sysConfig/cashFlow/addDialog'
import addBankAccountDialog from '@/views/sysConfig/bankAccount/addDialog'
// import addBudgetsUnitDialog from '@/views/sysConfig/budgetsUnit/AddDialog'
import { LINK_MAP } from './linkMap'

export default {
  name: 'AssistAddTable',
  components: {
    ChooseDialog,
    addDepartDialog,
    addCurrentUnitDialog,
    addCurrentUserDialog,
    addIncomeSourceDialog,
    addGrantsTypeDialog,
    addAssetClassificationDialog,
    addReceiverDialog,
    addInvestmentTypeDialog,
    addInvestmentDialog,
    addFunctionalSubjectDialog,
    addEconomicSubjectDialog,
    addFundsNatureDialog,
    addFundsTypesDialog,
    addFundingChannelsDialog,
    addBudgetsDialog,
    addAgencyDialog,
    addSpecialTypesDialog,
    addIndicatorsSourceDialog,
    addCashFlowDialog,
    addBankAccountDialog
    // addBudgetsUnitDialog
  },
  mixins: [commonMixins],
  props: {
    localRow: {
      type: Object,
      default: function() {
        return {}
      }
    },
    localModel: {
      type: String,
      default: ''
    },
    subjectCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      astValueMap: {},
      ok: false,
      // 超过3个页面布局就有变化
      astTypeLen: 0,
      editAstRow: {},
      btnData: [], // 浮动按钮的高度
      currentToAddAstTypeId: '', // 当前新增中的辅助项类型id
      currentToAddExtCode: '', // 当前新增中的辅助项类型code
      moneyQueryParams: {
        projectEncode: ''
      }
    }
  },
  computed: {
    ...mapGetters(['bookInfo', 'commonForeignKeyList', 'sysParam', 'sysType'])
  },
  watch: {
    'localRow.hsCertDtlAstList'() {
      this.initRow()
    }
  },
  async created() {
    console.log(this.localRow)
    this.initRow()
    this.sysType === 'gh' && this.$emit('useMoneyChange')
  },
  methods: {
    updateView(e, data, key) {
      this.$forceUpdate()
      key && this.handleNumberInput(e, data, key)
    },
    // 只能输入两位小数
    handleNumberInput(value, data, key) {
      this.$replaceToMoney(data, key)
      // data[key] = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    },
    // 原币是否显示全量精度
    ifShowForeignPop(value) {
      value = '' + value
      const dig = value.split('.')[1]
      const num = parseFloat(this.sysParam.foreignCurrencyDig || 0)
      return dig && dig.length > num
    },
    // 数量变了
    initRow() {
      this.ok = false
      this.btnData = []
      if (
        this.localRow &&
        this.localRow.hsCertDtlAstList &&
        this.localRow.hsCertDtlAstList.length > 0
      ) {
        const subAstTypeVOList = this.localRow.subDetail.subAstTypeVOList || []
        const astValueMap = {}
        const opList = []
        // 拿到辅助项值的缓存
        this.astValueMap = this.localRow.astValueMap || {}
        subAstTypeVOList.forEach(item => {
          // 声明结构
          astValueMap[item.extCode] =
            (this.astValueMap && this.astValueMap[item.extCode]) || []
          // 查辅助项的值
          opList.push(this.queryAssistTypeValue(item))
        })
        this.astTypeLen = subAstTypeVOList.length
        // 辅助项的值的列表请求完成
        Promise.all(opList)
          .then(() => {
            // 保存
            this.localRow.astValueMap = this.astValueMap
            this.localRow.hsCertDtlAstList.forEach((row, index) => {
              // 格式化数据
              const num = parseFloat(row.num || 0)
              const price = parseFloat(row.price || 0)
              const foreignRate = parseFloat(row.foreignRate || 0)
              const foreignMoney = parseFloat(row.foreignMoney || 0)
              const money = parseFloat(row.money || 0)
              const forMoney = price * num || foreignMoney
              if (money) {
                row.money = money
              } else {
                const countMoney = forMoney * (foreignRate || 1)
                if (countMoney) {
                  row.money = countMoney.toFixed(2)
                } else {
                  row.money = ''
                }
              }
              row.subCode = this.localRow.subCode
              // 辅助项map
              const oldAstMap = {}
              const astMap = {}
              const astNameMap = {}
              const astValueMap = {}
              // row.oldAstMap = {}
              const rawOldAstMap = row.oldAstMap || {}
              subAstTypeVOList.forEach(item => {
                astMap[item.extCode] = row.astMap[item.extCode] || {}
                oldAstMap[item.extCode] =
                  rawOldAstMap[item.extCode] ||
                  astMap[item.extCode].hisAstDtlId ||
                  ''
                astNameMap[item.extCode] = item.astName
                // 声明结构
                astValueMap[item.extCode] =
                  (this.astValueMap && this.astValueMap[item.extCode]) || []
              })
              for (const i in oldAstMap) {
                if (oldAstMap[i] === '-1' || oldAstMap[i] === '-2') {
                  oldAstMap[i] = astMap[i].encode
                }
              }
              row.astMap = astMap
              row.oldAstMap = oldAstMap
              row.astNameMap = astNameMap
              row.astValueMap = astValueMap
              this.ok = true
              this.btnData.push({
                className: 'ast-' + index,
                height: '56px',
                heightValue: 56
              })
              this.$nextTick(() => {
                const h = document.querySelectorAll('.cover .el-table__row')[
                  index
                ].clientHeight
                this.btnData[index].height = h + 'px'
                this.btnData[index].heightValue = h
              })
            })
            console.log(this.btnData)
          })
          .catch(err => {
            console.log(err)
            this.ok = true
          })
      } else {
        this.ok = true
      }
      this.toCertForm()
    },
    reSet() {
      this.ok = false
      this.$nextTick(() => {
        this.ok = true
      })
    },
    astValueChange(row, extCode) {
      console.log(row, extCode)
      const phid = row.oldAstMap[extCode]
      const astValueList = this.astValueMap[extCode]
      astValueList.forEach(item => {
        if (item.phid === phid) {
          row.astMap[extCode] = {
            dtlCode: item.name,
            hisAstDtlId: item.phid,
            encode: item.encode
          }
        }
      })
      if (extCode === 'ext_11') {
        this.moneyQueryParams.projectEncode = row.astMap.ext_11.encode
      }
      this.updateView()
    },
    updateUseMoneyBySubDeptBudget(index) {
      this.moneyQueryParams.projectEncode =
        this.localRow.hsCertDtlAstList[index].astMap.ext_11.encode || ''
      this.getNoUseMoneyBySubDeptBudget()
    },
    // 查询科目-部门-预算项目 未用金额
    getNoUseMoneyBySubDeptBudget() {
      if (this.moneyQueryParams.projectEncode) {
        this.$http
          .post('account/cert/getNoUseMoneyBySubDeptBudget', {
            ...this.moneyQueryParams,
            subEncode: this.subjectCode,
            bookId: this.$commonQueryParam.bookId,
            orgId: this.$commonQueryParam.orgId,
            year: this.$commonQueryParam.year
          })
          .then(res => {
            const money = res.data
            money && this.$emit('useMoneyChange', Number(money).toFixed(2))
          })
      } else {
        this.$emit('useMoneyChange')
      }
    },
    newAstValueChange(row, extCode) {
      const value = row.oldAstMap[extCode] || ''
      row.astMap[extCode] = {
        dtlCode: '',
        hisAstDtlId: -1,
        encode: value
      }
      this.updateView()
    },
    newAstValueChange2(row, extCode) {
      const value = row.oldAstMap[extCode]
      row.astMap[extCode] = {
        dtlCode: '',
        hisAstDtlId: -2,
        encode: value
      }
      this.updateView()
    },
    queryAssistTypeValue(assItem) {
      // 如果已经请求过值的列表那就不请求了
      if (
        this.astValueMap[assItem.extCode] &&
        this.astValueMap[assItem.extCode].length > 0
      ) {
        return this.astValueMap[assItem.extCode]
      }
      // 请求值的列表
      return this.$http
        .post('ucenter/diy/astType/dtl/listBookNoPage', {
          astTypeId: assItem.astTypeId,
          bookId: this.$commonQueryParam.bookId,
          orgId: this.$commonQueryParam.orgId,
          showTree: 1,
          year: this.$commonQueryParam.year
        })
        .then(res => {
          this.astValueMap[assItem.extCode] = res.data || []
        })
    },
    // 增加行
    addRow(index, data) {
      this.localRow.hsCertDtlAstList.splice(
        index + 1,
        0,
        data || {
          ...createHsCertDtlAst(),
          subCode: this.localRow.subCode
        }
      )
      this.$emit('useMoneyChange')
    },
    // 删除行
    deleteRow(index) {
      this.localRow.hsCertDtlAstList.splice(index, 1)
      this.$emit('useMoneyChange')
    },
    // 检查每一项是否需要显示数量
    ifShowNumRow(item) {
      let flag = false
      if (item.subDetail && item.subDetail.amountCheck === '1') {
        flag = true
      }
      if (parseFloat(item.num || 0) || parseFloat(item.price || 0)) {
        flag = true
      }
      return flag
    },
    // 检查每一项是否需要显示外币
    ifShowForeignCurrencyRow(item) {
      let flag = false
      if (item.subDetail && item.subDetail.foreignCheck === '1') {
        flag = true
      }
      return flag
    },
    // 本位币联动
    moneyChange(row) {
      const money = parseFloat(row.money || 0)
      const num = parseFloat(row.num || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      // 有数量
      if (this.ifShowNumRow(this.localRow) && num) {
        // 有外币
        if (foreignKey) {
          row.price = (money / (foreignRate * num)).toFixed(2)
        } else {
          // 汇率默认为1
          row.price = (money / num).toFixed(2)
        }
      }
      // 有外币
      if (this.ifShowForeignCurrencyRow(this.localRow) && foreignKey) {
        // 有外币
        row.foreignMoney = money / foreignRate
      }
      this.toCertForm()
    },
    // 币别切换
    foreignKeyChange(row, index) {
      this.commonForeignKeyList.forEach(currency => {
        if (currency.foreignKey === row.foreignKey) {
          row.foreignRate = currency.foreignRate
        }
      })
      const foreignRate = parseFloat(row.foreignRate || 0)
      const foreignMoney = parseFloat(row.foreignMoney || 0)
      if (foreignMoney) {
        // 有外币
        row.money = (foreignMoney * foreignRate).toFixed(2)
      } else {
        const value = parseFloat(row.money || 0)
        if (value) {
          row.foreignMoney = value / foreignRate
        }
      }
      this.toCertForm()
    },
    // 原币修改
    foreignMoneyChange(row, index) {
      const num = parseFloat(row.num || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      const foreignMoney = parseFloat(row.foreignMoney || 0)
      // 有数量
      if (this.ifShowNumRow(this.localRow) && num) {
        row.price = (foreignMoney / num).toFixed(2)
      }
      // 有外币,肯定有外币核算
      if (this.ifShowForeignCurrencyRow(this.localRow)) {
        if (foreignKey) {
          // 有外币
          row.money = (foreignMoney * foreignRate).toFixed(2)
        }
      }
      this.toCertForm()
    },
    // 单价修改
    priceChange(row, index) {
      const num = parseFloat(row.num || 0)
      const price = parseFloat(row.price || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      // 有数量，肯定有数量核算
      if (num) {
        // 有外币
        if (this.ifShowForeignCurrencyRow(this.localRow)) {
          if (foreignKey) {
            row.money = (price * num * foreignRate).toFixed(2)
          }
          row.foreignMoney = price * num
        } else {
          row.money = (price * num).toFixed(2)
        }
      }
      this.toCertForm()
      // 没数量就不用看
    },
    // 数量变了
    numChange(row, index) {
      const num = parseFloat(row.num || 0)
      const price = parseFloat(row.price || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      if (price) {
        // 有外币
        if (this.ifShowForeignCurrencyRow(this.localRow)) {
          if (foreignKey) {
            row.money = (price * num * foreignRate).toFixed(2)
          }
          row.foreignMoney = price * num
        } else {
          row.money = (price * num).toFixed(2)
        }
      }
      this.toCertForm()
    },
    // 表格格式化
    formatDetailList() {
      if (
        this.localRow &&
        this.localRow.hsCertDtlAstList &&
        this.localRow.hsCertDtlAstList.length > 0
      ) {
        this.localRow.hsCertDtlAstList.forEach(row => {
          const numTemp = parseFloat(row.num || 0)
          const priceTemp = parseFloat(row.price || 0)
          const money = parseFloat(row.money || 0)
          row.money = money || ''
          row.num = numTemp || ''
          row.price = priceTemp || ''
        })
      }
    },
    // 转到明细
    toCertForm() {
      this.formatDetailList()
      const certForm = this.localRow
      const debit = parseFloat(certForm.debit || 0)
      const lender = parseFloat(certForm.lender || 0)
      let moneyTotal = 0
      let ifSamePrice = true
      let lastPrice = ''
      let fanPrice = 0
      let numTotal = 0
      let ifSameFor = true
      let forKey = ''
      let forRate = ''
      let forMoneyTotal = 0
      const hsCertDtlAstList = this.localRow.hsCertDtlAstList || []
      hsCertDtlAstList.forEach(row => {
        const money = parseFloat(row.money || 0)
        const num = parseFloat(row.num || 0)
        const price = parseFloat(row.price || 0)
        // 单价一样那就整合
        if (price) {
          if (lastPrice !== '' && lastPrice !== price) {
            ifSamePrice = false
          }
          fanPrice = price
          lastPrice = price
        }
        moneyTotal += money
        numTotal += num
        // 如果是用一种外币那就要整合到明细
        if (row.foreignKey) {
          if (forKey !== '' && forKey !== row.foreignKey) {
            ifSameFor = false
          }
          forKey = row.foreignKey
          forRate = parseFloat(row.foreignRate || 0)
          forMoneyTotal += parseFloat(row.foreignMoney || 0)
        }
      })
      if (certForm.debitActive) {
        certForm.debit = moneyTotal
        this.$emit('moneyChange')
      } else if (certForm.lenderActive) {
        certForm.lender = moneyTotal
        this.$emit('moneyChange')
      } else if (debit) {
        certForm.debit = moneyTotal
        this.$emit('moneyChange')
      } else if (lender) {
        certForm.lender = moneyTotal
        this.$emit('moneyChange')
      }
      // 金额和数量相加
      certForm.tempMoney = moneyTotal
      certForm.num = numTotal
      if (ifSameFor) {
        certForm.foreignKey = forKey
        certForm.foreignRate = forRate
        certForm.foreignMoney = forMoneyTotal
      } else {
        certForm.foreignKey = ''
        certForm.foreignRate = ''
        certForm.foreignMoney = ''
      }
      // 单价整合
      if (ifSamePrice) {
        certForm.price = fanPrice
      } else {
        certForm.price = ''
      }
    },
    // 双击弹窗选择
    showCheckDialog(rowData, astRow, selectList) {
      this.editAstRow = astRow
      this.$refs.chooseDialog.open(
        rowData.astName,
        this.editAstRow.oldAstMap[rowData.extCode],
        rowData.extCode,
        rowData.astTypeId
      )
    },
    // 选择完辅助项
    choosedAsts(backValue) {
      this.currentToAddAstTypeId = backValue.astTypeId
      this.currentToAddExtCode = backValue.extCode
      this.editAstRow.oldAstMap[backValue.extCode] = backValue.oldAstMapCode
      this.addAstOk()
      this.astValueChange(this.editAstRow, backValue.extCode)
    },
    // 选中输入框内容
    handleFocus(e) {
      e.currentTarget.select()
    },
    handleMoneyFocus(e, index) {
      e.currentTarget.select()
      this.sysType === 'gh' && this.updateUseMoneyBySubDeptBudget(index)
    },
    // 新增辅助项
    addAst(row, ast) {
      const { astTypeId, astName, extCode } = ast
      this.currentToAddAstTypeId = astTypeId
      this.currentToAddExtCode = extCode
      const currentAstDialogName = LINK_MAP.filter(
        item => item.name === astName
      )[0].componentName
      const aloneList = [
        'addDepartDialog',
        'addCurrentUnitDialog',
        'addBudgetsUnitDialog'
      ]
      if (!aloneList.includes(currentAstDialogName)) {
        // 部门单独打开
        currentAstDialogName &&
          this.$refs[currentAstDialogName].open('add', {
            parentId: 0,
            year: this.$commonQueryParam.year || this.bookInfo.year,
            groupId: this.$commonQueryParam.groupId || -1
          })
      } else if (currentAstDialogName === 'addDepartDialog') {
        // 其余基础数据类型对应的辅助项，不包含自定义辅助项
        currentAstDialogName &&
          this.$popup(addDepartDialog, {
            parentId: 0,
            detail: { phid: 0, isAdd: true }
          })
            .then(() => {
              this.addAstOk()
            })
            .catch(err => {
              console.log('err', err)
            })
      } else if (currentAstDialogName === 'addCurrentUnitDialog') {
        this.$refs[currentAstDialogName].open({
          ifReferred: false,
          form: {
            year: this.$commonQueryParam.year || this.bookInfo.year,
            groupId: this.$commonQueryParam.groupId || -1
          },
          dialogType: 'add'
        })
      } else if (currentAstDialogName === 'addBudgetsUnitDialog') {
        this.$message.warning('该类型的辅助项不可新增！')
      }
    },
    //  辅助项新增回调
    addAstOk() {
      this.$http
        .post('ucenter/diy/astType/dtl/listBookNoPage', {
          astTypeId: this.currentToAddAstTypeId,
          bookId: this.$commonQueryParam.bookId,
          orgId: this.$commonQueryParam.orgId,
          showTree: 1,
          year: this.$commonQueryParam.year
        })
        .then(res => {
          this.astValueMap[this.currentToAddExtCode] = res.data || []
          this.$forceUpdate()
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.ass-wrap {
  width: 100%;
}

.table-title {
  text-align: left;
  border: none;
}

.voucher-edit-table {
  /deep/ th {
    padding: 2px 0;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
}

.cover {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
}

.btn-box {
  width: 30px;
  margin-top: 38px;

  .btn-item {
    padding: 0 5px;

    .right-btn-wrap {
      button {
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        padding: 0;
        display: block;
        margin: 0 0 5px 0;
      }
    }
  }
}
.datePicker {
  width: 100%;
  height: 100%;
  /deep/ .el-input__inner {
    height: 100%;
    border: none;
  }
}
//.ast-text {
//  display: block;
//  height: 100%;
//  margin: 0;
//  font-size: 12px;
//  word-break: break-all;
//  overflow-y: auto;
//  overflow-x: hidden;
//
//  /deep/ .el-select-dropdown__item {
//    margin-bottom: 30px;
//  }
//}

.ast-select-popper .select-b-btn-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  height: 30px;
  line-height: 30px;
}
</style>
