<template>
  <div>
    <cc-title large>Hangar&emsp;</cc-title>
    <v-btn-toggle id="viewtoggle" v-model="listOption" mandatory>
      <v-btn small icon>
        <v-icon color="primary">mdi-view-grid</v-icon>
      </v-btn>
      <v-btn small icon>
        <v-icon color="primary">mdi-view-list</v-icon>
      </v-btn>
      <v-btn small icon>
        <v-icon color="primary">mdi-format-align-justify</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-container v-if="listOption === 0" fluid>
      <v-row>
        <mech-card v-for="n in 5" :key="`${n}_mc`" />
      </v-row>
    </v-container>
    <v-container v-else-if="listOption === 1" fluid class="mt-2">
      <mech-list-item v-for="n in 5" :key="`${n}_mc`" />
    </v-container>
    <v-container v-else fluid>
      <mech-table />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechCard from './components/MechCard.vue'
import MechListItem from './components/MechListItem.vue'
import MechTable from './components/MechTable.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'mech-hangar-view',
  components: { MechCard, MechListItem, MechTable },
  data: () => ({
    listOption: 0,
  }),
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
    },
  },
})
</script>

<style scoped>
#viewtoggle {
  position: absolute;
  left: calc(100vw - 325px);
  top: 190px;
  z-index: 4;
}
</style>