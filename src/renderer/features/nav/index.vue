<template>
  <v-app-bar
    app
    fixed
    hide-on-scroll
    top
    color="primary"
    class="clipped-large"
    dark
    dense
    style="z-index:999"
  >
    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on" @click="historyNav(-1)">
          <v-icon dark>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>Back</span>
    </v-tooltip>

    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on" @click="historyNav(1)">
          <v-icon dark>mdi-arrow-right</v-icon>
        </v-btn>
      </template>
      <span>Forward</span>
    </v-tooltip>

    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on" @click="home()">
          <v-icon dark>mdi-home</v-icon>
        </v-btn>
      </template>
      <span>Main Menu</span>
    </v-tooltip>

    <v-divider vertical dark class="ml-2 mr-2" />

    <v-toolbar-title>
      <span class="heading">COMP/CON</span>
      <span class="flavor-text white--text">v{{ version }}</span>
    </v-toolbar-title>

    <v-spacer />

    <v-btn text tile to="/compendium">Compendium</v-btn>

    <v-divider vertical dark class="ml-2 mr-2" />

    <v-btn text tile to="/pilot_management">Pilot Roster</v-btn>

    <v-divider v-if="pilot" vertical dark class="ml-2 mr-2" />

    <v-menu v-if="pilot" nudge-bottom="35px" open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn light tile color="white" elevation="0" v-on="on">
          {{ pilot.Callsign }}
          <v-icon light>arrow_drop_down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/active">Active Play Mode</v-list-item>
        <v-list-item to="/pilot">Pilot Sheet</v-list-item>
        <v-list-item to="/hangar">Mech Hangar</v-list-item>
      </v-list>
    </v-menu>

    <v-divider vertical dark class="ml-2 mr-2" />

    <v-menu nudge-bottom="40px">
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on">
          <v-icon dark>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="$refs.optionsModal.show()">Options</v-list-item>
        <v-list-item @click="$refs.aboutModal.show()">About</v-list-item>
        <v-list-item @click="$refs.helpModal.show()">Help</v-list-item>
      </v-list>
    </v-menu>

    <v-spacer style="max-width: 20px" />

    <cc-solo-dialog ref="optionsModal" large no-confirm title="Options">
      options test
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About">about test</cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help">help test</cc-solo-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
// import HelpPage from './Pages/HelpPage.vue'
// import AboutPage from './Pages/AboutPage.vue'
// import OptionsPage from './Pages/OptionsPage.vue'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'cc-nav',
  // components: { HelpPage, AboutPage, OptionsPage },
  data: () => ({
    aboutDialog: false,
    helpDialog: false,
    optionsDialog: false,
  }),
  computed: {
    pilot() {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot || null
    },
  },
  methods: {
    home: function() {
      this.$router.push('/')
    },
    historyNav: function(dir: number) {
      this.$router.go(dir)
    },
    toMechSheet(mech) {
      this.pilot.LoadedMech = mech
      this.$router.push('./mech')
    },
  },
})
</script>
