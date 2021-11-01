<template>
  <div :class="[showType === 'view' ? 'view-content': '', 'num-content']">
    <div :class="[showType === 'view' ? 'view-model': '', 'num-wrap']">
      <div v-if="showNum" class="no-p-cell">
        <div>
          <span class="title">数量：</span>
          <span
            v-if="showType === 'view'"
            style="width: 100px;"
            class="text-b mini"
          >{{ _formatCountEmpty(localRow.num) }}</span>
          <div
            v-if="showType === 'add'"
            style="width: 100px;"
            class="input-b-wrap"
          >
            <span class="text-n number-text">{{ _formatCountEmpty(localRow.num) }}</span>
            <el-input
              v-model="localRow.num"
              class="input-b"
              style="width: 100px;"
              size="mini"
              @focus="handleFocus"
              @input="handleNumberInput($event, localRow, 'num')"
              @change="()=>{numChange(localRow)}"
            />
          </div>
        </div>
        <div>
          <span class="title">单价：</span>
          <span
            v-if="showType === 'view'"
            :class="$numberClass(localRow.price)"
            style="width: 100px;"
            class="text-b mini"
          >{{ localFormatUnitPriceBottomShow(localRow.price) }}</span>
          <div
            v-if="showType === 'add'"
            style="width: 100px;"
            class="input-b-wrap"
          >
            <span
              :class="$numberClass(localRow.price)"
              class="text-n number-text"
            >{{ _formatUnitPriceAbs(localRow.price) }}</span>
            <el-input
              v-model="localRow.price"
              class="input-b number-input"
              size="mini"
              @focus="handleFocus"
              @input="handleNumberInput($event, localRow, 'price')"
              @change="()=>{priceChange(localRow)}"
            />
          </div>
        </div>
      </div>
      <div v-if="showFor" class="no-p-cell">
        <div>
          <el-select
            v-if="showType !== 'view'"
            v-model="localRow.foreignKey"
            placeholder=""
            style="width: 80px; height: 32px"
            size="mini"
            class="theme-select no-p normal-disabled"
            @change="()=>{foreignKeyChange(localRow)}"
          >
            <el-option
              v-for="(item, index) in commonForeignKeyList"
              v-if="_ifSubjectForeign(item, localRow)"
              :key="index"
              :label="item.foreignKey"
              :value="item.foreignKey"
            />
          </el-select>
          <span v-else class="title">{{ localRow.foreignKey }}：</span>
          <span
            v-if="showType === 'view'"
            style="width: 126px;"
            class="text-b mini"
          >{{ localRow.foreignRate ? _formatForeignCurrencyEmpty(localRow.foreignRate) : '--' }}</span>
          <span
            v-if="showType === 'add'"
            style="width: 70px;"
            class="text-b mini"
          >{{ _formatForeignCurrencyEmpty(localRow.foreignRate) }}</span>
        </div>
        <div>
          <span class="title">原币：</span>
          <span
            v-if="showType === 'view'"
            :class="$numberClass(localRow.foreignMoney)"
            style="width: 126px;"
            class="text-b mini"
          >{{ localFormatForeignCurrencyBottomShow(localRow.foreignMoney) }}</span>
          <template v-else>
            <el-tooltip
              v-if="ifShowForeignPop(localRow.foreignMoney)"
              :content="''+localRow.foreignMoney"
              placement="top"
              effect="light"
            >
              <div
                style="width: 126px;"
                class="input-b-wrap"
              >
                <span
                  :class="$numberClass(localRow.foreignMoney)"
                  class="text-n number-text"
                >{{ _formatForeignCurrencyAbs(localRow.foreignMoney) }}</span>
                <el-input
                  v-model="localRow.foreignMoney"
                  class="input-b number-input"
                  size="mini"
                  @input="handleNumberInput($event, localRow, 'foreignMoney')"
                  @focus="handleFocus"
                  @change="()=>{foreignMoneyChange(localRow)}"
                />
              </div>
            </el-tooltip>
            <div
              v-else
              style="width: 126px;"
              class="input-b-wrap"
            >
              <span
                :class="$numberClass(localRow.foreignMoney)"
                class="text-n number-text"
              >{{ _formatForeignCurrencyAbs(localRow.foreignMoney) }}</span>
              <el-input
                v-model="localRow.foreignMoney"
                class="input-b number-input"
                size="mini"
                @input="handleNumberInput($event, localRow, 'foreignMoney')"
                @focus="handleFocus"
                @change="()=>{foreignMoneyChange(localRow)}"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'
export default {
  name: 'OpenNum',
  mixins: [commonMixins],
  props: {
    localRow: {
      type: Object,
      default: () => { }
    },
    layout: {
      type: Number,
      default: 2
    },
    showType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'bookInfo',
      'subjectTree',
      // 只能选择末级科目
      'subjectList',
      'subjectListLast',
      'commonForeignKeyList',
      'sysParam'
    ]),
    showNum() {
      return this.localRow.subDetail && +this.localRow.subDetail.amountCheck === 1
    },
    showFor() {
      return this.localRow.subDetail && +this.localRow.subDetail.foreignCheck === 1
    }
  },
  created() {
    console.log(this.localRow)
  },
  mounted() {
    this.$store.dispatch('initCommonForeignKeyList', {
      ...this.$commonQueryParam
    })
  },
  methods: {
    // 数量变了
    numChange(row) {
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
      this.returnData(row)
    },
    // 原币修改
    foreignMoneyChange(row) {
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
      this.returnData(row)
    },
    // 单价修改
    priceChange(row) {
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
      this.returnData(row)
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
    // 币别切换
    foreignKeyChange(row) {
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
      this.returnData(row)
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
    // 选中输入框内容
    handleFocus(e) {
      e.currentTarget.select()
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
    // 是否有辅助项
    ifHasAssist(item) {
      return item.subDetail && item.subDetail.subAstTypeVOList && item.subDetail.subAstTypeVOList.length > 0
    },
    // 返回数据
    returnData(row) {
      // this.$emit('update:localRow', row)
      console.log(row)
    },
    // 只能输入两位小数
    handleNumberInput(value, data, key) {
      data[key] = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/[^0-9.]+/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.num-content {
  height: 35px;
  position: relative;
  .num-wrap {
    position: absolute;
    top: -62px;
    z-index: 999;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px 0 10px;
    .np-p-cell {
      width: 50%;
    }
    .title {
      display: inline-block;
      line-height: 32px;
    }
    &.view-model {
      position: relative;
      top: 0;
      padding: 0;
    }
  }
  &.view-content {
    height: auto;
  }
}
</style>
