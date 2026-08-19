<template>
  <div class="text-black pa-3">
    <v-row>
      <pilot-print
        v-if="selectedPilot"
        :pilot="selectedPilot"
        :options="options"
      />
      <mech-print
        v-if="selectedMech"
        :mech="selectedMech"
        :options="options"
      />
      <std-action-print
        v-if="Array.isArray(options.card) && has(options.card, 'standardActions')"
      />
      <status-cards v-if="Array.isArray(options.card) && has(options.card, 'statusCards')" />
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { has } from '@/ui/print/options'
  import PilotPrint from './PilotPrint.vue'
  import MechPrint from './MechPrint.vue'
  import StdActionPrint from './StdActionPrint.vue'
  import StatusCards from './StatusCards.vue'
  import { Pilot } from '@/classes/pilot/Pilot'
  import { Mech } from '@/classes/mech/Mech'

  defineProps<{
    selectedPilot: Pilot
    selectedMech?: Mech
    options: any
  }>()
</script>
