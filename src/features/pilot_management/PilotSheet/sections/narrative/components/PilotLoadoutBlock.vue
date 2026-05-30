<template>
  <div class="pb-3">
    <section-header title="Gear Loadout" />
    <cc-pilot-loadout
      :pilot="pilot"
      :readonly="pilot.IsRemote"
    />
  </div>
</template>

<script setup lang="ts">
import CCPilotLoadout from '@/features/pilot_management/_components/loadout/pilot_loadout/CCPilotLoadout.vue'
import SectionHeader from '../../components/SectionHeader.vue'

const props = defineProps<{
  pilot: object
}>()
</script>
