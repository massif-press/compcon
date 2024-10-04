<template>
  <v-container class="px-12">
    <h3 class="heading text-accent">User Options</h3>
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <v-switch v-model="userViewExotics" color="exotic" density="compact" hide-details>
          <template #label>
            Show Exotic items in the Compendium
            <cc-tooltip
              title="SPOILER ALERT"
              content="Enabling this option may reveal campaign spoilers and it is recommended to leave this setting DISABLED if you are not the GM"
              inline>
              <v-icon end size="small" color="deep-orange" icon="mdi-alert" />
            </cc-tooltip>
          </template>
        </v-switch>
      </v-col>
      <v-col cols="auto">
        <v-btn color="accent" size="small" variant="tonal" @click="$emit('show-message')">
          Show Latest Update Message
        </v-btn>
      </v-col>
    </v-row>

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

    <v-row class="mt-4">
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

    <div class="text-right">
      <v-btn size="x-small" variant="text" to="/ui-test">UI Test</v-btn>
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
      await clearAllData();
      this.deleteDialog = false;
    },
  },
};
</script>
