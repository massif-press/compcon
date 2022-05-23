<template>
  <div v-if="item && component">
    <component :is="component" :item="item" />
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
import FactionPrintContent from '../factions/_components/FactionPrintContent.vue'
import LocationPrintContent from '../locations/_components/LocationPrintContent.vue'

export default Vue.extend({
  name: 'item-print-wrapper',
  components: { NpcPrintContent, CharacterPrintContent, FactionPrintContent, LocationPrintContent },
  props: {
    type: { type: String, required: true },
    id: { type: String, required: true },
  },
  data: () => ({
    printWindow: false,
  }),
  computed: {
    item() {
      if (!this.id) return null
      switch (this.type.toLowerCase()) {
        case 'character':
          return getModule(CharacterStore, this.$store).Characters.find(x => x.ID === this.id)
        case 'location':
          return getModule(LocationStore, this.$store).Locations.find(x => x.ID === this.id)
        case 'faction':
          return getModule(FactionStore, this.$store).Factions.find(x => x.ID === this.id)
        default:
          return getModule(NpcStore, this.$store).Npcs.find(x => x.ID === this.id)
      }
    },
    component() {
      if (!this.item) return null
      switch (this.type.toLowerCase()) {
        case 'character':
          return CharacterPrintContent
        case 'location':
          return LocationPrintContent
        case 'faction':
          return FactionPrintContent
        default:
          return NpcPrintContent
      }
    },
    options() {
      return {
        margin: [1, 10],
        filename: `${this.item.Name}.pdf`,
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
    margin-top: -60px !important;
  }

  .print-main * {
    font-size-adjust: 0.5;
  }
}
</style>
