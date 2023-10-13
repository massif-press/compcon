<template>
  <pilot-print v-if="selectedPilot" :pilot="selectedPilot" />
  <page-break v-if="selectedPilot.BondController.Bond" />
  <bonds-print v-if="selectedPilot.BondController.Bond" :bc="selectedPilot.BondController" />
  <page-break v-if="selectedMech" />
  <mech-print v-if="selectedMech" :mech="selectedMech" />
</template>

<script lang="ts">
import PilotPrint from './PilotPrint.vue';
import BondsPrint from './BondsPrint.vue';
import MechPrint from './MechPrint.vue';

import { Pilot, Mech } from '@/class';
import PageBreak from '../../components/PageBreak.vue';

export default {
  name: 'terse-print',
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
  },
  data: () => ({
    selectedPilot: null as Pilot | null,
    selectedMech: null as Mech | null,
  }),
};
</script>
