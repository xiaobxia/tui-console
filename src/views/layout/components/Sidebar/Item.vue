<template>
  <div>
    <i v-if="icon" :class="icon" style="margin-right: 5px; width: 16px;"/>
    <span v-if="showTitle" slot="title">{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: false
    }
  }
}
</script>
