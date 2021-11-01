<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    append-to-body
    class="sub-add-dialog"
  >
    <el-form
      v-if="dialogVisible"
      ref="form"
      :model="addForm"
      :rules="addRules"
      label-width="130px"
      size="small"
    >
      <el-form-item
        label="科目编码"
        prop="encode"
      >
        <el-input
          v-if="dialogType === 'addChild'"
          v-model="addForm.encode"
          class="diy-prepend"
        >
          <template slot="prepend"><span class="prepend">{{ parentCode }}</span></template>
        </el-input>
        <template v-else>
          <el-input
            v-if="parentCode"
            v-model="addForm.encode"
            class="diy-prepend"
          >
            <template slot="prepend"><span class="prepend">{{ parentCode }}</span></template>
          </el-input>
          <el-input
            v-else
            :disabled="ifEdit && ifAdopted"
            v-model="addForm.encode"
          />
        </template>
      </el-form-item>
      <el-form-item
        label="科目名称"
        prop="name"
      >
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="上级科目">
        <el-input
          v-model="parentName"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="科目类别"
        prop="subType"
      >
        <el-select
          :disabled="(ifEdit && ifAdopted)"
          v-model="addForm.subType"
          class="theme-select"
        >
          <el-option
            v-for="(item, index) in subjectCategoryList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="余额方向"
        prop="balanceType"
      >
        <el-radio
          v-for="(item,index) in $BALANCE_TYPE_LIST"
          :disabled="(ifEdit && ifAdopted)"
          :key="index"
          v-model="addForm.balanceType"
          :label="item.value"
        >{{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row>
          <el-col :span="4">
            <el-checkbox
              :disabled="(ifEdit && ifAdopted)"
              v-model="addForm.assistCheck"
              true-label="1"
              false-label="0"
            >辅助核算
            </el-checkbox>
          </el-col>
          <el-col :span="20">
            <el-form-item
              label="辅助项目"
              prop="type"
              class="auto-label-width"
            >
              <el-select
                v-model="assIdList"
                :disabled="addForm.assistCheck === '0' || (ifEdit && ifAdopted)"
                class="theme-select"
                multiple
                collapse-tags
                @change="handleChangeAsts"
              >
                <el-option
                  v-for="(item, index) in assistList"
                  :key="index"
                  :label="item.name"
                  :value="item.phid"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row>
          <el-col :span="4">
            <el-checkbox
              :disabled="(ifEdit && ifAdopted)"
              v-model="addForm.amountCheck"
              true-label="1"
              false-label="0"
            >数量核算
            </el-checkbox>
          </el-col>
          <el-col :span="20">
            <el-form-item
              label="计量单位"
              prop="unit"
              class="auto-label-width"
            >
              <el-input
                :disabled="addForm.amountCheck === '0' || (ifEdit && ifAdopted)"
                v-model="addForm.unit"
                :maxlength="10"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="bookInfo.isForeignCurrency === '1'"
        label-width="0px"
      >
        <el-row>
          <el-col :span="4">
            <el-checkbox
              :disabled="(ifEdit && ifAdopted)"
              v-model="addForm.foreignCheck"
              true-label="1"
              false-label="0"
            >外币核算
            </el-checkbox>
          </el-col>
          <el-col :span="20">
            <el-form-item
              label="辅助币别"
              prop="type"
            >
              <el-select
                :disabled="addForm.foreignCheck === '0' || (ifEdit && ifAdopted)"
                v-model="forIdList"
                class="theme-select subject-for-tag"
                multiple
                placeholder=""
              >
                <el-option
                  v-for="item in commonForeignKeyList"
                  v-if="item.foreignKey !== '人民币'"
                  :key="item.value"
                  :label="item.foreignKey"
                  :value="item.foreignKeyId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="bookInfo.isNewAccounts === '1' || $sysSetting.sysType === 'gh'"
        label-width="0px"
      >
        <el-row>
          <el-col
            v-if="[16, 20, 21].includes(bookInfo.accountsSystem)"
            :span="4"
          >
            <el-checkbox
              v-model="addForm.financeCheck"
              :true-label="'1'"
              :false-label="'0'"
            >经费核算</el-checkbox>
          </el-col>
          <el-col
            v-if="[17, 18, 19].includes(bookInfo.accountsSystem)"
            :span="4"
          >
            <el-checkbox
              v-model="addForm.cashFlowCheck"
              :true-label="'1'"
              :false-label="'0'"
            >现金流核算</el-checkbox>
          </el-col>
          <el-col
            v-if="[17, 18, 19].includes(bookInfo.accountsSystem)"
            :span="4"
          >
            <el-checkbox
              v-model="addForm.diffItemCheck"
              :true-label="'1'"
              :false-label="'0'"
            >差异项核算</el-checkbox>
          </el-col>
          <el-col :span="4">
            <el-checkbox
              v-model="addForm.budgetCheck"
              :true-label="'1'"
              :false-label="'0'"
            >预算</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        label="科目特征"
        prop="feature"
      >
        <el-select
          :disabled="(ifEdit && ifAdopted)"
          v-model="addForm.feature"
          class="theme-select"
        >
          <el-option
            v-for="(item, index) in $SUBJECT_FEATURE_LIST"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="受控系统"
        prop="controSystem"
      >
        <el-select
          :disabled="(ifEdit && ifAdopted)"
          v-model="addForm.controSystem"
          class="theme-select"
        >
          <el-option
            label="无"
            value="0"
          />
          <el-option
            v-for="(item, index) in $CONTROL_SYSTEM_LIST"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="+addForm.feature === 2"
        label="银行名称"
        prop="bankName"
      >
        <el-select
          v-model="addForm.bankName"
          :popper-class="bankNameList > 0 ? 'accountType-select-popper' : ''"
          style="width: 100%"
          class="theme-select"
        >
          <el-option
            v-for="(item, index) in bankNameList"
            :key="index"
            :label="item.name"
            :value="item.phid"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="+addForm.feature === 2"
        label="账户"
        prop="account"
      >
        <el-input v-model="addForm.account" />
      </el-form-item>
      <el-form-item
        v-if="+addForm.feature === 2"
        label="账户类别"
        prop="accountType"
      >
        <el-select
          v-model="addForm.accountType"
          :popper-class="accountTypeList > 0 ? 'accountType-select-popper' : ''"
          style="width: 100%"
          class="theme-select"
        >
          <el-option
            v-for="(item, index) in accountTypeList"
            :key="index"
            :label="item.name"
            :value="item.phid"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="+addForm.feature === 2"
        label="开户银行选择方式"
        prop="bankSelect"
      >
        <el-select
          v-model="addForm.bankSelect"
          :popper-class="bankSelectList > 0 ? 'bankSelect-select-popper' : ''"
          style="width: 100%"
          class="theme-select"
        >
          <el-option
            v-for="(item, index) in bankSelectList"
            :key="index"
            :label="item.name"
            :value="item.phid"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        :loading="loading"
        size="small"
        type="primary"
        @click="okHandler"
      >确定
      </el-button>
    </div>
    <account-bank-add
      ref="accountBankAdd"
      @ok="accountBankAddOk"
    />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { createSubjectForm } from '@/common/create'
import AccountBankAdd from './accountBankAdd'
import uuid from 'uuid/v1'

export default {
  name: 'SubjectAddDialog',
  components: {
    AccountBankAdd
  },
  data() {
    return {
      dialogVisible: false,
      addForm: createSubjectForm(),
      assIdList: [],
      forIdList: [],
      dialogTitle: '',
      dialogType: 'add',
      parentName: '无上级科目',
      parentCode: '',
      ifAdopted: false,
      editRowData: {},
      subjectCategoryList: [],
      addRules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 20, message: '长度20个字符以内', trigger: 'blur' }
        ],
        subType: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        feature: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      loading: false,
      subYear: '',
      bankNameList: [],
      accountTypeList: [],
      bankSelectList: []
    }
  },
  computed: {
    ...mapGetters([
      'bookInfo',
      'commonForeignKeyList',
      'assistList'
    ]),
    ifEdit() {
      return this.dialogType === 'edit' || this.dialogType === 'addChild'
    }
  },
  created() {
    this.$store.dispatch('initCommonForeignKeyList', {
      ...this.$commonQueryParam
    })
    this.$store.dispatch('initAssistList', {
      ...this.$commonQueryParam
    })
    this.subjectCategoryList = this.bookInfo.isNewAccounts === '1' ? this.$SUBJECT_CATEGORY_NEW_LIST.filter(item => !item.notShow.includes(this.bookInfo.accountsSystem)) : this.$SUBJECT_CATEGORY_OLD_LIST
  },
  methods: {
    // 获取账户类别和开户行选择方式数据
    getBackSelectAndAccountType(accountType, bankSelect, bankNameSelect) {
      accountType && this.$http.get('ucenter/dict-data/getSubAstData', { dictId: 2020031700000051 }).then(({ status, data, message }) => {
        this.accountTypeList = data || []
      })
      bankSelect && this.$http.get('ucenter/dict-data/getSubAstData', { dictId: 2020031700000052 }).then(({ status, data, message }) => {
        this.bankSelectList = data || []
      })
      bankNameSelect && this.$http.get('ucenter/dict-data/getSubAstData', { dictId: 2020031700000053 }).then(({ status, data, message }) => {
        this.bankNameList = data || []
      })
    },
    // 格式化提交阐述
    formatSubjectFormValue() {
      const hsSubEntity = {
        ...this.$commonQueryParam,
        ...this.addForm,
        subYear: this.subYear
      }
      if (this.dialogType === 'addChild') {
        hsSubEntity.encode = this.parentCode + this.addForm.encode
      }
      if (this.dialogType === 'edit' && this.parentCode) {
        hsSubEntity.encode = this.parentCode + this.addForm.encode
      }
      delete hsSubEntity.year
      delete hsSubEntity.parentEncode
      delete hsSubEntity.parentName
      delete hsSubEntity.originSubId
      return {
        assIdList: this.assIdList,
        forIdList: this.forIdList,
        hsSubEntity: hsSubEntity,
        isPublic: 2
      }
    },
    // 动态生成验证规则
    createAddRules(row) {
      const subLength = this.bookInfo.subLength || ''
      const list = subLength.split('-')
      let level = 1
      let len = '6'
      if (!row) {
        len = list[level - 1]
      } else {
        level = parseInt(row.subLevels || 1)
        len = list[level - 1]
      }
      // 编辑的话就是相加
      if (this.dialogType === 'edit') {
        let subLen = 0
        for (let i = 0; i < level; i++) {
          subLen += parseInt(list[i] || 0)
        }
        len = subLen
      }
      const validate = (rule, value, callback) => {
        const reg = new RegExp(`^\\d{${len}}$`)
        const code = this.parentCode && this.dialogType === 'edit' ? this.parentCode + value : value
        if (!reg.test(code)) {
          callback(new Error(`${len}位数字`))
        } else {
          callback()
        }
      }
      this.addRules = {
        ...this.addRules,
        encode: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
      }
    },
    open(data, row) {
      this.dialogTitle = data.dialogTitle || ''
      this.dialogType = data.dialogType || ''
      this.parentName = data.parentName || ''
      this.parentCode = data.parentCode || ''
      this.ifAdopted = data.ifAdopted || false
      this.subYear = data.subYear || this.$commonQueryParam.year
      let assIdList = []
      let forIdList = []
      if (row) {
        assIdList = row.assIdList
        forIdList = row.forIdList
        this.editRowData = row
        if (this.dialogType === 'addChild') {
          row.encode = ''
        }
        this.subYear = row.subYear
        // 编辑的情况
        if (this.dialogType === 'edit' && this.parentCode) {
          row.encode = row.encode.substring(this.parentCode.length)
        }
      }
      this.assIdList = assIdList
      this.forIdList = forIdList
      this.addForm = createSubjectForm(row)
      this.createAddRules(row)
      this.getBackSelectAndAccountType(true, true, true)
      this.dialogVisible = true
    },
    // 弹出框确认
    okHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 子级也用add
          let url = `account/subject/add?uuId=${uuid()}`
          if (this.dialogType === 'edit') {
            url = `account/subject/update?uuId=${uuid()}`
          }
          if (this.dialogType === 'edit' && this.editRowData.name === this.addForm.name) {
            // 编辑并且没改名字不用看重名
            this.submitSubjectForm(url)
          } else {
            // 检查重名
            this.$http.post('account/subject/findDupName', {
              bookId: this.$commonQueryParam.bookId,
              name: this.addForm.name,
              orgId: this.$commonQueryParam.orgId,
              isOnlyPublic: 0,
              year: this.$commonQueryParam.year,
              schemeId: this.bookInfo.schemeId || ''
            }).then((findDupNameRes) => {
              if (findDupNameRes.data) {
                // 重名了
                this.$confirm('已存在相同名称的科目，请确认是否保存?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false
                }).then(() => {
                  this.submitSubjectForm(url)
                }).catch((err) => {
                  console.log(err)
                })
              } else {
                this.submitSubjectForm(url)
              }
            })
          }
        }
      })
    },
    // 提交科目表单
    submitSubjectForm(url) {
      this.loading = true
      this.$http.post(url, this.formatSubjectFormValue()).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
        this.dialogVisible = false
        this.$emit('ok')
        this.loading = false
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    // 现金流核算开启后同步开启辅助核算
    handleChangeCashFlow(val) {
      const astId = this.assistList.filter(item => item.extCode === 'ext_10').length ? this.assistList.filter(item => item.extCode === 'ext_10')[0].phid : ''
      if (+val) {
        this.addForm.assistCheck = '1'
        if (!this.assIdList.includes(astId) && !this.assIdList.includes(+astId)) {
          this.assIdList.push(astId)
        }
      } else {
        if (this.assIdList.includes(astId) || this.assIdList.includes(+astId)) {
          const index = this.assIdList.findIndex(item => +item === +astId)
          this.assIdList.splice(index, 1)
        }
      }
    },
    // 变更辅助项
    handleChangeAsts(val) {
      const astId = this.assistList.filter(item => item.extCode === 'ext_10').length ? this.assistList.filter(item => item.extCode === 'ext_10')[0].phid : ''
      if (+this.addForm.cashFlowCheck) {
        if (!val.includes(astId)) {
          this.$message.warning('开启现金流核算后不得删除辅助项目中的现金流项目选项！')
          this.assIdList = [astId, ...this.assIdList]
        }
      }
    },
    // 新增账户类别
    addAccountType(formData) {
      this.$refs.accountBankAdd.open({
        module: 51,
        dictId: 2020031700000051
      }, [true, false])
    },
    // 新增开户银行
    addBankSelect(formData) {
      this.$refs.accountBankAdd.open({
        module: 52,
        dictId: 2020031700000052
      }, [false, true])
    },
    accountBankAddOk(val) {
      this.getBackSelectAndAccountType(val[0], val[1])
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.diy-prepend .prepend {
  display: inline-block;
  min-width: 30px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.subject-for-tag {
  .el-tag {
    .el-select__tags-text {
      display: inline-block;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: top;
    }
  }
}

.accountType-select-popper .select-b-btn-wrap,
.bankSelect-select-popper .select-b-btn-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  height: 30px;
  line-height: 30px;
}

.sub-add-dialog /deep/ .el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}

.auto-label-width {
  /deep/ .el-form-item__label {
    width: 75px !important;
  }
  /deep/ .el-form-item__content {
    margin-left: 75px !important;
  }
}
</style>
