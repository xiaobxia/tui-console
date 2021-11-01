<template>
  <div>
    <el-table
      id="voucherOldShowList"
      :border="true"
      :data="list"
      :header-cell-style="{textAlign: 'center'}"
      tooltip-effect="dark"
      style="width: 100%;position: absolute"
      height="calc(100% - 5px)"
      class="print-table"
      @row-dblclick="toView"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column prop="certDate" align="left" label="凭证日期">
        <template slot-scope="scope">
          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'certDate') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="certDate" align="left" width="100" label="凭证字号">
        <template slot-scope="scope">
          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'certTypeName') !== '空' ? _getCertItemNewKeyValue(scope.row.cert, 'certTypeName') + '-' : '' }}{{ _getCertItemNewKeyValue(scope.row.cert, 'certNo') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="sub-cell-col" align="left" label="摘要" min-width="120">
        <template slot-scope="scope">
          <div v-for="(item) in scope.row.cert[0].certDtlVOList" :key="item.phid" class="sub-cell">
            <div :title="item.digest" class="sub-cell-text ellipsis-text">{{ item.digest }}</div>
          </div>
          <div v-for="(item) in scope.row.cert[1].certDtlVOList" :key="item.phid" class="sub-cell">
            <div :title="item.digest" class="sub-cell-text ellipsis-text">{{ item.digest }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="sub-cell-col" align="left" label="科目" min-width="150">
        <template slot-scope="scope">
          <div v-for="(item) in scope.row.cert[0].certDtlVOList" :key="item.phid" class="sub-cell">
            <div
              :title="scope.row.subName ? `${scope.row.subCode} - ${scope.row.subName }`:''"
              class="sub-cell-text ellipsis-text"
            >{{ item.subName ? `${item.subCode} - ${item.subName }`:'' }}</div>
          </div>
          <div v-for="(item) in scope.row.cert[1].certDtlVOList" :key="item.phid" class="sub-cell">
            <div
              :title="scope.row.subName ? `${scope.row.subCode} - ${scope.row.subName }`:''"
              class="sub-cell-text ellipsis-text"
            >{{ item.subName ? `${item.subCode} - ${item.subName }`:'' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="sub-cell-col" align="right" label="借方金额">
        <template slot-scope="scope">
          <div v-for="(item) in scope.row.cert[0].certDtlVOList" :key="item.phid" class="sub-cell">
            <div class="sub-cell-text">{{ _formatStandardCurrencyEmpty(item.debit) }}</div>
          </div>
          <div v-for="(item) in scope.row.cert[1].certDtlVOList" :key="item.phid" class="sub-cell">
            <div class="sub-cell-text">{{ _formatStandardCurrencyEmpty(item.debit) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="sub-cell-col" align="right" label="贷方金额">
        <template slot-scope="scope">
          <div v-for="(item) in scope.row.cert[0].certDtlVOList" :key="item.phid" class="sub-cell">
            <div class="sub-cell-text">{{ _formatStandardCurrencyEmpty(item.lender) }}</div>
          </div>
          <div v-for="(item) in scope.row.cert[1].certDtlVOList" :key="item.phid" class="sub-cell">
            <div class="sub-cell-text">{{ _formatStandardCurrencyEmpty(item.lender) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="sub-cell-col" align="left" label="核算项目类型" min-width="120">
        <template slot-scope="scope">
          <div v-for="(item) in scope.row.cert[0].certDtlVOList" :key="item.phid" class="sub-cell">
            <div
              :title="_formatVoucherListAstType(item.hsCertDtlAstList)"
              class="sub-cell-text ellipsis-text"
            >{{ _formatVoucherListAstType(item.hsCertDtlAstList) }}</div>
          </div>
          <div v-for="(item) in scope.row.cert[1].certDtlVOList" :key="item.phid" class="sub-cell">
            <div
              :title="_formatVoucherListAstType(item.hsCertDtlAstList)"
              class="sub-cell-text ellipsis-text"
            >{{ _formatVoucherListAstType(item.hsCertDtlAstList) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="sub-cell-col" align="left" label="核算项目" min-width="120">
        <template slot-scope="scope">
          <div v-for="(item) in scope.row.cert[0].certDtlVOList" :key="item.phid" class="sub-cell">
            <div
              :title="_formatVoucherListAstDtl(item.hsCertDtlAstList)"
              class="sub-cell-text ellipsis-text"
            >{{ _formatVoucherListAstDtl(item.hsCertDtlAstList) }}</div>
          </div>
          <div v-for="(item) in scope.row.cert[1].certDtlVOList" :key="item.phid" class="sub-cell">
            <div
              :title="_formatVoucherListAstDtl(item.hsCertDtlAstList)"
              class="sub-cell-text ellipsis-text"
            >{{ _formatVoucherListAstDtl(item.hsCertDtlAstList) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="attachNum" align="left" label="附件数" width="90">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="viewFile(_getCertItemNewKeyValue(scope.row.cert, 'attachNum'), scope.row)"
          >{{ _getCertItemNewKeyValue(scope.row.cert, 'attachNum') || '0' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="creatName" align="left" label="制单人" width="90">
        <template slot-scope="scope">
          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'creatName') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="verifyName" align="left" label="审核人" width="90">
        <template slot-scope="scope">
          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'verifyName') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        prop="cfoName"-->
      <!--        align="left"-->
      <!--        label="财务主管"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'cfoName') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!-- <el-table-column
        prop="cashName"
        align="center"
        label="出纳"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cert[0].cashName }}</span>
        </template>
      </el-table-column>-->

      <el-table-column align="left" label="状态" width="90">
        <template slot-scope="scope">
          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'verifyStatus') | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="记账人" width="90">
        <template slot-scope="scope">
          <span>{{ _getCertItemNewKeyValue(scope.row.cert, 'bookKeeper') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            :disabled="_getCertItemNewKeyValue(scope.row.cert, 'verifyStatus') === '2' || _getCertItemNewKeyValue(scope.row.cert, 'verifyStatus') === '4'"
            type="text"
            @click="toEdit(scope.row.cert)"
          >编辑</el-button>
          <el-button
            :disabled="_getCertItemNewKeyValue(scope.row.cert, 'verifyStatus') === '2' || _getCertItemNewKeyValue(scope.row.cert, 'verifyStatus') === '4'"
            type="text"
            @click="toDelete(scope.row.cert)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pic-show ref="picShow" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixins from '@/mixins/common'
import PicShow from './picShow'
export default {
  name: 'VoucherNewShowList',
  components: {
    PicShow
  },
  filters: {
    statusFilter: function(value) {
      switch (value) {
        case '1':
          return '待审核'
        case '2':
          return '已审核'
        case '3':
          return '审核驳回'
        case '4':
          return '已记账'
      }
    }
  },
  mixins: [commonMixins],
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      checked: false,
      selection: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'certTypeList'])
  },
  created() {
    console.log(this.list)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getSelection() {
      return this.multipleSelection
    },
    toEdit(item) {
      let finBudgId = ''
      item.forEach(subItem => {
        if (subItem.finBudgId) {
          finBudgId = subItem.finBudgId
        }
      })
      this.$router.push({
        path: `/voucherManagement/voucherEdit?type=edit&finBudgId=${finBudgId}`
      })
    },
    toView(item) {
      let finBudgId = ''
      item.cert.forEach(subItem => {
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
      })
        .then(() => {
          this.$http
            .post(`account/cert/deleteCertMuch`, {
              finBudgIds: [this._getCertItemNewKeyValue(item, 'finBudgId')],
              bookId: this.$commonQueryParam.bookId
            })
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$emit('ok', { notToFirstPage: true })
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSelectAll(selection) {
      this.$emit('selectAll', selection.length === this.list.length)
    },
    // 查看附件
    viewFile(attachNum, row) {
      console.log(attachNum)
      if (+attachNum > 0) {
        const urlList = []
        row.cert.forEach(item => {
          item.hsFileList &&
            item.hsFileList.forEach(ele => {
              if (['jpg', 'jpeg', 'png'].includes(ele.url.split('.')[1])) {
                urlList.push(
                  `${location.protocol}//${location.hostname}:10001` + ele.url
                )
              }
            })
        })
        this.$refs.picShow.open(urlList)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.sub-table {
  position: relative;
  margin-bottom: 10px;
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
    background-color: rgba(0, 0, 0, 0.3);
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
  span {
    margin-right: 150px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

