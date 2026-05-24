<template>
  <equipment-card-base :item="item"
    :dense="dense">
    <div v-if="item.InLcp"
      class="heading h3 text-text text-right">{{ item.LcpName }}</div>
  </equipment-card-base>
</template>

<script setup lang="ts">
import { PilotGear } from '@/classes/pilot/components/Loadout/equipment/PilotGear';
import EquipmentCardBase from './_EquipmentCardBase.vue'

defineProps<{
  item: PilotGear
  dense?: boolean
}>()
</script>
