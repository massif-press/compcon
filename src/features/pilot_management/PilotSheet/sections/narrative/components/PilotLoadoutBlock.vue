<template>
  <div class="pb-3">
    <section-header title="Gear Loadout" />
    <cc-pilot-loadout :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';

export default {
  name: 'pilot-loadout-block',
  components: { SectionHeader },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
