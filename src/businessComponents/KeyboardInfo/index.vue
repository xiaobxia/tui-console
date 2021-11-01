<template>
  <el-popover
    placement="bottom-end"
    title="键盘常用操作"
    width="400"
    trigger="hover">
    <el-table :data="gridData" :border="true">
      <el-table-column property="name" label="凭证"/>
      <el-table-column property="value" label="快捷键"/>
    </el-table>
    <el-button slot="reference" size="small">快捷键</el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'KeyboardInfo',
  data() {
    return {
      gridData: [
        { name: '切换下一单元格', value: 'Tab' },
        { name: '保存', value: 'Ctrl+S' },
        { name: '保存并新增', value: 'Alt+N' }
      ]
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
