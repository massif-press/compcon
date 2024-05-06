<template>
  <section-header title="Licenses Required" />
  <div class="px-10 py-3">
    <requirement-item v-for="l in requirements" :license="l" />
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../../components/SectionHeader.vue';
import RequirementItem from './RequirementItem.vue';

export default {
  name: 'license-requirements-block',
  components: { RequirementItem, SectionHeader },
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
  computed: {
    requirements() {
      return this.mech.RequiredLicenses;
    },
  },
};
</script>
