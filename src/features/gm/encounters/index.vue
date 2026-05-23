<template>
  <v-container>
    <v-row>
      <v-col class="heading h2">Encounters</v-col>
      <v-col cols="auto">
        <cc-modal title="organize encounters"
          icon="mdi-queue-first-in-last-out">
          <template #activator="{ open }">
            <cc-button size="small"
              color="primary"
              class="mx-4"
              @click="open">Organize</cc-button>
          </template>
          <template #default="{ close }">
            <organizer type="encounter"
              @exit="close" />
          </template>
        </cc-modal>
      </v-col>
    </v-row>
    <v-card flat
      tile>
      <v-toolbar class="px-2 rounded-b-0">
        <v-row dense
          align="center">
          <v-col cols="auto"></v-col>
          <v-col class="pl-4">
            <v-autocomplete v-model="search"
              :placeholder="`Search Encounters`"
              :items="items"
              item-title="Name"
              item-value="Name"
              density="compact"
              hide-details
              clearable
              tile
              prepend-inner-icon="mdi-magnify" />
          </v-col>
          <v-col cols="3"
            class="ml-auto">
            <v-select v-model="grouping"
              :items="groupings"
              label="Group By"
              hide-details
              tile
              variant="outlined"
              density="compact" />
          </v-col>
          <v-col cols="3">
            <v-select v-model="sorting"
              :items="sortings"
              label="Sort By"
              hide-details
              tile
              variant="outlined"
              density="compact" />
          </v-col>
          <v-col cols="auto">
            <gm-collection-filter :items="items"
              :filters="filters"
              @add-filter="filters.push($event)"
              @remove-filter="filters.splice(filters.indexOf($event), 1)"
              @set-filters="filters = $event" />
          </v-col>
        </v-row>
      </v-toolbar>

      <gm-collection-folder v-for="folder in folders"
        :key="folder"
        :folder="folder"
        :filtered-items="filteredItems"
        :items="items"
        item-type="Encounter"
        :search="search"
        :view="view"
        :grouping="grouping"
        :sorting="sorting"
        :all-folders="folders"
        :transfer-key="folderTransferKey"
        folder-drag
        @set-folder-name="setFolderName(folder, $event)"
        @remove-folder="removeFolder($event)"
        @open="openItem($event)"
        @item-transferred="folderTransferKey++" />

      <v-card v-if="filteredItems.filter((x: any) => !x.FolderController?.Folder).length > 0"
        flat
        tile>
        <v-toolbar density="compact"
          style="height: 40px"
          class="mt-n2">
          <v-btn size="x-small"
            icon
            @click="showNoFolder = !showNoFolder">
            <v-icon size="30"
              icon="mdi-menu-right"
              :class="showNoFolder ? 'mdi-rotate-90' : ''" />
          </v-btn>
          <v-toolbar-title class="heading h3">No Folder</v-toolbar-title>
          <v-spacer />
          <div class="px-2 text-disabled text-caption">
            {{filteredItems.filter((x: any) => !x.FolderController?.Folder).length}}
            ({{items.filter((x: any) => !x.FolderController?.Folder).length}})
          </div>
        </v-toolbar>
        <v-expand-transition>
          <v-card-text v-if="showNoFolder">
            <sortable :key="`no-folder-${folderTransferKey}`"
              :list="sortedNoFolderItems"
              item-key="ID"
              :options="{ animation: 200, easing: 'cubic-bezier(1, 0, 0, 1)', handle: '.folder-drag-handle', group: { name: 'gm-folder-items', pull: true, put: true } }"
              @start="onNoFolderItemDragStart"
              @end="onNoFolderItemReorder"
              @add="onNoFolderItemAdded">
              <template #item="{ element }">
                <div style="position: relative"
                  :data-item-id="(element as any).ID">
                  <item-card :item="element"
                    list
                    :grouping="grouping"
                    :sorting="sorting"
                    @open="openItem($event)" />
                </div>
              </template>
            </sortable>
          </v-card-text>
        </v-expand-transition>
      </v-card>

      <div v-if="hidden"
        class="text-right pa-2 text-disabled">
        <i>{{ hidden }} items hidden by filter</i>
      </div>
    </v-card>

    <v-dialog v-model="editDialog"
      fullscreen>
      <encounter-editor :item="selected"
        @exit="editDialog = false" />
    </v-dialog>

    <v-footer fixed>
      <cc-button size="small"
        prepend-icon="mdi-folder-multiple-plus"
        color="primary"
        @click="addFolder">
        Add Folder
      </cc-button>
      <v-spacer />
      <cc-modal ref="import"
        title="import data"
        icon="mdi-download"
        no-confirm>
        <template #activator="{ open }">
          <cc-button size="small"
            color="primary"
            prepend-icon="mdi-download"
            class="mx-4"
            @click="open">
            Import
          </cc-button>
        </template>
        <template #default="{ close }">
          <importer @complete="close" />
        </template>
      </cc-modal>

      <share-code-dialog import-type="encounter" />
      <cc-button size="small"
        class="mx-4"
        prepend-icon="mdi-plus"
        color="accent"
        @click="addNew()">
        Add New Encounter
      </cc-button>
    </v-footer>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Sortable } from 'sortablejs-vue3'
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag'
import GmCollectionFilter from '../_views/_components/GMCollectionFilter.vue'
import GmCollectionFolder from '../_views/_components/GMCollectionFolder.vue'
import ItemCard from '../_views/_components/GMItemCard.vue'
import FolderMenu from '../_views/_components/FolderMenu.vue'
import { EncounterStore, UserStore } from '@/stores'
import { Encounter } from '@/classes/encounter/Encounter'
import EncounterEditor from './_components/EncounterEditor.vue'
import Organizer from '../_components/Organizer.vue'
import Importer from './_components/EncounterImporter.vue'
import ShareCodeDialog from '@/shared/ShareCodeDialog.vue'

const props = withDefaults(defineProps<{ id?: string }>(), {})
defineEmits<{ open: [item: any]; 'add-new': [] }>()

const search = ref('')
const view = ref('list')
const sorting = ref('Name')
const grouping = ref('None')
const filters = ref<any[]>([])
const openFolders = ref<string[]>([])
const showNoFolder = ref(true)
const hideFolders = ref(false)
const folderTransferKey = ref(0)
const selected = ref<any>(null)
const editDialog = ref(false)

const folders = computed<string[]>(() => EncounterStore().getFolders)
const items = computed<any[]>(() => EncounterStore().Encounters.filter((x) => !x.SaveController.IsDeleted))

const filteredItems = computed(() => {
  let out = items.value
  if (filters.value.length) {
    out = out.filter((x: any) => {
      if (x.StatController) {
        const stats = x.StatController.DisplayKeys.map((x: any) => x.title)
        if (filters.value.some((f) => stats.some((s: any) => s === f))) return false
      }
      if (x.NarrativeController) {
        const labels = x.NarrativeController.Labels.map((x: any) => x.title)
        if (filters.value.some((f) => labels.some((s: any) => s === f))) return false
      }
      return true
    })
  }
  return out
})

const hidden = computed(() => items.value.length - filteredItems.value.length)

const groupings = computed(() => {
  const allLabelTitles = new Set(
    EncounterStore().getAllLabels.filter((x: any) => x.title.length > 0).map((x: any) => x.title)
  )
  return ['None', 'Sitrep', 'Environment', ...allLabelTitles]
})

const sortings = computed(() => {
  const allLabelTitles = new Set(
    EncounterStore().getAllLabels.filter((x: any) => x.title.length > 0).map((x: any) => x.title)
  )
  return ['Name', 'Created', 'Updated', 'Sitrep', 'Environment', ...allLabelTitles]
})

const sortedNoFolderItems = computed(() =>
  filteredItems.value
    .filter((x: any) => !x.FolderController?.Folder)
    .slice()
    .sort((a: any, b: any) => a.FolderController.SortIndex - b.FolderController.SortIndex)
)

watch(view, (val) => { if (!val) return; UserStore().User.SetView('encountersView', val) })
watch(sorting, (val) => { if (!val) return; UserStore().User.SetView('encountersSorting', val) })
watch(grouping, (val) => { if (!val) return; UserStore().User.SetView('encountersGrouping', val) })
watch(filters, (val) => { UserStore().User.SetView('encountersFilters', val) })
watch(hideFolders, (val) => { UserStore().User.SetView('encountersHideFolders', val) })

const user = UserStore().User
if (user?.View) {
  view.value = user.View('encountersView', 'list')
  sorting.value = user.View('encountersSorting', 'Name')
  grouping.value = user.View('encountersGrouping', 'None')
  filters.value = user.View('encountersFilters', []) as any[]
  hideFolders.value = user.View('encountersHideFolders', false)
}
if (props.id) {
  const item = EncounterStore().getEncounterByID(props.id)
  if (item) {
    selected.value = item
    editDialog.value = true
  }
}

function addFolder() {
  let folderName = 'New Folder'
  if (folders.value.some((x) => x === folderName)) {
    let i = 1
    while (folders.value.some((x) => x === `${folderName} ${i}`)) i++
    folderName = `${folderName} ${i}`
  }
  EncounterStore().AddFolder(folderName)
  hideFolders.value = false
}
function setFolderName(old: string, newName: string) {
  EncounterStore().EditFolder({ old, newName })
}
function removeFolder(folder: string) {
  EncounterStore().RemoveFolder(folder)
}
function openItem(item: any) {
  selected.value = item
  editDialog.value = true
}
function onNoFolderItemDragStart(event: any) {
  startDragScroll()
  const itemId = event.item.dataset.itemId
  if (event.originalEvent?.dataTransfer && itemId) {
    event.originalEvent.dataTransfer.setData('text/encounter-id', itemId)
  }
}
function onNoFolderItemReorder(event: any) {
  stopDragScroll()
  if (event.from !== event.to) return
  if (event.oldIndex === event.newIndex) return
  const itemsList = [...sortedNoFolderItems.value] as any[]
  const [moved] = itemsList.splice(event.oldIndex, 1)
  itemsList.splice(event.newIndex, 0, moved)
  itemsList.forEach((item: any, idx: number) => { item.FolderController.SortIndex = idx })
}
async function onNoFolderItemAdded(event: any) {
  const itemId = event.item.dataset.itemId
  const item = items.value.find((x: any) => x.ID === itemId)
  if (!item) return
  item.FolderController.Folder = ''
  await nextTick()
  const itemsList = [...sortedNoFolderItems.value] as any[]
  const movedIdx = itemsList.findIndex((x: any) => x.ID === itemId)
  if (movedIdx !== -1 && movedIdx !== event.newIndex) {
    const [moved] = itemsList.splice(movedIdx, 1)
    itemsList.splice(Math.min(event.newIndex, itemsList.length), 0, moved)
  }
  itemsList.forEach((item: any, idx: number) => { item.FolderController.SortIndex = idx })
  folderTransferKey.value++
}
function addNew() {
  const e = new Encounter()
  EncounterStore().AddEncounter(e)
  selected.value = e
  editDialog.value = true
}
</script>
