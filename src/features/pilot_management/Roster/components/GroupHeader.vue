<template>
  <v-toolbar density="compact"
    :class="['mt-2', 'title-hover', { 'title-drag-active': dropActive }, { 'pl-4': mobile && !noGroup }]"
    height="48"
    style="position: relative; clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)"
    @click="emit('toggle-expand')"
    @dragover.prevent
    @drop.prevent="emit('drop')">
    <v-icon v-if="!noGroup && (!mobile || dragModeActive)"
      icon="mdi-drag"
      class="group-drag-handle mr-1 ml-2"
      aria-label="Drag to reorder group"
      tabindex="0"
      style="cursor: move; opacity: 0.5; transition: opacity 0.2s"
      @click.stop />
    <v-avatar v-if="group.PortraitController.HasImage"
      size="30px"
      class="mr-2">
      <cc-img :src="group.Portrait" />
    </v-avatar>
    <div v-else-if="noGroup"
      class="mr-2"
      style="width: 30px; height: 30px;" />
    <span class="heading h3">{{ group.Name }}</span>
    <v-btn v-if="mobile"
      :icon="edit ? 'mdi-pencil-off' : 'mdi-pencil'"
      size="x-small"
      v-bind="props"
      @click.stop="setEdit()" />
    <span class="pl-4 text-caption">
      ({{ pilotCount }} Pilot{{ pilotCount === 1 ? '' : 's' }})
    </span>
    <v-spacer />
    <v-divider v-if="!mobile"
      vertical
      class="ts mx-4"
      style="transform: skew(-45deg); opacity: 1 !important" />
    <v-icon :icon="group.Expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
  </v-toolbar>

  <v-expand-transition>
    <div v-if="group.Expanded && !noGroup"
      class="pa-2">
      <v-row align="start">
        <v-col cols="12"
          md=""
          :order="mobile ? 1 : 0">
          <v-expand-transition>
            <cc-text-field v-if="edit"
              v-model="group.Name"
              label="Group Name"
              variant="outlined"
              color="primary"
              density="compact"
              hide-details
              class="mb-2" />
          </v-expand-transition>
          <v-expand-transition>
            <fieldset v-if="group.Description || edit"
              class="py-1 px-2 my-1"
              style="border-radius: 4px">
              <legend class="text-overline px-2"
                style="line-height: 0">Description</legend>
              <div class="py-1 px-2 flavor-text">
                <cc-text-editor-inline v-if="edit"
                  :original="group.Description"
                  @save="group.Description = $event" />
                <div v-else
                  v-html-safe="group.Description" />
              </div>
            </fieldset>
          </v-expand-transition>
          <v-expand-transition>
            <fieldset v-if="group.History || edit"
              class="py-1 px-2 my-4"
              style="border-radius: 4px">
              <legend class="text-overline px-2"
                style="line-height: 0">History</legend>
              <div class="py-1 px-2 flavor-text">
                <cc-text-editor-inline v-if="edit"
                  :original="group.History"
                  @save="group.History = $event" />
                <div v-else
                  v-html-safe="group.History" />
              </div>
            </fieldset>
          </v-expand-transition>
          <cc-button v-if="mobile && edit"
            prepend-icon="mdi-pencil-circle-outline"
            block
            size="x-small"
            color="primary"
            @click="edit = false">
            Finish Editing
          </cc-button>
        </v-col>
        <v-col v-if="group.PortraitController.CloudImage || edit"
          cols="12"
          md="3"
          :order="mobile ? 0 : 1"
          :class="!mobile ? 'mb-2' : ''"
          class="text-right pa-3">
          <div class="d-flex justify-center">
            <cc-img :src="group.Portrait"
              :max-width="mobile ? 200 : ''" />
          </div>
          <div v-if="edit"
            class="text-right mb-2">
            <group-emblem-modal :group="group" />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-expand-transition>

  <v-expand-transition v-if="group.Expanded">
    <v-row v-if="edit"
      class="pa-1">
      <v-spacer />
      <v-col cols="auto">
        <v-dialog v-model="deleteDialog"
          width="auto">
          <template #activator="{ props }">
            <cc-button color="error"
              size="small"
              prepend-icon="mdi-delete"
              v-bind="props">Delete Group
            </cc-button>
          </template>
          <v-card tile>
            <v-card-text>
              <cc-alert color="error"
                icon="mdi-alert"
                :title="`Delete ${group.Name}?`">
                <div v-if="pilotCount"
                  class="pa-1">
                  <span v-if="deletePilotsToggle">
                    All pilots assigned to this group will be permanently deleted.
                  </span>
                  <span v-else>
                    All pilots assigned to this group will be moved to the "No Group" section
                  </span>
                </div>
              </cc-alert>
              <v-row v-if="pilotCount"
                justify="end">
                <v-col cols="auto">
                  <cc-switch v-model="deletePilotsToggle"
                    inset
                    color="error"
                    label="Delete pilots"
                    density="compact"
                    hide-details />
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn color="accent"
                variant="plain"
                tile
                @click="deleteDialog = false">
                Dismiss
              </v-btn>
              <v-spacer />
              <cc-button v-if="!noGroup"
                color="error"
                variant="tonal"
                prepend-icon="mdi-delete"
                @click="emit('delete', deletePilotsToggle)">
                Delete Group
              </cc-button>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-expand-transition>

  <v-slide-y-reverse-transition v-if="group.Expanded">
    <div v-if="!dragModeActive">
      <v-divider />
      <v-row justify="space-between"
        align="center"
        class="py-2 px-4 text-center"
        :dense="mobile">
        <v-col v-if="!noGroup"
          cols="12"
          sm="auto">
          <v-tooltip :text="edit ? 'Finish Editing' : 'Edit Group Information'">
            <template #activator="{ props }">
              <cc-button v-if="!mobile"
                :icon="edit ? 'mdi-pencil-off' : 'mdi-pencil'"
                color="primary"
                size="small"
                variant="outlined"
                v-bind="props"
                @click="edit = !edit" />
            </template>
          </v-tooltip>
        </v-col>

        <v-col v-if="transferrable.length"
          cols="auto"
          :order="mobile ? 1 : ''">
          <cc-button color="primary"
            :size="mobile ? 'x-small' : 'small'"
            :stacked="!mobile"
            prepend-icon="mdi-transfer"
            :disabled="!transferrable.length">
            {{ mobile ? 'Transfer' : 'Transfer Pilots' }}
            <v-menu activator="parent"
              :close-on-content-click="false">
              <v-card flat
                tile
                border>
                <v-text-field v-model="search"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                  prepend-inner-icon="mdi-magnify" />
                <v-divider class="mt-2" />
                <v-list max-height="400px"
                  density="compact">
                  <v-list-item v-for="pilot in transferrable"
                    :key="`transfer_${pilot.ID}`"
                    :title="pilot.Callsign"
                    :subtitle="pilot.Name"
                    slim
                    @click="emit('transfer-pilot', pilot)" />
                </v-list>
              </v-card>
            </v-menu>
          </cc-button>
        </v-col>

        <v-col cols="12"
          md=""
          class="text-left">
          <cc-button color="success"
            block
            prepend-icon="mdi-plus"
            @click="router.push({ name: 'new', params: { groupID: group.ID } })">
            Create New Pilot
            <template #info>
              <v-icon size="small"
                icon="cc:pilot" />
            </template>
            <template #subtitle>
              <div class="text-cc-overline"
                style="font-size: max(8px, calc(8px + 0.2vw)) !important">
                <span v-if="group.ID === 'no_group'">Add a new pilot to the roster</span>
                <span v-else>Add a new pilot to {{ group.Name }}</span>
              </div>
            </template>
          </cc-button>
        </v-col>

        <v-col cols="auto">
          <v-menu offset-y>
            <template #activator="{ props }">
              <cc-button color="primary"
                :size="mobile ? 'x-small' : 'small'"
                :stacked="!mobile"
                prepend-icon="mdi-dots-vertical"
                @click="props.onClick($event)">
                Import
              </cc-button>
            </template>
            <v-card tile
              border>
              <v-card-text>
                <cc-modal title="Import"
                  icon="mdi-import"
                  max-width="900">
                  <template #activator="{ open }">
                    <cc-button color="primary"
                      size="small"
                      block
                      prepend-icon="mdi-import"
                      @click="open">
                      File Import
                    </cc-button>
                  </template>
                  <template #default="{ close }">
                    <file-import :group-id="group.ID"
                      @done="close" />
                  </template>
                </cc-modal>
                <br />
                <share-code-dialog import-type="pilot"
                  block-btn />
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <cc-button color="primary"
          :size="mobile ? 'x-small' : 'small'"
          :stacked="!mobile"
          prepend-icon="mdi-export"
          @click="emit('export')">
          Export
        </cc-button>
      </v-row>
    </div>
  </v-slide-y-reverse-transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PilotStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import FileImport from './add_panels/FileImport.vue'
import ShareCodeDialog from '@/shared/ShareCodeDialog.vue'
import GroupEmblemModal from './_GroupEmblemModal.vue'

const props = defineProps<{
  group: any
  noGroup: boolean
  mobile: boolean
  dragModeActive: boolean
  dropActive: boolean
  pilotCount: number
}>()

const emit = defineEmits<{
  'toggle-expand': []
  'drop': []
  'delete': [deletePilots: boolean]
  'transfer-pilot': [pilot: Pilot]
  'export': []
}>()

const router = useRouter()
const edit = ref(false)
const deleteDialog = ref(false)
const deletePilotsToggle = ref(false)
const search = ref('')

const transferrable = computed(() =>
  PilotStore().Pilots.filter(
    (pilot) =>
      !pilot.SaveController.IsDeleted &&
      !props.group.Pilots.map((x: any) => x.id).includes(pilot.ID) &&
      (!search.value || (pilot.Name + pilot.Callsign).toLowerCase().includes(search.value.toLowerCase()))
  )
)

function setEdit() {
  if (!props.group.Expanded) emit('toggle-expand')
  edit.value = !edit.value
}
</script>

<style scoped>
.title-hover {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  transition: background-color 0.3s ease-in-out;
}

.title-hover:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-active));
}

.title-drag-active {
  background-color: rgb(var(--v-theme-success)) !important;
}
</style>
