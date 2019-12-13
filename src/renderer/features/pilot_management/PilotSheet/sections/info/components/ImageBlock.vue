<template>
  <div class="text-center">
    <div class="border">
      <!-- TODO: no data image -->
      <v-img v-if="pilot.Portrait" :key="pilot.Image" :src="pilot.Portrait" max-width="100%" />
      <v-img v-else src="https://via.placeholder.com/550" max-width="100% " />
    </div>
    <v-btn
      outlined
      color="secondary"
      small
      block
      class="fadeSelect"
      @click="$refs.imageSelector.open()"
    >
      <v-icon left>mdi-circle-edit-outline</v-icon>
      Set Pilot Portrait
    </v-btn>

    <cc-image-selector-web v-if="$platform" ref="imageSelector" :item="pilot" type="pilot" />
    <cc-image-selector v-else ref="imageSelector" :item="pilot" type="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import activePilot from '@/features/pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'history-block',
  mixins: [activePilot],
})
</script>
