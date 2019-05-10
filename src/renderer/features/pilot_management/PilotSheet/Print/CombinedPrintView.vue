<template>
  <div>
    <pilot-view />
    <div style="page-break-before: always;"> </div>
    <config-view />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import PilotView from './PrintView.vue'
  import ConfigView from '../../ConfigSheet/Print/PrintView.vue'

  export default Vue.extend({
    name: 'combined-print',
    components: {PilotView, ConfigView},
    mounted () {
      window.print()
      setTimeout(() => {
        this.$router.push('/pilot')
      }, 10)
    }
  })
</script>
