<template>
  <equipment-card-base :item="item" :dense="dense" small-tags :footer="dense" :tier="tier" />
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-npc-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapseActions: {
      type: Boolean,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
