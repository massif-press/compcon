<template>
  <v-app-bar
    v-if="!hide"
    app
    color="primary"
    :class="!mobile && 'clipped-large'"
    class="no-print"
    density="compact"
    :height="mobile ? '40' : '58'"
    style="z-index: 998">
    <div v-if="standalone">
      <v-tooltip location="bottom" open-delay="500ms">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" @click="$router.go(-1)">
            <v-icon icon="mdi-arrow-left" />
          </v-btn>
        </template>
        <span>Navigate Back</span>
      </v-tooltip>

      <v-tooltip location="bottom" open-delay="500ms">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" @click="$router.go(1)">
            <v-icon icon="mdi-arrow-right" />
          </v-btn>
        </template>
        <span>Navigate Forward</span>
      </v-tooltip>
      <v-divider v-if="!mobile" vertical class="mx-1" />
    </div>

    <cc-button
      :size="mobile ? 'small' : 'default'"
      icon="mdi-home"
      class="mx-1"
      tooltip="Main Menu"
      tooltip-location="bottom"
      @click="$router.push({ name: 'main-menu' })" />

    <cc-button
      :size="mobile ? 'small' : 'default'"
      icon="mdi-book"
      class="mx-1"
      tooltip="Compendium"
      tooltip-location="bottom"
      @click="$router.push({ path: '/srd' })" />

    <cc-button
      :size="mobile ? 'small' : 'default'"
      icon="cc:pilot"
      class="mx-1"
      tooltip="Pilot Management"
      tooltip-location="bottom"
      @click="$router.push({ path: '/pilot_management' })" />

    <v-menu location="bottom" open-on-hover>
      <template #activator="{ props }">
        <cc-button
          :size="mobile ? 'small' : 'default'"
          icon="cc:encounter"
          class="mx-1"
          v-bind="props"
          @click="$router.push({ path: '/gm' })"></cc-button>
      </template>
      <v-list density="compact" class="text-caption pa-0">
        <v-list-item slim @click="$router.push({ path: '/gm/npcs' })">NPC Roster</v-list-item>
        <v-list-item slim @click="$router.push({ path: '/gm/encounters' })">Encounters</v-list-item>
        <v-list-item slim @click="$router.push({ path: '/gm/narrative' })">
          Narrative Elements
        </v-list-item>
        <v-list-item slim @click="$router.push({ path: '/gm/campaigns' })">
          Campaign Manager
        </v-list-item>
      </v-list>
    </v-menu>

    <cc-button
      :size="mobile ? 'small' : 'default'"
      icon="cc:campaign"
      class="mx-1"
      tooltip="Active Mode"
      tooltip-location="bottom"
      @click="$router.push({ path: '/active-mode' })" />

    <cc-modal title="Quick Reference">
      <template #activator="{ open }">
        <cc-button
          :size="mobile ? 'small' : 'default'"
          icon="mdi-contain"
          class="mx-1"
          @click="open">
          <v-tooltip location="bottom" open-delay="500ms">
            <template #activator="{ props }">
              <v-icon v-bind="props" />
            </template>
            <span>Quick Reference</span>
          </v-tooltip>
        </cc-button>
      </template>
      <reference />
    </cc-modal>

    <v-divider v-if="!mobile" vertical class="ml-4 mr-1" />

    <v-toolbar-title v-if="!mobile">
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
      <span v-if="!mobile">
        <span class="heading">COMP/CON</span>
        <span class="flavor-text text-white" style="opacity: 0.4">&nbsp;{{ appVersion }}</span>
      </span>
    </v-toolbar-title>

    <v-spacer />

    <search />

    <v-divider v-if="!portrait" vertical class="mx-1" />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <cc-modal title="Cloud Account" icon="mdi-cloud-sync-outline">
          <template #activator="{ open }">
            <cc-button
              v-bind="props"
              class="mx-1"
              :size="mobile ? 'small' : ''"
              icon="mdi-cloud-sync-outline"
              @click="open" />
            <v-badge
              :model-value="notifications.length > 0"
              dot
              color="secondary"
              :content="notifications.length" />
          </template>
          <cloud-page />
        </cc-modal>
      </template>
      Cloud Account
    </v-tooltip>

    <v-divider v-if="!mobile" vertical class="mx-1" />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <cc-modal title="Achievements" icon="cc:achievement_1">
          <template #activator="{ open }">
            <cc-button
              v-bind="props"
              class="mx-1"
              :size="mobile ? 'small' : ''"
              icon="cc:achievement_1"
              :disabled="UserStoreLoading"
              @click="open" />
          </template>
          <template #default="{ close }">
            <achievements-page @close="close()" />
          </template>
        </cc-modal>
      </template>
      Achievements
    </v-tooltip>

    <v-divider v-if="!mobile" vertical class="mx-1" />

    <v-menu>
      <template #activator="{ props }">
        <cc-button
          class="mx-1"
          :size="mobile ? 'small' : ''"
          icon="mdi-dots-vertical"
          @click="props.onClick($event)" />
      </template>

      <v-list density="compact">
        <v-list-item @click.stop="contentModal = true">Manage Content</v-list-item>
        <content-page v-model="contentModal" />
        <cc-modal title="options" icon="mdi-cog">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">Options</v-list-item>
          </template>
          <options-page />
        </cc-modal>
        <cc-modal title="about" icon="mdi-information-outline">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">About</v-list-item>
          </template>
          <about-page />
        </cc-modal>
        <cc-modal title="title" icon="cc:gms">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">Credits</v-list-item>
          </template>
          <credits-page />
        </cc-modal>
        <cc-modal title="title" icon="mdi-help-circle-outline">
          <template #activator="{ open }">
            <v-list-item @click.stop="open">Help</v-list-item>
          </template>
          <help-page />
        </cc-modal>
        <v-divider />
        <v-list-item target="_blank" href="https://www.patreon.com/compcon">
          Support COMP/CON
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer v-if="!mobile" style="max-width: 20px" />
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

import Search from './search/index.vue';

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
    Search,
  },
  props: {
    pilotManagement: { type: Boolean },
    encounter: { type: Boolean },
  },
  data: () => ({
    aboutDialog: false,
    helpDialog: false,
    optionsDialog: false,
    contentModal: false,
    storageWarningDialog: false,
    storageFullDialog: false,
    qrDialog: false,
    hasCmdKey: false,
  }),
  created() {
    this.hasCmdKey = navigator.userAgent.includes('Mac');
    this.storageFullDialog = this.StorageMax;
  },
  computed: {
    hide(): boolean {
      if (this.$route.path === '/') return true;
      return false;
    },
    landscape(): boolean {
      return this.$vuetify.display.mdAndDown;
    },
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
    mobile() {
      return this.portrait || this.landscape;
    },
    StorageWarning(): boolean {
      return UserStore().StorageWarning;
    },
    StorageMax(): boolean {
      return UserStore().StorageFull;
    },
    appVersion(): string {
      return import.meta.env.VITE_APP_VERSION;
    },
    notifications() {
      return UserStore().CloudNotifications;
    },
    standalone(): boolean {
      return window.matchMedia('(display-mode: standalone)').matches;
    },
    UserStoreLoading(): boolean {
      return UserStore().IsLoading;
    },
  },
};
</script>
