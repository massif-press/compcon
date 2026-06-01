<template>
  <div class="mt-5">
    <section-header title="Equipment Loadout" class="mb-4" />
    <CCMechLoadout :mech="mech" :readonly="mech.Pilot.IsRemote" />
  </div>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import CCMechLoadout from '@/features/pilot_management/_components/loadout/mech_loadout/CCMechLoadout.vue'
import SectionHeader from '../../components/SectionHeader.vue';

defineOptions({ name: 'license-requirements-block' })

const props = defineProps<{
  mech: Mech
}>()
</script>
