<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -50px!important">
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
    <v-container class="px-0">
      <no-data-block v-if="!pilot.CoreBonuses.length" />
      <v-row v-else dense justify="center">
        <v-col
          v-for="(b, i) in pilot.CoreBonuses"
          :key="`b_${i}`"
          cols="12"
          md=""
          :style="$vuetify.breakpoint.mdAndUp ? 'min-width: 500px;' : ''"
        >
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
