<template>
  <div v-if="ok" class="ass-wrap">
    <div class="table-title">{{ localModel === 'yu'?'财政辅助核算':'常用辅助核算' }}</div>
    <el-table
      ref="multipleTable"
      :border="true"
      :data="localRow.hsCertDtlAstList"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      class="visible-table voucher-edit-table"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        v-for="item in names"
        :key="item.code"
        :label="item.name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.astMap[item.code]['dtlCode']||scope.row.astMap[item.code]['encode'] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="ifShowNumRow(localRow)"
        width="170"
        label="数量">
        <template slot-scope="scope">
          <div class="no-p-cell">
            <div>
              <span>数量:</span>
              <span style="width: 100px;" class="text-b mini">{{ _formatUnitPriceEmpty(scope.row.num) }}</span>
            </div>
            <div>
              <span>单价:</span>
              <span :class="$numberClass(scope.row.price)" style="width: 100px;" class="text-b mini">{{ _formatUnitPriceAbs(scope.row.price) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="bookInfo.isForeignCurrency === '1' && ifShowForeignCurrencyRow(localRow)"
        width="200"
        label="币别">
        <template slot-scope="scope">
          <div class="no-p-cell">
            <div>
              <span>{{ scope.row.foreignKey }}</span>
              <span>:</span>
              <span style="width: 100px;" class="text-b mini">{{ _formatForeignCurrencyEmpty(scope.row.foreignRate) }}</span>
            </div>
            <div>
              <span>原币:</span>
              <span :class="$numberClass(scope.row.foreignMoney)" style="width: 100px;" class="text-b mini">{{ _formatForeignCurrencyAbs(scope.row.foreignMoney) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="本位币金额">
        <template slot-scope="scope">
          <div class="cell-input-wrap">
            <span :class="$numberClass(scope.row.money)" class="text-n number-text">{{ _formatStandardCurrencyAbs(scope.row.money) }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'
export default {
  name: 'AssistViewTable',
  mixins: [commonMixins],
  props: {
    localRow: {
      type: Object,
      default: function() {
        return {
        }
      }
    },
    localModel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      names: [],
      ok: false,
      astValueMap: {}
    }
  },
  computed: {
    ...mapGetters([
      'bookInfo',
      'currencyList'
    ])
  },
  watch: {
    localRow() {
      this.initRow()
    }
  },
  created() {
    this.initRow()
  },
  methods: {
    initRow() {
      console.log(this.localRow, 'this.localRow')
      const names = []
      if (this.localRow.hsCertDtlAstList && this.localRow.hsCertDtlAstList[0]) {
        // 库存数据
        this.astValueMap = this.localRow.astValueMap || {}
        for (const key in this.localRow.hsCertDtlAstList[0].astNameMap) {
          names.push({
            code: key,
            name: this.localRow.hsCertDtlAstList[0].astNameMap[key]
          })
        }
        this.names = names
        console.log(this.names, 'this.names', this.localRow)
        this.ok = false
        // 遍历辅助项
        this.localRow.hsCertDtlAstList.forEach((item) => {
          for (const key in item.astNameMap) {
            if (item.astMap[key].hisAstDtlId === '-1' || item.astMap[key].hisAstDtlId === '-2') {
              this.astValueMap[key] = item.astMap[key].encode
            } else {
              this.astValueMap[key] = item.astMap[key].dtlCode
            }
          }
        })
        this.localRow.astValueMap = this.astValueMap
        console.log(this.astValueMap, 'this.astValueMap')
        this.$nextTick(() => {
          this.ok = true
        })
      }
    },
    // 检查每一项是否需要显示数量
    ifShowNumRow(item) {
      let flag = false
      if (parseFloat(item.num || 0) || parseFloat(item.price || 0)) {
        flag = true
      }
      return flag
    },
    // 判断是否是外币明细
    checkIfForeignAst(item) {
      return (parseFloat(item.foreignMoney || 0) || parseFloat(item.foreignRate || 0)) && (item.foreignKey && item.foreignKey !== '人民币')
    },
    // 检查每一项是否需要显示外币
    ifShowForeignCurrencyRow(item) {
      let flag = false
      if (this.checkIfForeignAst(item)) {
        flag = true
      }
      return flag
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ass-wrap {
  }
  .table-title {
    text-align: left;
    border: none;
  }
</style>
