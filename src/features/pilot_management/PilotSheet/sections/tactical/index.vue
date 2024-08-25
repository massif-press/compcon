<template>
  <v-container>
    <license-block :pilot="pilot" class="mb-4" />
    <special-block :pilot="pilot" class="mb-4" />
    <mech-skills-block :pilot="pilot" class="my-4" />
    <core-bonus-block :pilot="pilot" class="my-4" />
    <talent-block :pilot="pilot" class="mt-4" />
  </v-container>
</template>

<script lang="ts">
import MechSkillsBlock from './components/MechSkillsBlock.vue';
import LicenseBlock from './components/LicenseBlock.vue';
import SpecialBlock from './components/SpecialBlock.vue';
import CoreBonusBlock from './components/CoreBonusBlock.vue';
import TalentBlock from './components/TalentBlock.vue';

export default {
  name: 'tactical-view',
  components: {
    MechSkillsBlock,
    SpecialBlock,
    LicenseBlock,
    CoreBonusBlock,
    TalentBlock,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
