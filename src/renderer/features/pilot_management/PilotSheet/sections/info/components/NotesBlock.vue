<template>
  <div>
    <cc-title small color="pilot">
      <span class="ml-9">&emsp;</span>
      Player Notes
    </cc-title>
    <v-textarea v-model="pilot.Notes" class="mt-2" outlined auto-grow />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'
import activePilot from '@/features/pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'notes-block',
  mixins: [activePilot],
})
</script>
