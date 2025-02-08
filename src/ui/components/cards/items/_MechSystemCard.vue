<template>
  <equipment-card-base :item="item" :notes="notes">
    <v-row align="center" no-gutters>
      <v-col v-if="item.SP" cols="auto" class="text-center">
        <div class="heading" style="font-size: 24pt">
          {{ item.SP }}
          <v-icon size="32" class="mt-n1 ml-n1" icon="cc:system_point" />
        </div>
        <div class="text-cc-overline mt-n1">SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}</div>
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
