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
          <v-tab disabled>Images</v-tab>
          <v-tab disabled>Other</v-tab>
          <v-divider vertical />
          <v-tab disabled>Shared Items</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-window v-model="tab">
      <v-window-item value="Data">
        <item-data-tab :search="search" @refresh="refresh" :loading="loading" />
      </v-window-item>
      <v-window-item value="Images">
        <v-data-table
          density="compact"
          :headers="imageHeaders"
          :items="imageItems"
          item-key="name"
          :items-per-page="25">
          <template #item.image="{ item }">
            <v-img height="80" :src="item.image" />
          </template>
          <template #item.actions="{ item }">
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-btn size="small" color="accent" icon variant="text" v-bind="props">
                  <v-icon size="x-large">mdi-magnify</v-icon>
                </v-btn>
              </template>
              <div class="text-center">View Image</div>
            </v-tooltip>

            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-btn size="small" color="accent" icon variant="text" v-bind="props">
                  <v-icon size="x-large">mdi-download</v-icon>
                </v-btn>
              </template>
              <div class="text-center">Download Copy</div>
            </v-tooltip>

            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-btn size="small" color="accent" variant="text" icon v-bind="props">
                  <v-icon size="x-large">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <div class="text-center">
                Delete
                <br />
                <i class="text-caption">
                  Please note that this will break any references to this image in your data. This
                  action cannot be undone.
                </i>
              </div>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-window-item>
      <v-window-item value="Other">nyi</v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';
import DiffViewer from './data_viewer/diffViewer.vue';
import ItemDataTab from './data_viewer/ItemDataTab.vue';

export default {
  name: 'cloud-data-viewer',
  components: {
    DiffViewer,
    ItemDataTab,
  },
  data: () => ({
    tab: 'Data',
    search: '',
    loading: false,

    imageHeaders: [
      { title: '', key: 'image' },
      { title: 'Filename', key: 'filename' },
      { title: 'Upload Date', key: 'uploadDate' },
      { title: '', key: 'actions', width: '155px' },
    ],

    imageItems: [
      {
        image: 'https://via.placeholder.com/100',
        filename: 'test.png',
        uploadDate: '2021-01-01',
      },
    ],
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
