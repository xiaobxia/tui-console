<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="close"
    :title="title"
    modal-append-to-body
    append-to-body
    width="400px"
    class="message-dialog"
    top="40vh"
  >
    <div class="el-message-box__content">
      <div class="el-message-box__container">
        <div :class="['el-message-box__status', icon]"/>
        <div class="el-message-box__message">
          <div><span v-html="content"/><span v-if="!infinity"> ({{ count }}s) 后自动关闭。</span></div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="showCancelButton" size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="close">{{ confirmButtonText }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MessageDialog',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    fn: {
      type: Function,
      default: () => { }
    },
    content: {
      type: String,
      default: '这是弹框内容'
    },
    confirmButtonText: {
      type: String,
      default: '立即关闭'
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'success'
    },
    timeout: {
      type: Number,
      default: 3
    },
    infinity: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      interval: null,
      count: 0,
      icon: 'el-icon-success'
    }
  },
  mounted() { },
  methods: {
    close(done) {
      this.dialogVisible = false
      this.fn()
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
      this.$destroy()
    },
    showMsgBox: function() {
      const iconMap = {
        success: 'el-icon-success',
        warning: 'el-icon-warning',
        error: 'el-icon-error'
      }
      this.count = this.timeout
      this.dialogVisible = true
      this.icon = iconMap[this.status]
      this.$nextTick(() => {
        this.beginCount()
      })
    },
    beginCount: function() {
      if (this.infinity) return
      var that = this
      this.count = this.timeout
      this.interval = setInterval(() => {
        that.count--
        if (that.count === 0) {
          that.close()
        }
      }, 1000)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
