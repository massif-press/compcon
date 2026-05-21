<template>
  <div>
    <div class="d-flex align-center pa-2 gap-2">
      <cc-button size="small"
        :color="bulkDeleteMode ? 'panel' : 'error'"
        prepend-icon="mdi-delete-sweep"
        @click="toggleBulkDelete">
        {{ bulkDeleteMode ? 'Cancel Bulk Selection' : 'Bulk Delete' }}
      </cc-button>
      <cc-button v-if="bulkDeleteMode && selectedForDelete.length"
        size="small"
        color="error"
        prepend-icon="mdi-delete"
        @click="bulkDeleteDialog = true">
        Delete Selected ({{ selectedForDelete.length }})
      </cc-button>
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
            <span class=heading>Remote Item</span>
            <v-divider class="my-1" />
            <i class="text-caption">
              This item is linked to another user's data. Changes they make will be downloaded on
              sync.
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
            <span class=heading>Remote Item Inaccessible</span>
            <v-divider class="my-1" />
            <i class="text-caption">
              This cloud data for this item could not be found. This can happen when the owner
              deletes the
              item, or if there was an error during sync. You can attempt to restore the remote link
              or
              convert this item to a local copy.
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
        <span v-if="item.ItemType === 'Encounter'">Encounter Data</span>
        <span v-else-if="item.ItemType === 'Campaign'">Campaign Data</span>
        <span v-else-if="item.ItemType === 'EncounterInstance'">Active Encounter</span>
        <span v-else-if="item.ItemType === 'EncounterArchive'">Archived Encounter</span>
        <span v-else-if="item.ItemType === 'PilotSheet'">Pilot Sheet</span>
        <span v-else-if="item.ItemType === 'pilotgroup'">Pilot Group</span>
        <span v-else
          v-text="item.ItemType" />
      </template>
      <template #item.lastSync="{ item }">
        <span v-if="item.CloudController.Metadata?.Updated">
          {{ new Date(item.CloudController.Metadata.Updated).toLocaleString() }}
        </span>
        <i v-else
          class="text-disabled">
          No Data
        </i>
      </template>
      <template #item.localLastModified="{ item }">
        <span v-if="item.SaveController?.LastModified">
          {{ new Date(item.SaveController.LastModified).toLocaleString() }}
        </span>
        <i v-else
          class="text-disabled">
          No Data
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
            Remote link broken — owner's data not found. Retry or convert to local.
          </div>
        </v-tooltip>
        <v-tooltip v-else-if="item.SaveController?.IsDeleted || item.CloudController.Metadata.Deleted"
          max-width="300px"
          location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="warning"
              icon="mdi-delete-clock" />
          </template>
          <div class="text-center">
            {{ item.SaveController?.IsDeleted ? 'Deleted locally — will not sync.' : 'Marked as deleted in cloud.' }}
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
          <div class="text-center">Up to date</div>
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
            {{ item.IsCloudOnly ? 'Cloud only — not yet downloaded.' : !item.CloudController.Metadata?.ItemModified ? 'Local only — not yet synced.' : 'Pending sync.' }}
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
              This is an editable campaign you have created in the GM Campaign Editor. This data can
              be synced to the cloud for safekeeping and sharing with other devices, but are not
              sharable via the Share Code system.
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
            <div class="text-center">Copy Share Code</div>
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
            <div class="text-center">Copy Share Code</div>
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
            <div class="text-center">Retry Connection</div>
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
              Convert to Local
              <br />
              <i class="text-caption">Remove the remote link. Data is kept locally.</i>
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
              Restore
              <br />
              <i class="text-caption">Restore this item locally. It will resume syncing
                normally.</i>
            </div>
          </v-tooltip>
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
                  <div class="text-center">Delete Permanently</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">Delete Permanently</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  This will permanently remove the item from local storage. If the item has been
                  synced to the cloud, it will also be marked as deleted there.
                  <v-checkbox v-model="skipDeleteWarningLocal"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">
                    Cancel
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="!!deleteLocalItemPermanent(item) ? (isActive.value = false) : ''">
                    Delete
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
              Restore
              <br />
              <i class="text-caption">
                Restore this item. This item will no longer be marked as deleted and will sync to
                this
                and other devices.
              </i>
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
                  <div class="text-center">Delete Immediately</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">Delete Immediately</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  Deleting this item will remove it from cloud storage. This will not modify any
                  local
                  copies of this item.
                  <v-checkbox v-model="skipDeleteWarningPerm"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">
                    Cancel
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="!!deleteItemPermanent(item) ? (isActive.value = false) : ''">
                    Delete
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
                  <div class="text-center">Manual Controls</div>
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
              <v-tooltip v-if="!item.IsCloudOnly && (!item.CloudController.Metadata?.ItemModified || item._isRemote)"
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
                <div class="text-center">Delete Local Data</div>
                <div class="text-center text-caption">
                  <i>
                    This marks this item as deleted locally, and will be removed from this table and
                    will not be synced. Deleted item recovery options can be found in user settings.
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

                  <div class="text-center">Delete Cloud Data</div>
                </v-tooltip>
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card>
                <v-toolbar flat
                  color="error">
                  <v-toolbar-title>
                    <span class="heading h3">Delete Cloud Item</span>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon
                    @click="isActive.value = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  Deleting this item will mark it as deleted in the cloud. It will not delete this
                  item locally, but will prevent it from syncing to the cloud or to other devices.
                  Deleted items can be recovered via the "Deleted Items" tab. Recoverable items
                  still
                  count towards your storage limit.
                  <v-checkbox v-model="skipDeleteWarning"
                    label="Do not show this warning again"
                    hide-details />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text"
                    @click="isActive.value = false">
                    Cancel
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="elevated"
                    color="error"
                    :loading="loading"
                    @click="!!deleteItem(item) ? (isActive.value = false) : ''">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </template>
    </v-data-table>

    <cc-solo-dialog v-model="bulkDeleteDialog"
      title="Confirm Delete"
      :close-on-click="false">
      <cc-alert color="error">
        <v-toolbar-title>
          <span class="heading h3">Delete {{ selectedForDelete.length }} Item{{
            selectedForDelete.length !== 1 ? 's' : '' }}</span>
        </v-toolbar-title>
      </cc-alert>
      Choose how to delete the selected items:
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
          Cancel
        </v-btn>
        <v-spacer />
        <cc-button variant="elevated"
          color="error"
          :loading="bulkDeleteLoading"
          @click="executeBulkDelete">
          Delete
        </cc-button>
      </v-card-actions>
    </cc-solo-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useDisplay } from 'vuetify'
import { notify as vueNotify } from '@kyvg/vue3-notification'
import { UserStore } from '@/stores'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { getItemRegistration } from '@/classes/components/cloud/ItemRegistry'
import { expandFilterTypes, normalizeItemType } from '@/classes/components/cloud/ItemTypeMap'
import { cloudDelete } from '@/io/apis/account'
import logger from '@/user/logger'
import { Unit } from '@/classes/npc/unit/Unit'

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

const bulkDeleteMode = ref(false)
const bulkDeleteDialog = ref(false)
const bulkDeleteScope = ref<'cloud' | 'both'>('cloud')
const bulkDeleteLoading = ref(false)
const selectedForDelete = ref<any[]>([])
const deleteLoading = ref(false)
const retryingCode = ref<string | null>(null)

function isItemSynced(item: any): boolean {
  if (item._isRemote) {
    return (item.CloudController?.Metadata?.Updated ?? 0) >= (item.SaveController?.LastModified ?? 0)
  }
  return item.CloudController.isSynced
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

const skipDeleteWarning = computed({
  get: () => UserStore().User.View('skipDeleteWarning_item', false),
  set: (val: boolean) => UserStore().User.SetView('skipDeleteWarning_item', val),
})
const skipDeleteWarningPerm = computed({
  get: () => UserStore().User.View('skipDeleteWarningPerm_item', false),
  set: (val: boolean) => UserStore().User.SetView('skipDeleteWarningPerm_item', val),
})
const skipDeleteWarningLocal = computed({
  get: () => UserStore().User.View('skipDeleteWarningLocal_item', false),
  set: (val: boolean) => UserStore().User.SetView('skipDeleteWarningLocal_item', val),
})

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
    if (t === 'encounterarchive' || t === 'pilotsheet') return false
    if (typeFilter.length && !typeFilter.includes(t)) return false
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

  const combined = [...baseItems, ...remoteItems]

  return sortWithChildren(combined)
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
  else if (t === 'encounterinstance') {
    return `Active Encounter // Round ${(item as any)._round || '?'}`
  }
  return null
}

function toggleBulkDelete() {
  bulkDeleteMode.value = !bulkDeleteMode.value
  if (!bulkDeleteMode.value) selectedForDelete.value = []
}

async function executeBulkDelete() {
  bulkDeleteLoading.value = true
  const failures: string[] = []
  try {
    for (const item of selectedForDelete.value) {
      try {
        if (item.CloudController?.Metadata?.ItemModified) {
          await CloudController.MarkCloudDeleted(item.CloudController.Metadata).catch(e =>
            logger.warn(`Bulk delete: failed to mark ${item.Name} as deleted in cloud`, e)
          )
        }
        if (bulkDeleteScope.value === 'both') {
          item.SaveController?.Delete()
        }
      } catch (e) {
        logger.error(`Bulk delete: failed to delete ${item.Name}`, e)
        failures.push(item.Name)
      }
    }
    const succeeded = selectedForDelete.value.length - failures.length
    if (failures.length === 0) {
      vueNotify({
        title: `${succeeded} Item${succeeded !== 1 ? 's' : ''} Deleted`,
        text: 'Selected items have been deleted.',
        data: { icon: 'mdi-delete', color: 'success' },
      })
    } else {
      vueNotify({
        title: `${succeeded} Deleted, ${failures.length} Failed`,
        text: `Could not delete: ${failures.join(', ')}`,
        data: { icon: 'mdi-alert', color: 'warning' },
      })
    }
    emit('refresh')
  } catch (e) {
    logger.error('Bulk delete failed:', e)
    vueNotify({ title: 'Bulk Delete Failed', text: `${e}`, data: { icon: 'mdi-alert', color: 'error' } })
  } finally {
    bulkDeleteLoading.value = false
    bulkDeleteDialog.value = false
    selectedForDelete.value = []
    bulkDeleteMode.value = false
  }
}

async function retryBrokenRemote(item: any) {
  const code = item.SaveController?.RemoteCode
  if (!code) return
  retryingCode.value = code
  const ok = await UserStore().retryBrokenRemote(code)
  retryingCode.value = null
  if (ok) {
    vueNotify({ title: 'Connection Restored', text: `${item.Name} is linked again.`, data: { icon: 'mdi-link-variant', color: 'success' } })
    emit('refresh')
  } else {
    vueNotify({ title: 'Retry Failed', text: `The remote item for ${item.Name} could not be found.`, data: { icon: 'mdi-alert', color: 'error' } })
  }
}

function convertToLocal(item: any) {
  const code = item.SaveController?.RemoteCode
  if (!code) return
  UserStore().convertBrokenRemoteToLocal(code)
  vueNotify({ title: 'Converted to Local', text: `${item.Name} is now a local-only item.`, data: { icon: 'mdi-content-save', color: 'success' } })
  emit('refresh')
}

async function sync(item: any) {
  try {
    if (item._isRemote) {
      await CloudController.UpdateRemote(item)
    } else if (item.IsCloudOnly) {
      await CloudController.ForceDownload(item)
    } else if (item.CloudController.Metadata?.Updated) {
      await item.CloudController.syncFromCloud()
    } else {
      await CloudController.ForceUpload(item)
    }
    vueNotify({
      title: `Sync Complete`,
      text: `${item.ItemType} ${item.Name} synced.`,
      data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
    })
  } catch (err) {
    logger.error(`Error syncing item: ${err}`, {}, err)
    vueNotify({
      title: `Sync Failed`,
      text: `Failed to sync ${item.ItemType} ${item.Name}. ${err}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
}

async function forceSyncLocal(item: any) {
  try {
    await CloudController.ForceUpload(item)
    vueNotify({
      title: `Upload Complete`,
      text: `${item.ItemType} ${item.Name} uploaded.`,
      data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
    })
  } catch (err) {
    logger.error(`Error force-uploading: ${err}`, {}, err)
    vueNotify({
      title: `Upload Failed`,
      text: `Failed to upload ${item.ItemType} ${item.Name}. ${err}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
}

async function forceSyncCloud(item: any) {
  try {
    if (item.IsCloudOnly) {
      await CloudController.ForceDownload(item)
    } else {
      await item.CloudController.syncFromCloud()
    }
    emit('refresh')
    vueNotify({
      title: `Download Complete`,
      text: `${item.ItemType} ${item.Name} merged from cloud.`,
      data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
    })
  } catch (err) {
    logger.error(`Error force-downloading: ${err}`, {}, err)
    vueNotify({
      title: `Download Failed`,
      text: `Failed to download ${item.ItemType} ${item.Name}. ${err}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
}

async function deleteItem(item: any) {
  deleteLoading.value = true
  try {
    await CloudController.MarkCloudDeleted(item.CloudController.Metadata)
    emit('refresh')
    vueNotify({
      title: `Item Deleted`,
      text: `Marked ${item.ItemType} ${item.Name} as deleted.`,
      data: { icon: 'mdi-delete', color: 'success' },
    })
    deleteLoading.value = false
    return true
  } catch (err) {
    logger.error(`Error deleting item: ${err}`, {}, err)
    vueNotify({
      title: `Delete Failed`,
      text: `Unable to communicate with server. ${err}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
  deleteLoading.value = false
}

async function restoreItem(item: any) {
  deleteLoading.value = true
  try {
    await CloudController.Undelete(item.CloudController.Metadata)
    vueNotify({
      title: `Item Restored`,
      text: `Restored ${item.ItemType} ${item.Name}.`,
      data: { icon: 'mdi-delete', color: 'success' },
    })
    deleteLoading.value = false
    return true
  } catch (err) {
    logger.error(`Error restoring item: ${err}`, {}, err)
    vueNotify({
      title: `Restore Failed`,
      text: `Unable to communicate with server. ${err}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
  deleteLoading.value = false
}

async function deleteItemPermanent(item: any) {
  deleteLoading.value = true
  try {
    const { user_id, sortkey, uri } = item.CloudController.Metadata.Serialize()
    await cloudDelete(user_id, sortkey, uri)
    if (item.SaveController) {
      item.CloudController.Metadata = CloudController.GenerateMetadata(item.CloudController)
      item.CloudController.Metadata.ItemModified = 0
    }
    const store = UserStore()
    const cidx = store.CloudItems.findIndex((x: any) => x.sortkey === sortkey)
    if (cidx > -1) store.CloudItems.splice(cidx, 1)
    emit('refresh')
    vueNotify({
      title: `Item Deleted Permanently`,
      text: `Removed ${item.ItemType} ${item.Name}.`,
      data: { icon: 'mdi-delete', color: 'success' },
    })
    deleteLoading.value = false
    return true
  } catch (err) {
    logger.error(`Error deleting item: ${err}`, {}, err)
    vueNotify({
      title: `Deletion Failed`,
      text: `Unable to communicate with server. ${err}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
  deleteLoading.value = false
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  vueNotify({
    title: 'Copied',
    text: 'Share code copied to clipboard.',
    data: { icon: 'mdi-content-copy', color: 'success' },
  })
}

function restoreLocalItem(item: any) {
  item.SaveController.Restore()
  vueNotify({
    title: 'Item Restored',
    text: `Restored ${item.ItemType} ${item.Name}.`,
    data: { icon: 'mdi-restore', color: 'success' },
  })
}

async function deleteLocalItemPermanent(item: any, silent = false) {
  deleteLoading.value = true
  try {
    const reg = getItemRegistration(item.ItemType)
    if (!reg) throw new Error(`Unknown item type: ${item.ItemType}`)
    await reg.deleteLocal(item)
    if (!silent) {
      vueNotify({
        title: 'Item Deleted',
        text: `Removed ${item.ItemType} ${item.Name}.`,
        data: { icon: 'mdi-delete', color: 'success' },
      })
    }
    deleteLoading.value = false
    return true
  } catch (err) {
    logger.error(`Error permanently deleting local item: ${err}`, {}, err)
    if (!silent) {
      vueNotify({
        title: 'Delete Failed',
        text: `Failed to delete ${item.ItemType} ${item.Name}. ${err}`,
        data: { icon: 'mdi-alert', color: 'error' },
      })
    }
    throw err
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
