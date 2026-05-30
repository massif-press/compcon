<template>
  <equipment-card-base :item="item"
    :dense="dense"
    small-tags
    :footer="dense"
    :tier="tier" />
</template>

<script setup lang="ts">
import { NpcTrait } from '@/classes/npc/feature/NpcItem/NpcTrait';
import EquipmentCardBase from './_EquipmentCardBase.vue'
withDefaults(defineProps<{
  item: NpcTrait
  dense?: boolean
  collapseActions?: boolean
  tier?: number
}>(), {
  dense: false,
})
</script>
