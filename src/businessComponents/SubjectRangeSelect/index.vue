<template>
  <div class="subject-range-wrap">
    <el-select
      v-model="startCodeLocal"
      :title="`${startCodeLocal} - ${startTitle}`"
      :popper-append-to-body="false"
      filterable
      clearable
      style="width: 160px"
      placeholder="开始科目"
      size="small"
      @change="subjectChange"
    >
      <el-option
        v-for="(item, index) in subjectList"
        :disabled="endCodeLocal ? endCodeLocal < item.encode : false"
        :key="index"
        :label="item.encode + ' - ' + item.name"
        :value="item.encode"
      >
        <span :style="{paddingLeft: item.sub ? '2em':''}">{{ item.encode }} - {{ item.name }}</span>
      </el-option>
    </el-select>
    <span>~</span>
    <el-select
      v-model="endCodeLocal"
      :title="`${endCodeLocal} - ${endTitle}`"
      :popper-append-to-body="false"
      filterable
      clearable
      style="width: 160px"
      placeholder="结束科目"
      size="small"
      @change="subjectChange"
    >
      <el-option
        v-for="(item, index) in subjectList"
        :disabled="startCodeLocal ? startCodeLocal > item.encode : false"
        :key="index"
        :label="item.encode + ' - ' + item.name"
        :value="item.encode"
      >
        <span :style="{paddingLeft: item.sub ? '2em':''}">{{ item.encode }} - {{ item.name }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SubjectRangeSelect',
  props: {
    startCode: {
      type: String,
      default: ''
    },
    endCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      startCodeLocal: this.startCode,
      endCodeLocal: this.endCode,
      startTitle: '',
      endTitle: ''
    }
  },
  computed: {
    ...mapGetters([
      'subjectList'
    ])
  },
  created() {
    console.log(this.startCode)
    console.log(this.endCode)
  },
  mounted() { },
  methods: {
    subjectChange(val) {
      const currentStartSubList = this.subjectList.filter(item => item.encode === this.startCodeLocal)
      const currentEndSubList = this.subjectList.filter(item => item.encode === this.endCodeLocal)
      this.startTitle = val && currentStartSubList.length > 0 ? currentStartSubList[0].name : ''
      this.endTitle = val && currentEndSubList.length > 0 ? currentEndSubList[0].name : ''
      this.$emit('update:startCode', this.startCodeLocal)
      this.$emit('update:endCode', this.endCodeLocal)
    },
    subjectInit() {
      this.startCodeLocal = ''
      this.endCodeLocal = ''
      this.$emit('update:startCode', this.startCodeLocal)
      this.$emit('update:endCode', this.endCodeLocal)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.subject-range-wrap {
  display: inline-block;
}
</style>
