<template>
  <v-progress-linear v-if="!metadata" indeterminate color="accent" />
  <v-card v-else flat border class="mb-4">
    <v-toolbar density="compact">
      <v-toolbar-title>
        <div class="heading h3">
          <span class="text-accent">
            SYNC SETTINGS
            <v-tooltip max-width="300px" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-small" class="mt-n1">mdi-help-circle-outline</v-icon>
              </template>
              These options control how and when your data is synchronized with the cloud. By
              default, data is only synced manually. Unlike other user settings, these settings are
              stored in the cloud and are applied to all devices you use.
            </v-tooltip>
          </span>
        </div>
      </v-toolbar-title>
    </v-toolbar>

    <div class="pa-2">
      <v-row align="center">
        <v-col cols="6">
          <v-row align="center" class="mt-1">
            <v-col cols="5">
              <div class="font-weight-bold text-right">
                Sync Frequency
                <v-tooltip max-width="600px" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  Controls how often your data is synchronized with the cloud. Due to server costs,
                  certain options are only available to Patreon subscribers.
                </v-tooltip>
              </div>
            </v-col>
            <v-col>
              <v-menu offset-y>
                <template #activator="{ props }">
                  <v-btn size="small" block v-bind="props">
                    {{ syncOptions.find((opt) => opt.value === settings.frequency)?.title || '' }}
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="option in syncOptions"
                    :title="option.title"
                    :subtitle="option.subtitle"
                    @click="settings.frequency = option.value" />
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row align="center">
            <v-col cols="5">
              <div class="font-weight-bold text-right">
                Sync Items
                <v-tooltip max-width="600px" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  Controls which data is synced with the cloud. By default, all data is synced. If
                  no item types are selected, only marked items are synced. You can mark items in
                  the Cloud Data Viewer.
                </v-tooltip>
              </div>
            </v-col>
            <v-col>
              <v-select
                v-model="settings.itemTypes"
                multiple
                small-chips
                :items="syncItems"
                density="compact"
                hide-details>
                <template #prepend-inner>
                  <v-chip v-if="!settings.itemTypes.length" size="small">
                    <span>Marked Items Only</span>
                  </v-chip>
                </template>

                <template #selection="{ item, index }">
                  <v-chip size="small" v-if="index < 3">
                    <span>{{ item.title }}</span>
                  </v-chip>
                  <span v-if="index === 3" class="text-grey text-caption align-self-center">
                    &emsp;(+{{ settings.itemTypes.length - 3 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row align="center">
            <v-col cols="5">
              <div class="font-weight-bold text-right">
                Snyc User Settings
                <v-tooltip max-width="600px" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  On sync events, COMP/CON will sync user settings, such as theme, selected view
                  options, etc. User settings are always synced to the latest version in the cloud,
                  regardless of the resolution strategy, and can be managed in the "Other" tab of
                  the Cloud Data Viewer.
                </v-tooltip>
              </div>
            </v-col>
            <v-col>
              <v-btn
                block
                size="small"
                @click="settings.includeSettings = !settings.includeSettings">
                {{ settings.includeSettings ? 'ON' : 'OFF' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row align="center">
            <v-col cols="5">
              <div class="font-weight-bold text-right">
                Snyc Shared Items
                <v-tooltip max-width="600px" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  On sync events, COMP/CON will also update all shared items to the latest version.
                </v-tooltip>
              </div>
            </v-col>
            <v-col>
              <v-btn block size="small" @click="settings.includeShared = !settings.includeShared">
                {{ settings.includeShared ? 'ON' : 'OFF' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row align="center">
            <v-col cols="5">
              <div class="font-weight-bold text-right">
                Resolution Strategy
                <v-tooltip max-width="600px" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  This setting controls how conflicts between local and cloud data are resolved. By
                  default, the most recently modified data is kept. If "Manual" is selected, you can
                  use the Cloud Data Viewer to determine which data to keep.
                </v-tooltip>
              </div>
            </v-col>
            <v-col>
              <v-select
                v-model="settings.resolutionStrategy"
                :items="resolutionOptions"
                density="compact"
                hide-details />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row align="center">
            <v-col cols="5">
              <div class="font-weight-bold text-right">
                Deleted Item Retention
                <v-tooltip max-width="600px" location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="x-small" class="mt-n1" color="primary">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  This setting determines how long deleted items are kept in the cloud before being
                  permanently removed, even if they have been permanently deleted locally. By
                  default, deleted items persist for 90 days and can be recovered in the Cloud Data
                  Viewer. Selecting "None" will permanently delete items in the cloud as soon as
                  they are deleted locally.
                  <br />
                  Patreon subscribers can select "Keep" to keep deleted items until manually
                  removed.
                </v-tooltip>
              </div>
            </v-col>
            <v-col>
              <v-select
                v-model="settings.itemRetention"
                :items="deletionOptions"
                density="compact"
                hide-details />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6"></v-col>
      </v-row>
      <v-fade-transition>
        <div v-if="settingsDirty" class="text-right mt-2">
          <v-btn
            size="small"
            prepend-icon="mdi-cog-sync"
            color="accent"
            :loading="loadingSync"
            @click="updateSyncSettings">
            Update Sync Settings
          </v-btn>
        </div>
      </v-fade-transition>
    </div>

    <v-card flat class="ma-4">
      <v-row dense>
        <v-col>
          <v-card
            ripple
            color="accent"
            class="py-2 px-4"
            :loading="syncing"
            :disabled="!itemsPendingSync || cloudStorageFull"
            @click="runSync()">
            <v-row align="center" dense>
              <v-col cols="auto">
                <v-icon size="x-large" icon="mdi-sync" />
              </v-col>
              <v-col>
                <div class="heading h3">sync with current settings</div>
                <div v-if="cloudStorageFull" class="text-caption">
                  Cloud storage is full! Unable to create new archives.
                </div>
              </v-col>
              <v-col cols="auto">
                <div class="text-button">{{ itemsPendingSync }} items</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                size="52"
                icon
                variant="tonal"
                rounded="0"
                :disabled="cloudStorageFull"
                v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list max-width="500" lines="two">
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
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
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
    syncOptions: [
      {
        title: 'Manual Only',
        value: 'manual',
        subtitle: 'Data is only synced when you click the sync or quick sync button.',
      },
      { title: 'On App Start', value: 'start', subtitle: 'Data is synced when you open the app.' },
      {
        title: 'On App Close',
        value: 'close',
        subtitle: 'Data is synced when you close the app. May not be supported on all browsers.',
      },
      {
        title: 'On App Start and Close',
        value: 'startAndClose',
        subtitle:
          'Data is synced when you open and close the app. Syncing on close may not be supported on all browsers.',
      },
      {
        title: 'Every Hour',
        value: 'start_minutes_60',
        subtitle: 'Data is synced on startup, then every 60 minutes thereafter.',
      },
      {
        title: 'Every 30 Minutes',
        value: 'start_minutes_30',
        subtitle: 'Data is synced on startup, then every 30 minutes thereafter.',
      },
      {
        title: 'Every 10 Minutes',
        value: 'start_minutes_10',
        subtitle: 'Data is synced on startup, then every 10 minutes thereafter.',
      },
      {
        title: 'Every 5 Minutes',
        value: 'start_minutes_5',
        subtitle: 'Data is synced on startup, then every 5 minutes thereafter.',
      },
    ],
    syncItems: [
      { title: 'Pilot Data', value: 'pilot' },
      { title: 'NPC Data', value: 'npc' },
      { title: 'Campaign Data', value: 'campaign' },
      { title: 'Encounter Data', value: 'encounter' },
      { title: 'Narrative Data', value: 'collectionitem' },
    ],
    resolutionOptions: [
      { title: 'Keep Newest', value: 'newest' },
      { title: 'Local Wins', value: 'local' },
      { title: 'Cloud Wins', value: 'cloud' },
      { title: 'Manual', value: 'manual' },
    ],
    deletionOptions: [
      { title: 'None', value: '0' },
      { title: '7 Days', value: '7' },
      { title: '30 Days', value: '30' },
      { title: '90 Days', value: '90' },
      { title: '1 Year', value: '365' },
      { title: 'Keep', value: '-1', disabled: true },
    ],
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
