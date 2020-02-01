<template>
  <div>
    <span class="heading h2 text--text">{{ cs.Name }}</span>
    <p class="flavor-text" v-html="cs.Description" />

    <div v-if="cs.PassiveEffect">
      <span class="heading sub">PASSIVE {{ cs.PassiveName ? ` - ${cs.PassiveName}` : '' }}</span>
      <p class="effect-text light-panel pa-2 clipped" v-html="cs.PassiveEffect" />
    </div>

    <span class="heading sub">ACTIVE {{ cs.ActiveName ? ` - ${cs.ActiveName}` : '' }}</span>
    <p class="effect-text light-panel pa-2 clipped" v-html="cs.ActiveEffect" />

    <div v-if="cs.Integrated">
      <span class="heading sub">CORE INTEGRATED WEAPON - {{ cs.Integrated.Name }}</span>
      <div class="panel-block pa-2 mt-1 mb-3">
        <mech-weapon-card :item="cs.Integrated" />
      </div>
    </div>

    <cc-tags :tags="cs.Tags" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechWeaponCard from '../_MechWeaponCard.vue'

export default Vue.extend({
  name: 'cc-frame-core-system-panel',
  components: { MechWeaponCard },
  props: {
    cs: {
      type: Object,
      required: true,
    },
  },
})
</script>
