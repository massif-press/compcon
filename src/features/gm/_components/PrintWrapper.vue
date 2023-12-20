<template>
  <div v-if="item && component">
    <component :is="component" :item="item" />
    <v-bottom-navigation fixed grow horizontal color="primary" class="no-print">
      <v-btn @click="$router.go(-1)">
        <span>Close Preview</span>
        <v-icon icon="mdi-close" />
      </v-btn>
      <v-spacer />
      <v-btn disabled>
        <span>Options</span>
        <v-icon icon="mdi-settings" />
      </v-btn>
      <v-btn @click="print()">
        <span>Print</span>
        <v-icon icon="print" />
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import { NpcStore, NarrativeStore } from '@/stores';
import NpcPrintContent from '../npc_roster/npcs/_components/NpcPrintContent.vue';
import CharacterPrintContent from '../narrative/characters/_components/CharacterPrintContent.vue';
import FactionPrintContent from '../narrative/factions/_components/FactionPrintContent.vue';
import LocationPrintContent from '../narrative/locations/_components/LocationPrintContent.vue';

export default {
  name: 'item-print-wrapper',
  components: {
    NpcPrintContent,
    CharacterPrintContent,
    FactionPrintContent,
    LocationPrintContent,
  },
  props: {
    type: { type: String, required: true },
    id: { type: String, required: true },
  },
  data: () => ({
    printWindow: false,
  }),
  computed: {
    item() {
      if (!this.id) return null;
      switch (this.type.toLowerCase()) {
        case 'character':
          return NarrativeStore().Characters.find((x) => x.ID === this.id);
        case 'location':
          return NarrativeStore().Locations.find((x) => x.ID === this.id);
        case 'faction':
          return NarrativeStore().Factions.find((x) => x.ID === this.id);
        default:
          return NpcStore().Npcs.find((x) => x.ID === this.id());
      }
    },
    component() {
      if (!this.item) return null;
      switch (this.type.toLowerCase()) {
        case 'character':
          return CharacterPrintContent;
        case 'location':
          return LocationPrintContent;
        case 'faction':
          return FactionPrintContent;
        default:
          return NpcPrintContent;
      }
    },
    options() {
      return {
        margin: [1, 10],
        filename: `${this.item.Name}.pdf`,
      };
    },
  },
  methods: {
    print() {
      window.print();
    },
  },
};
</script>

<style scoped>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }

  .print-main {
    margin-top: -60px !important;
  }

  .print-main * {
    font-size-adjust: 0.5;
  }
}
</style>
