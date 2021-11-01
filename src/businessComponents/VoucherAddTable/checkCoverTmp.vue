<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="选择覆盖模板"
    append-to-body
    width="500px"
    destory-on-close
  >
    <div class="tip-content">
      您所选择的科目有绑定的凭证模板，您可以选择凭证模板进行快速录入！
    </div>
    <div class="list-content">
      <el-card v-for="(item, index) in list" :key="index" class="box-card">
        <div class="list-item">
          <div class="list-lfet">
            {{ item.name }}
          </div>
          <div class="list-right">
            <el-button type="text" @click="okHandler(item)">使用</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div
      slot="footer"
      class="foot"
    >
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CheckCoverTmp',
  data() {
    return {
      dialogVisible: false,
      list: []
    }
  },
  created() {

  },
  methods: {
    open(data) {
      this.list = data.list
      this.dialogVisible = true
    },
    close() {
      this.list = []
    },
    okHandler(data) {
      this.$emit('userTmpToCover', data)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-bottom: 10px;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .list-left {
    width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.tip-content {
  font-size: 14px;
  margin-bottom:  15px;
}
</style>
