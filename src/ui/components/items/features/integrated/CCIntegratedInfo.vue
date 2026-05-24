<template>
  <component :is="getComponent"
    :item="item" />
</template>

<script setup lang="ts">
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';
import integratedInfoHover from './_integratedInfoHover.vue';
import integratedInfoPanel from './_integratedInfoPanel.vue';
import integratedInfoPopup from './_integratedInfoPopup.vue';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  item: MechEquipment
  popup?: boolean
  panel?: boolean
  hover?: boolean
}>(), {
  popup: true,
})

const getComponent = computed(() => {
  if (props.hover) return integratedInfoHover
  else if (props.panel) return integratedInfoPanel
  else return integratedInfoPopup
})
</script>
