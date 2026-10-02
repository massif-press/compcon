<template>
  <v-progress-linear
    v-if="!metadata"
    indeterminate
    color="accent"
  />
  <v-card
    v-else
    flat
    border
    tile
    class="mb-4"
  >
    <v-toolbar
      density="compact"
      color="panel"
    >
      <v-toolbar-title>
        <cc-heading
          is-title
          :text="$t('mainMenu.syncSettings.syncSettings')"
          :tooltip="$t('mainMenu.syncSettings.syncSettingsHelp')"
        />
      </v-toolbar-title>
    </v-toolbar>

    <div class="px-6">
      <v-row
        align="center"
        justify="space-around"
        class="mt-1"
      >
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-cc-overline text-disabled">// {{ $t('ui.action.frequency') }}</div>
          <cc-select
            v-model="settings.frequency"
            :items="syncOptions"
            :tooltip="$t('mainMenu.syncSettings.syncFrequencyHelp')"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="text-cc-overline text-disabled">
            // {{ $t('mainMenu.syncSettings.syncItems') }}
          </div>
          <v-btn-toggle
            :model-value="itemTypePreset"
            density="compact"
            variant="outlined"
            flat
            tile
            @update:model-value="applyItemTypePreset"
          >
            <v-btn
              value="all"
              size="small"
              height="30"
            >
              {{ $t('common.all') }}
            </v-btn>
            <v-btn
              value="pilots"
              size="small"
              height="30"
            >
              {{ $t('mainMenu.syncSettings.pilotsOnly') }}
            </v-btn>
            <v-btn
              value="custom"
              size="small"
              height="30"
            >
              {{ $t('gm.stats.custom') }}
            </v-btn>
          </v-btn-toggle>
          <cc-select
            v-if="itemTypePreset === 'custom'"
            v-model="settings.itemTypes"
            multiple
            clearable
            chip-variant="tonal"
            :label="$t('mainMenu.syncSettings.itemTypes')"
            :all-text="$t('mainMenu.syncSettings.allItemTypes')"
            :none-text="$t('common.none')"
            select-all
            :max="$vuetify.display.lgAndUp ? 3 : 2"
            :tooltip="$t('mainMenu.syncSettings.syncDataTypesHelp')"
            :items="syncItems"
          />
        </v-col>
      </v-row>
      <v-fade-transition>
        <div
          v-if="settingsDirty"
          class="text-right mt-2"
        >
          <cc-button
            prepend-icon="mdi-cog-sync"
            color="primary"
            size="small"
            :loading="loadingSync"
            @click="updateSyncSettings"
          >
            {{ $t('mainMenu.syncSettings.updateSyncSettings') }}
          </cc-button>
        </div>
      </v-fade-transition>
    </div>

    <div class="text-center text-caption mt-1 mb-4 px-6">
      <span
        v-if="cloudStorageFull"
        class="text-error"
      >
        {{ $t('mainMenu.syncSettings.cloudFullSync') }}
      </span>
    </div>
    <div
      v-if="lastSyncTime"
      class="text-center text-caption text-disabled mt-1"
    >
      {{ $t('mainMenu.syncSettings.lastSynced', { label: lastSyncLabel }) }}
    </div>

    <cc-button
      block
      color="primary"
      class="mt-4 mx-6"
      :loading="syncing"
      :disabled="!itemsPendingSync || cloudStorageFull"
      prepend-icon="mdi-sync"
      @click="runSync()"
    >
      {{ $t('mainMenu.syncSettings.syncWithSettings') }}
      <template #options>
        <v-list
          max-width="500"
          lines="two"
          border
        >
          <div class="px-2 pb-2">
            <div class="heading">{{ $t('mainMenu.syncSettings.syncOverrides') }}</div>
            <div class="text-caption text-accent">
              {{ $t('mainMenu.syncSettings.syncOverridesNote') }}
            </div>
          </div>
          <v-divider />
          <v-list-item
            :title="$t('mainMenu.account.forceUpload')"
            :subtitle="$t('mainMenu.syncSettings.forcePushAllDescription')"
            @click="runSync('upload')"
          />
          <v-list-item
            :title="$t('mainMenu.account.forceDownload')"
            :subtitle="$t('mainMenu.syncSettings.pullAllDescription')"
            @click="runSync('download')"
          />
          <v-divider />
          <v-list-item
            :title="$t('mainMenu.syncSettings.removeDeletedItems')"
            :subtitle="$t('mainMenu.syncSettings.permanentlyRemovesItemsFlaggedFor')"
            @click="permDeleteSync()"
          />
        </v-list>
      </template>
    </cc-button>

    <div
      v-if="syncCountLabel"
      class="text-disabled text-center text-cc-overline pb-1"
    >
      {{ syncCountLabel }}
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t, te } = useI18n()
  import { computed, ref, watch } from 'vue'
  import { notify } from '@/util/notify'
  import { UserStore } from '@/stores'

  const settingsDirty = ref(false)
  const loadingSync = ref(false)
  const syncing = ref(false)
  const selectedItems = ref([] as string[])
  const forceCustom = ref(false)

  const metadata = computed(() => {
    return UserStore().UserMetadata
  })
  const settings = computed(() => {
    return UserStore().UserMetadata.SyncSettings
  })
  const itemsPendingSync = computed(() => {
    return UserStore().AllItemsToSync.length + UserStore().AllRemoteItemsToSync.length
  })
  const syncCountLabel = computed(() => {
    const items = UserStore().AllItemsToSync
    if (!items.length) return t('enums.syncItemCount.item', { n: 0 }, 0)
    const counts: Record<string, number> = {}
    for (const item of items) {
      const type = item.ItemType?.toLowerCase() ?? 'item'
      counts[type] = (counts[type] ?? 0) + 1
    }
    const parts = Object.entries(counts).map(([type, n]) =>
      t(
        te(`enums.syncItemCount.${type}`)
          ? `enums.syncItemCount.${type}`
          : 'enums.syncItemCount.item',
        { n },
        n
      )
    )
    return parts.join(' · ')
  })
  const lastSyncTime = computed(() => {
    return UserStore().SyncSettings?.lastSyncTime ?? 0
  })
  const lastSyncLabel = computed(() => {
    if (!lastSyncTime.value) return null
    const diff = Date.now() - lastSyncTime.value
    if (diff < 60_000) return 'just now'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
    return new Date(lastSyncTime.value).toLocaleDateString()
  })
  const cloudStorageFull = computed(() => {
    return UserStore().CloudStorageFull
  })
  const patreonTier = computed(() => {
    return UserStore().User.PatreonTierValue
  })
  const syncOptions = computed(() => {
    return [
      {
        title: t('mainMenu.account.manualOnly'),
        value: 'manual',
        subtitle: t('mainMenu.syncSettings.dataIsOnlySyncedWhenYou'),
      },
      {
        title: t('mainMenu.syncSettings.onOpenClose'),
        value: 'startAndClose',
        subtitle: t('mainMenu.syncSettings.syncOnOpenCloseDescription'),
      },
      {
        title: t('mainMenu.syncSettings.every30Minutes'),
        value: 'minutes_30',
        subtitle: t('mainMenu.syncSettings.syncsAutomaticallyEvery30MinutesRequires'),
        disabled: patreonTier.value < 1,
      },
      {
        title: t('mainMenu.syncSettings.every60Minutes'),
        value: 'minutes_60',
        subtitle: t('mainMenu.syncSettings.syncsAutomaticallyEvery60MinutesRequires'),
        disabled: patreonTier.value < 1,
      },
    ]
  })
  const syncItems = computed(() => {
    return [
      { title: t('mainMenu.syncSettings.pilotData'), value: 'pilot' },
      { title: t('mainMenu.account.pilotGroups'), value: 'pilotgroup' },
      { title: t('mainMenu.syncSettings.npcData'), value: 'npc' },
      { title: t('common.encounterData'), value: 'encounter' },
      { title: t('mainMenu.syncSettings.narrativeData'), value: 'collectionitem' },
    ]
  })
  const itemTypePreset = computed(() => {
    if (forceCustom.value) return 'custom'
    const all = syncItems.value.map((i: any) => i.value)
    const current = settings.value.itemTypes ?? []
    if (!current.length || all.every((v: string) => current.includes(v))) return 'all'
    if (current.length === 1 && current[0] === 'pilot') return 'pilots'
    return 'custom'
  })

  function applyItemTypePreset(preset: string) {
    const all = syncItems.value.map((i: any) => i.value)
    if (preset === 'all') {
      settings.value.itemTypes = all
      forceCustom.value = false
    } else if (preset === 'pilots') {
      settings.value.itemTypes = ['pilot']
      forceCustom.value = false
    } else if (preset === 'custom') {
      forceCustom.value = true
    }
  }
  async function updateSyncSettings() {
    loadingSync.value = true
    await UserStore().setUserMetadata()
    UserStore().setSyncTimer()
    settingsDirty.value = false
    loadingSync.value = false
  }
  async function runSync(override?: 'upload' | 'download') {
    const total =
      override === 'upload'
        ? UserStore().SyncEligibleItems.filter(x => !x.IsCloudOnly).length
        : UserStore().AllItemsToSync.length
    syncing.value = true
    const failures = await UserStore().AutoSync(override)
    settingsDirty.value = false
    syncing.value = false

    if (failures.length) {
      notify({
        title: t('mainMenu.account.syncPartialTitle', { synced: total - failures.length, total }),
        text: t('mainMenu.account.syncPartialText', { failures: failures.length }),
        type: 'error',
      })
    } else {
      notify({
        title: t('mainMenu.account.syncCompleteTitle', { total }),
        text: t('mainMenu.account.syncCompleteText'),
        type: 'success',
      })
    }
  }
  async function permDeleteSync() {
    syncing.value = true
    try {
      const count = await UserStore().permDeleteFlaggedItems()
      notify({
        title: t('mainMenu.account.deletionCompleteTitle', { count }, count),
        text:
          count > 0
            ? t('mainMenu.account.flaggedRemovedText')
            : t('mainMenu.account.noFlaggedText'),
        type: count > 0 ? 'success' : 'info',
      })
    } catch (e) {
      notify({
        title: t('notify.image.deleteFailedTitle'),
        text: t('mainMenu.account.deletionFailedBulkText'),
        type: 'error',
      })
    } finally {
      syncing.value = false
    }
  }
</script>
