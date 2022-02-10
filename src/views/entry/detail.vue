<template>
  <div v-if="item && init" class="c-c">
    <div style="margin-bottom: 15px">名称：{{ item.note }}</div>
    <div style="margin-bottom: 15px">请求方法：{{ item.method }}</div>
    <div style="margin-bottom: 15px">请求路径：{{ cPath(item.path) }}</div>
    <div>参数示例</div>
    <div>
      <pre v-highlight><code class="lang-javascript">{{ item.example }}</code></pre>
    </div>
    <div>
      <span>参数说明</span>
      <!--<el-button type="text" @click="openCodeDialog(item)">字段代码</el-button>-->
    </div>
    <div>
      <el-table
        :data="item.paramList"
        border
        style="width: 100%;margin: 1em 0;">
        <el-table-column
          prop="key"
          label="字段"/>
        <el-table-column
          prop="note"
          label="字段名"/>
        <el-table-column
          prop="type"
          label="类型"/>
        <el-table-column label="必填">
          <template slot-scope="{row}">
            <span>{{ row.required ? '是' : '否' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <code-dialog ref="codeDialog"/>
  </div>
</template>
<script>
import CodeDialog from './codeDialog'
function getItem(list, select) {
  for (let i = 0; i < list.length; i++) {
    const v = list[i]
    if (v.childList && v.childList.length > 0) {
      const res = getItem(v.childList, select)
      if (res) {
        return res
      }
    } else {
      if (v.id === select) {
        return v
      }
    }
  }
  return null
}
export default {
  components: {
    CodeDialog
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    select: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      item: null,
      init: false
    }
  },
  watch: {
    select() {
      if (this.select) {
        this.initItem()
      } else {
        this.item = null
      }
      this.reInit()
    }
  },
  created() {
    this.reInit()
  },
  methods: {
    reInit() {
      this.init = false
      this.$nextTick(() => {
        this.init = true
      })
    },
    initItem() {
      this.item = getItem(this.list, this.select)
    },
    cPath(path) {
      if (path.startsWith('/')) {
        path = path.substring(1)
      }
      return window.BASE_PATH + path
    },
    openCodeDialog(item) {
      this.$refs.codeDialog.open(item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .c-c {
    padding: 0 20px;
  }
</style>
