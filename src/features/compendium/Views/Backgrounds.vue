<template>
  <sidebar-array-view
    title="PILOT BACKGROUNDS"
    :array="backgrounds"
    icon="cci-orbit"
    name-key="Name"
    description-key="Description"
    sub-key="LcpName"
    sub-conditional="InLcp"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'backgrounds',
  components: { SidebarArrayView },
  data: () => ({
    backgrounds: [],
  }),
  created() {
    this.backgrounds = getModule(CompendiumStore, this.$store).Backgrounds
  },
})
</script>
