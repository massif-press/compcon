<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-row align="center"
          dense>
          <v-col><v-divider /></v-col>
          <v-col cols="auto">{{ items.length }} items</v-col>
        </v-row>
        <v-data-table :headers="headers"
          :items="items"
          item-value="ID"
          :sort-by="[{ key: 'Name', order: 'asc' }]"
          :items-per-page="-1"
          density="compact">
          <template #header.select>
            <v-btn icon
              flat
              size="small"
              @click="selected.length ? (selected = []) : (selected = items.map((x: any) => x.ID))">
              <v-icon size="x-large"
                :icon="selected.length === items.length
                  ? 'mdi-checkbox-outline'
                  : selected.length > 0
                    ? 'mdi-minus-box-outline'
                    : 'mdi-checkbox-blank-outline'" />
            </v-btn>
          </template>
          <template #item.select="{ item }">
            <v-checkbox v-model="selected"
              multiple
              :value="(item as any).ID"
              hide-details />
          </template>
          <template #item.Name="{ item }">
            <span
              :class="(item as any).SaveController.IsDeleted ? 'text-error text-decoration-line-through' : ''">
              {{ (item as any).Name }}
            </span>
          </template>
          <template #item.Callsign="{ item }">
            {{ (item as any).Callsign }}
          </template>
          <template #item.Level="{ item }">
            {{ (item as any).Level }}
          </template>
          <template #item.Mech="{ item }">
            {{ (item as any).FavoriteMech ? (item as any).FavoriteMech.Name : (item as
              any).ActiveMech ? (item as any).ActiveMech.Name : 'None' }}
          </template>
          <template #item.group="{ item }">
            <v-chip size="small"
              label
              prepend-icon="mdi-account-group">
              {{ getPilotGroup(item) }}
            </v-chip>
          </template>
          <template #item.LastUpdate="{ item }">
            {{ timeAgo((item as any).SaveController.LastModified) }}
          </template>
          <template #bottom>
            <v-row dense
              justify="end">
              <v-col cols="auto">
                <v-checkbox density="compact"
                  label="Show Deleted"
                  v-model="showDeleted" />
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="auto"
        style="width: 350px">
        <div>
          <b class="text-accent">{{ selected.length }}</b>
          selected
        </div>
        <v-list>
          <v-list-item title="Set Group"
            subtitle="Set pilot group"
            prepend-icon="mdi-account-group"
            :disabled="!selected.length"
            @click="setGroupDialog = true" />
          <!-- <v-list-item
            :title="selected.length < 2 ? 'Print' : 'Print Multiple'"
            subtitle="Generate item printables"
            prepend-icon="mdi-printer"
            :disabled="!selected.length"
            @click="printDialog = true" /> -->
          <v-list-item :title="selected.length < 2 ? 'Export' : 'Export Collection'"
            :subtitle="selected.length < 2 ? 'Export item JSON' : 'Generate a multi-item export package'
              "
            prepend-icon="mdi-upload"
            :disabled="!selected.length"
            @click="exportItems()" />
          <v-list-item :title="selected.length < 2 ? 'Delete' : 'Delete Multiple'"
            :subtitle="selected.length < 2 ? 'Mark item as Deleted' : 'Mark multiple items as Deleted'
              "
            prepend-icon="mdi-delete"
            :disabled="!selected.length"
            @click="deleteItems()" />
          <v-list-item v-if="showDeleted"
            :title="selected.length < 2 ? 'Restore' : 'Restore Multiple'"
            :subtitle="selected.length < 2
              ? 'Remove Deleted status from item'
              : 'Remove Deleted status from items'
              "
            prepend-icon="mdi-file-restore-outline"
            :disabled="!selected.length"
            @click="deleteItems(true)" />
          <v-list-item v-if="showDeleted && !showDeleteConfirm"
            title="Delete Permanently"
            variant="elevated"
            elevation="0"
            subtitle="Delete these items permanently"
            prepend-icon="mdi-delete-forever-outline"
            base-color="warning"
            :disabled="!selected.length"
            @click="showDeleteConfirm = true" />
          <v-divider v-if="showDeleteConfirm" />
          <v-list-item v-if="showDeleteConfirm"
            title="Confirm Permanent Deletion"
            subtitle="This action cannot be undone"
            prepend-icon="mdi-exclamation-thick"
            :disabled="!selected.length"
            @click="deleteItemsPermanent()"
            base-color="error" />
          <v-list-item v-if="showDeleteConfirm"
            title="Cancel Permanent Deletion"
            prepend-icon="mdi-cancel"
            @click="showDeleteConfirm = false"
            base-color="accent" />
        </v-list>
      </v-col>
    </v-row>
  </v-card-text>
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
          @click="setGroup"
          color="accent">Set</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as _ from 'lodash-es';
import { PilotStore } from '../../store';
import exportAsJson from '@/util/jsonExport';
import { PilotGroup } from '../../store/PilotGroup';

defineProps<{ type: string }>()

const selected = ref<any[]>([])
const addKvp = ref({ key: '', value: '' })
const printDialog = ref(false)
const deleteDialog = ref(false)
const showDeleted = ref(false)
const setGroupDialog = ref(false)
const stagedGroup = ref<any>(null)
const showDeleteConfirm = ref(false)

const headers = computed(() => [
  { key: 'select', sortable: false, width: '40px' },
  { title: 'Name', key: 'Name', sortable: true },
  { title: 'Callsign', key: 'Callsign', sortable: true },
  { title: 'LL', key: 'Level', sortable: true },
  { title: 'Mech', key: 'Mech', sortable: true },
  { title: 'Group', key: 'group', sortable: true, value: (item: any) => getPilotGroup(item) },
  { title: 'Updated', key: 'LastUpdate', sortable: true },
])

const items = computed(() =>
  PilotStore().Pilots.filter(
    (x: any) => showDeleted.value || !x.SaveController.IsDeleted
  )
)

const allGroups = computed(() => PilotStore().getPilotGroups())

async function setGroup() {
  for (const id of selected.value) {
    const item = items.value.find((x: any) => x.ID === id) as any;
    if (item) {
      await PilotStore().TransferPilot(item, stagedGroup.value ? (stagedGroup.value as PilotGroup).ID : undefined);
    }
  }

  stagedGroup.value = null;
  setGroupDialog.value = false;
  await PilotStore().SaveGroupData();
  await PilotStore().SavePilotData();
}

function exportItems() {
  let json = {} as any;
  let filename = '';
  if (selected.value.length === 1) {
    const item = items.value.find((x: any) => x.ID === selected.value[0]);
    if (item) {
      json = (item as any).Serialize();
      filename = (item as any).Name + '.json';
    }
  } else {
    const data = items.value.filter((x: any) => selected.value.includes(x.ID));
    json = {
      type: `pilot_collection`,
      item_count: data.length,
      data: data.map((x: any) => x.Serialize()),
    };
    filename = `roster_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`;
  }

  exportAsJson(json, filename);
}

function deleteItems(undelete: boolean = false) {
  selected.value.forEach((id) => {
    const item = items.value.find((x: any) => x.ID === id) as any;
    if (item) {
      if (undelete) item.SaveController.Restore();
      else item.SaveController.Delete();
    }
  });
  selected.value = [];
  PilotStore().SavePilotData();
  PilotStore().SaveGroupData();
}

async function deleteItemsPermanent() {
  const promises = [] as Promise<any>[];
  selected.value.forEach((id) => {
    const item = items.value.find((x: any) => x.ID === id) as any;
    if (item && item.SaveController.IsDeleted) {
      promises.push(PilotStore().DeletePilotPermanent(item));
    }
  });
  await Promise.all(promises);

  selected.value = [];
  showDeleteConfirm.value = false;
}

function getPilotGroup(item: any) {
  const group = PilotStore().PilotGroups.find((x) => x.Pilots.some((y) => y.id === item.ID));
  return group ? group.Name : 'None';
}

function timeAgo(timestamp: number | string) {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
</script>
