<template>
  <div class="printable" style="width: 100%">
    <div class="no-print" style="min-height: 48px!important" />
    <pilot-print :pilot="pilot" />
    <div style="page-break-before: always;"></div>
    <mech-print v-if="mech" :mech="mech" />
    <print-footer />
    <div class="no-print" style="min-height: 60px!important" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotPrint from './PilotPrint.vue'
import MechPrint from './MechPrint.vue'
import PrintFooter from './PrintFooter.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'combined-print',
  components: { PilotPrint, MechPrint, PrintFooter },
  props: {
    pilotID: {
      type: String,
      required: true,
    },
    mechID: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    pilot: null,
    mech: null,
  }),
  created() {
    const store = getModule(PilotManagementStore, this.$store)
    this.pilot = store.ActivePilot
    this.mech = this.pilot.ActiveMech
    // if (this.mechID) {
    //   this.mech = store.ActivePilot.Mechs.find(x => x.ID === this.mechID)
    // }
  },
})
</script>

<style scoped>
@page {
  size: A4;
  margin: 0;
}
@media print {
  .printable {
    zoom: 50%;
  }
  .caption {
    line-height: 0 !important;
  }
  fieldset {
    padding: 0px;
  }
}
</style>
