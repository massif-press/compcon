<template>
  <div>
    <span class="heading h2 text--text">{{ cs.Name }}</span>
    <p class="flavor-text" v-html="cs.Description" />

    <div v-if="cs.Passive">
      <span class="heading sub">PASSIVE</span>
      <p class="effect-text panel pa-2" v-html="cs.Passive" />
    </div>

    <span class="heading sub">ACTIVE {{ cs.Active ? ` - ${cs.Active}` : '' }}</span>
    <p class="effect-text panel-block pa-2" v-html="cs.Effect" />

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
