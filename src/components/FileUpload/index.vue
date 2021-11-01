<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    append-to-body
    width="800px"
    title="附件"
    class="n-b-t-p"
  >
    <div
      v-if="dialogVisible"
      class="upload-wrap clearfix"
    >
      <div
        v-if="type === 'add'"
        class="left"
      >
        <div style="padding:10px 5px">
          <span>附件类型：</span>
          <el-select
            v-model="fileType"
            size="mini"
            style="width: 150px"
            placeholder="请选择附件类型"
            @change="filterFile"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.name"
              :value="item.phid"
            />
          </el-select>
        </div>
        <el-upload
          ref="upload"
          :multiple="true"
          :disabled="!canUp"
          :show-file-list="false"
          :on-exceed="onExceed"
          :on-success="onSuccess"
          :on-error="onError"
          :before-upload="beforeUpload"
          :headers="{token: token, currentOrgId: $commonQueryParam.orgId}"
          :data="{type: 2}"
          :action="$http.makeUrl('ucenter/file/upload')"
          class="upload-demo-file"
          drag
        >
          <i class="el-icon-upload" />
          <div v-if="canUp" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div v-else class="el-upload__text">上传不可用，请先添加附件类型</div>
        </el-upload>
      </div>
      <div :class="{right: type === 'add'}">
        <div class="filter-container clearfix">
          <div class="right-block">
            <el-button
              v-if="type === 'add'"
              type="primary"
              size="small"
              @click="deleteHandler"
            >删除</el-button>
            <el-button
              type="primary"
              size="small"
              @click="downLoad"
            >下载</el-button>
          </div>
        </div>
        <div class="list-wrap">
          <el-table
            ref="multipleTable"
            :data="showList"
            :header-cell-style="{textAlign: 'center'}"
            :cell-style="{textAlign: 'center'}"
            style="width: 100%"
            height="258px"
            class="no-b-table"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="附件名"
            />
            <el-table-column
              prop="fileDwg"
              label="文件格式"
            />
            <el-table-column
              prop="fileSize"
              label="文件大小"
            >
              <template slot-scope="scope">
                <span>{{ (parseFloat(scope.row.fileSize || 0) /1024).toFixed(2) }}k</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div
      v-if="type === 'add'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="okHandler"
      >保存</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'UploadFileDialog',
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      multipleSelection: [],
      uploadBtnLoading: false,
      fileType: '',
      typeList: [],
      showList: [],
      canUp: true,
      moduleType: 2 // 当前表单 1-凭证 2-收款单 3-付款单 4-现金日记账 5-银行日记账
    }
  },
  computed: {
    token() {
      return this.$getToken() || ''
    }
  },
  watch: {
    '$route.path'() {
      this.dialogVisible = false
    }
  },
  created() {
  },
  methods: {
    // 查附件类型
    getFileTypeList() {
      this.$http.post('ucenter/fileType/fileTypeApplyForFormList', {
        'applyForForm': this.moduleType
      }).then((res) => {
        this.typeList = res.data || []
        if (this.typeList.length === 0) {
          this.canUp = false
        } else {
          this.canUp = true
          this.fileType = this.typeList[0].phid
          this.filterFile()
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    open({ list, moduleType }) {
      this.showList = []
      this.fileType = ''
      this.multipleSelection = []
      this.typeList = []
      this.fileList = this.$deepClone(list)
      console.log(this.fileList)
      this.moduleType = moduleType
      this.getFileTypeList()
      this.dialogVisible = true
    },
    filterFile() {
      const showList = []
      this.fileList.forEach((item) => {
        if (item.fileTypeId === this.fileType) {
          showList.push(item)
        }
      })
      this.showList = showList
    },
    checkRequired() {
      const list = []
      this.typeList.forEach((item) => {
        if (item.required) {
          let ifHas = false
          this.fileList.forEach((file) => {
            if (file.fileTypeId === item.phid) {
              ifHas = true
            }
          })
          if (!ifHas) {
            list.push(item.name)
          }
        }
      })
      if (list.length > 0) {
        this.$confirm(`必须包含附件类型为：${list.join(',')}的附件！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        })
        return false
      } else {
        return true
      }
    },
    okHandler() {
      if (this.checkRequired()) {
        this.dialogVisible = false
        this.$emit('ok', this.fileList)
        this.clear()
      }
    },
    deleteHandler() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选择附件!`
        })
        return false
      }
      this.$confirm('一旦删除，将不可恢复，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        const urlList = []
        this.multipleSelection.forEach((item) => {
          urlList.push(item.url)
        })
        const fileList = []
        this.fileList.forEach((item) => {
          if (urlList.indexOf(item.url) === -1) {
            fileList.push(item)
          }
        })
        this.fileList = fileList
        this.filterFile()
      })
    },
    downLoad() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选择附件!`
        })
        return false
      }
      this.multipleSelection.forEach((item) => {
        this.downLoadFile(item)
      })
    },
    downLoadFile(item) {
      this.$http.get('ucenter/file/download', {
        filePath: item.url
      }, { responseType: 'arraybuffer' }).then((res) => {
        this.$downloadFile(res, item.name)
      })
    },
    onExceed() {
      this.$message({
        type: 'warning',
        message: `超出个数限制!`
      })
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 <= 5
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isLt2M
    },
    onSuccess(res) {
      // this.clear()
      if (res.status) {
        res.data.fileTypeId = this.fileType
        this.fileList.push(res.data)
        this.filterFile()
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: `上传失败!`
      })
      this.clear()
    },
    clear() {
      this.$refs.upload.clearFiles()
      this.file = null
      this.name = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.filter-container {
  padding: 10px 0;
}
.left-block {
  line-height: 32px;
}
.left {
  width: 33%;
  border-right: 1px solid #e6e6e6;
}
.right {
  width: 67%;
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
}
.left,
.right {
  float: left;
  height: 310px;
}
.list-wrap {
}
.upload-wrap {
  height: 310px;
  border-bottom: 1px solid #e6e6e6;
}
</style>
