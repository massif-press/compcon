<template>
  <v-navigation-drawer
    :value="true"
    :mini-variant="mini"
    app
    right
    permanent
    mini-variant-width="30"
    width="550px"
    style="z-index: 1; position: fixed; height: 100%;"
  >
    <div class="panel-expander">
      <v-row align="center" style="height: 100%" @click.stop="mini = !mini">
        <v-col cols="auto">
          <v-icon v-if="mini" large dark class="pr-1">mdi-chevron-double-left</v-icon>
          <v-icon v-else large dark class="pr-1">mdi-chevron-double-right</v-icon>
        </v-col>
      </v-row>
    </div>

    <div style="min-height: 40px" />
    <v-fade-transition group>
      <v-window
        v-if="!mini"
        key="trw-1"
        v-model="step"
        class="background pa-1"
        style="height:100%; margin-left: 40px;"
      >
        <downtime-manager ref="dt" :pilot="pilot" @end="startCombat()" />
        <turn-manager ref="turn" :pilot="pilot" @end="endCombat()" />
        <rest-manager ref="rest" :pilot="pilot" @restart="startCombat()" @end="startDowntime()" />
      </v-window>
    </v-fade-transition>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import TurnManager from './Mission/TurnManager.vue'
import RestManager from './Mission/RestManager.vue'
import DowntimeManager from './Downtime/DowntimeManager.vue'

export default Vue.extend({
  name: 'turn-sidebar',
  components: { TurnManager, RestManager, DowntimeManager },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    mini: true,
  }),
  computed: {
    step() {
      const stage = this.pilot.ActiveMech.State.stage
      switch (stage) {
        case 'Rest':
          return 2
        case 'Combat':
          return 1
        default:
          return 0
      }
    },
  },
  methods: {
    startCombat() {
      this.pilot.ActiveMech.State.stage = 'Combat'
    },
    endCombat() {
      this.pilot.ActiveMech.State.stage = 'Rest'
      this.$refs.rest.startRest()
    },
    startDowntime() {
      this.pilot.ActiveMech.State.stage = 'Downtime'
    },
  },
})
</script>

<style scoped>
.panel-expander {
  position: fixed;
  height: 100%;
  background-color: var(--v-primary-darken2);
  padding-top: 40px;
  opacity: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.panel-expander:hover {
  opacity: 0.6;
}
</style>
