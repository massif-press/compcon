<template>
  <equipment-card-base :item="item">
    <template v-slot:title>
      <v-row v-if="item.InLcp">
        <div class="heading h3 text-text">{{ item.LcpName }}</div>
      </v-row>
    </template>
    <template v-slot:statblock>
      <v-row density="compact" justify="center">
        <cc-statblock-panel icon="mdi-shield" name="Armor" :value="armor" />
        <cc-statblock-panel
          icon="mdi-heart"
          name="HP Bonus"
          :value="`+${hp}`"
        />
        <cc-statblock-panel icon="cc:e_def" name="E-Defense" :value="edef" />
        <cc-statblock-panel icon="cc:evasion" name="Evasion" :value="evasion" />
        <cc-statblock-panel
          icon="mdi-arrow-right-bold-hexagon-outline"
          name="Speed"
          :value="speed"
        />
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
  },
  computed: {
    armor() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_armor');
      return attr ? attr.Value : 0;
    },
    hp() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_hp');
      return attr ? attr.Value : 0;
    },
    edef() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_edef');
      return attr ? attr.Value : 0;
    },
    evasion() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_evasion');
      return attr ? attr.Value : 0;
    },
    speed() {
      const attr = this.item.Bonuses.find((b) => b.ID === 'pilot_speed');
      return attr ? attr.Value : 0;
    },
  },
};
</script>
