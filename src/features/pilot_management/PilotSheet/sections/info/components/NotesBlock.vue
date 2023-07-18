<template>
  <div>
    <section-header title="Player Notes" />

    <v-textarea v-model="pilot.Notes" class="ma-2 px-10" variant="outlined" auto-grow />
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import { Pilot } from '@/class';
export default {
  name: 'notes-block',
  components: { SectionHeader },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
};
</script>
