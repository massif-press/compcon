<template>
  <v-card flat border>
    <v-toolbar extended density="compact">
      <v-toolbar-title>
        <div class="heading h3">
          <span class="text-accent">
            DATA VIEWER
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small" class="mt-n1">mdi-help-circle-outline</v-icon>
              </template>
              This is a view of your COMP/CON data, stored both locally and in the cloud. You can
              use this tool to manage the state of your data, and to sync changes between your local
              data and the cloud.
            </v-tooltip>
          </span>
        </div>
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn size="small" icon v-bind="props" @click="refresh()">
            <v-icon size="x-large">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          Reload Data
          <br />
          (This does not sync)
        </div>
      </v-tooltip>
      <template #extension>
        <v-text-field
          v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          class="mx-1"
          clearable
          hide-details />
        <v-spacer />
        <v-tabs v-model="tab">
          <v-tab>Data</v-tab>
          <v-tab>Images</v-tab>
          <v-divider vertical />
          <v-tab>
            Remote Items
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="small" end color="primary">
                  mdi-information-outline
                </v-icon>
              </template>
              <div class="text-center">
                Remote Items are items imported from other users via share codes.
              </div>
            </v-tooltip>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
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
