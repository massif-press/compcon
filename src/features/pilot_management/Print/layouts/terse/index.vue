<template>
  <div style="display: block">
    <pilot-print v-if="selectedPilot"
      :pilot="selectedPilot"
      :options="options" />
    <page-break v-if="showBondPrint"
      silent />
    <bonds-print v-if="showBondPrint"
      :bc="selectedPilot.BondController"
      :options="options" />
    <page-break v-if="selectedMech" />
    <mech-print v-if="selectedMech"
      :mech="selectedMech"
      :options="options" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pilot } from '@/classes/pilot/Pilot'
import { Mech } from '@/classes/mech/Mech'
import PilotPrint from './PilotPrint.vue'
import BondsPrint from '../../extras/BondsPrint.vue'
import MechPrint from './MechPrint.vue'
import PageBreak from '../../components/PageBreak.vue'

defineOptions({ name: 'terse-print' })

const props = withDefaults(defineProps<{
  selectedPilot?: Pilot | null
  selectedMech?: Mech
  options: object
  hasBonds?: boolean
}>(), {
  selectedPilot: null as any,
})

const showBondPrint = computed(() => {
  if (!props.selectedPilot) return false
  if (!props.hasBonds) return false
  if ((props.options as any).bonds?.title === 'Omit') return false
  return (props.options as any).content?.title === 'Blank' || props.selectedPilot.BondController.Bond
})
</script>

