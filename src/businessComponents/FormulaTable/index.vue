<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="subject"
        label="科目"/>
      <el-table-column
        label="运算符号">
        <template slot-scope="scope">
          <el-select v-model="scope.row.operationalSymbol" class="theme-select">
            <el-option v-for="(item, index) in $OPERATION_TYPE_LIST" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="取数规则">
        <template slot-scope="scope">
          <el-select v-model="scope.row.fetchNumber" class="theme-select">
            <el-option v-for="(item, index) in $FETCH_NUMBER_TYPE_LIST" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="时间类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.dateType" class="theme-select">
            <el-option v-for="(item, index) in $ACCOUNT_DATE_TYPE_LIST" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addRow(scope.$index)">新增</el-button>
          <el-button :disabled="tableData.length === 1 && scope.$index ===0" type="text" @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
function createItem(tar) {
  let raw = {
    subject: '',
    operationalSymbol: '',
    fetchNumber: '',
    dateType: ''
  }
  if (tar) {
    raw = Object.assign(raw, tar)
  }
  return raw
}
export default {
  name: 'FormulaTable',
  data() {
    return {
      tableData: [createItem()]
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    addRow(index) {
      this.tableData.splice(index + 1, 0, createItem())
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
