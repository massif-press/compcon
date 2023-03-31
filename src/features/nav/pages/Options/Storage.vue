<template>
  <div>
    <h3 class="heading text-accent">Storage</h3>
    <div class="flavor-text">
      COMP/CON is currently using {{ bytesToSize(size.usage) }} of
      {{ bytesToSize(size.quota) }}, or
      <b class="text-accent"
        >{{ ((size.usage / size.quota) * 100).toFixed(3) }}%</b
      >
      of your available storage. This includes space reveserved by COMP/CON for
      app management.
    </div>
    <v-divider class="my-4" />

    <h3 class="heading text-accent">Deleted Items (local data only)</h3>
    <deleted-items />
    <v-dialog v-model="deleteDialog" width="80%">
      <template v-slot:activator="{ props }">
        <v-btn block color="error" class="my-1" v-bind="props">
          <v-icon start v-html="'mdi-alert'" />
          Delete All User Data
          <v-icon end v-html="'mdi-alert'" />
        </v-btn>
      </template>
      <v-card flat tile>
        <v-card-text>
          <v-alert
            prominent
            dark
            color="error"
            icon="mdi-alert-circle"
            border="bottom"
            class="my-3"
          >
            <span class="heading h2">WARNING // WARNING // WARNING</span>
          </v-alert>
          <p class="text-center heading h2 text-text">
            This will delete
            <b class="text-accent">ALL</b>
            local COMP/CON data.
            <br />
            This
            <b class="text-accent">cannot</b>
            be undone.
            <br />
            <br />
            <b class="text-accent">Are you sure you want to continue?</b>
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="secondary" text large @click="deleteDialog = false"
            >Dismiss</v-btn
          >
          <v-spacer />
          <v-btn color="error" text @click="deleteAll">
            <v-icon start v-html="'mdi-alert'" />
            Delete All User Data
            <v-icon end v-html="'mdi-alert'" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import * as allThemes from '@/ui/style/themes';

import { UserStore } from '@/stores';
import { exportAll, importAll, clearAllData } from '@/io/BulkData';
import { saveFile } from '@/io/Dialog';
import DeletedItems from './DeletedItems.vue';
import { SetTheme } from '@/classes/utility/ThemeManager';

export default {
  name: 'options-storage',
  components: { DeletedItems },
  data: () => ({
    themes: [],
    importDialog: false,
    fileValue: null,
    deleteDialog: false,
    size: { usage: '', quota: '' },
  }),
  computed: {
    user() {
      const store = UserStore();
      return store.UserProfile;
    },
    userViewExotics: {
      get: function () {
        return this.user.GetView('showExotics');
      },
      set: function (newval) {
        this.user.SetView('showExotics', newval);
      },
    },
    userAllowQuickstart: {
      get: function () {
        return this.user.GetView('quickstart');
      },
      set: function (newval) {
        this.user.SetView('quickstart', newval);
      },
    },
    userSaveStrategy: {
      get: function () {
        return this.user.GetView('savePerformant');
      },
      set: function (newval) {
        this.user.SetView('savePerformant', newval);
      },
    },
    theme: {
      get: function () {
        return this.user.Theme;
      },
      set: function (newval) {
        this.user.Theme = newval;
        SetTheme(this.theme, this.$vuetify);
      },
    },
    userID() {
      return this.user.id;
    },
    userTheme() {
      return this.user.Theme;
    },
  },
  created() {
    for (const k in allThemes) {
      const e = allThemes[k];
      this.themes.push({ name: e.name, value: e.id });
    }
  },
  async mounted() {
    this.size = await navigator.storage.estimate();
  },
  methods: {
    reload() {
      location.reload();
    },
    bytesToSize(bytes: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return 'n/a';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) return `${bytes} ${sizes[i]})`;
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    },
    showMessage() {
      const store = UserStore();
      store.UserProfile.WelcomeHash = '';
      localStorage.removeItem('cc-welcome-hash');
      this.reload();
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
        .then(() => this.$notify('Data import successful', 'confirmation'))
        .catch((err) =>
          this.$notify(`ERROR: Unable to import: ${err}`, 'error')
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
