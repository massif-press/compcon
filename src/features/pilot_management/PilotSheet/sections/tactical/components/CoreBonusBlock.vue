<template>
  <div>
    <section-header title="CORE Bonuses">
      <section-edit-chip
        v-if="!pilot.IsRemote"
        :highlight="!pilot.CoreBonusController.HasCBs"
        :current="pilot.CoreBonusController.CurrentCBPoints"
        :max="pilot.CoreBonusController.MaxCBPoints"
        :label="`Edit Pilot CORE Bonuses (${pilot.CoreBonusController.CurrentCBPoints}/${pilot.CoreBonusController.MaxCBPoints})`"
        @open-selector="($refs as any).bonusSelector.show()" />
    </section-header>

    <cc-solo-dialog
      ref="bonusSelector"
      icon="cc:corebonus"
      no-confirm
      title="Set Pilot CORE Bonuses"
      fullscreen>
      <core-bonus-selector :pilot="pilot" modal />
    </cc-solo-dialog>
    <v-container class="px-0">
      <no-data-block v-if="!pilot.CoreBonusController.CoreBonuses.length" />
      <v-row v-else density="compact" justify="center">
        <v-col
          v-for="(b, i) in pilot.CoreBonusController.CoreBonuses"
          cols="12"
          md=""
          :style="$vuetify.display.mdAndUp ? 'min-width: 500px;' : ''">
          <cc-core-bonus-item :bonus="b" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import CoreBonusSelector from '@/features/pilot_management/_components/selectors/CoreBonusSelector.vue';

export default {
  name: 'skill-block',
  components: { SectionHeader, NoDataBlock, SectionEditChip, CoreBonusSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
