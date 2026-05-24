<template>
  <v-card>
    <div v-show="item">
      <v-card class="rounded-0 pb-12 elevation-0">
        <v-toolbar density="compact"
          class="rounded-0 pl-2"
          color="primary">
          <div class="heading h3 pa-1 text-white">
            <v-icon start
              size="large"
              icon="cc:encounter" />
            ENCOUNTER EDITOR
          </div>
          <v-spacer />
          <v-btn icon
            @click="$emit('exit')">
            <v-icon large
              color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row density="compact">
            <v-col cols="9">
              <v-row class="heading h1"
                dense>
                <cc-remote-hover :item="item"
                  color="accent" />
                <cc-missing-content-hover :item="item" />
                <v-col>
                  <div class="mt-n3">
                    <cc-short-string-editor large
                      :readonly="isRemote"
                      justify="start"
                      :placeholder="item.Name"
                      @set="item.Name = $event">
                      <div class="heading-block">
                        {{ item.Name }}
                      </div>
                    </cc-short-string-editor>
                  </div>
                </v-col>
              </v-row>

              <div class="text-overline">ENCOUNTER DETAILS</div>
              <cc-rich-text-area v-model="item.Description"
                :readonly="isRemote" />

              <sitrep-editor :readonly="isRemote"
                :item="item" />

              <environment-editor :readonly="isRemote"
                :item="item" />
            </v-col>
            <v-col cols="3"
              class="text-center ml-auto">
              <gm-folder-editor :readonly="isRemote"
                :item="item"
                class="mb-1" />
              <gm-label-editor :readonly="isRemote"
                :item="item"
                class="mb-4" />
              <v-card flat
                tile
                border>
                <v-window>
                  <v-window-item>
                    <div v-if="!item.PortraitController.HasImage"
                      class="text-cc-overline text-disabled"
                      style="padding-top:125px; padding-bottom: 125px;">NO MAP DATA</div>
                    <cc-img v-else
                      :src="item.PortraitController.Image" />
                    <cc-modal title="Set Map Image">
                      <template #activator="{ open }">
                        <cc-button v-if="!isRemote"
                          size="x-small"
                          block
                          color="primary"
                          @click="open">
                          Change Image
                        </cc-button>
                      </template>
                      <cc-image-selector ref="imageSelector"
                        :item="item"
                        type="doodad"
                        @set="item.PortraitController.Image = $event" />
                    </cc-modal>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>

          <combatant-editor :encounter="item"
            :readonly="isRemote" />

          <cc-icon-divider icon="mdi-robot-industrial"
            class="mt-2" />
          <div class="text-caption">ADDITIONAL DETAIL</div>
          <section-editor :readonly="isRemote"
            :item="item" />
          <v-divider class="my-2" />
          <div class="text-caption">CLOCKS</div>
          <cc-clock v-for="(c, ci) in item.NarrativeController.Clocks"
            :key="`clock-${ci}`"
            :readonly="isRemote"
            :clock="c"
            class="mx-1 my-2"
            @delete="item.NarrativeController.DeleteClock(c)" />
          <v-row v-if="!isRemote"
            justify="end">
            <v-col cols="auto">
              <cc-button color="primary"
                size="small"
                @click="item.NarrativeController.AddClock()">
                <v-icon start>mdi-plus</v-icon>
                Add New Clock
              </cc-button>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="text-caption">TABLES</div>
          <cc-rollable-table v-for="(t, ti) in item.NarrativeController.Tables"
            :key="`table-${ti}`"
            :readonly="isRemote"
            :table="t"
            class="mx-1 my-2"
            @delete="item.NarrativeController.DeleteTable(t)" />
          <v-row v-if="!isRemote"
            justify="end">
            <v-col cols="auto">
              <cc-button color="primary"
                size="small"
                @click="item.NarrativeController.AddTable()">
                <v-icon start>mdi-plus</v-icon>
                Add New Table
              </cc-button>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <div class="text-caption mb-2">ADDITIONAL NOTES</div>
          <cc-rich-text-area v-model="item.Note"
            :readonly="isRemote" />
        </v-container>
      </v-card>
    </div>
    <v-footer app
      color="panel"
      height="28"
      class="border-t-sm">
      <cc-button size="small"
        color="primary"
        :to="`/gm/print/${typeText.toLowerCase()}/${item.ID}`">
        <v-icon start
          icon="mdi-printer" />
        Print
      </cc-button>
      <cc-button size="small"
        color="primary"
        class="ml-2"
        @click="exportItem(item)">
        <v-icon start
          icon="mdi-upload" />
        Export
      </cc-button>
      <v-spacer />
      <cc-dialog v-if="!isRemote && isAuthed"
        title="Share Code"
        icon="mdi-broadcast"
        :close-on-click="false">
        <template #activator="{ open }">
          <cc-button color="panel"
            class="mx-2"
            size="small"
            @click="open">
            <v-icon start
              icon="mdi-broadcast" />
            Share Code
          </cc-button>
        </template>
        <share-dialog :item="item" />
      </cc-dialog>
      <v-spacer v-if="!isRemote && isAuthed" />

      <v-menu v-if="isRemote"
        v-model="convertMenu"
        offset-y
        offset-x
        top
        left>
        <template #activator="{ props }">
          <cc-button size="small"
            class="mx-3"
            v-bind="props">
            <v-icon start
              icon="mdi-content-copy" />
            Convert
          </cc-button>
        </template>
        <cc-confirmation content="Converting this item to local data will allow local editing but remove its remote link to the
      author's cloud account, and prevent any further updates from being received. To re-enable
      remote syncing, you will have to re-import this item via its share code."
          @confirm="convert()" />
      </v-menu>

      <v-tooltip v-if="isRemote">
        <template #activator="{ props }">
          <cc-button size="small"
            :disabled="item.CloudController.isSynced"
            class="mx-3"
            v-bind="props">
            <v-icon start>mdi-cloud-sync</v-icon>
            Update
          </cc-button>
        </template>
        {{
          isAuthed
            ? item.CloudController.isSynced
              ? 'Item is up to date with remote changes'
              : 'Download all remote changes to this item, overwriting local data.'
            : 'Must be logged in to update'
        }}
      </v-tooltip>

      <v-menu v-if="!isRemote"
        v-model="dupeMenu"
        offset-y
        offset-x
        top
        left>
        <template #activator="{ props }">
          <cc-button size="small"
            color="primary"
            class="mx-3"
            v-bind="props">
            <v-icon start
              icon="mdi-content-copy" />
            Duplicate
          </cc-button>
        </template>
        <cc-confirmation content="Confirm duplication of this NPC"
          @confirm="dupe()" />
      </v-menu>

      <v-menu v-if="!isRemote"
        v-model="deleteMenu"
        offset-y
        offset-x
        top
        left>
        <template #activator="{ props }">
          <cc-button size="small"
            color="error"
            class="mx-3"
            v-bind="props">
            <v-icon start
              icon="mdi-delete" />
            Delete
          </cc-button>
        </template>
        <cc-confirmation content="This will delete this Encounter from your library. Are you sure?"
          @confirm="deleteItem()" />
      </v-menu>
      <cc-button size="small"
        color="secondary"
        class="mx-3"
        @click="save()">
        <v-icon start
          icon="mdi-content-save" />
        Save and Exit
      </cc-button>
    </v-footer>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EncounterStore, UserStore } from '@/stores'
import { notify } from '@/util/notify'
import { GM_STRINGS } from '@/features/gm/strings'
import SectionEditor from '../../_components/SectionEditor.vue'
import GmLabelEditor from '../../_components/_subcomponents/GMLabelEditor.vue'
import GmFolderEditor from '../../_components/_subcomponents/GMFolderEditor.vue'
import ShareDialog from '@/shared/ShareDialog.vue'
import SitrepEditor from './SitrepEditor.vue'
import EnvironmentEditor from './EnvironmentEditor.vue'
import MapEditor from './map/MapEditor.vue'
import MapPreview from './map/MapPreview.vue'
import { Encounter } from '@/classes/encounter/Encounter'
import exportAsJson from '@/util/jsonExport'
import CombatantEditor from './combatants/CombatantEditor.vue'
import { CloudController } from '@/classes/components/cloud/CloudController'

const props = withDefaults(defineProps<{
  isNew?: boolean
  showDescription?: boolean
  item: Record<string, any>
}>(), {})

const emit = defineEmits<{ exit: [] }>()

const dupeMenu = ref(false)
const deleteMenu = ref(false)
const convertMenu = ref(false)
const loading = ref(false)

const typeText = computed(() => props.item ? props.item.ItemType.toUpperCase() : 'ERR')
const isRemote = computed(() => props.item.SaveController.IsRemote)
const isAuthed = computed(() => UserStore().IsLoggedIn)

function exit() {
  emit('exit')
}
function saveAsNew() {
  EncounterStore().AddEncounter(props.item as Encounter)
  exit()
}
function save() {
  EncounterStore().SaveEncounterData()
  emit('exit')
}
function deleteItem() {
  (props.item as Encounter).SaveController.Delete()
  emit('exit')
}
function dupe() {
  EncounterStore().CloneEncounter(props.item as Encounter)
  emit('exit')
}
function exportItem(item: any) {
  exportAsJson(Encounter.Serialize(item), `${item.Name}.json`)
}
async function remoteUpdate() {
  try {
    await CloudController.UpdateRemote(props.item)
    await UserStore().refreshDbData()
    notify({ title: GM_STRINGS.sync.syncCompleteTitle, text: GM_STRINGS.sync.syncCompleteText(props.item.ItemType, props.item.Name), data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' } })
  } catch (err) {
    notify({ title: GM_STRINGS.sync.syncFailedTitle, text: GM_STRINGS.sync.syncFailedText(props.item.ItemType, props.item.Name, String(err)), data: { icon: 'mdi-alert', color: 'error' } })
  }
}
async function convert() {
  loading.value = true
  UserStore().deleteRemoteItem(props.item.SaveController.RemoteCode)
  props.item.CloudController.GenerateMetadata()
  props.item.SaveController.ClearRemote()
  await UserStore().refreshDbData()
  loading.value = false
}
</script>
