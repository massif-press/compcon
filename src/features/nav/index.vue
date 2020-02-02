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
      <span class="flavor-text white--text">{{ $appVersion }}</span>
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
        <v-list-item @click="$refs.contentModal.show()">Manage Content</v-list-item>
        <v-list-item @click="$refs.optionsModal.show()">Options</v-list-item>
        <v-list-item @click="$refs.aboutModal.show()">About</v-list-item>
        <v-list-item @click="$refs.helpModal.show()">Help</v-list-item>
        <v-divider />
        <v-list-item
          v-extlink="`https://www.patreon.com/compcon`"
          href="https://www.patreon.com/compcon"
        >
          Support COMP/CON
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer style="max-width: 20px" />

    <cc-solo-dialog
      ref="contentModal"
      no-title-clip
      no-pad
      large
      no-confirm
      title="Manage Content Packs"
    >
      <content-page />
    </cc-solo-dialog>

    <cc-solo-dialog ref="optionsModal" large no-confirm title="Options & User Profile">
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About"><about-page /></cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"><help-page /></cc-solo-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import HelpPage from './pages/Help.vue'
import AboutPage from './pages/About.vue'
import OptionsPage from './pages/Options.vue'
import ContentPage from './pages/ExtraContent/index.vue'
import activePilot from '../pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'cc-nav',
  components: { HelpPage, AboutPage, OptionsPage, ContentPage },
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
