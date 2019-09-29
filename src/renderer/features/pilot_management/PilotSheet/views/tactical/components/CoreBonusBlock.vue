<template>
  <div>
    <cc-title small>
      <section-edit-chip
        :highlight="!pilot.HasCBs"
        :current="pilot.CurrentCBPoints"
        :max="pilot.MaxCBPoints"
        :label="`Edit Pilot CORE Bonuses (${pilot.CurrentCBPoints}/${pilot.MaxCBPoints})`"
        @open-selector="$refs.bonusSelector.show()"
      />CORE Bonuses
    </cc-title>
    <cc-solo-dialog
      ref="bonusSelector"
      icon="cci-corebonus"
      no-confirm
      title="Set Pilot CORE Bonuses"
      fullscreen
    >
      <cc-core-bonus-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-container>
      <cc-core-bonus-item v-for="(b, i) in pilot.CoreBonuses" :key="`b_${i}`" :bonus="b" />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditChip from '../../components/SectionEditChip.vue'

export default Vue.extend({
  name: 'skill-block',
  components: { SectionEditChip },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>