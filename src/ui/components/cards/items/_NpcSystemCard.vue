<template>
  <equipment-card-base
    :item="item"
    :dense="dense"
    :collapse-actions="collapseActions"
    small-tags
    :footer="dense" />
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-npc-system-card',
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
  },
};
</script>
