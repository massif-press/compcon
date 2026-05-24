<template>
  <v-progress-linear v-if="!metadata"
    indeterminate
    color="accent" />
  <v-card v-else
    flat
    border
    tile
    class="mb-4">
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          text="Sync Settings"
          tooltip=" These options control how and when your data is synchronized with the cloud. By
              default, data is only synced manually. Unlike other user settings, these settings are
              stored in the cloud and are applied to all devices you use." />
      </v-toolbar-title>
    </v-toolbar>

    <div class="px-6">
      <v-row align="center"
        justify="space-around"
        class="mt-1">
        <v-col cols="12"
          md="6">
          <div class="text-cc-overline text-disabled">// Frequency</div>
          <cc-select v-model="settings.frequency"
            :items="syncOptions"
            tooltip="Controls how often your data is synchronized with the cloud. Due to server costs,
                  certain options are only available to Patreon subscribers." />
        </v-col>
        <v-col cols="12"
          md="6">
          <div class="text-cc-overline text-disabled">// Sync Items</div>
          <v-btn-toggle :model-value="itemTypePreset"
            density="compact"
            variant="outlined"
            flat
            tile
            @update:model-value="applyItemTypePreset">
            <v-btn value="all"
              size="small"
              height="30">All</v-btn>
            <v-btn value="pilots"
              size="small"
              height="30">Pilots Only</v-btn>
            <v-btn value="custom"
              size="small"
              height="30">Custom</v-btn>
          </v-btn-toggle>
          <cc-select v-if="itemTypePreset === 'custom'"
            v-model="settings.itemTypes"
            multiple
            clearable
            chip-variant="tonal"
            label="Item Types"
            all-text="All Item Types"
            none-text="None"
            select-all
            :max="$vuetify.display.lgAndUp ? 3 : 2"
            tooltip="Controls which data types are synced with the cloud."
            :items="syncItems" />
        </v-col>
      </v-row>
      <v-fade-transition>
        <div v-if="settingsDirty"
          class="text-right mt-2">
          <cc-button prepend-icon="mdi-cog-sync"
            color="primary"
            size="small"
            :loading="loadingSync"
            @click="updateSyncSettings">
            Update Sync Settings
          </cc-button>
        </div>
      </v-fade-transition>
    </div>

    <div class="text-center text-caption mt-1 mb-4 px-6">
      <span v-if="cloudStorageFull"
        class="text-error">Cloud storage is full! Unable to sync new data.</span>

    </div>
    <div v-if="lastSyncTime"
      class="text-center text-caption text-disabled mt-1">
      Last synced: {{ lastSyncLabel }}
    </div>

    <cc-button block
      color="primary"
      class="mt-4 mx-6"
      :loading="syncing"
      :disabled="!itemsPendingSync || cloudStorageFull"
      prepend-icon="mdi-sync"
      @click="runSync()">
      sync with current settings
      <template #options>
        <v-list max-width="500"
          lines="two"
          border>
          <div class="px-2 pb-2">
            <div class="heading">SYNC OVERRIDES</div>
            <div class="text-caption text-accent">
              The following operations override sync settings and should be used with caution.
            </div>
          </div>
          <v-divider />
          <v-list-item title="Force Upload"
            subtitle="Pushes all local data to the cloud unconditionally, resetting field timestamps to now. Use after a restore or import."
            @click="runSync('upload')" />
          <v-list-item title="Force Download"
            subtitle="Pulls all cloud data and merges it with local data. Local fields with newer timestamps are preserved."
            @click="runSync('download')" />
          <v-divider />
          <v-list-item title="Remove Deleted Items"
            subtitle="Permanently removes items flagged for deletion."
            @click="permDeleteSync()" />
        </v-list>
      </template>
    </cc-button>

    <div v-if="syncCountLabel"
      class="text-disabled text-center text-cc-overline pb-1">{{ syncCountLabel
      }}
    </div>

  </v-card>
</template>

<script lang="ts">
import { UserStore } from '@/stores'

export default {
  name: 'SyncSettings',
  data: () => ({
    settingsDirty: false,
    loadingSync: false,
    syncing: false,
    selectedItems: [] as string[],
    forceCustom: false,
  }),
  computed: {
    metadata() {
      return UserStore().UserMetadata
    },
    settings() {
      return UserStore().UserMetadata.SyncSettings
    },
    itemsPendingSync() {
      return UserStore().AllItemsToSync.length + UserStore().AllRemoteItemsToSync.length
    },
    syncCountLabel() {
      const items = UserStore().AllItemsToSync
      if (!items.length) return '0 items'
      const counts: Record<string, number> = {}
      for (const item of items) {
        const t = item.ItemType?.toLowerCase() ?? 'item'
        counts[t] = (counts[t] ?? 0) + 1
      }
      const parts = Object.entries(counts).map(([t, n]) => `${n} ${t}${n > 1 ? 's' : ''}`)
      return parts.join(' · ')
    },
    lastSyncTime() {
      return UserStore().SyncSettings?.lastSyncTime ?? 0
    },
    lastSyncLabel() {
      if (!this.lastSyncTime) return null
      const diff = Date.now() - this.lastSyncTime
      if (diff < 60_000) return 'just now'
      if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
      if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
      return new Date(this.lastSyncTime).toLocaleDateString()
    },
    cloudStorageFull() {
      return UserStore().CloudStorageFull
    },
    patreonTier() {
      return UserStore().User.PatreonTierValue
    },
    syncOptions() {
      return [
        {
          title: 'Manual Only',
          value: 'manual',
          subtitle: 'Data is only synced when you click Sync.',
        },
        {
          title: 'On Open & Close',
          value: 'startAndClose',
          subtitle: 'Syncs when you open and close the app. Close sync may not be supported on all browsers.',
        },
        {
          title: 'Every 30 Minutes',
          value: 'minutes_30',
          subtitle: 'Syncs automatically every 30 minutes. Requires Patreon supporter.',
          disabled: this.patreonTier < 1,
        },
        {
          title: 'Every 60 Minutes',
          value: 'minutes_60',
          subtitle: 'Syncs automatically every 60 minutes. Requires Patreon supporter.',
          disabled: this.patreonTier < 1,
        },
      ]
    },
    syncItems() {
      return [
        { title: 'Pilot Data', value: 'pilot' },
        { title: 'Pilot Groups', value: 'pilotgroup' },
        { title: 'NPC Data', value: 'npc' },
        { title: 'Encounter Data', value: 'encounter' },
        { title: 'Narrative Data', value: 'collectionitem' },
      ]
    },
    itemTypePreset() {
      if (this.forceCustom) return 'custom'
      const all = this.syncItems.map((i: any) => i.value)
      const current = this.settings.itemTypes ?? []
      if (!current.length || all.every((v: string) => current.includes(v))) return 'all'
      if (current.length === 1 && current[0] === 'pilot') return 'pilots'
      return 'custom'
    },
  },
  watch: {
    settings: {
      handler() {
        this.settingsDirty = true
      },
      deep: true,
    },
  },
  methods: {
    applyItemTypePreset(preset: string) {
      const all = this.syncItems.map((i: any) => i.value)
      if (preset === 'all') { this.settings.itemTypes = all; this.forceCustom = false }
      else if (preset === 'pilots') { this.settings.itemTypes = ['pilot']; this.forceCustom = false }
      else if (preset === 'custom') { this.forceCustom = true }
    },
    async updateSyncSettings() {
      this.loadingSync = true
      await UserStore().setUserMetadata()
      UserStore().setSyncTimer()
      this.settingsDirty = false
      this.loadingSync = false
    },
    async runSync(override?: 'upload' | 'download') {
      const total = UserStore().AllItemsToSync.length
      this.syncing = true
      const failures = await UserStore().AutoSync(override)
      this.settingsDirty = false
      this.syncing = false

      if (failures.length) {
        this.$notify({
          title: `${total - failures.length}/${total} Items Synced`,
          text: `Failed to fully sync ${failures.length} items. This may be due to missing local data.`,
          type: 'error',
        })
      } else {
        this.$notify({
          title: `${total}/${total} Items Synced`,
          text: 'All items were successfully synced.',
          type: 'success',
        })
      }
    },
    async permDeleteSync() {
      this.syncing = true
      try {
        const count = await UserStore().permDeleteFlaggedItems()
        this.$notify({
          title: `${count} Item${count !== 1 ? 's' : ''} Permanently Deleted`,
          text:
            count > 0
              ? 'All flagged items have been removed from the cloud.'
              : 'No items were flagged for deletion.',
          type: count > 0 ? 'success' : 'info',
        })
      } catch (e) {
        this.$notify({
          title: 'Deletion Failed',
          text: 'An error occurred while deleting flagged items.',
          type: 'error',
        })
      } finally {
        this.syncing = false
      }
    },
  },
}
</script>
