<template>
  <div id="voucherOldShowCardList">
    <div v-if="list.length === 0" class="empty-wrap">暂无数据</div>
    <div v-for="(item, index) in list" :key="index" class="sub-table">
      <el-checkbox v-model="item.checked" class="check" @change="selectionChange"/>
      <div class="card-content" @click="toggleModal(item, index)">
        <div v-if="item.verifyStatus === '2'" class="verify-tag">
          <h4>已审核</h4>
          <!--          <p>{{ $formatToDay(item.verifyDate) }}</p>-->
        </div>
        <div v-if="item.verifyStatus === '3'" class="verify-tag">
          <el-tooltip :content="'驳回意见：'+ item.verifyRemark" class="item" effect="dark" placement="left">
            <h4 class="reject">已驳回</h4>
          </el-tooltip>
          <!--          <p>{{ $formatToDay(item.verifyDate) }}</p>-->
        </div>
        <div v-if="item.verifyStatus === '4'" class="verify-tag">
          <h4>已记账</h4>
          <!--          <p>{{ $formatToDay(item.verifyDate) }}</p>-->
        </div>
        <div class="table-title has-sub">
          <span>记账凭证</span>
          <div class="sub">
            <span>凭证日期：{{ $formatToDay(item.certDate) }}</span>
            <span>凭证字号：{{ item.certTypeName !== '空' ? item.certTypeName + '-' : '' }}{{ item.certNo }}</span>
            <span>附件数：{{ item.attachNum || 0 }}</span>
            <span>制单人：{{ item.creatName }}</span>
            <span>审核人：{{ item.verifyName || ' ' }}</span>
          </div>
        </div>
        <div class="table-wrap">
          <el-table
            :border="true"
            :data="item.certDtlVOList"
            :header-cell-style="{textAlign: 'center'}"
            :span-method="(value)=>{return objectSpanMethod(value, item.certDtlVOList.length)}"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              align="center"
              width="100px"
              label="序号">
              <template slot-scope="scope">
                <span>{{ index +1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="摘要">
              <template slot-scope="scope">
                <span
                  :title="scope.row.digest"
                  class="ellipsis-text"
                >{{ scope.row.digest }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="科目">
              <template slot-scope="scope">
                <span
                  :title="scope.row.subName ? `${scope.row.subCode} - ${scope.row.subName }`:''"
                  class="ellipsis-text"
                >{{ scope.row.subName ? `${scope.row.subCode} - ${scope.row.subName }`:'' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="借方">
              <template slot-scope="scope">
                <span v-if="scope.$index === item.certDtlVOList.length-1">{{ _formatStandardCurrencyEmpty(scope.row.debit) }}</span>
                <span v-else>{{ _formatStandardCurrencyEmpty(scope.row.debit) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="贷方">
              <template slot-scope="scope">
                <span v-if="scope.$index === item.certDtlVOList.length-1">{{ _formatStandardCurrencyEmpty(scope.row.lender) }}</span>
                <span v-else>{{ _formatStandardCurrencyEmpty(scope.row.lender) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--<div class="bottom-info">-->
          <!--<span>财务主管: {{ item.cfoName }}</span>-->
          <!--<span>审核: {{ item.verifyName }}</span>-->
          <!--<span>制单: {{ item.creatName }}</span>-->
          <!--<span>出纳: {{ item.cashName }}</span>-->
          <!--</div>-->
        </div>
      </div>
      <div v-if="showModalAll && item.showModal" class="modal" @click="toggleModal(item, index)">
        <div class="btn-list">
          <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
            <el-button class="btn" icon="el-icon-document" @click="toView(item)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button v-if="$hasPermission('/account/cert/delete') && item.verifyStatus !== '2'" class="btn" icon="el-icon-delete" @click="toDelete(item)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <el-button v-if="item.verifyStatus !== '2'" class="btn" icon="el-icon-edit-outline" @click="toEdit(item)"/>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'
export default {
  name: 'VoucherOldShowCard',
  mixins: [commonMixins],
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    showModalAll: {
      type: Boolean,
      default: true
    },
    adjust: {
      type: Boolean,
      default: false
    },
    // 是否是双凭证模式
    doubleCert: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: false,
      selection: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'certTypeList'
    ])
  },
  created() {
  },
  methods: {
    toggleModal(item, index) {
      item.showModal = !item.showModal
      this.list.forEach((item, subIndex) => {
        item.checked = false
        if (index !== subIndex) {
          item.showModal = false
        }
      })
      item.checked = true
      this.selectionChange()
    },
    selectionChange() {
      const raw = []
      this.list.forEach((item) => {
        if (item.checked === true) {
          raw.push(item)
        }
      })
      this.selection = raw
      this.$emit('checkChange', {
        allCheck: this.selection.length === this.list.length,
        isIndeterminate: this.selection.length > 0 && this.selection.length < this.list.length
      })
    },
    allCheck(check) {
      this.list.forEach((item) => {
        item.checked = check || false
      })
      this.selection = check ? this.list : []
      this.$emit('selectAll', check)
    },
    clear() {
      this.list.forEach(item => {
        item.checked = false
      })
      this.selectionChange()
    },
    getSelection() {
      return this.selection
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }, len) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: len,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 1
          }
        }
      }
      if (row.last) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 2
          }
        }
        if (columnIndex === 2) {
          return {
            rowspan: 1,
            colspan: 0
          }
        }
      }
    },
    toEdit(item) {
      if (this.adjust) {
        this.$router.push({
          path: `/voucherManagement/adjustVoucherAdd?type=edit&finBudgId=${item.finBudgId}`
        })
      } else {
        this.$router.push({
          path: `/voucherManagement/voucherEdit?type=edit&finBudgId=${item.finBudgId}`
        })
      }
    },
    toView(item) {
      this.$router.push({
        path: `/voucherManagement/voucherView?finBudgId=${item.finBudgId}`
      })
    },
    toDelete(item) {
      this.$confirm('一旦删除，将不可恢复，是否确定删除此凭证?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$http.post(`account/cert/deleteCertMuch`, {
          finBudgIds: [item.finBudgId],
          bookId: this.$commonQueryParam.bookId
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('ok', { notToFirstPage: true })
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sub-table {
    position: relative;
    margin-bottom: 10px;
    padding: 0;
    &:last-child {
      margin-bottom: 0;
    }
    .check {
      position: absolute;
      top: 15px;
      left: 15px;
    }
    .modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      background-color: rgba(0,0,0,0.3);
    }
    .has-sub {
      padding: 10px 30px 10px 0;
    }
  }
  .btn-list {
    text-align: center;
    height: 60px;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    margin: auto;
    .btn {
      width: 60px;
      height: 60px;
      border-radius: 60px;
      font-size: 24px;
    }
    .btn + .el-button {
      margin-left: 60px;
    }
  }
  .bottom-info {
    background-color: #fff;
    padding: 12px;
    border: 1px solid #DCDFE6;
    border-top: 0;
    line-height: 23px;
    font-size: 14px;
    color: rgb(96, 98, 102);
    span {
      margin-right: 150px;
    }
  }
  .empty-wrap {
    width: 100%;
    padding: 20px 0;
    text-align: center;
    color: #909399;
  }
  .sub {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

