<template>
  <div>
    <license-block :pilot="pilot" />
    <mech-skills-block :pilot="pilot" />
    <core-bonus-block :pilot="pilot" />
    <talent-block :pilot="pilot" />
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