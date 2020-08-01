<template>
  <div>
    <!-- <span v-if="item && talentSynergyCount" )>
      <cc-tooltip :title="`TALENT SYNERGIES`" :content="talentSynergies">
        <span>
          <v-icon large color="accent">cci-talent</v-icon>
        </span>
      </cc-tooltip>
    </span> -->
    <!-- <span v-if="frame && frameSynergyCount" )>
      <cc-tooltip :title="`FRAME SYNERGIES`" :content="talentSynergies">
        <span v-show="synergyCount">
          <v-icon large color="accent">cci-frame</v-icon>
        </span>
      </cc-tooltip>
    </span> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Synergy } from '@/class'
export default Vue.extend({
  name: 'cc-synergy-panel',
  props: {
    location: { type: String, required: true },
    item: { type: Object, required: false, default: null },
    frame: { type: Object, required: false, default: null },
    pilot: { type: Object, required: true },
  },
  computed: {
    talentSynergyCount() {
      return Synergy.TalentSynergies(this.item, this.pilot, this.location).length
    },
    // frameSynergyCount() {
    //   return Synergy.FrameSynergies(this.frame, this.location).length
    // },
    talentSynergies() {
      let str = ''
      Synergy.TalentSynergies(this.item, this.pilot, this.location).forEach(s => {
        str += `<div class="caption font-weight-bold accent--text">${s.title}</div><div class="mb-2">${s.synergy.detail}</div>`
      })
      return str
    },
    // frameSynergies() {
    //   let str = ''
    //   Synergy.FrameSynergies(this.frame, this.location).forEach(s => {
    //     str += `<div class="caption font-weight-bold accent--text">${s.title}</div><div class="mb-2">${s.synergy.detail}</div>`
    //   })
    //   return str
    // },
  },
})
</script>
