<template>
  <div v-if="npc">
    <npc-print-content :item="npc" />
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
import { NpcStore } from '@/stores';
import NpcPrintContent from './_components/NpcPrintContent.vue';

export default {
  name: 'npc-print-base',
  components: { NpcPrintContent },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    printWindow: false,
  }),
  methods: {
    print() {
      window.print();
    },
  },
  computed: {
    npc() {
      return this.getModule(NpcStore).Npcs.find(
      //   (x) => x.ID === this.id
      // );
    },
    options() {
      return {
        margin: [1, 10],
        filename: `${this.npc.Name}.pdf`,
      };
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
