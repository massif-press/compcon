<template>
  <equipment-card-base :item="item" :notes="notes">
    <v-row align="center">
      <v-col v-if="item.SP" cols="auto" class="text-center">
        <div class="panel clipped">
          <v-icon v-for="n in item.SP" size="x-large">cc:system_point</v-icon>
        </div>
        <span class="text-overline">
          <b>{{ item.SP }}</b>
          SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}
        </span>
      </v-col>
      <v-col v-if="item.LicenseString" cols="auto" class="ml-auto text-right">
        <div class="heading h2">{{ item.Type }}</div>
        <span class="flavor-text text-disabled">// {{ item.LicenseString }}</span>
        <div v-if="item.InLcp" class="flavor-text text-disabled">
          {{ item.LcpName }}
        </div>
      </v-col>
    </v-row>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-mech-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
  },
};
</script>
