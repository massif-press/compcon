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
      <v-layout column fill-height justify-center>
        <v-flex xs6>
          <v-divider dark vertical class="ml-4" />
        </v-flex>
        <v-flex shrink>
          <v-btn flat icon dark @click.stop="mini = !mini">
            <v-icon large v-if="mini">mdi-chevron-double-left</v-icon>
            <v-icon large v-else>mdi-chevron-double-right</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-divider dark vertical class="ml-4" />
        </v-flex>
      </v-layout>
    </div>
    <v-fade-transition>
      <v-window
        v-show="!mini"
        v-model="step"
        class="ml-5 white--text"
        style="height:100%; width: 85%"
      >
        <v-window-item :value="0">
          <v-layout column fill-height>
            <v-flex xs12 class="major-title text-xs-center">
              <span>DOWNTIME</span>
            </v-flex>
          </v-layout>
          <v-divider class="ma-2" dark />
          <div class="ma-2 pt-3">
            <action-button action-id="action_poweratcost" class="mb-1" />
            <action-button action-id="action_buysometime" class="mb-1" />
            <action-button action-id="action_damndrink" class="mb-1" />
            <action-button action-id="action_creative" class="mb-1" />
            <action-button action-id="action_focused" class="mb-1" />
            <action-button action-id="action_organized" class="mb-1" />
            <action-button action-id="action_information" class="mb-1" />
            <action-button action-id="action_connected" class="mb-1" />
            <action-button action-id="action_scrounge" class="mb-1" />
          </div>
        </v-window-item>
      </v-window>
    </v-fade-transition>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionButton from '../ActiveSheet/components/Turn/ActionButton.vue'

export default Vue.extend({
  name: 'downtime-sidebar',
  components: { ActionButton },
  props: {
    pilot: Object,
    mech: Object,
    loadout: Object,
  },
  data: () => ({
    step: 0,
    drawer: true,
    mini: true,
  }),
})
</script>

<style scoped>
.panel-expander {
  position: fixed;
  height: 100%;
}
</style>
