<template>
  <cc-item-card :item="item" />
</template>

<script setup lang="ts">
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';

const props = defineProps<{
  item: MechEquipment
}>()
</script>
