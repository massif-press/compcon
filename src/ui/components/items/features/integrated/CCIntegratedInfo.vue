<template>
  <component :is="hover
    ? integratedInfoHover
    : panel
      ? integratedInfoPanel
      : integratedInfoPopup
    "
    :item="item" />
</template>

<script setup lang="ts">
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';
import integratedInfoHover from './_integratedInfoHover.vue';
import integratedInfoPanel from './_integratedInfoPanel.vue';
import integratedInfoPopup from './_integratedInfoPopup.vue';

const props = withDefaults(defineProps<{
  item: MechEquipment
  popup?: boolean
  panel?: boolean
  hover?: boolean
}>(), {
  popup: true,
})
</script>
