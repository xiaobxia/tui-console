<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    title="差异项维护"
    width="1300px"
  >
    <div v-if="dialogVisible">
      <el-row>
        <el-col :span="4">
          <span class="d-t"><span class="label">收入总额：</span><span>{{
            $formatStandardCurrency(showForm['a1'])
          }}</span></span>
        </el-col>
        <el-col :span="4">
          <span class="d-t"><span class="label">预算收入总额：</span><span>{{ $formatStandardCurrency(showForm['a2']) }}</span></span>
        </el-col>
        <el-col :span="8">
          <span
            v-if="diffInText"
            class="d-t"
          ><span class="label">{{ diffInText }}：</span><span>{{ $formatStandardCurrency(showForm['a3']) }}</span></span>
          <span
            v-else
            style="color: transparent"
          >11</span>
        </el-col>
        <el-col :span="4">
          <span class="d-t"><span class="label">分配金额：</span><span>{{
            $formatStandardCurrency(showForm['a4'])
          }}</span></span>
        </el-col>
        <el-col :span="4">
          <span class="d-t"><span class="label">待分配金额：</span><span>{{ $formatStandardCurrency(showForm['a5']) }}</span></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="d-t"><span class="label">费用总额：</span><span>{{
            $formatStandardCurrency(showForm['a6'])
          }}</span></span>
        </el-col>
        <el-col :span="4">
          <span class="d-t"><span class="label">预算支出总额：</span><span>{{ $formatStandardCurrency(showForm['a7']) }}</span></span>
        </el-col>
        <el-col :span="8">
          <span
            v-if="diffOutText"
            class="d-t"
          ><span class="label">{{ diffOutText }}：</span><span>{{
            $formatStandardCurrency(showForm['a8'])
          }}</span></span>
          <span
            v-else
            style="color: transparent"
          >11</span>
        </el-col>
        <el-col :span="4">
          <span class="d-t"><span class="label">分配金额：</span><span>{{
            $formatStandardCurrency(showForm['a9'])
          }}</span></span>
        </el-col>
        <el-col :span="4">
          <span class="d-t"><span class="label">待分配金额：</span><span>{{ $formatStandardCurrency(showForm['a10']) }}</span></span>
        </el-col>
      </el-row>
      <el-table
        :data="tableList"
        :header-cell-style="{textAlign: 'center'}"
        border
        class="visible-table has-row-btn voucher-edit-table"
        style="width: 100%"
      >
        <el-table-column
          prop="subType"
          label="科目类别"
        >
          <template slot-scope="scope">
            <span class="t-t">{{ scope.row.subDetail.subType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subCode"
          label="科目编码"
        >
          <template slot-scope="scope">
            <span class="t-t">{{ scope.row.subDetail.encode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subName"
          label="科目名称"
        >
          <template slot-scope="scope">
            <span class="t-t">{{ scope.row.subDetail.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="debit"
          align="right"
          label="借方"
        >
          <template slot-scope="scope">
            <span class="t-t">{{ $formatStandardCurrency(scope.row.debit) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lender"
          align="right"
          label="贷方"
        >
          <template slot-scope="scope">
            <span class="t-t">{{ $formatStandardCurrency(scope.row.lender) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="差异项"
        >
          <template slot-scope="scope">
            <div class="cell-input-wrap with-click">
              <el-select
                v-model="scope.row.diffItemId"
                :clearable="true"
                size="small"
                style="height: 100%"
                class="input-h"
                @change="()=>{diffChange(scope.row)}"
              >
                <template v-if="scope.row.subDetail.subType === '收入'">
                  <el-option
                    v-for="(item) in typeList1"
                    :key="item.phid"
                    :label="item.name"
                    :value="item.phid"
                  />
                </template>
                <template v-if="scope.row.subDetail.subType === '预算收入'">
                  <el-option
                    v-for="(item) in typeList2"
                    :key="item.phid"
                    :label="item.name"
                    :value="item.phid"
                  />
                </template>
                <template v-if="scope.row.subDetail.subType === '费用'">
                  <el-option
                    v-for="(item) in typeList3"
                    :key="item.phid"
                    :label="item.name"
                    :value="item.phid"
                  />
                </template>
                <template v-if="scope.row.subDetail.subType === '预算支出'">
                  <el-option
                    v-for="(item) in typeList4"
                    :key="item.phid"
                    :label="item.name"
                    :value="item.phid"
                  />
                </template>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          align="right"
          label="金额"
        >
          <template slot-scope="scope">
            <div
              v-if="!ifView"
              class="cell-input-wrap"
            >
              <span class="text-n number-text">{{ $formatStandardCurrency(scope.row.diffMoney) }}</span>
              <el-input
                :maxlength="16"
                v-model="scope.row.diffMoney"
                class="input-h number-input f-h"
                size="small"
                @change="()=>{diffMoneyChange(scope.row)}"
              />
            </div>
            <span
              v-else
              class="t-t"
            >{{ $formatStandardCurrency(scope.row.diffMoney) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="distributionMoney"
          align="right"
          label="分配金额"
        >
          <template slot-scope="scope">
            <span class="t-t">{{ $formatStandardCurrency(formatDistributionMoney(scope.row)) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button size="small" @click="dialogVisible = false; tableList = []">取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="okHandler"
      >确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'

function showForm(tar) {
  let raw = {
    'a1': '',
    'a2': '',
    'a3': '',
    'a4': '',
    'a5': '',
    'a6': '',
    'a7': '',
    'a8': '',
    'a9': '',
    'a10': ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}

export default {
  name: 'DifferenceTermDialog',
  mixins: [commonMixins],
  props: {
    ifView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableList: [],
      showForm: showForm(),
      typeList1: [],
      typeList2: [],
      typeList3: [],
      typeList4: [],
      diffInText: '',
      diffOutText: '',
      diffMoneyAddTo: ''
    }
  },
  computed: {
    ...mapGetters([])
  },
  watch: {},
  created() {
  },
  methods: {
    // 获取差异项列表
    queryDiffSelectList() {
      return this.$http.get('ucenter/differenceItem/findOrgDifList', {
        orgId: this.$commonQueryParam.orgId,
        year: this.$commonQueryParam.year
      }).then(({ status, data, message }) => {
        if (status) {
          this.typeList1 = data ? data['1'] : []
          this.typeList2 = data ? data['2'] : []
          this.typeList3 = data ? data['3'] : []
          this.typeList4 = data ? data['4'] : []
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.log(err.message)
      })
    },
    open(dtlList) {
      this.queryDiffSelectList().then(() => {
        const tableList = []
        dtlList.forEach((row) => {
          if (row.subDetail) {
            if (
              !row.last &&
              ['收入', '费用', '预算收入', '预算支出'].indexOf(row.subDetail.subType) !== -1 &&
              row.subDetail.diffItemCheck === '1'
            ) {
              if (!row.diffMoney) {
                row.diffMoney = row.debit || row.lender
              } else {
                row.diffMoney = parseFloat(row.diffMoney || 0) || 0
              }
              tableList.push(row)
            }
          }
        })
        this.tableList = tableList

        this.countShowForm(tableList)
        this.dialogVisible = true
      })
    },
    formatDistributionMoney(row) {
      let distributionMoney = ''
      if (row.subDetail) {
        if (['收入', '预算收入'].indexOf(row.subDetail.subType) !== -1) {
          if (row.lender) {
            distributionMoney = parseFloat(row.diffMoney)
          } else if (row.debit) {
            distributionMoney = -parseFloat(row.diffMoney || 0)
          }
        }
        if (['费用', '预算支出'].indexOf(row.subDetail.subType) !== -1) {
          if (row.debit) {
            distributionMoney = parseFloat(row.diffMoney)
          } else if (row.lender) {
            distributionMoney = -parseFloat(row.diffMoney || 0)
          }
        }
        return distributionMoney
      }
    },
    // 计算顶部信息
    countShowForm(dtlList) {
      let a1 = 0
      let a2 = 0
      let a6 = 0
      let a7 = 0
      dtlList.forEach((row) => {
        if (row.subDetail) {
          if (!row.last && ['收入', '费用', '预算收入', '预算支出'].indexOf(row.subDetail.subType) !== -1) {
            if (row.subDetail.subType === '收入') {
              const debit = parseFloat(row.debit || 0) || 0
              const lender = parseFloat(row.lender || 0) || 0
              a1 = a1 + lender - debit
            }
            if (row.subDetail.subType === '预算收入') {
              const debit = parseFloat(row.debit || 0) || 0
              const lender = parseFloat(row.lender || 0) || 0
              a2 = a2 + lender - debit
            }
            if (row.subDetail.subType === '费用') {
              const debit = parseFloat(row.debit || 0) || 0
              const lender = parseFloat(row.lender || 0) || 0
              a6 = a6 - lender + debit
            }
            if (row.subDetail.subType === '预算支出') {
              const debit = parseFloat(row.debit || 0) || 0
              const lender = parseFloat(row.lender || 0) || 0
              a7 = a7 - lender + debit
            }
          }
        }
      })
      this.showForm.a1 = a1
      this.showForm.a2 = a2
      if (Math.abs(a1) > Math.abs(a2)) {
        this.diffInText = '当期确认为收入没有确认为预算收入'
        this.diffMoneyAddTo = '收入'
        this.showForm.a3 = a1 - a2
        let a4 = 0
        this.tableList.forEach((item) => {
          if (item.subDetail.subType === '收入' && item.diffItemId) {
            a4 += this.formatDistributionMoney(item)
          }
          if (item.subDetail.subType === '预算收入' && item.diffItemId) {
            a4 -= this.formatDistributionMoney(item)
          }
        })
        this.showForm.a4 = a4
        this.showForm.a5 = this.showForm.a3 - this.showForm.a4
      }
      if (Math.abs(a1) < Math.abs(a2)) {
        this.diffInText = '当期确认为预算收入没有确认为收入'
        this.diffMoneyAddTo = '预算收入'
        this.showForm.a3 = a2 - a1
        let a4 = 0
        this.tableList.forEach((item) => {
          if (item.subDetail.subType === '收入' && item.diffItemId) {
            a4 -= this.formatDistributionMoney(item)
          }
          if (item.subDetail.subType === '预算收入' && item.diffItemId) {
            a4 += this.formatDistributionMoney(item)
          }
        })
        this.showForm.a4 = a4
        this.showForm.a5 = this.showForm.a3 - this.showForm.a4
      }
      if (Math.abs(a1) === Math.abs(a2)) {
        this.diffInText = ''
        this.showForm.a3 = 0
        this.showForm.a4 = 0
        this.showForm.a5 = 0
      }
      this.showForm.a6 = a6
      this.showForm.a7 = a7
      if (Math.abs(a6) > Math.abs(a7)) {
        this.diffOutText = '当期确认为费用没有确认为预算支出'
        this.diffMoneyAddTo = '费用'
        this.showForm.a8 = a6 - a7
        let a9 = 0
        this.tableList.forEach((item) => {
          if (item.subDetail.subType === '费用' && item.diffItemId) {
            a9 += this.formatDistributionMoney(item)
          }
          if (item.subDetail.subType === '预算支出' && item.diffItemId) {
            a9 -= this.formatDistributionMoney(item)
          }
        })
        this.showForm.a9 = a9
        this.showForm.a10 = this.showForm.a8 - this.showForm.a9
      }
      if (Math.abs(a6) < Math.abs(a7)) {
        this.diffOutText = '当期确认为预算支出没有确认为费用'
        this.diffMoneyAddTo = '预算支出'
        this.showForm.a8 = a7 - a6
        let a9 = 0
        this.tableList.forEach((item) => {
          if (item.subDetail.subType === '费用' && item.diffItemId) {
            a9 -= this.formatDistributionMoney(item)
          }
          if (item.subDetail.subType === '预算支出' && item.diffItemId) {
            a9 += this.formatDistributionMoney(item)
          }
        })
        this.showForm.a9 = a9
        this.showForm.a10 = this.showForm.a8 - this.showForm.a9
      }
      if (Math.abs(a6) === Math.abs(a7)) {
        this.diffOutText = ''
        this.showForm.a8 = 0
        this.showForm.a9 = 0
        this.showForm.a10 = 0
      }
    },
    // 填充差异项参数
    diffChange(row) {
      console.log(this.showForm)
      console.log(row)
      const list = [
        ...this.typeList1,
        ...this.typeList2,
        ...this.typeList3,
        ...this.typeList4
      ]
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.phid === row.diffItemId) {
          row.diffItemCode = item.code
          row.diffItemType = item.diffType
        }
      }
      if (row.diffItemId && +this.showForm.a5 !== 0) { // 收入未配平，切换差异项时在第一次符合条件的情况下补全金额，将待分配的金额带入收入和预算收入中绝对值大的那一边
        if (row.subDetail.subType === this.diffMoneyAddTo) { // 当前科目的类型和绝对值大的一侧的科目类型相同，补全金额
          row.diffMoney = Math.abs(this.showForm.a5).toFixed(2)
        }
      }
      if (row.diffItemId && +this.showForm.a10 !== 0) { // 支出未配平，切换差异项时在第一次符合条件的情况下补全金额，将待分配的金额带入费用和预算支出中绝对值大的那一边
        if (row.subDetail.subType === this.diffMoneyAddTo) { // 当前科目的类型和绝对值大的一侧的科目类型相同，补全金额
          row.diffMoney = Math.abs(this.showForm.a10).toFixed(2)
        }
      }
      this.countShowForm(this.tableList)
    },
    diffMoneyChange() {
      this.countShowForm(this.tableList)
    },
    okHandler() {
      this.$emit('ok')
      this.tableList = []
      this.dialogVisible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.d-t {
  display: inline-block;
  margin-bottom: 10px;
}

.t-t {
  display: inline-block;
  padding: 0 16px;
}
</style>
