<template>
  <v-container>
    <div style="overflow-y: scroll; overflow-x: hidden">
      <v-row density="compact">
        <v-col md="12" lg="6" class="mr-3">
          <h3 class="heading text-accent">User Options</h3>
          <div class="flavor-text">
            <div>
              <b>LOCAL USER ID:</b>
              <span class="text-accent pl-3">
                {{ userID }}
              </span>
            </div>
            <div>
              <b>CLOUD USER ID:</b>
              <span class="text-disabled pl-3">Not Connected</span>
            </div>
            <v-divider />
            <v-row class="text-center py-4">
              <v-col>
                <b>itch.io account:</b>
                <div class="text-disabled">Unlinked</div>
                <v-btn size="small" color="#fa5c5c">
                  Link itch.io
                  <v-tooltip max-width="400px">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" size="large" end>mdi-help-circle-outline</v-icon>
                    </template>
                    Linking your itch.io account will allow you to download Massif and
                    community-approved homebrew content from the itch.io store with one click.
                    <br />
                    You can also subscribe to LCPs to auto-update your local copy when the author
                    releases a new version.
                    <br />
                    <v-divider class="my-3" />
                    This
                    <b>does not</b>
                    require a COMP/CON cloud account, and your itch account data will not be stored
                    in your COMP/CON cloud account, only in your local app data. You will have to
                    re-link your account if you reset your local data or set up COMP/CON on a new
                    device.
                  </v-tooltip>
                </v-btn>
              </v-col>
              <v-col>
                <b>Patreon account:</b>
                <div class="text-disabled">Unlinked</div>
                <v-btn size="small" color="#FF424D">
                  Link Patreon
                  <v-tooltip max-width="400px">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" size="large" end>mdi-help-circle-outline</v-icon>
                    </template>
                    If you are subscribed to the COMP/CON Patreon, linking your Patreon account will
                    increase your maximum cloud storage space, and unlock realtime table creation in
                    GM mode.
                    <br />
                    <v-divider class="my-3" />
                    This
                    <b>does</b>
                    require a COMP/CON cloud account, but your Patreon account data will not be
                    stored in your COMP/CON cloud account, only in your local app data. You will
                    have to re-link your account if you reset your local data or set up COMP/CON on
                    a new device.
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4" />
          <v-row dense>
            <v-col>
              <v-btn block color="accent" variant="tonal" @click="$emit('show-message')">
                Show Latest Update Message
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-btn block large color="primary" @click="bulkExport">
                <v-icon start>mdi-database</v-icon>
                Create Data Backup
                <cc-tooltip
                  inline
                  content="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often.">
                  <v-icon end variant="plain">mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </v-btn>
            </v-col>

            <v-col>
              <v-dialog v-model="importDialog" width="50%">
                <template #activator="{ props }">
                  <v-btn block large color="primary" v-bind="props">
                    <v-icon start>mdi-database-refresh</v-icon>
                    Load Data Backup
                    <cc-tooltip
                      inline
                      content="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often.">
                      <v-icon end variant="plain">mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text class="pa-6">
                    <p class="text-center heading h3 text-text">
                      This will OVERWRITE
                      <b class="text-accent">ALL</b>
                      local COMP/CON data.
                      <br />
                      This
                      <b class="text-accent">cannot</b>
                      be undone.
                    </p>
                    <v-file-input
                      v-model="fileValue"
                      accept=".compcon"
                      variant="outlined"
                      density="compact"
                      hide-details
                      autofocus
                      placeholder="Select COMP/CON Bulk Export File"
                      prepend-icon="mdi-paperclip"
                      @change="bulkImport" />
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <h3 class="heading text-accent">Advanced Options</h3>
          <v-switch v-model="userViewExotics" color="exotic" inset density="compact" hide-details>
            <template #label>
              Show Exotic items in the Compendium
              <cc-tooltip
                title="SPOILER ALERT"
                content="Enabling this option may reveal campaign spoilers and it is recommended to leave this setting DISABLED
              if you are not the GM"
                inline>
                <v-icon end size="small" color="deep-orange" icon="mdi-alert-outline" />
              </cc-tooltip>
            </template>
          </v-switch>
          <!-- <v-switch
            v-model="userAllowQuickstart"
            color="exotic"
            inset
            density="compact"
            hide-details>
            <template #label>Enable quick pilot creation and level-up</template>
          </v-switch> -->
          <h3 class="heading text-accent mt-2">Theme</h3>
          <v-select
            v-model="theme"
            density="compact"
            variant="outlined"
            :items="themes"
            item-title="name" />
          <h3 class="heading text-accent mt-2">Log Level</h3>
          <v-menu>
            <template #activator="{ props }">
              <v-list-item v-bind="props" three-line border>
                <v-list-item-title>Log level:</v-list-item-title>
                <v-list-item-subtitle>
                  <b class="text-uppercase">{{ logLevel.name }}</b>
                </v-list-item-subtitle>
                <template #append>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item
                v-for="item in logLevels"
                :key="item.level"
                @click="setLogLevel(item)"
                :class="{ 'primary--text': item.level === logLevel.level }">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.detail }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <div class="text-right">
        <v-btn size="x-small" variant="text" to="/ui-test">UI Test</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import * as allThemes from '@/ui/style/themes';

import { UserStore } from '@/stores';
import { exportAll, importAll, clearAllData } from '@/io/BulkData';
import { saveFile } from '@/io/Data';

export default {
  name: 'options-settings',
  data: () => ({
    importDialog: false,
    fileValue: null as any,
    deleteDialog: false,
    logLevel: {
      name: 'Warning',
      level: 3,
      detail: 'Record warning and error messages (recommended)',
    },
    logLevels: [
      { name: 'Debug', level: 1, detail: 'Record all log messages (slow, use only for debugging)' },
      { name: 'Info', level: 2, detail: 'Record info, warning, and error messages' },
      { name: 'Warning', level: 3, detail: 'Record warning and error messages (recommended)' },
      { name: 'Error', level: 4, detail: 'Record only error messages' },
    ],
  }),
  emits: ['show-message'],
  computed: {
    user() {
      return UserStore().User;
    },
    userViewExotics: {
      get: function () {
        return this.user.Option('showExotics');
      },
      set: function (newVal) {
        this.user.SetOption('showExotics', newVal);
      },
    },
    userAllowQuickstart: {
      get: function () {
        return this.user.Option('quickstart');
      },
      set: function (newVal) {
        this.user.SetOption('quickstart', newVal);
      },
    },
    theme: {
      get: function () {
        return this.user.Theme;
      },
      set: function (newVal) {
        this.user.Theme = newVal;
        // @ts-ignore
        this.$vuetify.theme.global.name = newVal;
      },
    },
    userID() {
      return this.user.ID;
    },
    themes() {
      return Object.keys(allThemes).map((x) => ({ name: allThemes[x].name, value: x }));
    },
  },
  created() {
    this.logLevel =
      this.logLevels.find((x) => x.name.toLowerCase() === this.user.LogLevel) || this.logLevels[2];
  },
  methods: {
    reload() {
      location.reload();
    },
    setLogLevel(item) {
      this.logLevel = item;
      this.user.LogLevel = item.name.toLowerCase();
    },
    async bulkExport() {
      const result = await exportAll();
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        JSON.stringify(result),
        'Save COMP/CON Archive'
      );
    },
    async bulkImport(file) {
      await importAll(file)
        .then(() =>
          this.$notify({
            title: 'Data import successful',
            text: `Local user data has been overwritten.`,
            data: { icon: 'mdi-database-arrow-left-outline' },
          })
        )
        .catch((err) =>
          this.$notify({
            title: 'Unable to import data',
            text: `ERROR: ${err}`,
            data: { color: 'error', icon: 'mdi-database-off-outline' },
          })
        );
      this.importDialog = false;
    },
    async deleteAll() {
      await clearAllData(false);
      this.deleteDialog = false;
    },
  },
};
</script>
