<template>
  <div style="display: block">
    <pilot-print v-if="selectedPilot"
      :pilot="selectedPilot"
      :options="options" />
    <page-break v-if="showBondPrint"
      silent />
    <bonds-print v-if="showBondPrint"
      :bc="selectedPilot.BondController"
      :options="options" />
    <page-break v-if="selectedMech" />
    <mech-print v-if="selectedMech"
      :mech="selectedMech"
      :options="options" />
  </div>
</template>

<script lang="ts">
import PilotPrint from './PilotPrint.vue';
import BondsPrint from '../../extras/BondsPrint.vue';
import MechPrint from './MechPrint.vue';
import PageBreak from '../../components/PageBreak.vue';
import { usePrintLayout } from '../_usePrintLayout';

export default {
  name: 'minimal-print',
  mixins: [usePrintLayout],
  components: { PilotPrint, BondsPrint, MechPrint, PageBreak },
};
</script>
