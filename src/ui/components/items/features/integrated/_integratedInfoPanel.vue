<template>
  <cc-alert density="compact" :color="item.Color" class="light-panel pb-1">
    <v-row v-if="item.ItemType === 'MechWeapon'" class="text-stark mb-n3" no-gutters align="center">
      <v-col>
        <v-icon large left class="mt-n2">cc:weapon</v-icon>
        <span class="heading h3">{{ item.Name }}</span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <span class="text-overline">INTEGRATED MECH WEAPON</span>
      </v-col>
    </v-row>
    <integrated-info-base :item="item" />
  </cc-alert>
</template>

<script lang="ts">
import integratedInfoBase from './_integratedInfoBase.vue';

export default {
  name: 'integrated-info-panel',
  components: { integratedInfoBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
