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
    <v-container :fluid="!!pilot.CoreBonuses.length">
      <no-data-block v-if="!pilot.CoreBonuses.length" />
      <v-row v-else dense justify="center">
        <v-col v-for="(b, i) in pilot.CoreBonuses" :key="`b_${i}`" md="12" lg="6" xl="4">
          <cc-core-bonus-item :bonus="b" />
        </v-col>
      </v-row>
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
