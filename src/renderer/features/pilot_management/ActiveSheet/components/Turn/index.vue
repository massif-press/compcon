<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    absolute
    dark
    right
    mini-variant-width="40"
    width="550px"
    class="elevation-10"
    style="padding-top: 60px; z-index: 9"
  >
    <div class="panel-expander">
      <v-row column fill-height justify="center">
        <v-col cols="6">
          <v-divider dark vertical class="ml-4" />
        </v-col>
        <v-col shrink>
          <v-btn flat icon dark @click.stop="mini = !mini">
            <v-icon large v-if="mini">mdi-chevron-double-left</v-icon>
            <v-icon large v-else>mdi-chevron-double-right</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-divider dark vertical class="ml-4" />
        </v-col>
      </v-row>
    </div>

    <v-fade-transition>
      <v-window
        v-model="step"
        v-show="!mini"
        class="ml-5 white--text"
        style="height:100%; width: 85%"
      >
        <v-window-item>
          <downtime-manager
            ref="dt"
            :mech="mech"
            :loadout="loadout"
            :pilot="pilot"
            @end="startCombat()"
          />
        </v-window-item>
        <v-window-item>
          <turn-manager
            ref="turn"
            :mech="mech"
            :loadout="loadout"
            :pilot="pilot"
            @end="endCombat()"
          />
        </v-window-item>
        <v-window-item>
          <rest-manager
            ref="rest"
            :mech="mech"
            :loadout="loadout"
            @restart="startCombat()"
            @end="startDowntime()"
          />
        </v-window-item>
      </v-window>
    </v-fade-transition>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import TurnManager from './TurnManager.vue'
import RestManager from './RestManager.vue'
import DowntimeManager from './DowntimeManager.vue'

export default Vue.extend({
  name: 'turn-sidebar',
  components: { TurnManager, RestManager, DowntimeManager },
  props: {
    pilot: Object,
    mech: Object,
    loadout: Object,
  },
  data: () => ({
    drawer: true,
    mini: true,
    step: 0,
  }),
  methods: {
    startCombat() {
      this.$refs.turn.restart()
      this.step = 1
      this.$emit('combat')
    },
    endCombat() {
      this.$refs.rest.startRest()
      this.step = 2
    },
    startDowntime() {
      this.step = 0
      this.$emit('downtime')
    },
  },
})
</script>

<style scoped>
.panel-expander {
  position: fixed;
  height: 100%;
}
</style>
