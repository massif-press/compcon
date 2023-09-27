<template>
  <section-header title="Licenses Required" />
  <v-row class="px-10 py-3">
    <v-col>
      <requirement-item v-for="l in mech.RequiredLicenses" :license="l" />
    </v-col>
  </v-row>
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
};
</script>
