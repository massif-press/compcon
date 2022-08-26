<template>
  <div>
    <div v-for="(i, n) in items" :key="`item_${n}`" class="print-main">
      <component :is="component" :item="i" />
      <v-divider style="page-break-before: avoid" />
    </div>
    <v-bottom-navigation fixed grow horizontal color="primary" class="no-print">
      <v-btn @click="$router.go(-1)">
        <span>Close Preview</span>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn disabled>
        <span>Options</span>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
      <v-btn @click="print()">
        <span>Print</span>
        <v-icon>print</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore, CharacterStore, LocationStore, FactionStore } from '@/store'
import NpcPrintContent from '../npcs/_components/NpcPrintContent.vue'
import CharacterPrintContent from '../characters/_components/CharacterPrintContent.vue'
import LocationPrintContent from '../locations/_components/LocationPrintContent.vue'
import FactionPrintContent from '../factions/_components/FactionPrintContent.vue'

export default Vue.extend({
  name: 'gm-mass-print',
  props: { type: { type: String, required: true }, ids: { type: String, required: true } },
  data: () => ({
    printWindow: false,
  }),
  computed: {
    items() {
      const arr = this.ids.split(',')
      switch (this.type.toLowerCase()) {
        case 'npc':
          return getModule(NpcStore, this.$store).Npcs.filter(x => arr.includes(x.ID))
        case 'character':
          return getModule(CharacterStore, this.$store).Characters.filter(x => arr.includes(x.ID))
        case 'location':
          return getModule(LocationStore, this.$store).Locations.filter(x => arr.includes(x.ID))
        case 'faction':
          return getModule(FactionStore, this.$store).Factions.filter(x => arr.includes(x.ID))
        default:
          return []
      }
    },
    component() {
      switch (this.type.toLowerCase()) {
        case 'npc':
          return NpcPrintContent
        case 'character':
          return CharacterPrintContent
        case 'location':
          return LocationPrintContent
        case 'faction':
          return FactionPrintContent
        default:
          return null
      }
    },
  },
  methods: {
    print() {
      window.print()
    },
  },
})
</script>

<style scoped>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }

  .print-main {
    margin: 0;
    margin-top: -80px !important;
  }

  .print-main * {
    font-size-adjust: 0.5;
  }
}
</style>
