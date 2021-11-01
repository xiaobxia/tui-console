<template>
  <el-dialog
    :title="'查看附件'"
    :visible="dialogVisible"
    :before-close="handleClose"
    width="800px"
  >
    <div class="dialog__body">
      <div class="pic-list">
        <div
          v-for="(item, index) in urlList"
          :key="index"
          class="pic-item"
        >
          <!-- <el-image
            :ref="`pic${index}`"
            :src="item.url"
            :preview-src-list="urlList"
            class="pic-content"
            fit="cover"
          /> -->
          <el-link @click="dowmload(item)">{{ item.name }}</el-link>
        </div>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog__footer"
    >
      <el-button
        size="small"
        @click="handleClose"
      >关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PicShow',
  data() {
    return {
      dialogVisible: false,
      urlList: []
    }
  },
  computed: {
    location() {
      return window.location
    }
  },
  methods: {
    open(urlList, index) {
      this.urlList = urlList
      this.dialogVisible = true
      this.$nextTick(() => {
        if (index >= 0) {
          this.$refs[`pic${index}`][0].showViewer = true
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    dowmload(item) {
      this.$http.get('ucenter/file/download', {
        filePath: item.url
      }, { responseType: 'arraybuffer' }).then((res) => {
        this.$downloadFile(res, item.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog__body {
  max-height: 500px;
  overflow-y: auto;
}
.pic-list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  .pic-item {
    margin: 0.45%;
    .pic-content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
