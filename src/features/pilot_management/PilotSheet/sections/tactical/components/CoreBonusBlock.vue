<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -50px !important">
      <section-edit-chip
        :highlight="!pilot.CoreBonusController.HasCBs"
        :current="pilot.CoreBonusController.CurrentCBPoints"
        :max="pilot.CoreBonusController.MaxCBPoints"
        :label="`Edit Pilot CORE Bonuses (${pilot.CoreBonusController.CurrentCBPoints}/${pilot.CoreBonusController.MaxCBPoints})`"
        @open-selector="($refs as any).bonusSelector.show()"
      />
      CORE Bonuses
    </cc-title>
    <cc-solo-dialog
      ref="bonusSelector"
      icon="cc:corebonus"
      no-confirm
      title="Set Pilot CORE Bonuses"
      fullscreen
    >
      <cc-core-bonus-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-container class="px-0">
      <no-data-block v-if="!pilot.CoreBonusController.CoreBonuses.length" />
      <v-row v-else density="compact" justify="center">
        <v-col
          v-for="(b, i) in pilot.CoreBonusController.CoreBonuses"
          cols="12"
          md=""
          :style="$vuetify.display.mdAndUp ? 'min-width: 500px;' : ''"
        >
          <cc-core-bonus-item :bonus="b" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';

export default {
  name: 'skill-block',
  components: { NoDataBlock, SectionEditChip },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
