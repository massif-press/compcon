<template>
  <div>
    <div class="d-flex align-center pa-2 gap-2">
      <cc-button size="small"
        :color="bulkDeleteMode ? 'panel' : 'error'"
        prepend-icon="mdi-delete-sweep"
        @click="toggleBulkDelete">
        {{ bulkDeleteMode ? $t("mainMenu.dataItem.cancelBulkSelection") : $t("mainMenu.dataItem.bulkDelete") }}
      </cc-button>
      <cc-button v-if="bulkDeleteMode && selectedForDelete.length"
        size="small"
        color="error"
        prepend-icon="mdi-delete"
        @click="bulkDeleteDialog = true">
        {{ $t("mainMenu.dataItem.deleteSelected", { count: selectedForDelete.length }) }}
      </cc-button>
      <v-spacer />
      <cc-switch v-model="showLocalDeleted"
        label="Show Locally Deleted"
        hide-details
        class="ml-auto" />

    </div>

    <v-data-table v-model="selectedForDelete"
      density="compact"
      :mobile="mobile"
      :headers="<any>dataHeaders"
      :items="shownItems"
      item-key="ID"
      :loading="loading"
      :items-per-page="50"
      :show-select="bulkDeleteMode"
      return-object>
      <template #item.ID="{ item }">
        <v-tooltip v-if="item._isRemote"
          location="top"
          max-width="300">
          <template #activator="{ props }">
            <v-icon size="large"
              color="secondary"
              v-bind="props">mdi-broadcast</v-icon>
          </template>
          <div class="text-center">
            <span class=heading>{{ $t("mainMenu.dataItem.remoteItem") }}</span>
            <v-divider class="my-1" />
            <i class="text-caption">
              {{ $t("mainMenu.dataItem.remoteItemDesc") }}
            </i>
          </div>
        </v-tooltip>
        <v-tooltip v-if="item._isBrokenRemote"
          location="top"
          max-width="300">
          <template #activator="{ props }">
            <v-icon size="large"
              color="secondary"
              v-bind="props">mdi-broadcast-off</v-icon>
          </template>
          <div class="text-center">
            <span class=heading>{{ $t("mainMenu.dataItem.remoteItemInaccessible") }}</span>
            <v-divider class="my-1" />
            <i class="text-caption">
              {{ $t("mainMenu.dataItem.remoteInaccessibleDesc") }}
            </i>
          </div>
        </v-tooltip>

        <span v-if="item._isChild">↳</span>
      </template>
      <template #item.Name="{ item }">
        <div class="d-flex flex-column">
          <div class="d-flex align-center gap-1">

            <span :class="item._isChild ? 'text-medium-emphasis' : ''">{{ itemLine1(item) }}</span>
          </div>
          <div v-if="itemLine2(item)"
            class="text-caption text-disabled mt-n1">
            {{ itemLine2(item) }}
          </div>
        </div>
      </template>
      <template #item.ItemType="{ item }">
        <span v-if="item.ItemType === 'Encounter'">{{ $t("mainMenu.dataItem.typeEncounterData") }}</span>
        <span v-else-if="item.ItemType === 'Campaign'">{{ $t("mainMenu.dataItem.typeCampaignData") }}</span>
        <span v-else-if="item.ItemType === 'EncounterInstance'">{{ $t("mainMenu.dataItem.typeActiveEncounter") }}</span>
        <span v-else-if="item.ItemType === 'EncounterArchive'">{{ $t("mainMenu.dataItem.typeArchivedEncounter") }}</span>
        <span v-else-if="item.ItemType === 'PilotSheet'">{{ $t("mainMenu.dataItem.typePilotSheet") }}</span>
        <span v-else-if="item.ItemType === 'pilotgroup'">{{ $t("mainMenu.dataItem.typePilotGroup") }}</span>
        <span v-else
          v-text="item.ItemType" />
      </template>
      <template #item.lastSync="{ item }">
        <span v-if="item.CloudController.Metadata?.Updated">
          {{ new Date(item.CloudController.Metadata.Updated).toLocaleString() }}
        </span>
        <i v-else
          class="text-disabled">
          {{ $t("mainMenu.dataItem.noData") }}
        </i>
      </template>
      <template #item.localLastModified="{ item }">
        <span v-if="item.SaveController?.LastModified || item.SaveController?.Created">
          {{ new Date(item.SaveController.LastModified ||
            item.SaveController.Created).toLocaleString() }}
        </span>
        <i v-else
          class="text-disabled">
          {{ $t("mainMenu.dataItem.noData") }}
        </i>
      </template>
      <template #item.syncStatus="{ item }">
        <v-tooltip v-if="item._isBrokenRemote"
          max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="error"
              icon="mdi-link-variant-off" />
          </template>
          <div class="text-center">
            {{ $t("mainMenu.dataItem.remoteLinkBroken") }}
          </div>
        </v-tooltip>
        <v-tooltip
          v-else-if="item.SaveController?.IsDeleted || item.CloudController.Metadata.Deleted"
          max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="warning"
              icon="mdi-delete-clock" />
          </template>
          <div class="text-center">
            {{ item.SaveController?.IsDeleted ?
              $t("mainMenu.dataItem.deletedLocally")
              : $t("mainMenu.dataItem.markedDeletedCloud") }}
          </div>
        </v-tooltip>
        <v-tooltip v-else-if="isItemSynced(item)"
          max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="success"
              icon="mdi-cloud-check-variant-outline" />
          </template>
          <div class="text-center">{{ $t("mainMenu.dataItem.upToDateStatus") }}</div>
        </v-tooltip>
        <v-tooltip v-else
          max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="warning"
              icon="mdi-cloud-sync" />
          </template>
          <div class="text-center">
            {{ item.IsCloudOnly
              ? $t('mainMenu.dataItem.cloudOnly')
              : !item.CloudController.Metadata?.ItemModified
                ? $t('mainMenu.dataItem.localOnly')
                : $t('mainMenu.dataItem.pendingSync')
            }}
          </div>
        </v-tooltip>
      </template>
      <template #item.code="{ item }">
        <span v-if="item.ItemType === 'Campaign'">
          <v-tooltip max-width="400px"
            location="top">
            <template #activator="{ props }">
              <v-icon icon="mdi-information-outline"
                class="fade-select"
                v-bind="props" />
            </template>
            <div class="text-center">
              {{ $t("mainMenu.dataItem.editableCampaignDesc") }}
            </div>
          </v-tooltip>
        </span>
        <span v-else-if="item._isRemote && item.SaveController?.RemoteCode?.length > 0">
          {{
            `${item.SaveController.RemoteCode.slice(0, 4)}-${item.SaveController.RemoteCode.slice(4,
              8)}-${item.SaveController.RemoteCode.slice(8, 12)}`
          }}
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                color="accent"
                size="small"
                icon="mdi-content-copy"
                class="fade-select"
                @click="copy(item.SaveController.RemoteCode)" />
            </template>
            <div class="text-center">{{ $t("mainMenu.dataItem.copyShareCode") }}</div>
          </v-tooltip>
        </span>
        <span v-else-if="item.CloudController?.Metadata?.Code?.length > 0">
          {{
            `${item.CloudController.Metadata.Code.slice(0,
              4)}-${item.CloudController.Metadata.Code.slice(4,
                8)}-${item.CloudController.Metadata.Code.slice(8, 12)}`
          }}
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                color="accent"
                size="small"
                icon="mdi-content-copy"
                class="fade-select"
                @click="copy(item.CloudController.Metadata.Code)" />
            </template>
            <div class="text-center">{{ $t("mainMenu.dataItem.copyShareCode") }}</div>
          </v-tooltip>
        </span>
      </template>
      <template #item.actions="{ item }">
        <div v-if="item._isBrokenRemote">
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props"
                :loading="retryingCode === item.SaveController?.RemoteCode"
                @click="retryBrokenRemote(item)">
                <v-icon size="x-large">mdi-refresh</v-icon>
              </v-btn>
            </template>
            <div class="text-center">{{ $t("mainMenu.dataItem.retryConnection") }}</div>
          </v-tooltip>
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-btn size="small"
                color="warning"
                icon
                variant="text"
                v-bind="props"
                @click="convertToLocal(item)">
                <v-icon size="x-large">mdi-link-variant-remove</v-icon>
              </v-btn>
            </template>
            <div class="text-center">
              {{ $t("mainMenu.dataItem.convertToLocal") }}
              <br />
              <i class="text-caption">{{ $t("mainMenu.dataItem.convertToLocalDesc") }}</i>
            </div>
          </v-tooltip>
        </div>
        <div v-else-if="item.SaveController?.IsDeleted">
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props"
                @click="restoreLocalItem(item)">
                <v-icon size="x-large">mdi-restore</v-icon>
              </v-btn>
            </template>
            <div class="text-center">
              {{ $t("mainMenu.dataItem.restore") }}
              <br />
              <i class="text-caption">{{ $t("mainMenu.dataItem.restoreLocalDesc") }}</i>
            </div>
          </v-tooltip>
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                :disabled="cloudStorageFull"
                v-bind="props">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">
                      mdi-cloud-braces
                    </v-icon>
                  </template>
                  <div class="text-center">{{ $t("mainMenu.dataItem.manualControls") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="Sync Now"
                subtitle="Merge and sync this item immediately."
                @click="sync(item)" />
              <v-list-item v-if="!item._isRemote"
                title="Force Upload"
                subtitle="Push local data to cloud unconditionally, overwriting remote."
                :disabled="!item.SaveController"
                @click="forceSyncLocal(item)" />
              <v-list-item v-if="!item._isRemote"
                title="Force Download"
                subtitle="Merge latest cloud data into this item, preserving any newer local fields."
                :disabled="!item.CloudController?.Metadata?.Updated"
                @click="forceSyncCloud(item)" />
            </v-list>
          </v-menu>
          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="x-small"
                color="error"
                class="mx-1"
                flat
                icon
                v-bind="skipDeleteWarningLocal ? '' : props"
                @click="skipDeleteWarningLocal ? deleteLocalItemPermanent(item) : ''">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="24"
                      v-bind="props">
                      mdi-delete-forever
                    </v-icon>
                  </template>
                  <div class="text-center">{{ $t("mainMenu.dataItem.deletePermanently") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t("mainMenu.dataItem.deletePermanently") }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t("mainMenu.dataItem.deletePermanentlyDesc") }}
                  <v-checkbox v-model="skipDeleteWarningLocal"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">
                    {{ $t("common.cancel") }}
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="!!deleteLocalItemPermanent(item) ? (isActive.value = false) : ''">
                    {{ $t("common.delete") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
        <div v-else-if="item.CloudController.Metadata.Deleted">
          <v-tooltip max-width="300px"
            location="top">
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                v-bind="props"
                @click="restoreItem(item)">
                <v-icon size="x-large">mdi-restore</v-icon>
              </v-btn>
            </template>
            <div class="text-center">
              {{ $t("mainMenu.dataItem.restore") }}
              <br />
              <i class="text-caption">{{ $t("mainMenu.dataItem.restoreItemDesc") }}</i>
            </div>
          </v-tooltip>
          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-btn size="x-small"
                color="error"
                class="mx-1"
                flat
                icon
                v-bind="skipDeleteWarningPerm ? '' : props"
                @click="skipDeleteWarningPerm ? deleteItemPermanent(item) : ''">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="24"
                      v-bind="props">
                      mdi-delete-forever
                    </v-icon>
                  </template>
                  <div class="text-center">{{ $t("mainMenu.dataItem.deleteImmediately") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t("mainMenu.dataItem.deleteImmediately") }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t("mainMenu.dataItem.deleteImmediatelyDesc") }}
                  <v-checkbox v-model="skipDeleteWarningPerm"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">
                    {{ $t("common.cancel") }}
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="!!deleteItemPermanent(item) ? (isActive.value = false) : ''">
                    {{ $t("common.delete") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
        <div v-else>
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn size="small"
                color="accent"
                icon
                variant="text"
                :disabled="cloudStorageFull"
                v-bind="props">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">
                      mdi-cloud-braces
                    </v-icon>
                  </template>
                  <div class="text-center">{{ $t("mainMenu.dataItem.manualControls") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="Sync Now"
                subtitle="Merge and sync this item immediately."
                @click="sync(item)" />
              <v-list-item v-if="!item._isRemote"
                title="Force Upload"
                subtitle="Push local data to cloud unconditionally, overwriting remote."
                :disabled="!item.SaveController"
                @click="forceSyncLocal(item)" />
              <v-list-item v-if="!item._isRemote"
                title="Force Download"
                subtitle="Merge latest cloud data into this item, preserving any newer local fields."
                :disabled="!item.CloudController?.Metadata?.Updated"
                @click="forceSyncCloud(item)" />
              <v-list-item v-if="item._isRemote"
                title="Convert to Local Data"
                subtitle="Remove the remote link and keep data locally."
                @click="convertToLocal(item)" />
            </v-list>
          </v-menu>

          <v-dialog max-width="600px">
            <template #activator="{ props }">
              <v-tooltip
                v-if="!item.IsCloudOnly && (!item.CloudController.Metadata?.ItemModified || item._isRemote)"
                max-width="300px"
                location="top">
                <template #activator="{ props }">
                  <v-btn size="small"
                    color="warning"
                    icon
                    variant="text"
                    v-bind="props"
                    @click="item.SaveController.Delete()">
                    <v-icon size="x-large">mdi-delete-outline</v-icon>
                  </v-btn>
                </template>
                <div class="text-center">{{ $t("mainMenu.dataItem.deleteLocalData") }}</div>
                <div class="text-center text-caption">
                  <i>
                    {{ $t("mainMenu.dataItem.deleteLocalDataDesc") }}
                  </i>
                </div>
              </v-tooltip>
              <v-btn v-else
                size="small"
                color="accent"
                icon
                variant="text"
                v-bind="skipDeleteWarning ? '' : props"
                @click="skipDeleteWarning ? deleteItem(item) : ''">
                <v-tooltip max-width="300px"
                  location="top">
                  <template #activator="{ props }">
                    <v-icon size="x-large"
                      v-bind="props">
                      mdi-delete-outline
                    </v-icon>
                  </template>

                  <div class="text-center">{{ $t("mainMenu.dataItem.deleteCloudData") }}</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">{{ $t("mainMenu.dataItem.deleteCloudItem") }}</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  {{ $t("mainMenu.dataItem.deleteCloudItemDesc") }}
                  <v-checkbox v-model="skipDeleteWarning"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">
                    {{ $t("common.cancel") }}
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="!!deleteItem(item) ? (isActive.value = false) : ''">
                    {{ $t("common.delete") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </template>
    </v-data-table>

    <cc-dialog v-model="bulkDeleteDialog"
      title="Confirm Delete"
      :close-on-click="false">
      <cc-alert color="error">
        <v-toolbar-title>
          <span class="heading h3">{{ $t("mainMenu.dataItem.deleteNItems", { count: selectedForDelete.length }, selectedForDelete.length) }}</span>
        </v-toolbar-title>
      </cc-alert>
      {{ $t("mainMenu.dataItem.chooseDeleteMethod") }}
      <v-radio-group v-model="bulkDeleteScope"
        class="mt-2">
        <v-radio value="cloud"
          label="Delete cloud data only (keep local data)" />
        <v-radio value="both"
          label="Delete cloud and mark local as deleted" />
      </v-radio-group>
      <v-divider />
      <v-card-actions class="pa-0">
        <v-btn variant="text"
          @click="bulkDeleteDialog = false">
          {{ $t("common.cancel") }}
        </v-btn>
        <v-spacer />
        <cc-button variant="elevated"
          color="error"
          :loading="bulkDeleteLoading"
          @click="executeBulkDelete">
          {{ $t("common.delete") }}
        </cc-button>
      </v-card-actions>
    </cc-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { notify as vueNotify } from '@kyvg/vue3-notification'
import { UserStore } from '@/stores'
import { expandFilterTypes, normalizeItemType } from '@/classes/components/cloud/ItemTypeMap'
import { Unit } from '@/classes/npc/unit/Unit'
import { useItemTransfer } from './useItemTransfer'
import { useItemDeleteLifecycle } from './useItemDeleteLifecycle'

const props = withDefaults(defineProps<{
  search?: string
  loading?: boolean
  itemTypeFilter?: string[]
}>(), {
  search: '',
  loading: false,
  itemTypeFilter: () => ['pilot', 'pilotgroup', 'npc', 'collectionItem', 'encounter', 'campaign'],
})

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const display = useDisplay()
const mobile = computed(() => display.mdAndDown.value)

const showLocalDeleted = ref(false)

const { sync, forceSyncLocal, forceSyncCloud } = useItemTransfer({ refresh: () => emit('refresh') })

const {
  bulkDeleteMode,
  bulkDeleteDialog,
  bulkDeleteScope,
  bulkDeleteLoading,
  selectedForDelete,
  deleteLoading,
  retryingCode,
  skipDeleteWarning,
  skipDeleteWarningPerm,
  skipDeleteWarningLocal,
  toggleBulkDelete,
  executeBulkDelete,
  retryBrokenRemote,
  convertToLocal,
  deleteItem,
  restoreItem,
  deleteItemPermanent,
  restoreLocalItem,
  deleteLocalItemPermanent,
} = useItemDeleteLifecycle({ refresh: () => emit('refresh') })

function isItemSynced(item: any): boolean {
  if (item._isRemote) {
    return (item.CloudController?.Metadata?.Updated ?? 0) >= (item.SaveController?.LastModified ?? 0)
  }
  if (item.CloudController.isSynced) return true
  const updated = item.CloudController?.Metadata?.Updated ?? 0
  const lastModified = item.SaveController?.LastModified ?? 0
  const created = item.SaveController?.Created ?? 0
  if (updated && !lastModified && created && updated >= created) return true
  return false
}

const dataHeaders = [
  { title: '', key: 'ID', width: '0px', },
  { title: 'Name', key: 'Name' },
  { title: 'Type', key: 'ItemType' },
  {
    title: 'Last Sync',
    key: 'lastSync',
    align: 'center' as const,
    sortRaw: (a: any, b: any) =>
      a.CloudController.Metadata?.Updated - b.CloudController.Metadata?.Updated,
  },
  {
    title: 'Last Modified',
    key: 'localLastModified',
    value: 'SaveController.LastModified',
    align: 'center' as const,
  },
  {
    title: 'Status',
    key: 'syncStatus',
    width: '0px',
    align: 'center' as const,
    sortRaw: (a: any, b: any) => {
      const rank = (item: any) => {
        if (item._isBrokenRemote) return 4
        if (item.IsCloudOnly) return 3
        if (!item.CloudController.Metadata?.ItemModified) return 2
        if (isItemSynced(item)) return 0
        return 1
      }
      return rank(a) - rank(b)
    },
  },
  {
    title: 'Share Code',
    key: 'code',
    align: 'center' as const,
    width: '195px',
    sortable: false,
  },
  { title: '', key: 'actions', width: '152px', align: 'end' as const },
]

const allSyncableItems = computed(() => UserStore().AllSyncableItems)
const allRemoteItems = computed(() => UserStore().AllRemoteItems)
const brokenRemoteCodes = computed(() => UserStore().BrokenRemoteCodes)
const cloudStorageFull = computed(() => UserStore().CloudStorageFull)

function sortWithChildren(items: any[]): any[] {
  const result: any[] = []
  const encounterMap = new Map<string, any>()
  const pilotMap = new Map<string, any>()

  const encounters: any[] = []
  const instances: any[] = []
  const pilots: any[] = []
  const sheets: any[] = []
  const rest: any[] = []

  for (const item of items) {
    const t = normalizeItemType(item.ItemType)
    if (t === 'encounter') { encounters.push(item); encounterMap.set(item.ID, item) }
    else if (t === 'encounterinstance') instances.push(item)
    else if (t === 'pilot') { pilots.push(item); pilotMap.set(item.ID, item) }
    else if (t === 'pilotsheet') sheets.push(item)
    else rest.push(item)
  }

  for (const enc of encounters) {
    result.push(enc)
    for (const inst of instances) {
      const parentEnc = (inst as any).Encounter
      if (parentEnc && (parentEnc.ID === enc.ID || parentEnc.Name === enc.Name)) {
        result.push({ ...inst, _isChild: true })
      }
    }
  }

  const pairedInstances = new Set(
    instances.filter(inst => {
      const parentEnc = (inst as any).Encounter
      return parentEnc && encounterMap.has(parentEnc.ID)
    }).map(i => i.ID)
  )
  for (const inst of instances) {
    if (!pairedInstances.has(inst.ID)) result.push(inst)
  }

  for (const pilot of pilots) {
    result.push(pilot)
    for (const sheet of sheets) {
      const pilotId = (sheet as any).Combatant?.id || (sheet as any).Combatant?.actor?.id
      if (pilotId && pilotId === pilot.ID) {
        result.push({ ...sheet, _isChild: true })
      }
    }
  }

  const pairedSheets = new Set(
    sheets.filter(sheet => {
      const pilotId = (sheet as any).Combatant?.id || (sheet as any).Combatant?.actor?.id
      return pilotId && pilots.some((p: any) => pilotId === p.ID)
    }).map(s => s.ID)
  )
  for (const sheet of sheets) {
    if (!pairedSheets.has(sheet.ID)) result.push(sheet)
  }

  result.push(...rest)
  return result
}

const shownItems = computed(() => {
  const typeFilter = expandFilterTypes(props.itemTypeFilter)

  const baseItems = allSyncableItems.value.filter((item: any) => {
    const t = normalizeItemType(item.ItemType)
    if (t === 'encounterarchive') return false
    if (t === 'pilotsheet' && item.Archived) return false
    if (typeFilter.length && !typeFilter.includes(t)) return false
    if (!showLocalDeleted.value && item.SaveController?.IsDeleted) return false
    if (props.search && !item.Name.toLowerCase().includes(props.search.toLowerCase())) return false
    return true
  }).map((item: any) => ({ ...item, _isRemote: false, _isBrokenRemote: false, _isChild: false, _parentId: null }))

  const remoteItems = allRemoteItems.value.filter((item: any) => {
    const t = normalizeItemType(item.ItemType)
    if (typeFilter.length && !typeFilter.includes(t)) return false
    if (props.search && !item.Name.toLowerCase().includes(props.search.toLowerCase())) return false
    return true
  }).map((item: any) => {
    const code = item.SaveController?.RemoteCode
    return {
      ...item,
      _isRemote: true,
      _isBrokenRemote: !!(code && brokenRemoteCodes.value.includes(code)),
      _isChild: false,
      _parentId: null,
    }
  })

  return sortWithChildren([...baseItems, ...remoteItems])
})

function itemLine1(item: any): string {
  const t = normalizeItemType(item.ItemType)
  if (t === 'pilot') return item._callsign || item._name || item.Name || 'Unknown Pilot'
  else if (t === 'unit') return item._name || item.Name || Unit.GetDefaultName(item) || 'Unknown Unit'
  return item._name || item.Name || 'Unknown Item'
}

function itemLine2(item: any): string | null {
  const t = normalizeItemType(item.ItemType)
  if (t === 'pilot') return item._name
  else if (t === 'unit') {
    if (!item._name || !item.Name) return 'NPC Unit'
  }
  else if (t === 'eidolon') return 'Eidolon'
  else if (t === 'doodad') return 'Doodad'
  else if (t === 'character') return 'Character'
  else if (t === 'faction') return 'Faction'
  else if (t === 'location') return 'Location'
  else if (t === 'encounter') {
    const sitrep = (item as any)._sitrep?._name
    const env = (item as any)._environment?._name
    if (sitrep || env) return [env, sitrep].filter(Boolean).join(' // ')
    return null
  }
  else if (t === 'encounterinstance' || t === 'pilotsheet') {
    return `Active Encounter // Round ${(item as any)._round || (item as any)._round || '?'}`
  }
  else if (t === 'encounterarchive' || t === 'pilotsheetarchive') {
    return `Archive`
  }
  return null
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  vueNotify({
    title: 'Copied',
    text: 'Share code copied to clipboard.',
    data: { icon: 'mdi-content-copy', color: 'success' },
  })
}

</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
