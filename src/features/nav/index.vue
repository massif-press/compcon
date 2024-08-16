<template>
  <v-app-bar
    v-show="!hide"
    app
    top
    color="primary"
    class="clipped-large no-print"
    density="compact"
    style="z-index: 50">
    <!-- <v-menu location="bottom" open-on-hover open-delay="500ms">
      <template #activator="{ props }">
        <v-btn icon variant="plain" size="45" v-bind="props">
          <v-icon icon="mdi-menu" />
        </v-btn>
      </template>
      <v-list density="compact" :items="navItems" />
    </v-menu>
    <v-divider vertical dark class="mx-2" /> -->

    <v-tooltip location="bottom" open-delay="500ms">
      <template #activator="{ props }">
        <v-btn icon variant="plain" size="45" v-bind="props" @click="historyNav(-1)">
          <v-icon icon="mdi-arrow-left" />
        </v-btn>
      </template>
      <span>Back</span>
    </v-tooltip>

    <v-tooltip location="bottom" open-delay="500ms">
      <template #activator="{ props }">
        <v-btn icon variant="plain" size="45" v-bind="props" @click="historyNav(1)">
          <v-icon icon="mdi-arrow-right" />
        </v-btn>
      </template>
      <span>Forward</span>
    </v-tooltip>

    <v-tooltip location="bottom" open-delay="500ms">
      <template #activator="{ props }">
        <v-btn
          icon
          variant="plain"
          size="45"
          v-bind="props"
          @click="$router.push({ name: 'main-menu' })">
          <v-icon color="white" icon="mdi-home" />
        </v-btn>
      </template>
      <span>Main Menu</span>
    </v-tooltip>

    <v-tooltip location="bottom" open-delay="500ms">
      <template #activator="{ props }">
        <v-btn
          icon
          variant="plain"
          size="45"
          v-bind="props"
          @click="$router.push({ path: '/srd' })">
          <v-icon color="white" icon="mdi-book" />
        </v-btn>
      </template>
      <span>Compendium</span>
    </v-tooltip>

    <v-dialog v-model="qrDialog">
      <template #activator="{ props }">
        <v-btn icon variant="plain" size="45" v-bind="props">
          <v-tooltip location="bottom" open-delay="500ms">
            <template #activator="{ props }">
              <v-icon v-bind="props" color="white" icon="mdi-contain" />
            </template>
            <span>Quick Reference</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-card id="content">
        <v-toolbar color="primary" density="compact" style="position: fixed; z-index: 2">
          <v-toolbar-title class="heading h3 text-uppercase">Quick Reference</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="qrDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div style="min-height: 22px" />
        <reference :is-modal="true" />
      </v-card>
    </v-dialog>

    <v-divider vertical dark class="mx-2" />

    <v-toolbar-title>
      <span v-if="StorageWarning">
        <v-tooltip location="bottom" max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="warning" icon="mdi-database-alert" start />
          </template>
          <span>
            <v-chip color="warning" variant="elevated" size="x-small">WARNING</v-chip>
            COMP/CON has exceeded the storage warning threshold. More details are available in the
            <b>Storage</b>
            tab of the Options Menu.
          </span>
        </v-tooltip>
      </span>
      <span v-else-if="StorageMax">
        <v-tooltip location="bottom" max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props" color="error" icon="mdi-database-off" start />
          </template>
          <span>
            <v-chip color="error" variant="elevated" size="x-small">ALERT</v-chip>
            COMP/CON has exceeded the maximum storage threshold.

            <v-alert color="error">
              <b>NO NEW ITEMS WILL BE SAVED UNTIL THE LIMIT IS INCREASED OR DATA IS DELETED.</b>
            </v-alert>
            More details are available in the
            <b>Storage</b>
            tab of the Options Menu.
          </span>
        </v-tooltip>
        <v-dialog v-model="storageFullDialog" width="780px">
          <v-card>
            <v-toolbar color="error" class="heading h2">
              <v-toolbar-title>
                <v-icon icon="mdi-database-off" start />
                STORAGE LIMIT EXCEEDED
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="storageFullDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p>
                COMP/CON has exceeded the maximum storage threshold.
                <br />
                <br />
                <b class="text-accent">
                  NO NEW ITEMS WILL BE SAVED UNTIL THE LIMIT IS INCREASED OR DATA IS DELETED.
                </b>
                <br />
                <br />
                More details are available in the
                <b>Storage</b>
                tab of the Options Menu.
              </p>
            </v-card-text>
          </v-card>
        </v-dialog>
      </span>
      <span class="heading">COMP/CON</span>
      <span class="flavor-text text-white" style="opacity: 0.4">&nbsp;{{ $appVersion }}</span>
    </v-toolbar-title>

    <v-spacer />

    <v-divider v-if="$vuetify.display.mdAndUp" vertical dark class="mx-2" />

    <cc-tooltip v-if="$vuetify.display.mdAndUp" location="bottom" content="Open cloud account menu">
      <v-btn icon variant="plain" size="45" dark @click="($refs.cloudModal as any).show()">
        <v-icon icon="mdi-cloud-sync-outline" />
      </v-btn>
    </cc-tooltip>

    <v-divider vertical dark class="mx-2" />

    <cc-tooltip location="bottom" content="Help &amp; FAQ">
      <v-btn icon variant="plain" size="45" dark @click="($refs.helpModal as any).show()">
        <v-icon icon="mdi-help-circle-outline" />
      </v-btn>
    </cc-tooltip>

    <v-divider vertical dark class="mx-2" />

    <cc-tooltip location="bottom" content="Achievements">
      <v-btn icon variant="plain" size="45" dark @click="($refs.achievementsModal as any).show()">
        <v-icon icon="cc:achievement_1" size="30" />
      </v-btn>
    </cc-tooltip>

    <v-divider vertical dark class="mx-2" />

    <v-menu nudge-location="40px">
      <template #activator="{ props }">
        <v-btn icon variant="plain" size="45" v-bind="props">
          <v-icon dark>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item @click="($refs.contentModal as any).show()">Manage Content</v-list-item>
        <v-list-item @click="($refs.optionsModal as any).show()">Options</v-list-item>
        <v-list-item @click="($refs.aboutModal as any).show()">About</v-list-item>
        <v-list-item @click="($refs.creditsModal as any).show()">Credits</v-list-item>
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
      title="Manage Content Packs">
      <content-page />
    </cc-solo-dialog>

    <cc-solo-dialog
      ref="optionsModal"
      large
      no-confirm
      no-pad
      no-title-clip
      title="Options & User Profile">
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="About"><about-page /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" large no-confirm title="Credits">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Help"><help-page /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" large no-confirm title="Credits">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="cloudModal" large no-confirm title="Cloud Account">
      <cloud-page />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="achievementsModal"
      fullscreen
      no-confirm
      no-title-clip
      title="Achievements">
      <achievements-page />
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
import AchievementsPage from './pages/Achievements.vue';

import Reference from '../compendium/Views/Reference/Reference.vue';

import { PilotStore, UserStore } from '@/stores';

import { Pilot } from '@/classes/pilot/Pilot';
// import { Auth } from 'aws-amplify';

export default {
  name: 'cc-nav',
  components: {
    HelpPage,
    AboutPage,
    CreditsPage,
    OptionsPage,
    ContentPage,
    CloudPage,
    AchievementsPage,
    Reference,
  },
  props: {
    pilotManagement: { type: Boolean },
    encounter: { type: Boolean },
  },
  data: () => ({
    aboutDialog: false,
    helpDialog: false,
    optionsDialog: false,
    storageWarningDialog: false,
    storageFullDialog: false,
    qrDialog: false,
  }),
  mounted() {
    this.storageFullDialog = this.StorageMax;
  },

  computed: {
    hide(): boolean {
      if (this.$route.path === '/') return true;
      return false;
    },
    StorageWarning(): boolean {
      return UserStore().StorageWarning;
    },
    StorageMax(): boolean {
      return UserStore().StorageFull;
    },
  },
  methods: {
    historyNav(dir: number) {
      this.$router.go(dir);
    },
  },
};
</script>
