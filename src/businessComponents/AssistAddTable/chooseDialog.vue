<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
      width="50%"
    >
      <div class="ast-dialog">
        <div class="show-type-box">
          <span>展示方式：</span>
          <el-radio-group
            v-model="showType"
            @change="handleChangeShowType"
          >
            <el-radio :label="1">列表</el-radio>
            <el-radio :label="2">树形</el-radio>
          </el-radio-group>
        </div>
        <div class="btn-box">
          <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
          <el-button type="primary" size="small" @click="handleConfig('edit')">编辑</el-button>
          <el-button type="primary" size="small" @click="handleConfig('add')">新增下级</el-button>
        </div>
        <el-table
          v-if="showType === 1"
          ref="selectTable"
          :data="selectList"
          :header-cell-style="{textAlign: 'center'}"
          border
          highlight-current-row
          style="width: 100%"
          height="500px"
          @row-dblclick="clickRow"
          @select="handleSelectionChange"
        >
          <el-table-column
            :selectable="canBeSelect"
            type="selection"
            width="80"
            align="center"
          />
          <el-table-column
            prop="encode"
            label="编码"
            align="left"
          />
          <el-table-column
            prop="name"
            label="名称"
            align="left"
          />
        </el-table>
        <el-tree
          v-if="showType === 2"
          ref="tree"
          :data="selectList"
          :props="props"
          :default-expand-all="true"
          :check-strictly="true"
          node-key="phid"
          show-checkbox
          class="filter-tree subject-tree"
          style="height: 400px; overflow: auto"
          @check="checkChange"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span @dblclick="clickNode(node,data)">{{ data.encode }} - {{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div
        slot="footer"
        class="foot"
      >
        <el-button
          size="small"
          @click="handleClose"
        >取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSubmit"
        >确定
        </el-button>
      </div>
    </el-dialog>
    <div class="add-dialogs">
      <!--    部门-->
      <!--      <addDepartDialog ref="addDepartDialog"/>-->
      <!--    往来单位-->
      <addCurrentUnitDialog ref="addCurrentUnitDialog" @ok="addAstOk"/>
      <!--    往来个人-->
      <addCurrentUserDialog ref="addCurrentUserDialog" @ok="addAstOk"/>
      <!--    收入来源-->
      <addIncomeSourceDialog ref="addIncomeSourceDialog" @ok="addAstOk"/>
      <!--    拨款种类-->
      <addAppropriationTypeDialog ref="addAppropriationTypeDialog" @ok="addAstOk"/>
      <!--    资产分类-->
      <addAssetClassificationDialog ref="addAssetClassificationDialog" @ok="addAstOk"/>
      <!--    支付对象-->
      <addReceiverDialog ref="addReceiverDialog" @ok="addAstOk"/>
      <!--    投资类型-->
      <addInvestmentTypeDialog ref="addInvestmentTypeDialog" @ok="addAstOk"/>
      <!--    投资对象-->
      <addInvestmentDialog ref="addInvestmentDialog" @ok="addAstOk"/>
      <!--    功能科目-->
      <addFunctionalSubjectDialog ref="addFunctionalSubjectDialog" @ok="addAstOk"/>
      <!--    经济科目-->
      <addEconomicSubjectDialog ref="addEconomicSubjectDialog" @ok="addAstOk"/>
      <!--    资金性质-->
      <addFundsNatureDialog ref="addFundsNatureDialog" @ok="addAstOk"/>
      <!--    经费类型-->
      <addFundsTypesDialog ref="addFundsTypesDialog" @ok="addAstOk"/>
      <!--    经费渠道-->
      <addFundingChannelsDialog ref="addFundingChannelsDialog" @ok="addAstOk"/>
      <!--    预算项目-->
      <addBudgetsDialog ref="addBudgetsDialog" @ok="addAstOk"/>
      <!--    经办机构-->
      <addAgencyDialog ref="addAgencyDialog" @ok="addAstOk"/>
      <!--    专项类型-->
      <addSpecialTypesDialog ref="addSpecialTypesDialog" @ok="addAstOk"/>
      <!--      指标来源-->
      <addIndicatorsSourceDialog ref="addIndicatorsSourceDialog" @ok="addAstOk"/>
      <!--      现金流-->
      <addCashFlowDialog ref="addCashFlowDialog" @ok="addAstOk"/>
      <!--    预算单位-->
      <!--      <addBudgetsUnitDialog ref="addBudgetsUnitDialog"/>-->
      <!-- 银行账户 bank account -->
      <addBankAccountDialog ref="addBankAccountDialog" @ok="addAstOk"/>
    </div>
  </div>
</template>

<script>
import addDepartDialog from '@/views/sysConfig/mailListSub/addDepartDialog'
import addCurrentUnitDialog from '@/views/sysConfig/currentUnit/addDialog'
import addCurrentUserDialog from '@/views/sysConfig/currentUser/addDialog'
import addIncomeSourceDialog from '@/views/sysConfig/incomeSource/addDialog'
import addAppropriationTypeDialog from '@/views/basicSetup/appropriationTypeDialog/addDialog'
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
  name: 'ChooseDialog',
  components: {
    addDepartDialog,
    addCurrentUnitDialog,
    addCurrentUserDialog,
    addIncomeSourceDialog,
    addAppropriationTypeDialog,
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
    addCashFlowDialog,
    addIndicatorsSourceDialog,
    addBankAccountDialog
    // addBudgetsUnitDialog
  },
  data() {
    return {
      title: '',
      oldAstMapCode: '',
      extCode: '',
      astTypeId: '', // 用于查selectList
      selectList: [],
      dialogVisible: false,
      props: {
        label: 'name',
        children: 'children',
        disabled: (data, node) => {
          return data.canSelect === 0
        }
      },
      showType: 1,
      selectedRow: [],
      astData: {}
    }
  },
  created() {

  },
  methods: {
    open(title, oldAstMapCode, extCode, astTypeId) {
      this.title = title
      this.oldAstMapCode = oldAstMapCode
      this.extCode = extCode
      this.astTypeId = astTypeId
      this.showType = 1
      this.getSelectList().then(() => {
        this.dialogVisible = true
        this.$nextTick(() => {
          const currentRow = this.selectList.filter(item => item.phid === this.oldAstMapCode)
          currentRow.length && this.$refs.selectTable.toggleRowSelection(currentRow[0], true)
        })
      })
    },
    // 获取数据
    getSelectList() {
      return this.$http.post('ucenter/diy/astType/dtl/listBookNoPage', {
        astTypeId: this.astTypeId,
        bookId: this.$commonQueryParam.bookId,
        orgId: this.$commonQueryParam.orgId,
        showTree: this.showType,
        year: this.$commonQueryParam.year
      }).then((res) => {
        this.selectList = res.data || []
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 提交
    handleSubmit() {
      if (this.oldAstMapCode) {
        this.$emit('ok', { oldAstMapCode: this.oldAstMapCode, extCode: this.extCode, astTypeId: this.astTypeId })
        this.dialogVisible = false
      } else {
        this.$message.warning('请选择辅助项数据！')
      }
    },
    // 表格是否可选
    canBeSelect(row, index) {
      if (row.canSelect) {
        return 1
      } else {
        return 0
      }
    },
    // 树形列表的选中
    checkChange(data, checkInfo) {
      const checkedKeys = checkInfo.checkedKeys
      if (checkedKeys.length === 0) {
        this.$refs.tree.getCheckedKeys([])
        this.oldAstMapCode = ''
      } else {
        if (checkedKeys.indexOf(data.phid) !== -1) {
          this.$refs.tree.setCheckedKeys([])
          this.$refs.tree.setCheckedKeys([data.phid])
          this.oldAstMapCode = data.phid
        }
      }
    },
    // 表格checkbox改变
    handleSelectionChange(selection, row) {
      if (selection.length > 1) {
        this.$refs.selectTable.clearSelection()
        this.$refs.selectTable.toggleRowSelection(row)
      }
      this.selectedRow = row
      this.oldAstMapCode = this.selectedRow.phid
    },
    // 修改显示方式
    handleChangeShowType(type) {
      return this.getSelectList().then(() => {
        if (type === 1) { // 列表
          const currentRow = this.selectList.filter(item => item.phid === this.oldAstMapCode)
          this.$refs.selectTable.toggleRowSelection(currentRow.length ? currentRow[0] : {})
        } else { // 树形
          this.$refs.tree.setCheckedKeys([])
          this.$refs.tree.setCheckedKeys([this.oldAstMapCode])
        }
      })
    },
    // 双击确定
    clickNode(node, data) {
      this.$emit('ok', { oldAstMapCode: data.phid, extCode: this.extCode })
      this.dialogVisible = false
    },
    // 双击表格行
    clickRow(row) {
      if (row.canSelect === 1) {
        this.$emit('ok', { oldAstMapCode: row.phid, extCode: this.extCode })
        this.dialogVisible = false
      } else {
        this.$message.warning('只能选择末级数据！')
      }
    },
    // 编辑数据准备
    getOldDetail(phid) {
      return this.$http.post('ucenter/commonBasic/getOne', {
        astTypeId: this.astTypeId,
        phid: phid
      })
    },
    // 新增和编辑
    handleConfig(type) {
      const currentRow = this.showType === 1 ? this.selectList.filter(item => item.phid === this.oldAstMapCode)[0] : this.$refs.tree.getCheckedNodes()[0]
      if (!currentRow) {
        this.$message.warning('请选择一条数据！')
        return
      }
      const currentAstDialogName = LINK_MAP.filter(item => item.name === this.title)[0].componentName
      const aloneList = ['addDepartDialog', 'addCurrentUnitDialog', 'addBudgetsUnitDialog', 'addAppropriationTypeDialog']
      if (!aloneList.includes(currentAstDialogName)) { // 其余基础数据类型对应的辅助项，不包含自定义辅助项
        let detail = {}
        if (type === 'add') {
          detail = { parentId: currentRow.phid }
          currentAstDialogName && this.$refs[currentAstDialogName].open(type, { ...detail })
        } else {
          this.getOldDetail(currentRow.phid).then(({ status, data, message }) => {
            if (status) {
              detail = { ...data }
              currentAstDialogName && this.$refs[currentAstDialogName].open(type, { ...detail })
            } else {
              this.$message.error(message)
            }
          })
        }
      } else if (currentAstDialogName === 'addDepartDialog') { // 部门单独打开
        let detail = {}
        if (type === 'add') {
          detail = { phid: currentRow.phid, isAdd: true }
          currentAstDialogName && this.$popup(addDepartDialog, {
            parentId: currentRow.parentId,
            detail: detail
          }).then(() => {
            this.addAstOk()
          }).catch(err => {
            console.log('err', err)
          })
        } else {
          this.getOldDetail(currentRow.phid).then(({ status, data, message }) => {
            if (status) {
              detail = { ...data, isAdd: false }
              currentAstDialogName && this.$popup(addDepartDialog, {
                parentId: currentRow.parentId,
                detail: detail
              }).then(() => {
                this.addAstOk()
              }).catch(err => {
                console.log('err', err)
              })
            } else {
              this.$message.error(message)
            }
          })
        }
      } else if (currentAstDialogName === 'addCurrentUnitDialog' || currentAstDialogName === 'addAppropriationTypeDialog') {
        if (type === 'add') {
          this.$refs[currentAstDialogName].open({
            ifReferred: false,
            form: {},
            dialogType: type
          })
        } else {
          this.getOldDetail(currentRow.phid).then(({ status, data, message }) => {
            if (status) {
              this.$refs[currentAstDialogName].open({
                ifReferred: false,
                form: { ...data },
                dialogType: type
              })
            } else {
              this.$message.error(message)
            }
          })
        }
      } else if (currentAstDialogName === 'addBudgetsUnitDialog') {
        this.$message.warning('该类型的辅助项不可新增！')
      }
    },
    //  辅助项新增回调
    addAstOk() {
      this.getSelectList().then(() => {
        if (this.showType === 1) { // 列表
          this.$refs.selectTable.clearSelection()
        } else { // 树形
          this.$refs.tree.setCheckedKeys([])
        }
        this.oldAstMapCode = ''
      })
    },
    // 确认引用
    checkReferred(url, ids) {
      return this.$http.post(url, ids)
    },
    // 删除
    handleDelete() {
      const currentRow = this.showType === 1 ? this.selectList.filter(item => item.phid === this.oldAstMapCode)[0] : this.$refs.tree.getCheckedNodes()[0]
      const checkUrl = LINK_MAP.filter(item => item.name === this.title)[0].checkUrl
      const delUrl = LINK_MAP.filter(item => item.name === this.title)[0].deleteUrl
      const currentAstDialogName = LINK_MAP.filter(item => item.name === this.title)[0].componentName
      const ids = [currentRow.phid]
      if (checkUrl.length) {
        this.checkReferred(checkUrl, ids).then((res) => {
          if (res.data) {
            this.$message({
              type: 'warning',
              message: '该条数据已被引用，不允许删除！'
            })
          } else {
            this.doDelete(delUrl, ids)
          }
        })
      } else {
        if (currentAstDialogName === 'addDepartDialog') {
          this.doDelete(delUrl, { ids: ids })
        } else if (currentAstDialogName === 'addCurrentUnitDialog' || currentAstDialogName === 'addAppropriationTypeDialog') {
          this.doDelete(delUrl, { ids })
        } else {
          this.doDelete(delUrl, ids)
        }
      }
    },
    // 执行删除
    doDelete(delUrl, ids) {
      this.$confirm('一旦删除，将不可恢复，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$http.post(delUrl, ids).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.getSelectList()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.show-type-box {
  margin-bottom: 15px;
}

.ast-dialog {
  position: relative;

  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}

.btn-box {
  position: absolute;
  right: 0;
  top: -5px;
  z-index: 999;
}
</style>
