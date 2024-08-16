<template>
  <equipment-card-base :item="item" :dense="dense">
    <div v-if="item.InLcp" class="heading h3 text-text text-right">{{ item.LcpName }}</div>
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
    dense: {
      type: Boolean,
    },
  },
};
</script>
