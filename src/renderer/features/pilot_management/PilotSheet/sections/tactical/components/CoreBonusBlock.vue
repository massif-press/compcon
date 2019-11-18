<template>
  <div>
    <cc-title small color="pilot">
      <section-edit-chip
        :highlight="!pilot.HasCBs"
        :current="pilot.CurrentCBPoints"
        :max="pilot.MaxCBPoints"
        :label="`Edit Pilot CORE Bonuses (${pilot.CurrentCBPoints}/${pilot.MaxCBPoints})`"
        @open-selector="$refs.bonusSelector.show()"
      />
      CORE Bonuses
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
      <no-data-block v-if="!pilot.CoreBonuses.length" />
      <cc-core-bonus-item v-for="(b, i) in pilot.CoreBonuses" v-else :key="`b_${i}`" :bonus="b" />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditChip from '../../components/SectionEditChip.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'

export default Vue.extend({
  name: 'skill-block',
  components: { NoDataBlock, SectionEditChip },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
