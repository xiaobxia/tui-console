<template>
  <div id="voucherNewShowCardList">
    <div v-if="list.length === 0" class="empty-wrap">暂无数据</div>
    <div v-for="(item, index) in list" :key="index" class="sub-table clearfix">
      <div class="a">
        <div class="text">
          <el-checkbox v-model="item.checked" class="check" @change="selectionChange"/>
          <span style="margin-left: 10px">{{ index+1 }}</span>
        </div>
      </div>
      <div class="card-content" @click="toggleModal(item, index)">
        <div v-if="_getCertItemNewKeyValue(item.cert, 'verifyStatus') === '2'" class="verify-tag">
          <h4>已审核</h4>
          <!--          <p>{{ $formatToDay(item.verifyDate) }}</p>-->
        </div>
        <div v-if="_getCertItemNewKeyValue(item.cert, 'verifyStatus') === '3'" class="verify-tag">
          <el-tooltip :content="'驳回意见：'+ _getCertItemNewKeyValue(item.cert, 'verifyRemark')" class="item" effect="dark" placement="left">
            <h4 class="reject">已驳回</h4>
          </el-tooltip>
          <!--          <p>{{ $formatToDay(item.verifyDate) }}</p>-->
        </div>
        <div v-if="_getCertItemNewKeyValue(item.cert, 'verifyStatus') === '4'" class="verify-tag">
          <h4>已记账</h4>
          <!--          <p>{{ $formatToDay(item.verifyDate) }}</p>-->
        </div>
        <div class="b">
          <div class="table-title has-sub">
            <div class="sub">
              <span style="margin-right: 40px">凭证日期：{{ $formatToDay(item.cert[0].certDate) }}</span>
              <span>凭证字号：<span v-if="!adjust">{{ (item.cert[0].certTypeName && item.cert[0].certTypeName !== '空') ? item.cert[0].certTypeName + '-' : '' }}</span>{{ item.cert[0].certNo }}</span>
            </div>
          </div>
          <div class="table-wrap">
            <el-table
              :border="true"
              :data="item.cert[0].certDtlVOList"
              :header-cell-style="{textAlign: 'center'}"
              :span-method="objectSpanMethod"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                align="left"
                label="摘要">
                <template slot-scope="scope">
                  <span
                    :title="scope.row.digest"
                    class="ellipsis-text"
                  >{{ scope.row.digest }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
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
                  <span v-if="scope.$index === item.cert[0].certDtlVOList.length-1">{{ _formatStandardCurrencyEmpty(scope.row.debit) }}</span>
                  <span v-else>{{ _formatStandardCurrencyEmpty(scope.row.debit) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="right"
                label="贷方">
                <template slot-scope="scope">
                  <span v-if="scope.$index === item.cert[0].certDtlVOList.length-1">{{ _formatStandardCurrencyEmpty(scope.row.lender) }}</span>
                  <span v-else>{{ _formatStandardCurrencyEmpty(scope.row.lender) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="b">
          <div class="table-title has-sub">
            <div class="sub">
              <span style="margin-right: 40px">凭证日期:{{ $formatToDay(item.cert[1].certDate) }}</span>
              <span>凭证字号:{{ (item.cert[0].certTypeName && item.cert[0].certTypeName !== '空') ? item.cert[1].certTypeName + '-' : '' }}{{ item.cert[1].certNo }}</span>
            </div>
          </div>
          <div class="table-wrap">
            <el-table
              :border="true"
              :data="item.cert[1].certDtlVOList"
              :header-cell-style="{textAlign: 'center'}"
              :span-method="objectSpanMethod"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                align="left"
                label="摘要">
                <template slot-scope="scope">
                  <span
                    :title="scope.row.digest"
                    class="ellipsis-text"
                  >{{ scope.row.digest }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
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
                  <span v-if="scope.$index === item.cert[1].certDtlVOList.length-1">{{ _formatStandardCurrencyEmpty(scope.row.debit) }}</span>
                  <span v-else>{{ _formatStandardCurrencyEmpty(scope.row.debit) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="right"
                label="贷方">
                <template slot-scope="scope">
                  <span v-if="scope.$index === item.cert[1].certDtlVOList.length-1">{{ _formatStandardCurrencyEmpty(scope.row.lender) }}</span>
                  <span v-else>{{ _formatStandardCurrencyEmpty(scope.row.lender) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="showModalAll && item.showModal" class="modal" @click="toggleModal(item,index)">
        <div class="btn-list">
          <el-button class="btn" icon="el-icon-document" @click="toView(item.cert)"/>
          <el-button v-if="$hasPermission('/account/cert/delete') && _getCertItemNewKeyValue(item.cert, 'verifyStatus') !== '2'" class="btn" icon="el-icon-delete" @click="toDelete(item.cert)"/>
          <el-button v-if="_getCertItemNewKeyValue(item.cert, 'verifyStatus') !== '2'" class="btn" icon="el-icon-edit-outline" @click="toEdit(item.cert)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'
export default {
  name: 'VoucherNewShowCard',
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
  watch: {
    list: function(nv) {
      console.log(nv)
    }
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
          for (let i = 0; i < item.cert.length; i++) {
            item.cert[i].certDtlVOList = item.cert[i].certDtlVOList.slice(0, item.cert[i].certDtlVOList.length - 1)
            raw.push(item)
          }
        }
      })
      this.selection = raw
      this.$emit('checkChange', {
        allCheck: this.selection.length === this.list.length,
        isIndeterminate: this.selection.length > 0 && this.selection.length < this.list.length
      })
    },
    clear() {
      this.list.forEach(item => {
        item.checked = false
      })
      this.selectionChange()
    },
    allCheck(check) {
      this.list.forEach((item) => {
        item.checked = check || false
      })
      this.selection = check ? this.list : []
      this.$emit('selectAll', check)
    },
    getSelection() {
      return this.selection
    },
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
    toEdit(item) {
      let finBudgId = ''
      item.forEach((subItem) => {
        if (subItem.finBudgId) {
          finBudgId = subItem.finBudgId
        }
      })
      if (this.adjust) {
        this.$router.push({
          path: `/voucherManagement/adjustVoucherAdd?type=edit&finBudgId=${finBudgId}`
        })
      } else {
        this.$router.push({
          path: `/voucherManagement/voucherEdit?type=edit&finBudgId=${finBudgId}`
        })
      }
    },
    toView(item) {
      let finBudgId = ''
      item.forEach((subItem) => {
        if (subItem.finBudgId) {
          finBudgId = subItem.finBudgId
        }
      })
      this.$router.push({
        path: `/voucherManagement/voucherView?finBudgId=${finBudgId}`
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
          finBudgIds: [
            this._getCertItemNewKeyValue(item, 'finBudgId')
          ],
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
    background-color: #fff;
    &:last-child {
      margin-bottom: 0;
    }
    .a {
      .text {
        position: absolute;
        height: 16px;
        margin: auto;
        left: 10px;
        top: 0;
        bottom: 0;
        line-height: 16px;
      }
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
  .sub-table {
    border: 1px solid #DCDFE6;
    overflow: hidden;
  }
  .a {
    float: left;
    width: 6%;
  }
  .b {
    float: left;
    margin: -1px 0;
    width: calc(50% + 2px);
    &:last-child {
      margin: -1px;
      width: 50%;
    }
  }
  .card-content {
    padding-left: 6%;
  }
  .empty-wrap {
    width: 100%;
    padding: 20px 0;
    text-align: center;
    color: #909399;
  }
</style>

