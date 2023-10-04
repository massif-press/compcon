<template>
  <div class="mt-5">
    <section-header title="Equipment Loadout" class="mb-5" />
    <cc-mech-loadout :mech="mech" class="px-3" />
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
