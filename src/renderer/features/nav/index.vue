<template>
  <v-app-bar app fixed hide-on-scroll top color="primary" class="clipped-large" dark dense>
    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="historyNav(-1)" text>
          <v-icon dark>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>Back</span>
    </v-tooltip>

    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="historyNav(1)" text>
          <v-icon dark>mdi-arrow-right</v-icon>
        </v-btn>
      </template>
      <span>Forward</span>
    </v-tooltip>

    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="home()" text>
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
        <v-btn v-on="on" light tile color="white" elevation="0">
          {{ pilot.Callsign }}
          <v-icon light>arrow_drop_down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/active">Active Play Mode</v-list-item>
        <v-list-item to="/pilot">Pilot Sheet</v-list-item>
        <v-list-item to="/hangar">Mech Hangar</v-list-item>
      </v-list>
      <v-divider />
      <v-list two line dense>
        <v-list-item v-for="mech in pilot.Mechs" :key="mech.Name" @click="toConfigSheet(mech)">
          <v-list-item-content>
            <v-list-item-title
              class="text-xs-right font-weight-bold effect-text"
            >{{ mech.Frame.Source }} {{ mech.Frame.Name }}</v-list-item-title>
            <v-list-item-sub-title class="text-xs-right">{{ mech.Name }}</v-list-item-sub-title>
          </v-list-item-content>
        </v-list-item>
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
        <v-list-item @click="optionsDialog = true">Options</v-list-item>
        <v-list-item @click="aboutDialog = true">About</v-list-item>
        <v-list-item @click="helpDialog = true">Help</v-list-item>
      </v-list>
    </v-menu>

    <v-spacer style="max-width: 20px" />

    <cc-solo-dialog large no-confirm :model="optionsDialog" @cancel="optionsDialog = false">
      <template slot="title">Options</template>
      options test
    </cc-solo-dialog>

    <cc-solo-dialog large no-confirm :model="aboutDialog" @cancel="aboutDialog = false">
      <template slot="title">About</template>
      about test
    </cc-solo-dialog>

    <cc-solo-dialog large no-confirm :model="helpDialog" @cancel="helpDialog = false">
      <template slot="title">Help</template>
      help test
    </cc-solo-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
// import HelpPage from './Pages/HelpPage.vue'
// import AboutPage from './Pages/AboutPage.vue'
// import OptionsPage from './Pages/OptionsPage.vue'
import { Route } from 'vue-router'

export default Vue.extend({
  name: 'cc-nav',
  // components: { HelpPage, AboutPage, OptionsPage },
  data: () => ({
    aboutDialog: false,
    helpDialog: false,
    optionsDialog: false,
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
})
</script>