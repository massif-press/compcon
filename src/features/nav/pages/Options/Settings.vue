<template>
  <v-container :class="!mobile && 'px-12'">
    <v-row align="center" justify="space-between" dense>
      <v-col cols="auto">
        <cc-button block color="primary" size="small" @click="showUpdates">
          Show Update Messages
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-switch
          v-model="userViewExotics"
          color="exotic"
          density="compact"
          tooltip="Enabling this option may reveal campaign spoilers and it is recommended to leave this setting DISABLED if you are not the GM"
          label="Show Exotic items in the Compendium"></cc-switch>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" sm="6">
        <cc-heading title text="Theme" />
        <cc-select v-model="theme" :items="themes" item-title="name" />
      </v-col>
      <v-col cols="12" sm="6">
        <cc-heading title text="Log Level" />
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
              :title="item.name"
              :subtitle="item.detail" />
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <cc-button
          block
          size="large"
          color="primary"
          prepend-icon="mdi-database"
          tooltip="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often."
          @click="bulkExport">
          Create Data Backup
        </cc-button>
      </v-col>

      <v-col cols="12" md="6">
        <v-dialog v-model="importDialog" width="50%">
          <template #activator="{ props }">
            <cc-button
              v-bind="props"
              block
              size="large"
              color="primary"
              prepend-icon="mdi-database"
              tooltip="COMP/CON relies on your browser to save and load its data. Settings, utilities, and other applications can erase your browser's localStorage cache, resulting in the loss of your COMP/CON data. IT is <b>strongly</b> recommended to back up your data often.">
              Load Data Backup
            </cc-button>
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

    <div class="text-right">
      <v-btn size="x-small" variant="text" to="/ui-test">UI Test I</v-btn>
      <v-btn size="x-small" variant="text" to="/ui-test-new">UI Test II</v-btn>
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
      { name: 'Debug', level: 1, detail: 'Record all log messages (very slow)' },
      { name: 'Info', level: 2, detail: 'Record info, warning, and error messages' },
      { name: 'Warning', level: 3, detail: 'Record warning and error messages (recommended)' },
      { name: 'Error', level: 4, detail: 'Record only error messages' },
    ],
  }),
  emits: ['show-message'],
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
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
    showUpdates() {
      this.user.SetView('WelcomePanel', true);
      this.reload();
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
      await clearAllData();
      this.deleteDialog = false;
    },
  },
};
</script>
