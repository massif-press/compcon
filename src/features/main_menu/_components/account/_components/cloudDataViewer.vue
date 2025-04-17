<template>
  <v-card flat border tile>
    <v-toolbar density="compact" color="panel">
      <v-toolbar-title>
        <cc-heading
          is-title
          text="Data Viewer"
          tooltip="This is a view of your COMP/CON data, stored both locally and in the cloud. You can
              use this tool to manage the state of your data, and to sync changes between your local
              data and the cloud." />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <cc-button
            v-bind="props"
            variant="tonal"
            :size="mobile ? 'small' : ''"
            class="mx-2"
            :loading="loading"
            icon="mdi-refresh"
            @click="refresh()" />
        </template>
        <div class="text-center">
          Reload Data
          <br />
          (This does not sync)
        </div>
      </v-tooltip>
      <template #extension>
        <cc-text-field
          v-if="!mobile"
          v-model="search"
          variant="outlined"
          color="primary"
          icon="mdi-magnify"
          placeholder="Search"
          width="350px"
          clearable />
        <v-spacer />
        <v-tabs v-model="tab">
          <v-tab>
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <span v-bind="props">Data</span>
              </template>
              <div class="text-center">PC and GM data stored in your COMP/CON account.</div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <span v-bind="props">Images</span>
              </template>
              <div class="text-center">
                All image data you have uploaded to your COMP/CON account.
              </div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <span v-bind="props">Remote Items</span>
              </template>
              <div class="text-center">
                Remote Items are items imported from other users via share codes.
              </div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <span v-bind="props">Campaigns</span>
              </template>
              <div class="text-center">Published campaigns imported from via share codes.</div>
            </v-tooltip>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-text-field
      v-if="mobile"
      v-model="search"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      label="Search"
      single-line
      density="compact"
      class="mx-1"
      clearable
      hide-details />
    <v-window v-model="tab">
      <v-window-item value="Data">
        <item-data-tab :search="search" @refresh="refresh" :loading="loading" />
      </v-window-item>
      <v-window-item value="Images">
        <image-data-tab :search="search" @refresh="refresh" :loading="loading" />
      </v-window-item>
      <v-window-item value="Remote">
        <remote-data-tab :search="search" @refresh="refresh" :loading="loading" />
      </v-window-item>
      <v-window-item value="Campaigns">
        <cc-alert color="secondary" class="ma-4" dense>
          Published campaigns are managed in the
          <cc-button size="x-small" class="mx-1" to="/srd?tab=2">Campaign Library</cc-button>
        </cc-alert>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import DiffViewer from './data_viewer/diffViewer.vue';
import ItemDataTab from './data_viewer/ItemDataTab.vue';
import RemoteDataTab from './data_viewer/RemoteDataTab.vue';
import ImageDataTab from './data_viewer/ImageDataTab.vue';

export default {
  name: 'cloud-data-viewer',
  components: {
    DiffViewer,
    ItemDataTab,
    RemoteDataTab,
    ImageDataTab,
  },
  data: () => ({
    tab: 'Data',
    search: '',
    loading: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    async refresh() {
      this.loading = true;
      await UserStore().refreshDbData();
      this.loading = false;
    },
  },
};
</script>

<style>
.v-data-table-header__content {
  font-weight: bold !important;
}
</style>
