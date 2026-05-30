<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-row align="center"
              dense>
              <v-col cols="1"><v-divider /></v-col>
              <v-col cols="auto">
                <div class="heading h3">
                  <v-btn-toggle v-model="shownTypes"
                    density="compact"
                    multiple>
                    <v-btn v-for="t in allTypes"
                      :key="t"
                      size="small"
                      :value="t">{{ t }}</v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
              <v-col><v-divider /></v-col>
              <v-col cols="auto">{{ items.length }} items</v-col>
            </v-row>
          </v-col>
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
              <cc-missing-content-hover :item="item" />
              {{ (item as any).Name }}
            </span>
          </template>
          <template #item.folder="{ item }">
            <v-chip v-if="(item as any).FolderController.Folder"
              size="x-small"
              label
              prepend-icon="mdi-folder">
              {{ (item as any).FolderController.Folder }}
            </v-chip>
          </template>
          <template #item.labels="{ item }">
            <cc-split-chip v-for="(label, li) in (item as any).NarrativeController.Labels"
              :key="`label-${li}`"
              :label="label"
              class="mr-1 mb-1" />
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
          <v-list-item title="Set Folder"
            subtitle="Set item folder"
            prepend-icon="mdi-folder"
            :disabled="!selected.length"
            @click="($refs.folderDialog as any).open()" />
          <v-list-item title="Set GM Label"
            subtitle="Add, set, or delete a GM Label"
            prepend-icon="mdi-label"
            :disabled="!selected.length"
            @click="($refs.labelDialog as any).open()" />
          <v-list-item :title="selected.length < 2 ? 'Print' : 'Print Multiple'"
            subtitle="Generate item printables"
            prepend-icon="mdi-printer"
            :disabled="!selected.length"
            @click="routePrint()" />
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
  <folder-dialog ref="folderDialog"
    :folders="allFolders"
    @confirm="setFolder($event)" />

  <label-dialog ref="labelDialog"
    :all-labels="allLabels"
    :selected-labels="selectedLabels"
    @confirm="setData('label', $event)" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { uniqBy } from 'lodash-es';
import { NarrativeStore } from '../store/narrative_store';
import { NpcStore } from '../store/npc_store';
import exportAsJson from '@/util/jsonExport';
import { EncounterStore } from '@/stores';
import { DeleteItemPermanent, GenerateExportCollection } from '@/io/Importer';
import FolderDialog from './_subcomponents/FolderDialog.vue';
import LabelDialog from './_subcomponents/LabelDialog.vue';
const router = useRouter()

const props = defineProps<{
  type: string
}>()

const emit = defineEmits<{
  'exit': []
}>()

const folderDialog = ref<any>(null)
const labelDialog = ref<any>(null)

const headers = ref([
      { key: 'select', sortable: false, width: '40px' },
      { title: 'Name', key: 'Name', sortable: true },
      { title: 'Folder', key: 'folder', sortable: true, value: (item: any) => item.FolderController?.Folder || '' },
      { title: 'GM Labels', key: 'labels', sortable: true, value: (item: any) => item.NarrativeController?.Labels?.map((l: any) => l.title).join(', ') || '' },
    ])
const selected = ref([] as any[])
const printDialog = ref(false)
const deleteDialog = ref(false)
const shownTypes = ref([] as string[])
const allTypes = ref([] as string[])
const showDeleted = ref(false)
const showDeleteConfirm = ref(false)

const items = computed(() => {
      let items = [] as any[];
      if (props.type === 'npc')
        items = NpcStore().Npcs.filter(
          (x: any) =>
            shownTypes.value.includes(x.ItemType.toLowerCase()) &&
            (showDeleted.value || !x.SaveController.IsDeleted)
        );
      else if (props.type === 'narrative')
        items = NarrativeStore().CollectionItems.filter(
          (x: any) =>
            shownTypes.value.includes(x.ItemType.toLowerCase()) &&
            (showDeleted.value || !x.SaveController.IsDeleted)
        );
      else if (props.type === 'encounter')
        items = EncounterStore().Encounters.filter(
          (x: any) =>
            shownTypes.value.includes(x.ItemType.toLowerCase()) &&
            (showDeleted.value || !x.SaveController.IsDeleted)
        );

      return items;
    })
const allFolders = computed(() => {
      return [...NpcStore().getFolders, ...EncounterStore().getFolders, ...NarrativeStore().getFolders];
    })
const allLabels = computed(() => {
      return NarrativeStore().getAllLabels;
    })
const selectedLabels = computed(() => {
      return getSelectedData('label');
    })

function getSelectedData(prop: 'stat' | 'label') {
      return uniqBy(
        items.value
          .filter((x: any) => selected.value.includes(x.ID))
          .flatMap((x: any) => {
            if (prop === 'stat') return (x as IStatContainer).StatController.DisplayKeys;
            if (prop === 'label') return (x as any).NarrativeController.Labels;
          }),
        prop === 'stat' ? 'key' : 'title'
      );
    }
function setData(prop: 'stat' | 'label', payload: any) {
      const op = typeof payload === 'string' ? payload : payload.op;
      const kvpKey = typeof payload === 'string' ? '' : payload.key;
      const kvpValue = typeof payload === 'string' ? '' : payload.value;

      selected.value.forEach((id) => {
        const item = items.value.find((x: any) => x.ID === id) as any;
        if (item) {
          if (prop === 'label') {
            const key = kvpKey?.title ? kvpKey.title : kvpKey;
            const val = kvpKey?.value ? kvpKey.value : kvpValue;
            if (op === 'set') {
              item.NarrativeController.Labels.push({ title: key, value: val });
            }
            if (op === 'delete') {
              item.NarrativeController.Labels = item.NarrativeController.Labels.filter(
                (x: any) => x.title !== key
              );
            }
          }
        }
      });
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
    }
function setFolder(folderName: string) {
      selected.value.forEach((id) => {
        const item = items.value.find((x: any) => x.ID === id) as any;
        if (item) {
          item.FolderController.Folder = folderName;
        }
      });
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
    }
function exportItems() {
      const json = GenerateExportCollection(
        selected.value.map((x) => items.value.find((y) => y.ID === x)),
        props.type
      );

      const filename =
        selected.value.length === 1
          ? items.value.find((x: any) => x.ID === selected.value[0]).Name
          : `GM_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`;

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
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
      EncounterStore().SaveEncounterData();
    }
async function deleteItemsPermanent() {
      const promises = [] as Promise<any>[];
      selected.value.forEach((id) => {
        promises.push(deleteItemPermanent(items.value.find((x: any) => x.ID === id)));
      });
      await Promise.all(promises);

      selected.value = [];
      showDeleteConfirm.value = false;
    }
async function deleteItemPermanent(item: any) {
      await DeleteItemPermanent(item);
    }
function routePrint() {
      if (props.type === 'narrative')
        router.push(`/gm/print/narrative/${JSON.stringify(selected.value)}`);
      else router.push(`/gm/print/${JSON.stringify(selected.value)}`);
    }
</script>
