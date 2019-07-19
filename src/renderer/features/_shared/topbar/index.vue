<template>
  <v-container fluid>
    <v-toolbar dense style="z-index:10" fixed>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="historyNav(-1)" flat>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Click to go back</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="historyNav(1)" flat>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <span>Click to go forward</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click="home()" flat>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <span>Return to the Main Menu</span>
      </v-tooltip>
      <v-divider vertical class="ml-2" />
      <v-toolbar-title class="font-weight-light" style="font-size:26px">
        C O M P / C O N&emsp;
        <span class="grey--text" style="font-size:16px">{{ ver }}</span>
      </v-toolbar-title>
      <v-divider class="ml-4 mr-4" />
      <v-toolbar-items>
        <v-btn flat to="/compendium">Compendium</v-btn>
        <v-btn flat to="/pilot_management">Pilot Roster</v-btn>
        <v-divider vertical class="ml-2 mr-2" />
        <v-menu v-if="pilot" nudge-bottom="45px" open-on-hover>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="primary">
              {{ pilot.Callsign }}
              <v-icon dark>arrow_drop_down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-tile to="/active">
              <v-list-tile-title class="minor-title">Active Play Mode</v-list-tile-title>
            </v-list-tile>
            <v-list-tile to="/downtime">
              <v-list-tile-title class="minor-title">Downtime Mode</v-list-tile-title>
            </v-list-tile>
            <v-divider />
            <v-list-tile to="/pilot">
              <v-list-tile-title class="minor-title">Pilot Sheet</v-list-tile-title>
            </v-list-tile>
            <v-divider />
            <v-list-tile to="/hangar">
              <v-list-tile-title class="minor-title">Mech Hangar</v-list-tile-title>
            </v-list-tile>
          </v-list>
          <v-list two line dense>
            <v-list-tile v-for="mech in pilot.Mechs" :key="mech.Name" @click="toConfigSheet(mech)">
              <v-list-tile-content>
                <v-list-tile-title
                  class="text-xs-right font-weight-bold effect-text"
                >{{ mech.Name }}</v-list-tile-title>
                <v-list-tile-sub-title
                  class="text-xs-right"
                >{{ mech.Frame.Source }} {{ mech.Frame.Name }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-divider vertical class="ml-2 mr-2" />

        <v-menu nudge-bottom="40px">
          <template v-slot:activator="{ on }">
            <v-btn flat icon v-on="on">
              <v-icon dark>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-tile @click="optionsModal = true">
              <v-list-tile-title flat>Options</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="aboutModal = true">
              <v-list-tile-title flat>About</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="helpModal = true">
              <v-list-tile-title flat>Help</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Options Modal -->
    <v-dialog v-model="optionsModal" width="80vw" scrollable>
      <v-card>
        <v-toolbar absolute class="primary white--text" style="position: sticky">
          <v-toolbar-title>Options</v-toolbar-title>
          <v-btn flat icon color="white" class="ml-auto" @click="optionsModal = false">
            <v-icon dark>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-4">
          <options-page />
        </v-card-text>
        <v-divider />
      </v-card>
    </v-dialog>
    <!-- About Modal -->
    <v-dialog v-model="aboutModal" width="80vw">
      <v-card>
        <v-toolbar absolute class="primary white--text" style="position: sticky">
          <v-toolbar-title>About COMP/CON</v-toolbar-title>
          <v-btn flat icon color="white" class="ml-auto" @click="aboutModal = false">
            <v-icon dark>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-4">
          <about-page />
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Help Modal -->
    <v-dialog v-model="helpModal" width="85vw">
      <v-card>
        <v-toolbar absolute class="primary white--text" style="position: sticky">
          <v-toolbar-title>Help</v-toolbar-title>
          <v-btn flat icon color="white" class="ml-auto" @click="helpModal = false">
            <v-icon dark>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-4">
          <help-page />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" flat @click="helpModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import HelpPage from './Pages/HelpPage.vue'
import AboutPage from './Pages/AboutPage.vue'
import OptionsPage from './Pages/OptionsPage.vue'
import { Route } from 'vue-router'

export default Vue.extend({
  name: 'top-bar',
  components: { HelpPage, AboutPage, OptionsPage },
  data: () => ({
    aboutModal: false,
    helpModal: false,
    optionsModal: false,
    ver: 0,
    hangarActive: false,
    zeroConfigs: false,
  }),
  methods: {
    home: function() {
      this.$router.push('/')
    },
    historyNav: function(dir: number) {
      this.$router.go(dir)
    },
    toConfigSheet(mech) {
      this.pilot.LoadedMech = mech
      this.$router.push('./config')
    },
  },
  computed: {
    pilot() {
      const p = this.$store.getters.getPilot
      return p.Name ? p : null
    },
  },
  created() {
    const vm = this as any
    vm.ver = process.env.npm_package_version
      ? `v${process.env.npm_package_version}`
      : `v${vm.version}`
  },
})
</script>

<style scoped>
p {
  margin-left: 8px;
}
</style>
