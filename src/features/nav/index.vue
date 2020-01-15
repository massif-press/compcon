<template>
  <v-app-bar
    app
    fixed
    top
    color="primary"
    class="clipped-large no-print"
    dark
    dense
    style="z-index:50"
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

    <div v-if="pilotManagement">
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
        <v-list two-line subheader>
          <v-list-item :to="`/active/${pilot.ID}`">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon large>cci-activate</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Active Mode</v-list-item-title>
              <v-list-item-subtitle>
                Gameplay manager for running a pilot in LANCER sessions
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="pilotSheet()">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon large>cci-pilot</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Pilot Sheet</v-list-item-title>
              <v-list-item-subtitle>
                View, edit, and update this pilot's information
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="mechHangar()">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon large>cci-frame</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mech Hangar</v-list-item-title>
              <v-list-item-subtitle>
                Build mechs and manage this pilot's library of mech configurations
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else-if="encounter">
      <v-btn text tile to="/compendium">Compendium</v-btn>
      <v-divider vertical dark class="ml-2 mr-2" />
      <v-btn text tile to="/gm/npc-roster">NPC Roster</v-btn>
      <v-divider vertical dark class="ml-2 mr-2" />
      <v-btn text tile to="/gm/encounter-builder">Encounters</v-btn>
      <v-divider vertical dark class="ml-2 mr-2" />
      <v-btn text tile to="/gm/mission">Missions</v-btn>
      <v-divider vertical dark class="ml-2 mr-2" />
    </div>

    <v-divider vertical dark class="ml-2 mr-2" />
    <v-menu nudge-bottom="40px">
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on">
          <v-icon dark>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item @click="$refs.optionsModal.show()">Options</v-list-item>
        <v-list-item @click="$refs.aboutModal.show()">About</v-list-item>
        <v-list-item @click="$refs.helpModal.show()">Help</v-list-item>
      </v-list>
    </v-menu>

    <v-spacer style="max-width: 20px" />

    <cc-solo-dialog ref="optionsModal" no-title-clip no-pad large no-confirm title="Options">
      <options />
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
import Options from './pages/Options.vue'
import activePilot from '../pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'cc-nav',
  // components: { HelpPage, AboutPage, OptionsPage },
  components: { Options },
  mixins: [activePilot],
  props: {
    pilotManagement: { type: Boolean },
    encounter: { type: Boolean },
  },
  data: () => ({
    aboutDialog: false,
    helpDialog: false,
    optionsDialog: false,
  }),
  methods: {
    home() {
      this.$router.push('/')
    },
    pilotSheet() {
      this.$router.push({ name: 'pilot_sheet' })
    },
    mechHangar() {
      this.$router.push({ name: 'mech_hangar' })
    },
    historyNav(dir: number) {
      this.$router.go(dir)
    },
  },
})
</script>
