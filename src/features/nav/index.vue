<template>
  <v-app-bar
    v-show="mode"
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

    <v-tooltip bottom open-delay="500ms">
      <template v-slot:activator="{ on }">
        <v-btn text icon to="/compendium" v-on="on">
          <v-icon color="white">mdi-book</v-icon>
        </v-btn>
      </template>
      <span>Compendium</span>
    </v-tooltip>

    <v-divider vertical dark class="ml-2 mr-2" />

    <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">
      <span class="heading">COMP/CON</span>
      <span class="flavor-text white--text">{{ $appVersion }}</span>
    </v-toolbar-title>

    <v-spacer />

    <div v-if="$vuetify.breakpoint.mdAndUp">
      <pilot-mode v-if="mode === 'pilot'" />
      <compendium-mode v-if="mode === 'compendium'" />
      <encounter-mode v-if="mode === 'encounter'" />
    </div>

    <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical dark class="ml-2 mr-2" />

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

    <cc-solo-dialog
      ref="optionsModal"
      large
      no-confirm
      no-pad
      no-title-clip
      title="Options & User Profile"
    >
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About"><about-page /></cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"><help-page /></cc-solo-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import HelpPage from './pages/Help.vue'
import AboutPage from './pages/About.vue'
import OptionsPage from './pages/Options/index.vue'
import ContentPage from './pages/ExtraContent/index.vue'
import activePilot from '../pilot_management/mixins/activePilot'

import PilotMode from './modes/pilot.vue'
import EncounterMode from './modes/encounter.vue'
import CompendiumMode from './modes/compendium.vue'

import vueMixins from '@/util/vueMixins'
import { getModule } from 'vuex-module-decorators'
import { NavStore } from '@/store'

export default vueMixins(activePilot).extend({
  name: 'cc-nav',
  components: {
    HelpPage,
    AboutPage,
    OptionsPage,
    ContentPage,
    PilotMode,
    EncounterMode,
    CompendiumMode,
  },
  props: {
    pilotManagement: { type: Boolean },
    encounter: { type: Boolean },
  },
  data: () => ({
    aboutDialog: false,
    helpDialog: false,
    optionsDialog: false,
  }),
  computed: {
    mode(): string {
      return getModule(NavStore, this.$store).NavMode
    },
  },
  methods: {
    home() {
      this.$router.push('/')
    },
    historyNav(dir: number) {
      this.$router.go(dir)
    },
  },
})
</script>
