<template>
  <sidebar-array-view title="PILOT BACKGROUNDS" :array="backgrounds" icon="cci-orbit" />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'

export default Vue.extend({
  name: 'backgrounds',
  components: { SidebarArrayView },
  data: () => ({
    backgrounds: [],
  }),
  created() {
    this.backgrounds = this.$store.getters.getItemCollection('Backgrounds')
  },
})
</script>
