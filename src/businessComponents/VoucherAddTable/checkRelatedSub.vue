<template>
  <el-dialog
    :title="'选择对应预算科目'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    append-to-body
    width="500px"
  >
    <div class="dialog__body">
      <div class="sub-list">
        <el-radio-group v-model="currentSubId">
          <el-radio
            v-for="(item, index) in dataList"
            :key="index"
            :label="item.phid"
            class="sub-item"
          >【{{ item.encode }}】{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog__footer"
    >
      <el-button
        size="small"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :disabled="!currentSubId"
        size="small"
        type="primary"
        @click="handleSubmit"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CheckRelatedSub',
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      currentSubId: ''
    }
  },
  methods: {
    open(list) {
      this.currentSubId = ''
      this.dataList = list
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSubmit() {
      const sub = this.dataList.find(item => item.phid === this.currentSubId)
      this.$emit('ok', [sub])
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-item {
  display: block;
  padding: 10px;
}
</style>
