<template>
  <equipment-card-base :item="item" :notes="notes">
    <v-row align="center">
      <v-col v-if="item.SP" cols="auto" class="text-center">
        <div class="heading h2 mb-n2">
          {{ item.SP }}
          <v-icon icon="cc:system_point" class="mt-n2 ml-n2" />
        </div>
        <span class="text-overline">SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}</span>
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
