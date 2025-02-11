<template>
  <equipment-card-base :item="item" :dense="dense">
    <template #title>
      <v-row v-if="item.InLcp">
        <div class="heading h3 text-text">{{ item.LcpName }}</div>
      </v-row>
    </template>
    <template #statblock>
      <v-row dense justify="center">
        <cc-statblock-panel icon="mdi-shield" name="Armor" :value="item.ArmorString" />
        <cc-statblock-panel icon="mdi-heart" name="HP Bonus" :value="`+${item.HpString}`" />
        <cc-statblock-panel icon="cc:e_def" name="E-Defense" :value="item.EdefString" />
        <cc-statblock-panel icon="cc:evasion" name="Evasion" :value="item.EvasionString" />
        <cc-statblock-panel
          icon="mdi-arrow-right-bold-hexagon-outline"
          name="Speed"
          :value="item.SpeedString" />
      </v-row>
    </template>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'pilot-armor-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
    },
  },
};
</script>
