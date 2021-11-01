<template>
  <div :style="{'min-height': +bookInfo.isNewAccounts === 1 ? '342px' : 'inherit'}">
    <el-table
      v-loading="loading"
      :ref="`table-${thisModel}`"
      :border="true"
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :span-method="objectSpanMethod"
      :highlight-current-row="true"
      :class="[cardInput?'cardInput':'','visible-table', 'voucher-edit-table','has-row-btn', thisModel ? `table-${thisModel}` : '', 'count-sin', +bookInfo.isNewAccounts === 1 ? 'new-table' : 'old-table', $sysSetting.sysType === 'cz' ? 'cz-table' : 'gh-table']"
      :height="+bookInfo.isNewAccounts === 1 ? '342px' : ''"
      :summary-method="getSummaries"
      :show-summary="+bookInfo.isNewAccounts === 1"
      :style="{'width': width}"
      element-loading-text="数据载入中..."
      tooltip-effect="dark"
      @current-change="currentChange"
    >
      <el-table-column
        min-width="200px"
        align="center"
        label="摘要"
        prop="digest"
      >
        <template slot-scope="scope">
          <!--          <div v-if="scope.$index === dtlList.length-1">{{ scope.row.digest }}</div>-->
          <div
            :title="scope.row.digest"
            class="sub-text"
          >{{ scope.row.digest }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150px"
        align="center"
        label="科目"
        prop="subId"
      >
        <template slot-scope="scope">
          <!--          <span v-if="scope.$index === dtlList.length-1">{{ scope.row.subId }}</span>-->
          <span
            :title="scope.row.subId ? `${scope.row.subCode} ${scope.row.subName||'' }`:''"
            class="sub-text"
          >{{ scope.row.subId ? `${scope.row.subCode} ${scope.row.subName||''}` : '' }}</span>
          <div
            v-if="ifShowAstIcon(scope.row)"
            class="ast-icon"
          ><span>辅</span></div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="showNumCol "
        width="170"
        label="数量"
      >
        <template slot-scope="scope">
          <div
            v-if="ifShowNumRow(scope.row)"
            class="no-p-cell"
          >
            <div>
              <span>数量:</span>
              <span
                v-if="ifBottomShow"
                style="width: 100px;"
                class="text-b mini"
              >--</span>
              <span
                v-else
                style="width: 100px;"
                class="text-b mini"
              >{{ _formatUnitPriceEmpty(scope.row.num) }}</span>
            </div>
            <div>
              <span>单价:</span>
              <span
                v-if="ifBottomShow"
                style="width: 100px;"
                class="text-b mini"
              >--</span>
              <span
                v-else
                :class="[$numberClass(scope.row.price)]"
                style="width: 100px;"
                class="text-b mini"
              >{{ _formatUnitPriceAbs(scope.row.price) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="bookInfo.isForeignCurrency === '1' && showForeignCurrencyCol"
        width="200"
        label="币别"
      >
        <template slot-scope="scope">
          <div
            v-if="ifShowForeignCurrencyRow(scope.row)"
            class="no-p-cell"
          >
            <div>
              <span>{{ scope.row.foreignKey }}</span>
              <span>:</span>
              <span
                v-if="ifBottomShow"
                style="width: 100px;"
                class="text-b mini"
              >--</span>
              <span
                v-else
                style="width: 100px;"
                class="text-b mini"
              >{{ _formatForeignCurrencyEmpty(scope.row.foreignRate) }}</span>
            </div>
            <div>
              <span>原币:</span>
              <span
                v-if="ifBottomShow"
                style="width: 100px;"
                class="text-b mini"
              >--</span>
              <span
                v-else
                :class="[$numberClass(scope.row.foreignMoney)]"
                style="width: 100px;"
                class="text-b mini"
              >{{ _formatForeignCurrencyAbs(scope.row.foreignMoney) }}</span>
            </div>
          </div>
        </template>
      </el-table-column> -->
      <template v-if="cardInput">
        <el-table-column
          prop="debit"
          min-width="150px">
          <div
            slot="header"
            class="n-header"
          >
            <number-grid-header :title="'借方'"/>
          </div>
          <template slot-scope="scope">
            <!--            <div-->
            <!--              v-if="scope.row && scope.row.last"-->
            <!--              class="right-cell cell-input-wrap"-->
            <!--            >-->
            <!--              <number-grid :count="''+scope.row.debit"/>-->
            <!--            </div>-->
            <template>
              <div class="cell-input-wrap">
                <number-grid :count="''+scope.row.debit"/>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="lender"
          min-width="150px">
          <div
            slot="header"
            class="n-header"
          >
            <number-grid-header :title="'贷方'"/>
          </div>
          <template slot-scope="scope">
            <!--            <div-->
            <!--              v-if="scope.row && scope.row.last"-->
            <!--              class="right-cell cell-input-wrap"-->
            <!--            >-->
            <!--              <number-grid :count="''+scope.row.lender"/>-->
            <!--            </div>-->
            <template>
              <div class="cell-input-wrap">
                <number-grid :count="''+scope.row.lender"/>
              </div>
            </template>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column
          min-width="150px"
          align="right"
          prop="debit"
          label="借方"
        >
          <template slot-scope="scope">
            <!--            <span-->
            <!--              v-if="scope.$index === dtlList.length-1"-->
            <!--              :class="[$numberClass(scope.row.debitTem)]"-->
            <!--              class="text-n number-text"-->
            <!--            >{{ _formatStandardCurrencyAbs(scope.row.debit) }}</span>-->
            <span
              :class="[$numberClass(scope.row.debit)]"
              class="text-n number-text"
            >{{ _formatStandardCurrencyAbs(scope.row.debit) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150px"
          align="right"
          prop="lender"
          label="贷方"
        >
          <template slot-scope="scope">
            <!--            <span-->
            <!--              v-if="scope.$index === dtlList.length-1"-->
            <!--              :class="[$numberClass(scope.row.lenderTemp)]"-->
            <!--              class="text-n number-text"-->
            <!--            >{{ _formatStandardCurrencyAbs(scope.row.lender) }}</span>-->
            <span
              :class="[$numberClass(scope.row.lender)]"
              class="text-n number-text"
            >{{ _formatStandardCurrencyAbs(scope.row.lender) }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <assist-view-table
      v-if="ifShowAssistTable(editRow)"
      :local-model="thisModel"
      :local-row="editRow"
    />
    <div
      v-if="ifBusinessDate"
      :class="{small: small}"
      class="bottom-info"
    >
      <div class="info-left">
        <open-num
          v-if="ifShowNumBottom(editRow)"
          :layout="1"
          :local-row.sync="editRow"
          :show-type="'view'"
        />
        <template v-if="ifBottomDetail && !ifShowNumBottom(editRow)">
          <span
            class="item"
            style="display: inline-block"
          >财务主管：{{ certTemp.cfoName }}</span>
          <span
            class="item"
            style="display: inline-block"
          >审核：{{ certTemp.verifyName }}</span>
          <span
            class="item"
            style="display: inline-block"
          >制单：{{ certTemp.creatName }}</span>
          <span
            class="item"
            style="display: inline-block"
          >出纳：{{ certTemp.cashName }}</span>
        </template>
      </div>
      <div class="info-right">
        <span>业务日期:</span>
        <el-date-picker
          :readonly="true"
          v-model="editRow.businessDate"
          :editable="false"
          type="date"
          size="small"
          style="width: 140px"
          value-format="yyyy-MM-dd"
        />
      </div>
    </div>
    <div
      v-if="ifBottomDetail && ifShowNumBottom(editRow)"
      class="has-num-bottom"
    >
      <span
        class="item"
        style="display: inline-block"
      >财务主管： {{ certTemp.cfoName }}</span>
      <span
        class="item"
        style="display: inline-block"
      >审核：{{ certTemp.verifyName }}</span>
      <span
        class="item"
        style="display: inline-block"
      >制单：{{ certTemp.creatName }}</span>
      <span
        class="item"
        style="display: inline-block"
      >出纳：{{ certTemp.cashName }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createHsCertDtlPara } from '@/common/create'
import AssistViewTable from '@/businessComponents/AssistViewTable'
import NumberGrid from '@/businessComponents/NumberGrid'
import NumberGridHeader from '@/businessComponents/NumberGridHeader'
import commonMixins from '@/mixins/common'
import OpenNum from '../VoucherAddTable/openNum'

export default {
  name: 'VoucherViewTable',
  components: {
    AssistViewTable,
    NumberGrid,
    NumberGridHeader,
    OpenNum
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
    ifBusinessDate: {
      type: Boolean,
      default: true
    },
    ifBottomDetail: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    thisModel: {
      type: String,
      default: ''
    },
    cardInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showForeignCurrencyCol: false,
      showNumCol: false,
      ifBottomShow: false,
      editRow: {
        blank: true,
        ...createHsCertDtlPara()
      },
      digest: {},
      tableData: [],
      loading: true,
      width: '100%'
    }
  },
  computed: {
    ...mapGetters([
      'bookInfo'
    ])
  },
  watch: {
    dtlList() {
      this.ifShowNumCol()
      this.ifShowForeignCurrencyCol()
      this.formatDetailList()
      this.$nextTick(() => {
        if (this.thisModel) {
          this.tableData = this.dtlList.filter(item => item.digest !== '合计')
        } else {
          let debit = 0
          let lender = 0
          this.dtlList.forEach(item => {
            debit += +item.debit
            lender += +item.lender
          })
          console.log(debit, lender)
          this.tableData = this.dtlList
          this.tableData[this.tableData.length - 1].debit = debit.toFixed(2)
          this.tableData[this.tableData.length - 1].lender = lender.toFixed(2)
        }
        // this.tableData = this.thisModel ? this.dtlList.filter(item => item.digest !== '合计') : this.dtlList
        this.$refs[`table-${this.thisModel}`].doLayout()
        this.$refs[`table-${this.thisModel}`].setCurrentRow(this.tableData[0])
      })
    }
  },
  created() {
  },
  methods: {
    // 表格合并规则
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.last) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2
          }
        }
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 0
          }
        }
      }
    },
    // 格式化明细数据
    formatDetailList() {
      this.loading = true
      const debitLenderSum = this._getDebitLenderSum(this.dtlList.slice(0, -1))
      const debit = Number(debitLenderSum.debit).toFixed(2)
      const lender = debitLenderSum.lender
      console.log(this.dtlList)
      // this.dtlList[this.dtlList.length - 1] = createHsCertDtlPara({
      this.digest = createHsCertDtlPara({
        digest: `合计：${this.$digitUppercase(debit)}`,
        debit: debit,
        lender: lender,
        debitTemp: debit,
        lenderTemp: lender,
        last: true
      })
      this.tableData = this.dtlList.filter(item => item.digest !== '合计')
      this.loading = false
    },
    ifHasAssist(item) {
      return item.hsCertDtlAstList && item.hsCertDtlAstList.length > 0
    },
    // 检查所有列,决定是否显示数量栏
    ifShowNumCol() {
      let flag = false
      this.tableData.forEach((rec) => {
        const item = rec
        // 排除有辅助项的
        if (this.ifHasAssist(item)) {
          return false
        }
        if (parseFloat(item.num || 0) || parseFloat(item.price || 0)) {
          flag = true
        }
      })
      this.showNumCol = flag
    },
    // 检查当前行是否显示数量栏
    ifShowNumBottom(item) {
      if (item.subDetail && item.subDetail.amountCheck === '1' && item.subDetail.subAstTypeVOList.length === 0) { // 选了科目
        return true
      } else {
        return false
      }
    },
    // 检查是否显示辅助项标识
    ifShowAstIcon(item) {
      return item.hsCertDtlAstList && item.hsCertDtlAstList.length > 0
    },
    // 检查每一项是否需要显示数量
    ifShowNumRow(item) {
      let flag = false
      // 排除有辅助项的
      if (this.ifHasAssist(item)) {
        return false
      }
      if (parseFloat(item.num || 0) || parseFloat(item.price || 0)) {
        flag = true
      }
      return flag
    },
    // 判断是否是外币明细
    checkIfForeignDtl(item) {
      return parseFloat(item.foreignMoney || 0) && (item.foreignKey && item.foreignKey !== '人民币')
    },
    // 检查所有列,决定是否显示外币栏
    ifShowForeignCurrencyCol() {
      let flag = false
      this.tableData.forEach((rec) => {
        // 排除有辅助项的
        if (this.ifHasAssist(rec)) {
          return false
        }
        if (this.checkIfForeignDtl(rec)) {
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
      if (this.checkIfForeignDtl(item)) {
        flag = true
      }
      return flag
    },
    // 是否显示辅助表格
    ifShowAssistTable(row) {
      let flag = false
      if (row.hsCertDtlAstList && row.hsCertDtlAstList.length > 0) {
        flag = true
      }
      return flag
    },
    // 点击行
    currentChange(currentRow) {
      if (currentRow) {
        if (currentRow.last) {
          this.$refs[`table-${this.thisModel}`].setCurrentRow()
        } else {
          this.editRow = currentRow
        }
      } else {
        this.editRow = {
          blank: true,
          ...createHsCertDtlPara(),
          hsCertDtlAstList: []
        }
      }
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.digest.digest
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
  padding: 12px 0 12px;
  line-height: 23px;
  font-size: 14px;
  color: rgb(96, 98, 102);
  text-align: right;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .info-left {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    flex: 1;
    padding-right: 10px;

    .item {
      margin-top: 5px;
      width: 25%;
      text-align: left;
    }

    &.small {
      .item {
        margin-right: 50px;
      }
    }
  }

  .info-right {
    width: 210px;
  }
}

.a-2 {
  padding-right: 30px;
}

.text-n {
  margin-right: 16px;
}

.has-num-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  padding-bottom: 10px;

  .item {
    width: 25%;
    font-size: 14px;
    text-indent: 2em;
    line-height: 28px;
    height: 28px;
    color: #606266;
  }
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
      /deep/ .el-textarea__inner {
        font-size: 12px;
      }

      .digest-suggestion {
        position: absolute;
        z-index: 999;
      }
    }
  }
}
 /deep/ .cell-input-wrap {
      min-height: 0!important;
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
            text-align: center;

            .cell-input-wrap {
              min-height: 42px;
            }
            .sub-text {
              line-height: 26px;
              text-align: center;
            }
          }
        }
      }
    }
  }

  &.cz-table {
    .sub-text {
      font-size: 12px;
    }
  }

  &.gh-table {
    .sub-text {
      font-size: 14px;
    }
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

.sub-text {
  display: block;
  height: 100%;
  margin: 0;
  padding: 10px 5px !important;
  font-size: 12px;
  word-break: break-all;
  z-index: 90;
  text-align: left;
  line-height: 14px;
}
</style>
