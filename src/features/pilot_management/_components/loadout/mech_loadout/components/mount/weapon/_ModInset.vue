<template>
  <cc-panel flat
    tile
    :title="mod.Name"
    title-color="mod"
    icon="cc:weaponmod"
    class="mb-1">
    <template #toolbar-items>
      <v-btn size="x-small"
        icon
        variant="plain"
        @click.stop="$emit('remove-mod')">
        <v-icon size="20"
          class="pt-1"
          icon="mdi-delete" />
      </v-btn>
    </template>
    <v-card-text class="pa-0 pb-1">
      <equipment-header :item="mod"
        :use-bonus="mech.LimitedBonus" />
      <equipment-details :item="mod"
        :mech="mech"
        :color="color"
        synergy-location="mod" />

      <cc-solo-modal v-model="detailDialog"
        :title="mod.Name"
        icon="cc:weaponmod"
        shrink>
        <cc-item-card :item="mod" />
      </cc-solo-modal>
    </v-card-text>
  </cc-panel>
</template>

<script lang="ts">
import EquipmentHeader from '../../_EquipmentHeader.vue';
import EquipmentDetails from '../../_EquipmentDetails.vue';
import { useMobile } from '@/mixins/useMobile';

export default {
  name: 'mod-inset',
  components: { EquipmentHeader, EquipmentDetails },
  mixins: [useMobile],
  props: {
    mod: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    detailDialog: false,
  }),
};
</script>

<style scoped>
.mod-border {
  border: 1px solid darkslategray;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}
</style>
