<template>
  <div style="display: block">
    <pilot-print v-if="selectedPilot" :pilot="selectedPilot" :options="options" />
    <page-break v-if="showBondPrint" />
    <bonds-print v-if="showBondPrint" :bc="selectedPilot.BondController" :options="options" />
    <page-break v-if="selectedMech" />
    <mech-print v-if="selectedMech" :mech="selectedMech" :options="options" />
  </div>
</template>

<script lang="ts">
import PilotPrint from './PilotPrint.vue';
import BondsPrint from '../../extras/BondsPrint.vue';
import MechPrint from './MechPrint.vue';

import { Pilot, Mech } from '@/class';
import PageBreak from '../../components/PageBreak.vue';

export default {
  name: 'minimal-print',
  components: {
    PilotPrint,
    BondsPrint,
    MechPrint,
    PageBreak,
  },
  props: {
    selectedPilot: {
      type: Pilot,
      required: true,
    },
    selectedMech: {
      type: Mech,
      required: false,
    },
    options: {
      type: Object,
      required: true,
    },
    hasBonds: {
      type: Boolean,
    },
  },
  computed: {
    showBondPrint() {
      if (!this.selectedPilot) return false;
      if (!this.hasBonds) return false;
      if (this.options.bonds === 'omit') return false;
      return this.options.content === 'blank' || this.selectedPilot.BondController.Bond;
    },
  },
};
</script>
