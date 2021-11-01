<template>
  <i v-if="isElIcon" :class="[name, className]" v-on="$listeners"/>
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isElIcon() {
      return this.name.startsWith('el-icon')
    },
    iconName() {
      return `#icon-${this.name}`
    },
    svgClass() {
      if (this.className) {
        return 'scoped-svg-icon ' + this.className
      } else {
        return 'scoped-svg-icon'
      }
    }
  }
}
</script>

<style lang="scss">
  .scoped-svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
