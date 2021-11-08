<template>
  <div>
    <div v-if="group" >
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in list"
          :key="index"
          :label="item.note"
          :name="`${index}`"
        >
          <div v-if="item.childList && item.childList.length > 0">
            <side :list="item.childList" :group="group"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else>
      <side :list="list" :group="group"/>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v1'
import Side from './side'

function format(list) {
  list.forEach((v) => {
    v.id = uuid()
    if (v.childList && v.childList.length > 0) {
      format(v.childList)
    } else {
      if (v.validateForm) {
        const properties = v.validateForm.properties
        const required = v.validateForm.required
        const paramList = []
        const example = {}
        for (const key in properties) {
          const item = properties[key]
          paramList.push({
            key,
            ...item,
            required: required.indexOf(key) !== -1
          })
          example[key] = ''
          if (item.type === 'array') {
            example[key] = []
          }
        }
        v.paramList = paramList
        v.example = JSON.stringify(example, null, 4)
      }
    }
  })
}

function reGroup(list) {
  const res = []
  const other = {
    note: '其他',
    childList: []
  }
  list.forEach((v) => {
    if (v.group) {
      res.push(v)
    } else {
      other.childList.push(v)
    }
  })
  if (other.childList.length > 0) {
    res.push(other)
  }
  return res
}

export default {
  name: 'Entry',
  components: {
    Side
  },
  data() {
    return {
      activeName: '0',
      list: [],
      group: false
    }
  },
  computed: {
  },
  created() {
    this.$http.get('apidoc').then((res) => {
      let list = res || []
      let group = false
      list.forEach((v) => {
        if (v.group) {
          group = true
        }
      })
      if (group) {
        list = reGroup(list)
      }
      this.group = group
      format(list)
      this.list = list
    })
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .c-c {
    padding: 0 20px;
  }
</style>
