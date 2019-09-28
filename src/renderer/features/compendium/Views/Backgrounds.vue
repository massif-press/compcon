<template>
  <sidebar-array-view
    title="PILOT BACKGROUNDS"
    :array="backgrounds"
    icon="cci-orbit"
    name-key="name"
    description-key="description"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'
import { backgrounds } from 'lancer-data'

export default Vue.extend({
  name: 'backgrounds',
  components: { SidebarArrayView },
  data: () => ({
    backgrounds: [],
  }),
  created() {
    this.backgrounds = backgrounds
  },
})
</script>
