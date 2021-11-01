<template>
  <div class="number-grid-header">
    <div class="t">{{ title }}</div>
    <div class="sub clearfix">
      <div>亿</div>
      <div>仟</div>
      <div>佰</div>
      <div>拾</div>
      <div>万</div>
      <div>仟</div>
      <div>佰</div>
      <div>拾</div>
      <div>元</div>
      <div>角</div>
      <div>分</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberGridHeader',
  props: {
    title: {
      type: String,
      default: '借方'
    }
  },
  data() {
    return {
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
  .number-grid-header {
    .t {
      border-bottom: 1px solid #DCDFE6;
    }
    .sub {
      div{
        float: left;
        width: 9%;
        text-align: center;
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
  }
</style>
