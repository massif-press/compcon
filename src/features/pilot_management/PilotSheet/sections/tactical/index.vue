<template>
  <div>
    <license-block :pilot="pilot" class="mb-4" />
    <mech-skills-block :pilot="pilot" class="my-4" />
    <core-bonus-block :pilot="pilot" class="my-4" />
    <talent-block :pilot="pilot" class="mt-4" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechSkillsBlock from './components/MechSkillsBlock.vue'
import LicenseBlock from './components/LicenseBlock.vue'
import CoreBonusBlock from './components/CoreBonusBlock.vue'
import TalentBlock from './components/TalentBlock.vue'

export default Vue.extend({
  name: 'tactical-view',
  components: { MechSkillsBlock, LicenseBlock, CoreBonusBlock, TalentBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
