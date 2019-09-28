<template>
  <div>
    <h1>pilot info/hist/roleplay/flavor</h1>
    <v-card outlined height="150px" class="mx-5 my-1">full image (additional art?)</v-card>
    <v-card outlined height="150px" class="mx-5 my-1">appearance desc</v-card>
    <v-card outlined height="150px" class="mx-5 my-1">bio/hist</v-card>
    <v-card outlined height="150px" class="mx-5 my-1">player notes</v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'info-view',
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
  },
})
</script>