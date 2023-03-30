<template>
  <equipment-card-base :item="item">
    <v-row v-if="item.InLcp">
      <div class="heading h3 text-text">{{ item.LcpName }}</div>
    </v-row>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'PilotGearCard',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
