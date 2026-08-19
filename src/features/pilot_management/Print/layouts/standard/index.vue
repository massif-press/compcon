<template>
  <div style="display: block">
    <pilot-print
      v-if="selectedPilot"
      :pilot="selectedPilot"
      :options="options"
    />
    <page-break
      v-if="showBondPrint"
      silent
    />
    <bonds-print
      v-if="showBondPrint && selectedPilot"
      :bc="selectedPilot.BondController"
      :options="options"
    />
    <page-break v-if="selectedMech" />
    <mech-print
      v-if="selectedMech"
      :mech="selectedMech"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
  import { BONDS, CONTENT } from '@/ui/print/options'
  import type { PilotPrintOptions } from '@/ui/print/types'
  import { computed } from 'vue'
  import { Pilot } from '@/classes/pilot/Pilot'
  import { Mech } from '@/classes/mech/Mech'
  import PilotPrint from './PilotPrint.vue'
  import BondsPrint from '../../extras/BondsPrint.vue'
  import MechPrint from './MechPrint.vue'
  import PageBreak from '@/ui/components/print/PageBreak.vue'

  defineOptions({ name: 'StandardPrint' })

  const props = withDefaults(
    defineProps<{
      selectedPilot?: Pilot | null
      selectedMech?: Mech | null
      options: PilotPrintOptions
      hasBonds?: boolean
    }>(),
    {
      selectedPilot: null as any,
      selectedMech: null as any,
    }
  )

  const showBondPrint = computed(() => {
    if (!props.selectedPilot) return false
    if (!props.hasBonds) return false
    if ((props.options as any).bonds?.key === BONDS.omit.key) return false
    return (
      (props.options as any).content?.key === CONTENT.blank.key ||
      props.selectedPilot.BondController.Bond
    )
  })
</script>
