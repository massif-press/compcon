<template>
  <equipment-card-base :item="item" small-tags>
    <v-col cols="auto" class="ml-auto text-right">
      <div v-if="item.InLcp" class="flavor-text text-disabled">
        {{ item.LcpName }}
      </div>
    </v-col>
  </equipment-card-base>
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
  },
};
</script>
