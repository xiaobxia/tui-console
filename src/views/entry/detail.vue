<template>
  <div v-if="item" class="c-c">
    <div>参数示例</div>
    <div>
      <pre v-highlight><code class="lang-javascript">{{ item.example }}</code></pre>
    </div>
    <div>参数说明</div>
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
  </div>
</template>
<script>
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
      item: null
    }
  },
  watch: {
    select() {
      if (this.select) {
        this.initItem()
      } else {
        this.item = null
      }
    }
  },
  methods: {
    initItem() {
      this.item = getItem(this.list, this.select)
    }
  }
}
</script>
<style lang="scss" scoped>
  .c-c {
    padding: 0 20px;
  }
</style>
