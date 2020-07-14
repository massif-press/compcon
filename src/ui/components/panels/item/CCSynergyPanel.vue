<template>
  <cc-tooltip title="TALENT SYNERGIES" :content="synergies">
    <span v-show="synergyCount">
      <v-icon large color="accent">cci-talent</v-icon>
    </span>
  </cc-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { TalentDecorator } from '@/class'
export default Vue.extend({
  name: 'cc-synergy-panel',
  props: {
    location: { type: String, required: true },
    item: { type: Object, required: true },
    pilot: { type: Object, required: true },
  },
  computed: {
    synergyCount() {
      return TalentDecorator.Collect(this.item, this.pilot, this.location).length
    },
    synergies() {
      let str = ''
      TalentDecorator.Collect(this.item, this.pilot, this.location).forEach(s => {
        str += `<div class="caption font-weight-bold accent--text">${s.title}</div><div class="mb-2">${s.synergy.detail}</div>`
      })
      return str
    },
  },
})
</script>
