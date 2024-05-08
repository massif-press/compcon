<template>
  <div v-for="(n, i) in npcs" class="py-1 mb-1">
    <component :is="getComponentByType(n)" :npc="<Npc>n" :options="options" />
    <page-break v-if="i + 1 < npcs.length" />
  </div>
</template>

<script lang="ts">
import UnitPrint from './UnitPrint.vue';
import EidolonPrint from './EidolonPrint.vue';
import DoodadPrint from './DoodadPrint.vue';
import PageBreak from '../components/PageBreak.vue';
import { Npc } from '@/classes/npc/Npc';

export default {
  name: 'combined-print',
  components: {
    PageBreak,
  },
  props: {
    npcs: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getComponentByType(npc) {
      switch (npc.ItemType) {
        case 'Unit':
          return UnitPrint;
        case 'Eidolon':
          return EidolonPrint;
        default:
          return DoodadPrint;
      }
    },
  },
};
</script>
