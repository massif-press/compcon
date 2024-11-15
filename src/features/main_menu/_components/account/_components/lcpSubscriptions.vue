<template>
  <!-- {{ lcpSaveData }} -->
  <v-card flat border class="mb-4" disabled>
    <v-toolbar density="compact">
      <v-toolbar-title>
        <div class="heading h3">
          <span class="text-accent">
            LCP SUBSCRIPTIONS
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small" class="mt-n1">mdi-help-circle-outline</v-icon>
              </template>
              This setting is device-based and will not sync between devices. LCPs must be installed
              before they can be auto-updated. Some paid LCPs may require an itch.io purchase before
              allowing for automatic updates.
            </v-tooltip>
          </span>
          <v-chip color="secondary" size="small">Coming soon!</v-chip>
        </div>
      </v-toolbar-title>
      <v-select
        v-model="lcpSaveData.updateOn"
        density="compact"
        hide-details
        label="Updates"
        class="mx-2"
        style="max-width: 200px"
        :items="update_on"
        @update:model-value="user.save()" />
      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn size="small" color="accent" icon v-bind="props">
            <v-icon size="x-large">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          Refresh List
          <br />
          (This does not sync)
        </div>
      </v-tooltip>
      <v-tooltip max-width="300px" location="top">
        <template #activator="{ props }">
          <v-btn size="small" color="accent" icon v-bind="props">
            <v-icon size="x-large">mdi-download-multiple-outline</v-icon>
          </v-btn>
        </template>
        <div class="text-center">Update All</div>
      </v-tooltip>
    </v-toolbar>

    <v-divider />
    <v-data-table
      density="compact"
      :headers="<any>lcpHeaders"
      :items="installedPacks"
      item-key="name"
      :items-per-page="-1"
      hide-default-footer>
      <template #item.Name="{ item }">
        {{ item.manifest.name || 'Unknown' }}
      </template>
      <template #item.Author="{ item }">
        {{ item.manifest.author || 'Unknown' }}
      </template>
      <template #item.last_update="{ item }">
        {{ item.manifest.LastUpdated || '' }}
      </template>
      <template #item.Version="{ item }">
        {{ item.manifest.version || 'Unknown' }}
      </template>
      <template #item.auto="{ item }">
        <v-row no-gutters justify="center">
          <v-checkbox
            v-model="item.auto"
            density="compact"
            hide-details
            color="accent"
            @update:model-value="user.save()" />
        </v-row>
      </template>
      <template #item.actions="{ item }">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              color="accent"
              v-bind="props"
              @click=""
              disabled>
              <v-icon size="large" icon="mdi-download" />
            </v-btn>
          </template>
          <div class="text-center">Manual update</div>
        </v-tooltip>
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              color="accent"
              v-bind="props"
              target="_blank"
              :href="item.manifest.Website || ''">
              <v-icon size="large" icon="mdi-open-in-new" />
            </v-btn>
          </template>
          <div class="text-center">Open Website</div>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" size="small" variant="tonal" prepend-icon="mdi-open-in-app">
        Browse LCP Directory
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { CompendiumStore, UserStore } from '@/stores';

export default {
  name: 'lcp-subscriptions',
  data: () => ({
    lcpHeaders: [
      { title: 'LCP', key: 'Name' },
      { title: 'Author', key: 'Author' },
      { title: 'Installed Version', key: 'Version', align: 'center', sortable: false },
      { title: 'Latest Version', key: 'remote_version', align: 'center', sortable: false },
      { title: 'Latest Update', key: 'last_update', align: 'center', sortable: false },
      { title: 'Auto Update', key: 'auto', align: 'center', sortable: false },
      { title: '', key: 'actions', align: 'end', sortable: false },
    ],
    update_on: [
      {
        title: 'On Startup',
        value: 'auto',
      },
      {
        title: 'Manual Only',
        value: 'manual',
      },
    ],
  }),
  computed: {
    contentPacks() {
      return CompendiumStore().ContentPacks;
    },
    lcpSaveData() {
      return UserStore().User.LcpSubscriptionData;
    },
    installedPacks() {
      return this.lcpSaveData.items.filter((item) => !!this.packDataItem(item));
    },
    missingPacks() {
      return this.lcpSaveData.items.filter((item) => !this.packDataItem(item));
    },
    user() {
      return UserStore().User;
    },
  },
  methods: {
    packDataItem(save) {
      return this.contentPacks.find((pack) => pack.ID === save.packId);
    },
  },
};
</script>
