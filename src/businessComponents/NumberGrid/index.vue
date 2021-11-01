<template>
  <div :class="textClass" class="text-n number-grid clearfix">
    <div v-for="(item,index) in showList" :key="`${item}-${index}`" class="col">
      <div>{{ item }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NumberGrid',
  props: {
    count: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showList: ['', '', '', '', '', '', '', '', '', '', ''],
      textClass: ''
    }
  },
  computed: {
  },
  watch: {
    count() {
      this.formatMoneyGrid()
    }
  },
  created() {
    this.formatMoneyGrid()
  },
  methods: {
    formatMoneyGrid() {
      let num = parseFloat(this.count || 0)
      if (!num) {
        this.showList = ['', '', '', '', '', '', '', '', '', '', '']
        return false
      }
      if (num < 0) {
        this.textClass = 'red-text'
      } else {
        this.textClass = ''
      }
      // 本位币金额一定是两位的
      num = Math.abs(num)
      num = num.toFixed(2)
      // 一定是正数
      if (num < 1 && num > 0) {
        // 取小数点后两位
        num = '' + num
        const t = num.split('.')
        num = t[t.length - 1]
      } else {
        num = '' + num
        num = num.replace('.', '')
      }
      const numList = num.split('')
      numList.reverse()
      numList.push('￥')
      const showList = []
      for (let i = 0; i < 11; i++) {
        showList.push(numList[i] || '')
      }
      this.showList = showList.reverse()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .text-n {
    padding: 0!important;
  }
  .number-grid {
    height: 100%;
    width: 100%;
    .col{
      height: 100%;
      float: left;
      width: 9%;
      text-align: center;
      line-height: 100%;
      position: relative;
      div {
        position: absolute;
        height: 20px;
        line-height: 20px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 100%;
        text-align: center;
      }
      &:nth-of-type(1) {
        border-right: 2px solid #7CCDFF;
      }
      &:nth-of-type(2) {
        border-right: 2px solid #7CCDFF;
      }
      &:nth-of-type(3) {
        border-right: 2px solid #7ED585;
      }
      &:nth-of-type(4) {
        border-right: 2px solid #7ED585;
      }
      &:nth-of-type(5) {
        border-right: 2px solid #7ED585;
      }
      &:nth-of-type(6) {
        border-right: 2px solid #FFE468;
      }
      &:nth-of-type(7) {
        border-right: 2px solid #FFE468;
      }
      &:nth-of-type(8) {
        border-right: 2px solid #FFE468;
      }
      &:nth-of-type(9) {
        border-right: 2px solid #E84C5A
      }
      &:nth-of-type(10) {
        border-right: 2px solid #FFE468;
      }
    }
  }
</style>
