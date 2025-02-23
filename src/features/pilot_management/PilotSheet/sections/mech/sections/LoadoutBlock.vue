<template>
  <div class="mt-5">
    <section-header title="Equipment Loadout" class="mb-4" />
    <cc-mech-loadout :mech="mech" :readonly="mech.Pilot.IsRemote" />
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';

export default {
  name: 'license-requirements-block',
  components: { SectionHeader },
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
};
</script>
