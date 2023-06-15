<template>
  <equipment-card-base :item="item">
    <v-row align="center">
      <v-col cols="auto">
        <cc-range-element :range="item.Range" />
      </v-col>
      <v-divider vertical class="mx-4" />
      <v-col cols="auto">
        <cc-damage-element :damage="item.Damage" :type-override="item.DamageTypeOverride" />
      </v-col>
      <v-col v-if="item.InLcp" cols="auto" class="ml-auto text-right">
        <div class="heading h3 text-text">{{ item.LcpName }}</div>
      </v-col>
    </v-row>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-pilot-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
