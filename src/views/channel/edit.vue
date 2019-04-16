<template>
  <channel-detail :is-edit="true"/>
</template>

<script>
import ChannelDetail from './components/ChannelDetail'

export default {
  name: 'EditForm',
  components: { ChannelDetail }
}
</script>

