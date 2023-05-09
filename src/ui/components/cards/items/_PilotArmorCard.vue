<template>
  <equipment-card-base :item="item">
    <template #title>
      <v-row v-if="item.InLcp">
        <div class="heading h3 text-text">{{ item.LcpName }}</div>
      </v-row>
    </template>
    <template #statblock>
      <v-row density="compact" justify="center">
        <cc-statblock-panel icon="$vuetify.icons.armor" name="Armor" :value="item.ArmorString" />
        <cc-statblock-panel icon="$vuetify.icons.hp" name="HP Bonus" :value="`+${item.HpString}`" />
        <cc-statblock-panel icon="$vuetify.icons.edef" name="E-Defense" :value="item.EdefString" />
        <cc-statblock-panel
          icon="$vuetify.icons.evasion"
          name="Evasion"
          :value="item.EvasionString"
        />
        <cc-statblock-panel icon="$vuetify.icons.speed" name="Speed" :value="item.SpeedString" />
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
};
</script>
