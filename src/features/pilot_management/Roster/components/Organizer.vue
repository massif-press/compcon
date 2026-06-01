<template>
  <cc-organizer :items="items"
    :headers="headers">
    <template #item.Callsign="{ item }">{{ (item as any).Callsign }}</template>
    <template #item.Level="{ item }">{{ (item as any).Level }}</template>
    <template #item.Mech="{ item }">
      {{ (item as any).FavoriteMech ? (item as any).FavoriteMech.Name
        : (item as any).ActiveMech ? (item as any).ActiveMech.Name : 'None' }}
    </template>
    <template #item.group="{ item }">
      <v-chip size="small"
        label
        prepend-icon="mdi-account-group">
        {{ getPilotGroup(item) }}
      </v-chip>
    </template>
    <template #item.LastUpdate="{ item }">{{ timeAgo((item as any).SaveController.LastModified) }}</template>

    <template #actions="{ selected, items, showDeleted, clearSelected, showDeleteConfirm, setShowDeleteConfirm }">
      <v-list-item title="Set Group"
        subtitle="Set pilot group"
        prepend-icon="mdi-account-group"
        :disabled="!selected.length"
        @click="setGroupDialog = true" />
      <v-list-item :title="selected.length < 2 ? 'Export' : 'Export Collection'"
        :subtitle="selected.length < 2 ? 'Export item JSON' : 'Generate a multi-item export package'"
        prepend-icon="mdi-upload"
        :disabled="!selected.length"
        @click="exportItems(selected, items)" />
      <v-list-item :title="selected.length < 2 ? 'Delete' : 'Delete Multiple'"
        :subtitle="selected.length < 2 ? 'Mark item as Deleted' : 'Mark multiple items as Deleted'"
        prepend-icon="mdi-delete"
        :disabled="!selected.length"
        @click="deleteItems(selected, items, false, clearSelected)" />
      <v-list-item v-if="showDeleted"
        :title="selected.length < 2 ? 'Restore' : 'Restore Multiple'"
        :subtitle="selected.length < 2 ? 'Remove Deleted status from item' : 'Remove Deleted status from items'"
        prepend-icon="mdi-file-restore-outline"
        :disabled="!selected.length"
        @click="deleteItems(selected, items, true, clearSelected)" />
      <v-list-item v-if="showDeleted && !showDeleteConfirm"
        title="Delete Permanently"
        variant="elevated"
        elevation="0"
        subtitle="Delete these items permanently"
        prepend-icon="mdi-delete-forever-outline"
        base-color="warning"
        :disabled="!selected.length"
        @click="setShowDeleteConfirm(true)" />
      <v-divider v-if="showDeleteConfirm" />
      <v-list-item v-if="showDeleteConfirm"
        title="Confirm Permanent Deletion"
        subtitle="This action cannot be undone"
        prepend-icon="mdi-exclamation-thick"
        :disabled="!selected.length"
        @click="deleteItemsPermanent(selected, items, clearSelected, setShowDeleteConfirm)"
        base-color="error" />
      <v-list-item v-if="showDeleteConfirm"
        title="Cancel Permanent Deletion"
        prepend-icon="mdi-cancel"
        @click="setShowDeleteConfirm(false)"
        base-color="accent" />
    </template>

    <template #dialogs>
      <v-dialog v-model="setGroupDialog"
        max-width="500px">
        <v-card>
          <v-toolbar density="compact">
            <v-toolbar-title>Set Group</v-toolbar-title>
            <v-spacer />
            <v-btn icon
              @click="setGroupDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-select v-model="stagedGroup"
              :items="allGroups"
              label="Pilot Group"
              item-title="Name"
              return-object
              variant="outlined"
              density="compact"
              clearable
              hide-details />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn variant="text"
              @click="setGroupDialog = false">Cancel</v-btn>
            <v-spacer />
            <v-btn variant="text"
              color="accent"
              @click="setGroup()">Set</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </cc-organizer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as _ from 'lodash-es'
import { PilotStore, PilotGroupStore } from '../../store'
import exportAsJson from '@/util/jsonExport'
import { PilotGroup } from '../../store/PilotGroup'
import CCOrganizer from '@/ui/components/CCOrganizer.vue'

defineProps<{ type: string }>()

const setGroupDialog = ref(false)
const stagedGroup = ref<any>(null)

const headers = computed(() => [
  { title: 'Name', key: 'Name', sortable: true },
  { title: 'Callsign', key: 'Callsign', sortable: true },
  { title: 'LL', key: 'Level', sortable: true },
  { title: 'Mech', key: 'Mech', sortable: true },
  { title: 'Group', key: 'group', sortable: true, value: (item: any) => getPilotGroup(item) },
  { title: 'Updated', key: 'LastUpdate', sortable: true },
])

const items = computed(() =>
  PilotStore().Pilots
)

const allGroups = computed(() => PilotGroupStore().getPilotGroups())

async function setGroup() {
  for (const group of allGroups.value) {
    await PilotGroupStore().TransferPilot(
      items.value.find((x: any) => x.ID === stagedGroup.value?.ID) as any,
      stagedGroup.value ? (stagedGroup.value as PilotGroup).ID : undefined
    )
  }
  stagedGroup.value = null
  setGroupDialog.value = false
  await PilotGroupStore().SaveGroupData()
  await PilotStore().SavePilotData()
}

function exportItems(selected: string[], allItems: any[]) {
  let json = {} as any
  let filename = ''
  if (selected.length === 1) {
    const item = allItems.find((x: any) => x.ID === selected[0])
    if (item) { json = (item as any).Serialize(); filename = (item as any).Name + '.json' }
  } else {
    const data = allItems.filter((x: any) => selected.includes(x.ID))
    json = { type: 'pilot_collection', item_count: data.length, data: data.map((x: any) => x.Serialize()) }
    filename = `roster_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`
  }
  exportAsJson(json, filename)
}

function deleteItems(selected: string[], allItems: any[], undelete: boolean, clearSelected: () => void) {
  selected.forEach((id) => {
    const item = allItems.find((x: any) => x.ID === id) as any
    if (item) {
      if (undelete) item.SaveController.Restore()
      else item.SaveController.Delete()
    }
  })
  clearSelected()
  PilotStore().SavePilotData()
  PilotGroupStore().SaveGroupData()
}

async function deleteItemsPermanent(selected: string[], allItems: any[], clearSelected: () => void, setShowDeleteConfirm: (v: boolean) => void) {
  await Promise.all(
    selected
      .map((id) => allItems.find((x: any) => x.ID === id))
      .filter((item) => item?.SaveController.IsDeleted)
      .map((item) => PilotStore().DeletePilotPermanent(item))
  )
  clearSelected()
  setShowDeleteConfirm(false)
}

function getPilotGroup(item: any) {
  const group = PilotGroupStore().PilotGroups.find((x) => x.Pilots.some((y) => y.id === item.ID))
  return group ? group.Name : 'None'
}

function timeAgo(timestamp: number | string) {
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
</script>
