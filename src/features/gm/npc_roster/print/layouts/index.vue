<template>
  <div v-for="(n, i) in npcs" :key="(n as any).ID" class="py-1 mb-1">
    <component :is="getComponentByType(n)" :npc="<Npc>n" :options="options" />
    <page-break v-if="i + 1 < npcs.length" />
  </div>
</template>

<script setup lang="ts">
import UnitPrint from './UnitPrint.vue';
import EidolonPrint from './EidolonPrint.vue';
import DoodadPrint from './DoodadPrint.vue';
import PageBreak from '@/features/pilot_management/Print/components/PageBreak.vue';
import { Npc } from '@/classes/npc/Npc';

defineOptions({ name: 'combined-print' })

const props = defineProps<{
  npcs: Npc[]
  options: object
}>()

function getComponentByType(npc) {
      switch (npc.ItemType) {
        case 'Unit':
          return UnitPrint;
        case 'Eidolon':
          return EidolonPrint;
        default:
          return DoodadPrint;
      }
    }
</script>
