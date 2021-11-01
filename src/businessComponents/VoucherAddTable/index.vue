<template>
  <div>
    <div
      class="table-wrap"
      style="height: 100%"
    >
      <div v-if="notUseAmount && sysType === 'gh'" class="not-use-amonut">预算额度：{{ notUseAmount }}</div>
      <el-table
        ref="table"
        :border="true"
        :data="dtlList"
        :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}"
        :span-method="objectSpanMethod"
        :highlight-current-row="true"
        :class="[cardInput ? 'cardInput' : '', 'visible-table', 'voucher-edit-table', 'has-row-btn', 'count-sin', +bookInfo.isNewAccounts === 1 ? 'new-table' : 'old-table', $sysSetting.sysType === 'cz' ? 'cz-table' : 'gh-table']"
        :height="+bookInfo.isNewAccounts === 1 ? '342px' : ''"
        :summary-method="getSummaries"
        :show-summary="+bookInfo.isNewAccounts === 1"
        tooltip-effect="dark"
        style="width: 100%"
        @current-change="currentChange"
      >
        <!--      <el-table-->
        <!--        ref="table"-->
        <!--        :border="true"-->
        <!--        :data="dtlList"-->
        <!--        :header-cell-style="{textAlign: 'center'}"-->
        <!--        :cell-style="{textAlign: 'center'}"-->
        <!--        :span-method="objectSpanMethod"-->
        <!--        :highlight-current-row="true"-->
        <!--        :class="[cardInput?'cardInput':'','visible-table', 'voucher-edit-table', 'has-row-btn', 'count-sin']"-->
        <!--        :height="+bookInfo.isNewAccounts === 1 ? '342px' : ''"-->
        <!--        tooltip-effect="dark"-->
        <!--        style="width: 100%"-->
        <!--        @current-change="currentChange"-->
        <!--      >-->
        <el-table-column
          :resizable="false"
          label="摘要"
          min-width="140px"
          prop="digest"
        >
          <template slot-scope="scope">
            <span v-if="scope.$index === dtlList.length-1 && +bookInfo.isNewAccounts === 0">{{
              scope.row.digest
            }}</span>
            <div
              v-else
              class="cell-input-wrap with-click"
              style="text-align: left"
              @dblclick="openDigestSelect(scope.row, scope.$index)"
            >
              <el-autocomplete
                :maxlength="50"
                v-model="scope.row.digest"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                :popper-append-to-body="true"
                :rows="3"
                style="width: 100%"
                type="textarea"
                resize="none"
                class="input-h"
                popper-class="digest-suggestion"
                @focus="()=>{digestFocus(scope.$index)}"
                @blur="setDigestToStore(scope.row.digest, scope.$index)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          label="科目"
          min-width="200px"
          prop="subId"
        >
          <template slot-scope="scope">
            <span v-if="scope.$index === dtlList.length-1 && +bookInfo.isNewAccounts === 0">{{ scope.row.subId }}</span>
            <div
              v-else
              class="cell-input-wrap with-click"
              style="text-align: left;"
              @dblclick="openSubjectSelectDialog(scope.row, `${model || 'old'}-subSelect-${scope.$index}`)"
              @click="clickSubModal(scope.row)"
            >
              <div
                v-if="scope.row.astIconShow"
                class="ast-icon"
                @click="activeChange(scope.row, 'debitActive', 'debit')"
              ><span>辅</span></div>
              <span
                :class="[scope.row.divUpSelect ? 'active' : '']"
                class="text-n number-text sub-text"
                @blur="blurSub(scope.row)"
              >
                {{ scope.row.subCode }} {{ scope.row.subName }}
                <el-select
                  v-loading="loading"
                  :ref="`${model || 'old'}-subSelect-${scope.$index}`"
                  v-model="scope.row.subCode"
                  :trigger-on-focus="false"
                  :clearable="true"
                  :popper-append-to-body="true"
                  :title="`${scope.row.subCode} ${scope.row.subName}`"
                  :class="[`${model || 'old'}-subSelect-${scope.$index}`]"
                  element-loading-text="数据载入中"
                  popper-class="sub-select-popper"
                  class="input-h sub-select"
                  style="height: 100%"
                  filterable
                  remote
                  placeholder=""
                  @focus="otherFocus"
                  @change="(value)=>{subjectChange(value, scope.row, `${model || 'old'}-subSelect-${scope.$index}`)}"
                >
                  <el-option-group
                    v-for="group in options"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.phid"
                      :disabled="item.status !== '1' || item.end !== '1'"
                      :label="`${item.encode} ${item.name}`"
                      :value="item.encode"
                    >
                      <span style="float: left">{{ item.encode }} {{ item.name }}</span>
                      <span v-if="item.subAstTypeVOList ? item.subAstTypeVOList.length > 0 : false" style="float: right; color: rgb(26, 132, 232); font-size: 13px">辅</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </span>
              <div />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showNumCol && layout === 2"
          :resizable="false"
          width="170"
          label="数量"
          prop="num"
        >
          <template slot-scope="scope">
            <div
              v-if="ifShowNumRow(scope.row)"
              class="no-p-cell"
            >
              <div>
                <span>数量:</span>
                <span
                  v-if="ifShowAssistTable(scope.row)"
                  style="width: 100px;"
                  class="text-b mini"
                >{{ _formatCountEmpty(scope.row.num) }}</span>
                <div
                  v-else
                  style="width: 100px;"
                  class="input-b-wrap"
                >
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
                <span
                  v-if="ifShowAssistTable(scope.row)"
                  :class="$numberClass(scope.row.price)"
                  style="width: 100px;"
                  class="text-b mini"
                >{{ localFormatUnitPriceBottomShow(scope.row.price) }}</span>
                <div
                  v-else
                  style="width: 100px;"
                  class="input-b-wrap"
                >
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
          v-if="bookInfo.isForeignCurrency === '1' && showForeignCurrencyCol && layout === 2"
          :resizable="false"
          width="200"
          label="币别"
          prop="foreignKey"
        >
          <template slot-scope="scope">
            <div
              v-if="ifShowForeignCurrencyRow(scope.row)"
              class="no-p-cell"
            >
              <div>
                <el-select
                  :disabled="ifShowAssistTable(scope.row)"
                  v-model="scope.row.foreignKey"
                  placeholder=""
                  style="width: 80px"
                  size="mini"
                  class="theme-select no-p normal-disabled"
                  @change="()=>{foreignKeyChange(scope.row, scope.$index)}"
                >
                  <el-option
                    v-for="(item, index) in commonForeignKeyList"
                    v-if="_ifSubjectForeign(item, scope.row)"
                    :key="index"
                    :label="item.foreignKey"
                    :value="item.foreignKey"
                  />
                </el-select>
                <span>:</span>
                <span
                  v-if="ifShowAssistTable(scope.row)"
                  style="width: 70px;"
                  class="text-b mini"
                >{{ scope.row.foreignRate ? _formatForeignCurrencyEmpty(scope.row.foreignRate) : '--' }}</span>
                <span
                  v-else
                  style="width: 70px;"
                  class="text-b mini"
                >{{ _formatForeignCurrencyEmpty(scope.row.foreignRate) }}</span>
              </div>
              <div>
                <span>原币:</span>
                <span
                  v-if="ifShowAssistTable(scope.row)"
                  :class="$numberClass(scope.row.foreignMoney)"
                  style="width: 126px;"
                  class="text-b mini"
                >{{ localFormatForeignCurrencyBottomShow(scope.row.foreignMoney) }}</span>
                <template v-else>
                  <el-tooltip
                    v-if="ifShowForeignPop(scope.row.foreignMoney)"
                    :content="''+scope.row.foreignMoney"
                    placement="top"
                    effect="light"
                  >
                    <div
                      style="width: 126px;"
                      class="input-b-wrap"
                    >
                      <span
                        :class="$numberClass(scope.row.foreignMoney)"
                        class="text-n number-text"
                      >{{ _formatForeignCurrencyAbs(scope.row.foreignMoney) }}</span>
                      <el-input
                        v-model="scope.row.foreignMoney"
                        class="input-b number-input"
                        size="mini"
                        @change="()=>{foreignMoneyChange(scope.row, scope.$index)}"
                      />
                    </div>
                  </el-tooltip>
                  <div
                    v-else
                    style="width: 126px;"
                    class="input-b-wrap"
                  >
                    <span
                      :class="$numberClass(scope.row.foreignMoney)"
                      class="text-n number-text"
                    >{{ _formatForeignCurrencyAbs(scope.row.foreignMoney) }}</span>
                    <el-input
                      v-model="scope.row.foreignMoney"
                      class="input-b number-input"
                      size="mini"
                      @change="()=>{foreignMoneyChange(scope.row, scope.$index)}"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-table-column>
        <template v-if="cardInput">
          <el-table-column
            :resizable="false"
            prop="debit"
            min-width="140px"
          >
            <div
              slot="header"
              class="n-header"
            >
              <number-grid-header :title="'借方'" />
            </div>
            <template slot-scope="scope">
              <div
                v-if="scope.row && scope.row.last && +bookInfo.isNewAccounts === 0"
                :class="[`${model || 'old'}-debit-${scope.$index}`]"

                class="right-cell cell-input-wrap"
              >
                <number-grid :count="''+scope.row.debit" />
              </div>
              <template v-else>
                <div
                  v-if="ifShowAssistTable(scope.row)"
                  :class="['cell-input-wrap', scope.row.debitActive ? 'c-active' : '', `${model || 'old'}-debit-${scope.$index}`]"
                  @click="activeChange(scope.row, 'debitActive', 'debit')"
                >
                  <number-grid :count="''+scope.row.debit" />
                </div>
                <div
                  v-else
                  :class="[`${model || 'old'}-debit-${scope.$index}`]"
                  class="cell-input-wrap"
                >
                  <number-grid :count="''+scope.row.debit" />
                  <el-input
                    v-if="!ifShowAssistTable(scope.row)"
                    :ref="[`${model || 'old'}-debit-${scope.$index}`]"
                    v-model="scope.row.debit"
                    :class="$numberClass(scope.row.debit)"
                    class="input-h number-input f-h"
                    size="small"
                    style="text-align: right"
                    @focus="handleFocus"
                    @input="() => {$replaceToMoney(scope.row, 'debit')}"
                    @change="()=>{debitLenderChange('debit', scope.row, scope.$index)}"
                  />
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="lender"
            min-width="140px"
          >
            <div
              slot="header"
              class="n-header"
            >
              <number-grid-header :title="'贷方'" />
            </div>
            <template slot-scope="scope">
              <div
                v-if="scope.row && scope.row.last && +bookInfo.isNewAccounts === 0"
                :class="[`${model || 'old'}-lender-${scope.$index}`]"
                class="right-cell cell-input-wrap"
              >
                <number-grid :count="''+scope.row.lender" />
              </div>
              <template v-else>
                <div
                  v-if="ifShowAssistTable(scope.row)"
                  :class="['cell-input-wrap', scope.row.lenderActive ? 'c-active' : '', `${model || 'old'}-lender-${scope.$index}`]"
                  @click="activeChange(scope.row, 'lenderActive', 'lender')"
                >
                  <number-grid :count="''+scope.row.lender" />
                </div>
                <div
                  v-else
                  :class="[`${model || 'old'}-lender-${scope.$index}`]"
                  class="cell-input-wrap"
                >
                  <number-grid :count="''+scope.row.lender" />

                  <el-input
                    v-if="!ifShowAssistTable(scope.row)"
                    :ref="[`${model || 'old'}-lender-${scope.$index}`]"
                    v-model="scope.row.lender"
                    :class="$numberClass(scope.row.lender)"
                    class="input-h number-input f-h"
                    size="small"
                    style="text-align: right"
                    @focus="handleFocus"
                    @input="() => {$replaceToMoney(scope.row, 'lender')}"
                    @change="()=>{debitLenderChange('lender', scope.row, scope.$index)}"
                  />
                </div>
              </template>
              <div
                v-if="!scope.row.last && +bookInfo.isNewAccounts === 0"
                class="right-btn-wrap"
              >
                <el-button
                  tabindex="-1"
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addRow(scope.$index)"
                />
                <el-button
                  tabindex="-1"
                  type="danger"
                  icon="el-icon-close"
                  size="mini"
                  @click="deleteRow(scope.$index)"
                />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :resizable="false"
            min-width="140px"
            label="借方"
            prop="debit"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row && scope.row.last && +bookInfo.isNewAccounts === 0"
                :class="[`${model || 'old'}-debit-${scope.$index}`]"
                class="right-cell"
              >
                <span :class="$numberClass(scope.row.debit)">{{ _formatStandardCurrencyAbs(scope.row.debit) }}</span>
              </div>
              <template v-else>
                <div
                  v-if="ifShowAssistTable(scope.row)"
                  :class="['cell-input-wrap', scope.row.debitActive ? 'c-active' : '', `${model || 'old'}-debit-${scope.$index}`]"
                  @click="activeChange(scope.row, 'debitActive', 'debit')"
                >
                  <span
                    :class="$numberClass(scope.row.debit)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyAbs(scope.row.debit) }}</span>
                </div>
                <div
                  v-else
                  :class="[`${model || 'old'}-debit-${scope.$index}`]"
                  class="cell-input-wrap"
                >
                  <span
                    :class="$numberClass(scope.row.debit)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyAbs(scope.row.debit) }}</span>
                  <el-input
                    v-if="!ifShowAssistTable(scope.row)"
                    :ref="[`${model || 'old'}-debit-${scope.$index}`]"
                    v-model="scope.row.debit"
                    :class="$numberClass(scope.row.debit)"
                    class="input-h number-input f-h"
                    size="small"
                    style="text-align: right"
                    @focus="handleFocus"
                    @input="() => {$replaceToMoney(scope.row, 'debit')}"
                    @change="()=>{debitLenderChange('debit', scope.row, scope.$index)}"
                  />
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            min-width="140px"
            label="贷方"
            prop="lender"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row && scope.row.last && +bookInfo.isNewAccounts === 0"
                :class="[`${model || 'old'}-lender-${scope.$index}`]"
                class="right-cell"
              >
                <span :class="$numberClass(scope.row.lender)">{{ _formatStandardCurrencyAbs(scope.row.lender) }}</span>
              </div>
              <template v-else>
                <div
                  v-if="ifShowAssistTable(scope.row)"
                  :class="['cell-input-wrap', scope.row.lenderActive ? 'c-active' : '', `${model || 'old'}-lender-${scope.$index}`]"
                  @click="activeChange(scope.row, 'lenderActive', 'lender')"
                >
                  <span
                    :class="$numberClass(scope.row.lender)"
                    class="text-n number-text"
                  >{{ _formatStandardCurrencyAbs(scope.row.lender) }}</span>
                </div>
                <div
                  v-else
                  :class="[`${model || 'old'}-lender-${scope.$index}`]"
                  class="cell-input-wrap"
                >
                  <span
                    :class="$numberClass(scope.row.lender)"
                    class="text-n number-text"
                  >
                    {{ _formatStandardCurrencyAbs(scope.row.lender) }}
                  </span>
                  <el-input
                    v-if="!ifShowAssistTable(scope.row)"
                    :ref="[`${model || 'old'}-lender-${scope.$index}`]"
                    v-model="scope.row.lender"
                    :class="$numberClass(scope.row.lender)"
                    class="input-h number-input f-h"
                    size="small"
                    style="text-align: right"
                    @focus="handleFocus"
                    @input="() => {$replaceToMoney(scope.row, 'lender')}"
                    @change="()=>{debitLenderChange('lender', scope.row, scope.$index)}"
                  />
                </div>
              </template>
              <div
                v-if="+bookInfo.isNewAccounts === 0 ? !scope.row.last : true"
                class="right-btn-wrap"
              >
                <el-button
                  tabindex="-1"
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addRow(scope.$index)"
                />
                <el-button
                  tabindex="-1"
                  type="danger"
                  icon="el-icon-close"
                  size="mini"
                  @click="deleteRow(scope.$index)"
                />
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div>
        <assist-add-table
          v-if="ifShowAssistTable(editRow) && (editRow.debitActive || editRow.lenderActive)"
          :local-model="model"
          :local-row="editRow"
          :subject-code="editRow.subCode"
          @useMoneyChange="useMoneyChange"
          @moneyChange="formatDetailList"
        />
      </div>
      <div
        v-if="ifBusinessDate"
        class="bottom-info"
      >
        <template v-if="ifBottomDetail">
          <span class="item">财务主管: {{ certTemp.cfoName }}</span>
          <span class="item">审核: {{ certTemp.verifyName }}</span>
          <span class="item">制单: {{ certTemp.creatName }}</span>
          <span class="item">出纳: {{ certTemp.cashName }}</span>
        </template>
        <span>业务日期：</span>
        <el-date-picker
          :disabled="editRow.blank"
          :picker-options="pickerOptions"
          v-model="editRow.businessDate"
          :editable="false"
          type="date"
          style="width: 140px"
          size="small"
          value-format="yyyy-MM-dd"
        />
      </div>
      <div v-if="ifShowNumBottom(editRow) && layout === 1">
        <open-num
          :layout="layout"
          :local-row.sync="editRow"
          :show-type="'add'"
        />
      </div>
    </div>
    <subject-select-dialog
      ref="subjectSelectDialog"
      @ok="subjectSelectDialogOk"
    />
    <digest-select
      ref="digestSelect"
      :is-tmp-model-digest="isTmpModel"
      @ok="digestSelectOk"
    />
    <cert-fund-account-dialog ref="certFundAccountDialog" />
    <CheckCoverTmp
      ref="CheckCoverTmp"
      @ok="CheckCoverTmp"
      @userTmpToCover="userTmpToCover"
    />
    <subject-add-dialog
      ref="subjectAddDialog"
      @ok="subjectAddDialogOk"
    />
    <!-- 选择财务科目对应的预算科目 -->
    <checkRelateSub
      ref="checkRelateSub"
      @ok="setRelatedSub"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createHsCertDtlPara, createHsCertDtlAst } from '@/common/create'
import SubjectSelectDialog from '@/businessComponents/SubjectSelectDialog'
import DigestSelect from '@/businessComponents/DigestSelect'
import AssistAddTable from '@/businessComponents/AssistAddTable'
import NumberGrid from '@/businessComponents/NumberGrid'
import NumberGridHeader from '@/businessComponents/NumberGridHeader'
import CertFundAccountDialog from '@/businessComponents/CertFundAccountDialog'
import business from '@/common/business'
import commonMixins from '@/mixins/common'
import CheckCoverTmp from './checkCoverTmp'
import OpenNum from './openNum'
import SubjectAddDialog from '@/businessComponents/SubjectAddDialog'
import moment from 'moment'
import checkRelateSub from './checkRelatedSub'

export default {
  name: 'VoucherAddTable',
  components: {
    SubjectSelectDialog,
    DigestSelect,
    AssistAddTable,
    NumberGrid,
    NumberGridHeader,
    CertFundAccountDialog,
    CheckCoverTmp,
    OpenNum,
    SubjectAddDialog,
    checkRelateSub
  },
  mixins: [commonMixins],
  props: {
    dtlList: {
      type: Array,
      default: function() {
        return []
      }
    },
    certTemp: {
      type: Object,
      default: function() {
        return {
          cfoName: '',
          verifyName: '',
          creatName: '',
          cashName: ''
        }
      }
    },
    year: {
      type: String,
      default: ''
    },
    ifBusinessDate: {
      type: Boolean,
      default: true
    },
    ifBottomDetail: {
      type: Boolean,
      default: false
    },
    model: {
      type: String,
      default: ''
    },
    cardInput: {
      type: Boolean,
      default: false
    },
    isTmpModel: {
      type: Boolean,
      default: false
    },
    layout: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      type: 'add',
      editRow: {
        blank: true,
        debitActive: false,
        lenderActive: false,
        ...createHsCertDtlPara()
      },
      pickerOptions: {},
      loading: false,
      showNumCol: false,
      showForeignCurrencyCol: false,
      options: [],
      accountType: 'old',
      currentRowIndex: 0,
      itemSubCode: '',
      activeRef: '',
      notUseAmount: ''
    }
  },
  computed: {
    ...mapGetters([
      'bookInfo',
      'subjectTree',
      'sysType',
      // 只能选择末级科目
      'subjectList',
      'subjectListLast',
      'commonForeignKeyList',
      'sysParam',
      'certDigest'
    ])
  },
  watch: {
    dtlList() {
      this.ifShowNumCol()
      this.ifShowForeignCurrencyCol()
      this.formatDetailList()
    },
    subjectList() {
      this.options = this.$groupSubjectList(this.subjectList, this.model, this.accountType)
    },
    editRow: {
      deep: true,
      handler: function(newVal) {
      }
    }
  },
  created() {
    if (this.bookInfo.isNewAccounts === '1') {
      this.accountType = 'new'
    }
    this.ifShowNumCol()
    this.ifShowForeignCurrencyCol()
    this.formatDetailList()
    // 设置时间选择器
    this.pickerOptions = business.getDisabledDateFn(this.$commonQueryParam)
    console.log(this.model, this.subjectListLast, 'subjectListLast')
  },
  mounted() {
    this.$store.dispatch('initSubjectTree', {
      bookId: this.$commonQueryParam.bookId,
      orgId: this.$commonQueryParam.orgId,
      year: this.year ? this.year.split('-')[0] : this.bookInfo.year ? this.bookInfo.year : new Date().getFullYear(),
      withParentName: 1
    })
    this.options = this.$groupSubjectList(this.subjectList, this.model, this.accountType)
  },
  methods: {
    // 科目-部门-预算项目 未用金额变化
    useMoneyChange(amount) {
      this.notUseAmount = amount
    },
    // 设置明细项的科目信息
    setRowSubjectInfo(row, subject, isSubChange) {
      row.subName = ''
      for (let i = 0; i < this.options.length; i++) {
        const item = this.options[i].options
        for (let j = 0; j < item.length; j++) {
          const item2 = item[j]
          if (subject.encode === item2.encode) {
            row.subName = item2.name
          }
        }
      }
      row.astIconShow = subject.subAstTypeVOList ? subject.subAstTypeVOList.length > 0 : false
      row.subId = subject.phid || ''
      row.subCode = subject.encode || ''
      // row.subName = subject.name || ''
      row.subDetail = this.$deepClone(subject)
      // if (isSubChange) {
      //   document.querySelector('.is-focus input').blur()
      //   row.debitActive = Math.abs(row.debit) > 0
      //   row.lenderActive = Math.abs(row.lender) > 0
      // }
    },
    // 是否显示全量精度
    ifShowForeignPop(value) {
      value = '' + value
      const dig = value.split('.')[1]
      const num = parseFloat(this.sysParam.foreignCurrencyDig || 0)
      return dig && dig.length > num
    },
    localFormatForeignCurrencyBottomShow(value) {
      return this._formatForeignCurrencyAbs(value) || '--'
    },
    localFormatUnitPriceBottomShow(value) {
      return this._formatUnitPriceAbs(value) || '--'
    },
    // 表格合并规则
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let col = 2
      if (this.showNumCol) {
        col++
      }
      if (this.bookInfo.isForeignCurrency === '1' && this.showForeignCurrencyCol) {
        col++
      }
      const colList = []
      for (let i = 1; i < col; i++) {
        colList.push(i)
      }
      if (row && row.last) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: col
          }
        }
        if (colList.indexOf(columnIndex) !== -1) {
          return {
            rowspan: 1,
            colspan: 0
          }
        }
      }
    },
    // 借贷联动
    debitLenderChange(key, row, index) {
      console.log('debitLenderChange')
      row[key] = row[key] !== '0' ? this.$clearToNumber(row[key]) : '0'
      const valueRaw = parseFloat(row[key] || 0)
      if (valueRaw > 999999999.99) {
        row[key] = ''
      }
      // 不正确的输入直接返回
      // if (!row[key]) {
      //   return
      // }
      if (key === 'debit') {
        row.lender = ''
      } else {
        row.debit = ''
      }
      console.log('debitLenderChange-end')
      this.formatDetailList()
      this.debitLenderAutoPriceForeignMoney(key, row)
    },
    // 数量变了
    numChange(row, index) {
      let key = 'debit'
      const debit = parseFloat(row.debit || 0)
      const lender = parseFloat(row.lender || 0)
      if (debit) {
        key = 'debit'
      }
      if (lender) {
        key = 'lender'
      }
      const num = parseFloat(row.num || 0)
      const price = parseFloat(row.price || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      if (price) {
        // 有外币
        if (this.ifShowForeignCurrencyRow(row)) {
          if (foreignKey) {
            row[key] = (price * num * foreignRate).toFixed(2)
          }
          row.foreignMoney = (price * num)
        } else {
          row[key] = (price * num).toFixed(2)
        }
      }
    },
    // 单价修改
    priceChange(row, index) {
      let key = 'debit'
      const debit = parseFloat(row.debit || 0)
      const lender = parseFloat(row.lender || 0)
      if (debit) {
        key = 'debit'
      }
      if (lender) {
        key = 'lender'
      }
      const num = parseFloat(row.num || 0)
      const price = parseFloat(row.price || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      // 有数量，肯定有数量核算
      if (num) {
        // 有外币
        if (this.ifShowForeignCurrencyRow(row)) {
          if (foreignKey) {
            row[key] = (price * num * foreignRate).toFixed(2)
          }
          row.foreignMoney = (price * num)
        } else {
          row[key] = (price * num).toFixed(2)
        }
      }
      // 没数量就不用看
    },
    // 币别切换
    foreignKeyChange(row, index) {
      this.commonForeignKeyList.forEach((currency) => {
        if (currency.foreignKey === row.foreignKey) {
          row.foreignRate = currency.foreignRate
        }
      })
      let key = 'debit'
      const debit = parseFloat(row.debit || 0)
      const lender = parseFloat(row.lender || 0)
      if (debit) {
        key = 'debit'
      }
      if (lender) {
        key = 'lender'
      }
      const foreignRate = parseFloat(row.foreignRate || 0)
      const foreignMoney = parseFloat(row.foreignMoney || 0)
      if (foreignMoney) {
        // 有外币
        row[key] = (foreignMoney * foreignRate).toFixed(2)
      } else {
        const value = parseFloat(row[key] || 0)
        if (value) {
          row.foreignMoney = value / foreignRate
        }
      }
    },
    // 原币修改
    foreignMoneyChange(row, index) {
      let key = 'debit'
      const debit = parseFloat(row.debit || 0)
      const lender = parseFloat(row.lender || 0)
      if (debit) {
        key = 'debit'
      }
      if (lender) {
        key = 'lender'
      }
      const num = parseFloat(row.num || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      const foreignMoney = parseFloat(row.foreignMoney || 0)
      // 有数量
      if (this.ifShowNumRow(row) && num) {
        row.price = (foreignMoney / num).toFixed(2)
      }
      // 有外币,肯定有外币核算
      if (foreignKey) {
        // 有外币
        row[key] = (foreignMoney * foreignRate).toFixed(2)
      }
    },
    // 输入借贷，联动核算
    debitLenderAutoPriceForeignMoney(key, row) {
      const debitLender = row[key]
      const num = parseFloat(row.num || 0)
      const foreignKey = row.foreignKey
      const foreignRate = parseFloat(row.foreignRate || 0)
      // 有数量
      if (this.ifShowNumRow(row) && num) {
        // 有外币
        if (foreignKey) {
          row.price = (debitLender / (foreignRate * num)).toFixed(2)
        } else {
          // 汇率默认为1
          row.price = (debitLender / (num)).toFixed(2)
        }
      }
      // 有外币
      if (this.ifShowForeignCurrencyRow(row) && foreignKey) {
        // 有外币
        row.foreignMoney = (debitLender / (foreignRate))
      }
      // 借贷联动自动平衡
      this.debitLenderChangeAutoRow()
    },
    // 表格格式化
    formatDetailList() {
      let debit = 0
      let lender = 0
      const lastIndex = +this.bookInfo.isNewAccounts === 0 ? this.dtlList.length - 1 : this.dtlList.length
      for (let i = 0; i < lastIndex; i++) {
        const item = this.dtlList[i]
        const debitTemp = parseFloat(item.debit || 0)
        const lenderTemp = parseFloat(item.lender || 0)
        const numTemp = parseFloat(item.num || 0)
        const priceTemp = parseFloat(item.price || 0)
        debit += debitTemp
        lender += lenderTemp
        item.debit = debitTemp ? debitTemp.toFixed(2) : item.debit === '' ? '' : '0'
        item.lender = lenderTemp ? lenderTemp.toFixed(2) : item.lender === '' ? '' : '0'
        item.num = numTemp || ''
        item.price = priceTemp || ''
        item.astIconShow = item.subDetail.subAstTypeVOList ? item.subDetail.subAstTypeVOList.length > 0 : false
        this.$set(item, 'divUpSelect', false)
      }
      // 录凭证不用计算
      // this.dtlList[lastIndex].digest = `合计:${this.$digitUppercase(debit)}`
      +this.bookInfo.isNewAccounts === 0 && (this.dtlList[lastIndex].debit = debit.toFixed(2));
      +this.bookInfo.isNewAccounts === 0 && (this.dtlList[lastIndex].lender = lender.toFixed(2))
    },
    // 获取凭证借贷方总额
    getCertDebitLenderSum() {
      let debit = 0
      let lender = 0
      const lastIndex = this.dtlList.length - 1
      let lastKey = ''
      for (let i = 0; i < lastIndex; i++) {
        const item = this.dtlList[i]
        const debitTemp = parseFloat(item.debit || 0)
        const lenderTemp = parseFloat(item.lender || 0)
        if (debitTemp) {
          lastKey = 'debit'
        } else if (lenderTemp) {
          lastKey = 'lender'
        }
        debit += debitTemp
        lender += lenderTemp
        item.debit = debitTemp || (item.debit === '' ? '' : '0')
        item.lender = lenderTemp || (item.lender === '' ? '' : '0')
      }
      return {
        debit,
        lender,
        lastKey
      }
    },
    // 科目选择后金额自动平衡
    subjectChangeAuto(row) {
      console.log('subjectChangeAuto')
      if (!row.subId) {
        // 清空的话就算了
        return false
      }
      const rowDebit = parseFloat(row.debit || 0)
      const rowLender = parseFloat(row.lender || 0)
      if (rowDebit || rowLender) {
        // 有数据
        return false
      }
      const debitLenderSum = this.getCertDebitLenderSum()
      const debit = debitLenderSum.debit
      const lender = debitLenderSum.lender
      // const lastKey = debitLenderSum.lastKey
      // 平的那就算了
      if (debit === lender) {
        return false
      }
      const diff = debit - lender
      if (diff > 0) {
        row.lender = diff
      } else {
        row.debit = Math.abs(diff)
      }
      console.log('subjectChangeAuto-end')
      this.formatDetailList()
    },
    // 增加行
    addRow(index, data) {
      this.dtlList.splice(index + 1, 0, data || {
        ...createHsCertDtlPara(),
        hsCertDtlAstList: [createHsCertDtlAst()]
      })
    },
    // 删除行
    deleteRow(index) {
      this.dtlList.splice(index, 1)
      if (this.dtlList.length < 4) {
        if (this.bookInfo.isNewAccounts === '0') {
          this.dtlList.splice(this.dtlList.length - 2, 0, {
            ...createHsCertDtlPara(),
            hsCertDtlAstList: [createHsCertDtlAst()]
          })
        } else {
          this.dtlList.push({
            ...createHsCertDtlPara(),
            hsCertDtlAstList: [createHsCertDtlAst()]
          })
        }
      }
    },
    // 打开科目选择弹窗
    openSubjectSelectDialog(row, cellRef) {
      this.editRow = row
      this.$refs.subjectSelectDialog.open({
        isInCertAdd: true,
        model: this.model,
        multiple: false,
        year: moment(this.year || this.$commonQueryParam.year).format('YYYY')
      })
      this.activeRef = cellRef
    },
    // 检查是否是经费科目，是就弹出录入框
    checkFundsAccount(row) {
      if (row.subDetail && row.subDetail.financeCheck === '1') {
        if (!row.fundsUUid) {
          row.fundsUUid = this.$createUUid()
        }
        this.$emit('fundAccountShow', row)
      }
    },
    // 科目弹窗选择回调
    subjectSelectDialogOk(data) {
      this.setRowSubjectInfo(this.editRow, data, true)
      this.subjectChangeAuto(this.editRow)
      // this.ifShowAssistTable(this.editRow)
      this.prepareAssist(this.editRow)
      this.stepToNextCell(this.editRow, this.activeRef)
      this.ifShowNumCol()
      this.ifShowForeignCurrencyCol()
      this.checkFundsAccount(this.editRow)
      if (window.location.href.indexOf('voucherManagement') > -1) {
        if (this.bookInfo.isNewAccounts === '1' && this.model === 'cai') {
          this.checkRelateSub(data.phid)
        }
        this.checkSubRelatedTmp(data.phid)
      }
    },
    // 科目下拉回调
    subjectChange(value, row, cellRef) {
      let subId = ''
      if (!value) {
        this.setRowSubjectInfo(row, {}, true)
      } else {
        for (let i = 0; i < this.subjectListLast.length; i++) {
          const item = this.subjectListLast[i]
          if (value === item.encode) {
            subId = item.phid
            this.setRowSubjectInfo(row, item, true)
            // 科目选择了那就等同于选择了当前行
            this.$refs.table.setCurrentRow(row)
            break
          }
        }
        // document.querySelector(`.${toCellClass} input`).focus()
        if (window.location.href.indexOf('voucherManagement') > -1) {
          if (this.bookInfo.isNewAccounts === '1' && this.model === 'cai') {
            this.checkRelateSub(subId)
          }
          this.checkSubRelatedTmp(subId)
        }
      }
      // 自动平衡
      this.subjectChangeAuto(row)
      // 判断是否显示辅助项
      // this.ifShowAssistTable(row)
      this.activeRef = cellRef
      this.prepareAssist(row, cellRef)
      this.stepToNextCell(row, cellRef)
      this.ifShowNumCol()
      this.ifShowForeignCurrencyCol()
      this.checkFundsAccount(row)
      this.$sysSetting.sysType === 'cz' && this.checkDiff(row)
    },
    // 科目选完自动跳到下一个单元格
    stepToNextCell(row, cellRef) {
      const lender = parseFloat(row.lender || '')
      if (row.hsCertDtlAstList.length) {
        if (!(row.debitActive || row.lenderActive)) {
          if (lender) {
            row.lenderActive = true
          } else {
            // 默认借方高亮
            row.debitActive = true
          }
        }
      } else {
        const model = cellRef.split('-')[0]
        const index = cellRef.split('-')[2]
        if (lender) {
          setTimeout(() => {
            this.$refs[`${model}-lender-${index}`].focus()
          }, 0)
        } else {
          setTimeout(() => {
            this.$refs[`${model}-debit-${index}`].focus()
          }, 0)
        }
      }
      if (cellRef) {
        this.$nextTick(() => {
          if (this.$refs[cellRef]) {
            this.$refs[cellRef].blur()
          }
        })
      }
    },
    // 查看是否有财务关联的预算科目
    checkRelateSub(subId) {
      this.$http.get('account/subRelation/findBookYearData', { subId: subId }).then(({ status, data, message }) => {
        if (status) {
          if (data.length === 1) {
            this.$emit('relatedSubChecked', data)
          } else if (data.length > 1) {
            this.$refs.checkRelateSub.open(data)
          }
        }
      })
    },
    // 检查科目是否开启差异项核算且存在差异同时待分配金额不为0
    checkDiff(row) {
      // 拿到当前科目的数据
      let diffItem = {}
      for (let i = 0; i < this.subjectListLast.length; i++) {
        const item = this.subjectListLast[i]
        if (row.subId === item.phid && +item.diffItemCheck === 1) {
          diffItem = { ...item }
          break
        }
      }
      if (diffItem.phid) {
        // 查询是否有差异项
        this.$http.get('ucenter/differenceItem/findOrgDifList', {
          orgId: this.$commonQueryParam.orgId,
          year: this.$commonQueryParam.year
        }).then(({ status, data, message }) => {
          if (status) {
            const flag = Object.values(data).some(item => item.length > 0)
            if (flag) {
              // 查询待分配金额
              this.$emit('checkDiff', diffItem)
            }
          } else {
            this.$message.error('差异项查询失败：' + message)
          }
        }).catch(err => {
          console.log(err.message)
        })
      }
    },
    // 有多个对应预算科目的情况选择其中一个
    setRelatedSub(sub) {
      this.$emit('relatedSubChecked', sub)
    },
    // 通过科目查看是否有关联模板并打开选择弹框
    checkSubRelatedTmp(subId) {
      this.$http.get(`account/certTmp/findCertTmpBySubId/${subId}`).then(({ status, message, data }) => {
        if (status) {
          if (data.length) {
            const _data = data
            this.$refs.CheckCoverTmp.open({ list: _data })
          }
        } else {
          this.$message.error(message)
        }
      })
    },
    // 使用模板覆盖
    userTmpToCover(val) {
      this.$emit('coverCertWithTmp', val)
    },
    CheckCoverTmp(val) {
      this.$emit('coverCertWithTmp', val)
    },
    // 打开摘要选择
    openDigestSelect(row, index) {
      this.editRow = row
      this.currentRowIndex = index
      this.$refs.digestSelect.open({ source: 0 })
    },
    // 选择摘要
    digestSelectOk(value) {
      this.editRow.digest = value
      this.setDigestToStore(this.editRow.digest, this.currentRowIndex)
    },
    // 点击行
    currentChange(currentRow) {
      console.log('currentChange')
      if (currentRow) {
        this.$emit('currentChange', currentRow)
        // 如果点击的是合计那就清空
        if (currentRow.last) {
          this.$refs.table.setCurrentRow()
        } else {
          // 增加对比的唯一标识
          currentRow.uuIdT = this.$createUUid()
          this.otherFocus(currentRow)
          this.editRow = currentRow
          this.$emit('editTableCurrentChange', currentRow)
        }
      } else {
        this.editRow = {
          blank: true,
          ...createHsCertDtlPara(),
          hsCertDtlAstList: []
        }
        this.otherFocus()
      }
      console.log('currentChange-end')
    },
    // 是否有辅助项
    ifHasAssist(item) {
      return item.subDetail && item.subDetail.subAstTypeVOList && item.subDetail.subAstTypeVOList.length > 0
    },
    // 检查所有列,决定是否显示数量栏
    ifShowNumCol() {
      let flag = false
      this.dtlList.forEach((rec) => {
        const item = rec
        // 排除有辅助项的
        if (this.ifHasAssist(item)) {
          return false
        }
        if (item.subDetail && item.subDetail.amountCheck === '1') {
          flag = true
        }
        if (parseFloat(item.num || 0) || parseFloat(item.price || 0)) {
          flag = true
        }
      })
      this.showNumCol = flag
    },
    // 检查当前行是否显示数量栏
    ifShowNumBottom(item) {
      if (item.subDetail && (item.subDetail.amountCheck === '1' || item.subDetail.foreignCheck === '1') && item.subDetail.subAstTypeVOList.length === 0) { // 选了科目
        return true
      } else {
        return false
      }
    },
    // 检查每一项是否需要显示数量
    ifShowNumRow(item) {
      let flag = false
      // 排除有辅助项的
      if (this.ifHasAssist(item)) {
        return false
      }
      if (item.subDetail && item.subDetail.amountCheck === '1') {
        flag = true
      }
      if (parseFloat(item.num || 0) || parseFloat(item.price || 0)) {
        flag = true
      }
      return flag
    },
    // 检查所有列,决定是否显示外币栏
    ifShowForeignCurrencyCol() {
      let flag = false
      this.dtlList.forEach((rec) => {
        const item = rec
        // 排除有辅助项的
        if (this.ifHasAssist(item)) {
          return false
        }
        if (item.subDetail && item.subDetail.foreignCheck === '1') {
          flag = true
        }
        if (parseFloat(item.foreignMoney || 0)) {
          flag = true
        }
      })
      this.showForeignCurrencyCol = flag
    },
    // 检查每一项是否需要显示外币
    ifShowForeignCurrencyRow(item) {
      let flag = false
      // 排除有辅助项的
      if (this.ifHasAssist(item)) {
        return false
      }
      if (item.subDetail && item.subDetail.foreignCheck === '1') {
        flag = true
      }
      if (parseFloat(item.foreignMoney || 0)) {
        flag = true
      }
      return flag
    },
    // 摘要匹配
    querySearch(queryString, cb) {
      this.$http.post('account/cert/getDigest', {
        condition: queryString,
        currPage: 1,
        pageSize: 10,
        bookId: this.$commonQueryParam.bookId,
        orgId: this.$commonQueryParam.orgId,
        year: this.$commonQueryParam.year
      }).then((res) => {
        cb(res.data.list || [])
      })
    },
    // 是否辅助项模式
    ifShowAssistTable(listItem) {
      // console.log(listItem.subCode)
      this.itemSubCode = listItem.subCode
      let flag = false
      if (listItem.subDetail && listItem.subDetail.subAstTypeVOList && listItem.subDetail.subAstTypeVOList.length > 0) {
        flag = true
        // 开启了辅助项，辅助项明细如果没数据就初始化一个
        const debit = parseFloat(listItem.debit || '')
        const lender = parseFloat(listItem.lender || '')
        if (!(listItem.hsCertDtlAstList && listItem.hsCertDtlAstList.length > 0)) {
          listItem.hsCertDtlAstList = [createHsCertDtlAst({
            money: debit || lender || ''
          })]
        } else if (listItem.hsCertDtlAstList.length === 1) {
          !listItem.hsCertDtlAstList[0].money && (listItem.hsCertDtlAstList[0].money = debit || lender || '')
        }
      }
      return flag
    },
    // 辅助项准备，只在切换科目的时候会调用
    prepareAssist(row, cellRef) {
      // 开启辅助项的话，明细里面的数据就清空
      row.num = ''
      row.price = ''
      row.foreignRate = ''
      row.foreignMoney = ''
      row.foreignKey = ''
      if (this.ifShowAssistTable(row)) {
        const debit = parseFloat(row.debit || '')
        const lender = parseFloat(row.lender || '')
        row.hsCertDtlAstList = [createHsCertDtlAst({
          money: debit || lender || ''
        })]
      } else {
        row.hsCertDtlAstList = []
      }
    },
    // 借贷高亮部分
    activeChange(listItem, key, key2) {
      console.log('activeChange')
      this.dtlList.forEach((localItem) => {
        localItem['debitActive'] = false
        localItem['lenderActive'] = false
      })
      listItem[key] = true
      if (!listItem.tempMoney) {
        listItem.tempMoney = listItem.debit || listItem.lender
      }
      listItem.debit = ''
      listItem.lender = ''
      listItem[key2] = listItem.tempMoney
      this.formatDetailList()
      console.log('activeChange-end')
    },
    // 换行以后移除所有高亮
    otherFocus(currentRow) {
      this.dtlList.forEach((localItem) => {
        if (currentRow && (currentRow.uuIdT !== localItem.uuIdT)) {
          localItem['debitActive'] = false
          localItem['lenderActive'] = false
        }
      })
    },
    // 摘要获取焦点以后自动填充上一行摘要
    digestFocus(index) {
      if (index !== 0 && !this.dtlList[index].digest) {
        const lastDigest = this.dtlList[index - 1].digest
        if (lastDigest) {
          this.dtlList[index].digest = lastDigest
        }
      } else if (this.certDigest && this.model === 'yu' && index === 0) {
        this.dtlList[index].digest = this.certDigest
      }
    },
    // 选中输入框内容
    handleFocus(e) {
      e.currentTarget.select()
    },
    // 获取需要被自动填充的明细
    getCanAutoRow() {
      const lastIndex = this.dtlList.length - 1
      for (let i = 0; i < lastIndex; i++) {
        const item = this.dtlList[i]
        const debitTemp = parseFloat(item.debit || 0) || 0
        const lenderTemp = parseFloat(item.lender || 0) || 0
        // 有科目，没有借贷方金额
        // if (item.subId && !(debitTemp || lenderTemp)) { // 增加非空判断使输入0时不会被自动平衡
        if (item.subId && !(debitTemp || lenderTemp) && !(item.debit === '0' || item.lender === '0')) {
          return item
        }
      }
      return null
    },
    // 借贷方金额变化触发的金额变动
    debitLenderChangeAutoRow() {
      console.log('debitLenderChangeAutoRow')
      const debitLenderSum = this.getCertDebitLenderSum()
      const debit = debitLenderSum.debit
      const lender = debitLenderSum.lender
      // 平的那就算了
      if (debit === lender) {
        return false
      }
      const canAutoRow = this.getCanAutoRow()
      // 没有可以自动填充的行
      if (!canAutoRow) {
        return false
      }
      const diff = debit - lender
      if (diff > 0) {
        canAutoRow.lender = diff
      } else {
        canAutoRow.debit = Math.abs(diff)
      }
      console.log('debitLenderChangeAutoRow-end')
      this.formatDetailList()
    },
    // 只能输入两位小数  弃用
    handleNumberInput(value, data, key) {
      // data[key] = value.replace(/^-?^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      data[key] = value.replace(/(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^-?0$)|(^-?\d\.\d{1,2}$)/g, '$1')
    },
    // 新增科目
    addSub() {
      this.$refs.subjectAddDialog.open({
        isInCertAdd: true,
        dialogType: 'add',
        parentCode: '',
        parentName: '无上级科目',
        dialogTitle: '新增会计科目',
        subYear: moment(this.year).format('YYYY'),
        ifAdopted: false
      })
    },
    // 新增科目回调
    subjectAddDialogOk() {
      this.$store.dispatch('initSubjectTree', {
        bookId: this.$commonQueryParam.bookId,
        orgId: this.$commonQueryParam.orgId,
        year: moment(this.year).format('YYYY'),
        withParentName: 1
      })
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index < columns.length - 2) {
          sums[index] = ''
          return
        }
        const values = data.map(item => (column.property === 'debit' || column.property === 'lender') && Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.$formatMoneyRaw(sums[index].toFixed(2))
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    // 缓存摘要
    setDigestToStore(digest, index) {
      if (this.model === 'cai' && index === 0) {
        this.$store.dispatch('setCertDigest', digest)
      }
    },
    // 点击科目，将文案置于input下方
    clickSubModal(row) {
      this.dtlList.forEach(item => {
        item.divUpSelect = false
      })
      row.divUpSelect = true
    },
    blurSub(row) {
      this.dtlList.forEach(item => {
        item.divUpSelect = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-wrap {
  height: auto;
  .not-use-amonut {
    margin-bottom: 10px;
    color: #FFA033;
  }
}

.form-content {
  margin-bottom: 18px;
}

.input-s {
  width: 80px;
}

.bottom-info {
  background-color: #fff;
  padding: 10px 0 10px 10px;
  line-height: 23px;
  font-size: 14px;
  color: rgb(96, 98, 102);
  text-align: right;

  span {
  }

  .item {
    margin-top: 5px;
    margin-right: 7%;
    float: left;
  }
}

.a-2 {
  padding-right: 30px;
}

.visible-table {
  /deep/ th {
    padding: 2px 0;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }

  /deep/ td {
    padding: 0;
    line-height: 14px;
    font-size: 12px;
    height: 64px;

    /deep/ .cell {
      height: 64px;
      // line-height: 56px;

      .digest-suggestion {
        position: absolute;
        z-index: 999;
      }
    }
  }

  &.cz-table {
    .sub-text {
      font-size: 12px;
    }

    .cell-input-wrap .input-h /deep/ .el-textarea /deep/ .el-textarea__inner,
    .cell-input-wrap .input-v /deep/ .el-textarea /deep/ .el-textarea__inner {
      font-size: 12px;
    }
  }

  &.gh-table {
    .sub-text {
      font-size: 14px;
    }

    .cell-input-wrap .input-h /deep/ .el-textarea /deep/ .el-textarea__inner,
    .cell-input-wrap .input-v /deep/ .el-textarea /deep/ .el-textarea__inner {
      font-size: 14px;
    }
  }
}

.count-sin {
  &.old-table {
    /deep/ .el-table__body-wrapper {
      tr:last-child {
        //display: none;
        td {
          height: 32px;

          /deep/ .cell {
            height: 42px;
            line-height: 42px;
            font-size: 14px;

            .cell-input-wrap {
              min-height: 42px;
            }
          }
        }
      }
    }
  }

  /deep/ .cell-input-wrap {
      min-height: 0!important;
  }
  /deep/ .el-table__footer-wrapper {
    td {
      height: 32px;
      background: #fff;
      border-right: 0;

      /deep/ .cell {
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        text-align: center;
        padding-right: 24px;

        .cell-input-wrap {
          min-height: 42px;
        }
      }
    }

    th {
      background: #fff;
    }

    td:nth-child(1) {
      .cell {
        text-align: left;
        padding-left: 16px;
      }
    }

    td:nth-child(2) {
      .cell {
        border-right: 1px solid #DCDFE6;
      }
    }

    td:nth-last-child(2) {
      .cell {
        text-align: right;
        border-right: 1px solid #DCDFE6;
      }
    }

    td:nth-last-child(3) {
      .cell {
        text-align: right;
        border-right: 1px solid #DCDFE6;
      }
    }
  }
}

.sub-select {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 80;

  /deep/ input {
    opacity: 0;

    &:focus {
      opacity: 1;
    }
  }
}

.sub-text {
  display: block;
  height: 100%;
  margin: 0;
  padding: 5px !important;
  font-size: 12px;
  word-break: break-all;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 90;

  &.active {
    z-index: 100;
    overflow-y: hidden;
  }
}

.select-b-btn-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  height: 30px;
  line-height: 30px;
}
</style>
