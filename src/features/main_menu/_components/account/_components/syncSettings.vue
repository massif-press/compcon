<template>
  <v-progress-linear v-if="!metadata" indeterminate color="accent" />
  <v-card v-else flat border tile class="mb-4">
    <v-toolbar density="compact" color="panel">
      <v-toolbar-title>
        <cc-heading
          is-title
          text="Sync Settings"
          tooltip=" These options control how and when your data is synchronized with the cloud. By
              default, data is only synced manually. Unlike other user settings, these settings are
              stored in the cloud and are applied to all devices you use." />
      </v-toolbar-title>
    </v-toolbar>

    <div class="px-6">
      <v-row align="center" justify="space-around" class="mt-1">
        <v-col cols="12" md="6">
          <cc-select
            v-model="settings.frequency"
            label="sync frequency"
            :items="syncOptions"
            tooltip="Controls how often your data is synchronized with the cloud. Due to server costs,
                  certain options are only available to Patreon subscribers." />
        </v-col>
        <v-col cols="12" md="6">
          <cc-select
            v-model="settings.includeSettings"
            label="sync user settings"
            tooltip="On sync events, COMP/CON will also update all shared items to the latest version."
            :items="[
              { title: 'On', value: true },
              { title: 'Off', value: false },
            ]" />
        </v-col>
        <v-col cols="12" md="6">
          <cc-select
            v-model="settings.includeShared"
            label="Snyc Shared Items"
            tooltip="On sync events, COMP/CON will also update all shared items to the latest version."
            :items="[
              { title: 'On', value: true },
              { title: 'Off', value: false },
            ]" />
        </v-col>
        <v-col cols="12" md="6">
          <cc-select
            v-model="settings.resolutionStrategy"
            label="Resolution Strategy"
            tooltip="This setting controls how conflicts between local and cloud data are resolved. By
                  default, the most recently modified data is kept. If 'Manual' is selected, you can
                  use the Cloud Data Viewer to determine which data to keep."
            :items="resolutionOptions" />
        </v-col>
        <v-col cols="12">
          <cc-select
            v-model="settings.itemTypes"
            multiple
            clearable
            chip-variant="tonal"
            label="Sync Items"
            tooltip="Controls which data is synced with the cloud. By default, all data is synced. If
                  no item types are selected, only marked items are synced. You can mark items in
                  the Cloud Data Viewer."
            :items="syncItems" />
        </v-col>
      </v-row>
      <v-fade-transition>
        <div v-if="settingsDirty" class="text-right mt-2">
          <cc-button
            prepend-icon="mdi-cog-sync"
            color="primary"
            size="small"
            :loading="loadingSync"
            @click="updateSyncSettings">
            Update Sync Settings
          </cc-button>
        </div>
      </v-fade-transition>
    </div>

    <cc-button
      block
      color="primary"
      class="my-4 mx-6"
      :loading="syncing"
      :disabled="!itemsPendingSync || cloudStorageFull"
      prepend-icon="mdi-sync"
      @click="runSync()">
      sync with current settings
      <template #info>
        <span class="text-cc-overline">{{ itemsPendingSync }} items</span>
      </template>
      <template #subtitle v-if="cloudStorageFull">
        <span class="text-cc-overline">Cloud storage is full! Unable to create new archives</span>
      </template>
      <template #options>
        <v-list max-width="500" lines="two" border>
          <div class="px-2 pb-2">
            <div class="heading">SYNC OVERRIDES</div>
            <div class="text-caption text-accent">
              The following operations override sync settings and should be used with caution.
            </div>
          </div>
          <v-divider />
          <v-list-item
            title="Force to Newest"
            subtitle="Overwrites all local and cloud items with their most recently modified versions."
            @click="runSync('newest')" />
          <v-list-item
            title="Force to Local"
            subtitle="Overwrites all cloud items with the current locally-saved data, regardless of when the items were last modified."
            @click="runSync('local')" />
          <v-list-item
            title="Overwite to Cloud"
            subtitle="Overwrites all local items with cloud data, regardless of when the items were last modified."
            @click="runSync('cloud')" />
        </v-list>
      </template>
    </cc-button>
  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'sync-settings',
  data: () => ({
    settingsDirty: false,
    loadingSync: false,
    syncing: false,
    selectedItems: [] as string[],
  }),
  computed: {
    metadata() {
      return UserStore().UserMetadata;
    },
    settings() {
      return UserStore().UserMetadata.SyncSettings;
    },
    itemsPendingSync() {
      const userItems = UserStore().AllItemsToSync.length;
      const remoteItems = UserStore().AllRemoteItemsToSync.length;
      if (!UserStore().SyncSettings.includeShared) return userItems;
      return userItems + remoteItems;
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull;
    },
    patreonTier() {
      return UserStore().User.PatreonTierValue;
    },
    syncOptions() {
      return [
        {
          title: 'Manual Only',
          value: 'manual',
          subtitle: 'Data is only synced when you click the sync or quick sync button.',
        },
        {
          title: 'On App Start',
          value: 'start',
          subtitle: 'Data is synced when you open the app.',
        },
        {
          title: 'On App Close',
          value: 'close',
          disabled: this.patreonTier < 1,
          subtitle: 'Data is synced when you close the app. May not be supported on all browsers.',
        },
        {
          title: 'On App Start and Close',
          value: 'startAndClose',
          disabled: this.patreonTier < 1,
          subtitle:
            'Data is synced when you open and close the app. Syncing on close may not be supported on all browsers.',
        },
        {
          title: 'Every Hour',
          value: 'start_minutes_60',
          disabled: this.patreonTier < 2,
          subtitle: 'Data is synced on startup, then every 60 minutes thereafter.',
        },
        {
          title: 'Every 30 Minutes',
          value: 'start_minutes_30',
          disabled: this.patreonTier < 2,
          subtitle: 'Data is synced on startup, then every 30 minutes thereafter.',
        },
        {
          title: 'Every 10 Minutes',
          value: 'start_minutes_10',
          disabled: this.patreonTier < 3,
          subtitle: 'Data is synced on startup, then every 10 minutes thereafter.',
        },
        {
          title: 'Every 5 Minutes',
          value: 'start_minutes_5',
          disabled: this.patreonTier < 3,
          subtitle: 'Data is synced on startup, then every 5 minutes thereafter.',
        },
      ];
    },
    syncItems() {
      return [
        { title: 'Pilot Data', value: 'pilot' },
        { title: 'NPC Data', value: 'npc' },
        { title: 'Campaign Data', value: 'campaign' },
        { title: 'Encounter Data', value: 'encounter' },
        { title: 'Narrative Data', value: 'collectionitem' },
      ];
    },
    resolutionOptions() {
      return [
        { title: 'Keep Newest', value: 'newest' },
        { title: 'Local Wins', value: 'local' },
        { title: 'Cloud Wins', value: 'cloud' },
        { title: 'Manual', value: 'manual' },
      ];
    },
    deletionOptions() {
      const arr = [
        { title: 'None', value: '0' },
        { title: '7 Days', value: '7' },
        { title: '30 Days', value: '30' },
        { title: '90 Days', value: '90' },
        { title: '1 Year', value: '365' },
      ];
      if (this.patreonTier > 1) arr.push({ title: 'Forever', value: '-1' });
      return arr;
    },
  },
  watch: {
    settings: {
      handler() {
        this.settingsDirty = true;
      },
      deep: true,
    },
  },
  methods: {
    async updateSyncSettings() {
      this.loadingSync = true;
      await UserStore().setUserMetadata();
      UserStore().setSyncTimer();
      this.settingsDirty = false;
      this.loadingSync = false;
    },
    async runSync(override?: 'cloud' | 'local' | 'newest') {
      const total = UserStore().AllItemsToSync.length;
      this.syncing = true;
      const failures = await UserStore().AutoSync(override);
      this.settingsDirty = false;
      this.syncing = false;

      if (failures.length) {
        this.$notify({
          title: `${total - failures.length}/${total} Items Synced`,
          text: `Failed to fully sync ${failures.length} items. This may be due to missing or outdated LCPs.`,
          type: 'error',
        });
      } else {
        this.$notify({
          title: `${total}/${total} Items Synced`,
          text: 'All items were successfully synced.',
          type: 'success',
        });
      }
    },
  },
};
</script>
