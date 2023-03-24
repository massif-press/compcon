<template>
  <div>
    <pilot-block v-if="!pilot.IsDead" :pilot="pilot" />
    <clone-block v-else hide-quirks readonly />
  </div>
</template>

<script lang="ts">
import PilotBlock from '../layout/PilotBlock.vue';
import CloneBlock from '@/features/pilot_management/PilotSheet/sections/info/components/CloneBlock.vue';

export default {
  name: 'active-narrative',
  components: {
    PilotBlock,
    CloneBlock,
  },
};
</script>
