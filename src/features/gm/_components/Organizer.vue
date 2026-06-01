<template>
  <cc-organizer :items="items"
    :headers="headers">
    <template #filters>
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
    </template>

    <template #name-prefix="{ item }">
      <cc-missing-content-hover :item="item" />
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

    <template #actions="{ selected, items, showDeleted, clearSelected, showDeleteConfirm, setShowDeleteConfirm }">
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
        @click="routePrint(selected)" />
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
      <folder-dialog ref="folderDialog"
        :folders="allFolders"
        @confirm="setFolder($event)" />
      <label-dialog ref="labelDialog"
        :all-labels="allLabels"
        :selected-labels="selectedLabels"
        @confirm="setData('label', $event)" />
    </template>
  </cc-organizer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer'
import { uniqBy } from 'lodash-es'
import { NarrativeStore } from '../store/narrative_store'
import { NpcStore } from '../store/npc_store'
import exportAsJson from '@/util/jsonExport'
import { EncounterStore } from '@/stores'
import { DeleteItemPermanent, GenerateExportCollection } from '@/io/Importer'
import FolderDialog from './_subcomponents/FolderDialog.vue'
import LabelDialog from './_subcomponents/LabelDialog.vue'
import CCOrganizer from '@/ui/components/CCOrganizer.vue'

const router = useRouter()

const props = defineProps<{
  type: string
}>()

const folderDialog = ref<any>(null)
const labelDialog = ref<any>(null)
const shownTypes = ref([] as string[])
const allTypes = ref([] as string[])

const headers = ref([
  { title: 'Name', key: 'Name', sortable: true },
  { title: 'Folder', key: 'folder', sortable: true, value: (item: any) => item.FolderController?.Folder || '' },
  { title: 'GM Labels', key: 'labels', sortable: true, value: (item: any) => item.NarrativeController?.Labels?.map((l: any) => l.title).join(', ') || '' },
])

const items = computed(() => {
  let all = [] as any[]
  if (props.type === 'npc') all = NpcStore().Npcs
  else if (props.type === 'narrative') all = NarrativeStore().CollectionItems
  else if (props.type === 'encounter') all = EncounterStore().Encounters
  return all.filter((x: any) => shownTypes.value.includes(x.ItemType.toLowerCase()))
})

const allFolders = computed(() => [
  ...NpcStore().getFolders,
  ...EncounterStore().getFolders,
  ...NarrativeStore().getFolders,
])

const allLabels = computed(() => NarrativeStore().getAllLabels)

const selectedLabels = computed(() =>
  uniqBy(
    items.value.flatMap((x: any) => x.NarrativeController?.Labels || []),
    'title'
  )
)

function setData(_prop: string, payload: any) {
  const op = typeof payload === 'string' ? payload : payload.op
  const kvpKey = typeof payload === 'string' ? '' : payload.key
  const kvpValue = typeof payload === 'string' ? '' : payload.value
  items.value.forEach((item: any) => {
    const key = kvpKey?.title ? kvpKey.title : kvpKey
    const val = kvpKey?.value ? kvpKey.value : kvpValue
    if (op === 'set') item.NarrativeController.Labels.push({ title: key, value: val })
    if (op === 'delete')
      item.NarrativeController.Labels = item.NarrativeController.Labels.filter((x: any) => x.title !== key)
  })
  NarrativeStore().SaveItemData()
  NpcStore().SaveNpcData()
}

function setFolder(folderName: string) {
  items.value.forEach((item: any) => {
    item.FolderController.Folder = folderName
  })
  NarrativeStore().SaveItemData()
  NpcStore().SaveNpcData()
}

function exportItems(selected: string[], allItems: any[]) {
  const selectedItems = selected.map((x) => allItems.find((y) => y.ID === x))
  const json = GenerateExportCollection(selectedItems, props.type)
  const filename = selected.length === 1
    ? allItems.find((x: any) => x.ID === selected[0]).Name
    : `GM_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`
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
  NarrativeStore().SaveItemData()
  NpcStore().SaveNpcData()
  EncounterStore().SaveEncounterData()
}

async function deleteItemsPermanent(selected: string[], allItems: any[], clearSelected: () => void, setShowDeleteConfirm: (v: boolean) => void) {
  await Promise.all(selected.map((id) => DeleteItemPermanent(allItems.find((x: any) => x.ID === id))))
  clearSelected()
  setShowDeleteConfirm(false)
}

function routePrint(selected: string[]) {
  if (props.type === 'narrative')
    router.push(`/gm/print/narrative/${JSON.stringify(selected)}`)
  else router.push(`/gm/print/${JSON.stringify(selected)}`)
}
</script>
