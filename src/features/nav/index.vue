<template>
  <v-app-bar
    v-show="mode"
    app
    top
    color="primary"
    class="clipped-large no-print"
    density="compact"
    style="z-index: 50"
  >
    <v-tooltip location="bottom" open-delay="500ms">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" @click="historyNav(-1)">
          <v-icon icon="mdi-arrow-left" />
        </v-btn>
      </template>
      <span>Back</span>
    </v-tooltip>

    <v-tooltip location="bottom" open-delay="500ms">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" @click="historyNav(1)">
          <v-icon icon="mdi-arrow-right" />
        </v-btn>
      </template>
      <span>Forward</span>
    </v-tooltip>

    <v-tooltip location="bottom" open-delay="500ms">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" to="/">
          <v-icon icon="mdi-home" />
        </v-btn>
      </template>
      <span>Main Menu</span>
    </v-tooltip>

    <v-tooltip location="bottom" open-delay="500ms">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" to="/compendium">
          <v-icon icon="mdi-book" />
        </v-btn>
      </template>
      <span>Compendium</span>
    </v-tooltip>

    <v-divider vertical dark class="mx-2" />

    <v-toolbar-title v-if="$vuetify.display.mdAndUp">
      <span class="heading">COMP/CON</span>
      <span class="flavor-text text-white" style="opacity: 0.5"
        >&nbsp;{{ $appVersion }}</span
      >
    </v-toolbar-title>

    <v-spacer />

    <div v-if="$vuetify.display.mdAndUp">
      <pilot-mode v-if="mode === 'pilot'" />
      <compendium-mode v-if="mode === 'compendium'" />
      <encounter-mode v-if="mode === 'encounter'" />
    </div>

    <v-divider
      v-if="$vuetify.display.mdAndUp && isAuthed"
      vertical
      dark
      class="mx-2"
    />

    <cc-tooltip
      v-if="$vuetify.display.mdAndUp && isAuthed"
      location="bottom"
      content="Open cloud account menu"
    >
      <v-btn icon dark @click="($refs.cloudModal as any).show()">
        <v-icon icon="mdi-cloud-sync-outline" />
      </v-btn>
    </cc-tooltip>

    <v-divider v-if="$vuetify.display.mdAndUp" vertical dark class="mx-2" />

    <cc-tooltip location="bottom" content="Help &amp; FAQ">
      <v-btn icon dark @click="($refs.helpModal as any).show()">
        <v-icon icon="mdi-help-circle-outline" />
      </v-btn>
    </cc-tooltip>

    <v-divider vertical dark class="mx-2" />

    <v-menu nudge-location="40px">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon dark>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item @click="($refs.contentModal as any).show()"
          >Manage Content</v-list-item
        >
        <v-list-item @click="($refs.optionsModal as any).show()"
          >Options</v-list-item
        >
        <v-list-item @click="($refs.aboutModal as any).show()"
          >About</v-list-item
        >
        <v-list-item @click="($refs.creditsModal as any).show()"
          >Credits</v-list-item
        >
        <v-list-item @click="($refs.helpModal as any).show()">Help</v-list-item>
        <v-divider />
        <v-list-item target="_blank" href="https://www.patreon.com/compcon">
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
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About"
      ><about-page
    /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" large no-confirm title="Credits">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"
      ><help-page
    /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" fullscreen no-confirm title="Credits">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="cloudModal" large no-confirm title="Cloud Account">
      <cloud-page />
    </cc-solo-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import HelpPage from './pages/Help.vue';
import AboutPage from './pages/About.vue';
import CreditsPage from './pages/Credits.vue';
import OptionsPage from './pages/Options/index.vue';
import ContentPage from './pages/ExtraContent/index.vue';
import CloudPage from './pages/Cloud.vue';

import PilotMode from './modes/pilot.vue';
import EncounterMode from './modes/encounter.vue';
import CompendiumMode from './modes/compendium.vue';

import { PilotStore, UserStore } from '@/stores';
// import { Auth } from 'aws-amplify';

export default {
  name: 'cc-nav',
  components: {
    HelpPage,
    AboutPage,
    CreditsPage,
    OptionsPage,
    ContentPage,
    PilotMode,
    EncounterMode,
    CompendiumMode,
    CloudPage,
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
  async mounted() {
    // await Auth.currentAuthenticatedUser();
  },
  computed: {
    mode(): string {
      if (this.$route.path.includes('/compendium')) return 'compendium';
      else if (
        this.$route.path.includes('/pilot') ||
        this.$route.path.includes('/active') ||
        this.$route.path.includes('/new')
      )
        return 'pilot';
      else if (this.$route.path.includes('/gm')) return 'encounter';
      else return '';
    },
    unsaved() {
      return PilotStore().unsavedCloudPilots;
    },
    isAuthed() {
      return UserStore().IsLoggedIn;
    },
    syncTooltip(): string {
      if (!this.unsaved.length) return 'Pilot data synced';
      return (
        '<div class="text-center"><b>LOCAL CHANGES<br></b>' +
        this.unsaved.map((p) => `Pilot::${p.Callsign}`).join('<br>') +
        '<br><span class="caption">Click to save changes to your cloud account</span></div>'
      );
    },
  },
  methods: {
    sync() {
      UserStore().cloudSync({
        callback: (status, message) => this.$notify(status, message),
      });
    },
    historyNav(dir: number) {
      this.$router.go(dir);
    },
  },
};
</script>
