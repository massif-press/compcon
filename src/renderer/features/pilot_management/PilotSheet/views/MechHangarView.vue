<template>
  <div>
    <h1>pilot mech hangar</h1>
    <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
    <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
    <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
    <v-card outlined height="150px" class="mx-5 my-1">mech</v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'mech-hangar-view',
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
  },
})
</script>