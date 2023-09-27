<template>
  <section-header :title="`${mech.Frame.Source} ${mech.Frame.Name} Frame Traits`" />
  <cc-trait-item v-for="t in mech.Frame.Traits" :trait="t" :color="color" class="ma-3" />
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
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>
