<template>
  <div class="pb-3">
    <section-header :title="$t('pm.titles.gearLoadout')" />
    <CCPilotLoadout
      :pilot="pilot"
      :readonly="pilot.IsRemote"
    />
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import CCPilotLoadout from '@/features/pilot_management/_components/loadout/pilot_loadout/CCPilotLoadout.vue'
import SectionHeader from '../../components/SectionHeader.vue'

const props = defineProps<{
  pilot: Pilot
}>()
</script>
