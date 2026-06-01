<template>
  <div class="text-overline">SITREP</div>
  <v-card class="py-2 px-4"
    variant="outlined"
    style="border-color: rgb(var(--v-theme-panel))">
    <v-row align="center">
      <v-col>
        <cc-short-string-editor justify="start"
          :readonly="readonly"
          :placeholder="item.Sitrep.Name"
          @set="item.Sitrep.Name = $event">
          <span class="heading h3">{{ item.Sitrep.Name }}</span>
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
        <cc-button color="primary"
          size="small"
          :prepend-icon="showPresets ? 'mdi-chevron-double-down' : 'mdi-chevron-double-right'"
          @click="showPresets = !showPresets">
          PRESETS
        </cc-button>
      </v-col>
    </v-row>

    <v-slide-y-transition>
      <v-card v-if="showPresets"
        flat
        tile
        variant="tonal"
        color="secondary"
        class="px-1">
        <v-chip-group show-arrows>
          <v-chip v-for="sitrep in sitreps"
            :key="sitrep.Name"
            size="small"
            class="rounded-0"
            label
            @click="setSitrep(sitrep)">
            {{ sitrep.Name }}
          </v-chip>
        </v-chip-group>
        <template v-if="userPresets.length > 0">
          <v-divider class="my-1" />
          <div class="text-cc-overline text-disabled px-2">MY PRESETS</div>
          <v-chip-group>
            <v-chip v-for="(preset, i) in userPresets"
              :key="preset.id"
              size="small"
              class="rounded-0"
              label
              @click="loadUserPreset(preset)">
              {{ preset.name }}
              <v-icon size="14"
                class="ml-1"
                icon="mdi-close"
                @click.stop="stagedDeleteIndex = i; deleteConfirmDialog = true" />
            </v-chip>
          </v-chip-group>
        </template>
      </v-card>
    </v-slide-y-transition>

    <v-textarea v-model="item.Sitrep.Description"
      :readonly="readonly"
      label="Description"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2 mt-2" />
    <v-textarea v-if="shownKeys.includes('Deployment')"
      v-model="item.Sitrep.Deployment"
      :readonly="readonly"
      label="Deployment"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('Deployment')" />
      </template>
    </v-textarea>
    <v-textarea v-if="shownKeys.includes('Objective')"
      v-model="item.Sitrep.Objective"
      :readonly="readonly"
      label="Objective"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('Objective')" />
      </template>
    </v-textarea>
    <v-textarea v-if="shownKeys.includes('ControlZone')"
      v-model="item.Sitrep.ControlZone"
      :readonly="readonly"
      label="Control Zone"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('ControlZone')" />
      </template>
    </v-textarea>
    <v-textarea v-if="shownKeys.includes('Extraction')"
      v-model="item.Sitrep.Extraction"
      :readonly="readonly"
      label="Extraction"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mb-2">
      <template #append-inner>
        <v-icon v-if="!readonly"
          icon="mdi-close"
          class="fade-select"
          @click="removeKey('Extraction')" />
      </template>
    </v-textarea>

    <v-card v-for="(c, i) in item.Sitrep.Conditions"
      :key="`condition-${i}`"
      class="pa-2">
      <v-text-field v-model="c.title"
        :readonly="readonly"
        label="Title"
        density="compact"
        hide-details
        class="mb-2">
        <template #append>
          <v-icon v-if="!readonly"
            icon="mdi-delete"
            class="fade-select"
            @click="item.Sitrep.Conditions.splice(i)" />
        </template>
      </v-text-field>
      <v-textarea v-model="c.condition"
        :readonly="readonly"
        label="Conditions"
        density="compact"
        rows="1"
        variant="outlined"
        auto-grow
        hide-details
        class="mb-2" />
    </v-card>

    <v-row v-if="!readonly"
      dense>
      <v-col v-for="key in keys.filter((x) => !item.Sitrep[x])"
        :key="key"
        cols="auto">
        <cc-button color="primary"
          size="small"
          prepend-icon="mdi-plus"
          @click="showKey(key)">
          {{ key }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button color="primary"
          size="small"
          prepend-icon="mdi-plus"
          @click="item.Sitrep.Conditions.push({ title: 'New Condition', condition: '' })">
          Condition
        </cc-button>
      </v-col>
      <v-col cols="auto"
        class="ml-auto">
        <cc-button v-if="!readonly"
          color="info"
          size="small"
          prepend-icon="mdi-content-save-outline"
          :disabled="!item.Sitrep.modified"
          @click="savePreset">
          Save Preset
        </cc-button>
      </v-col>
    </v-row>

    <cc-dialog v-model="confirmDialog"
      title="sitrep modified"
      icon="mdi-undo-variant"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        This sitrep has been modified. Loading a new preset will delete these changes. Are you sure
        you want to continue?
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary"
          size="small"
          @click="confirmDialog = false">cancel</cc-button>
        <v-spacer />
        <cc-button color="success"
          size="small"
          @click="confirm()">confirm</cc-button>
      </div>
    </cc-dialog>

    <cc-dialog v-model="deleteConfirmDialog"
      title="delete preset"
      icon="mdi-delete"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        Delete preset
        <b>{{ stagedDeleteIndex >= 0 ? userPresets[stagedDeleteIndex]?.name : '' }}</b>?
        This cannot be undone.
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary"
          size="small"
          @click="deleteConfirmDialog = false">cancel</cc-button>
        <v-spacer />
        <cc-button color="error"
          size="small"
          @click="confirmDeletePreset">delete</cc-button>
      </div>
    </cc-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { v4 as uuid } from 'uuid'
import { Encounter } from '@/classes/encounter/Encounter'
import { Sitrep, SitrepInstance, type ISitrepData } from '@/classes/encounter/Sitrep'
import { CompendiumStore } from '@/stores'
import { GetValue, SetValue } from '@/io/Storage'

const STORAGE_KEY = 'user_sitrep_presets'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })

const keys = ['Deployment', 'Objective', 'ControlZone', 'Extraction']
const shownKeys = ref<string[]>([])
const confirmDialog = ref(false)
const showPresets = ref(false)
const stagedSitrep = ref<Sitrep | null>(null)
const userPresets = ref<ISitrepData[]>([])
const deleteConfirmDialog = ref(false)
const stagedDeleteIndex = ref(-1)

const sitreps = computed(() => CompendiumStore().Sitreps)

onMounted(async () => {
  shownKeys.value = keys.filter((x) => props.item.Sitrep[x].length)
  userPresets.value = (await GetValue(STORAGE_KEY)) || []
})

function showKey(key: string) {
  if (!shownKeys.value.includes(key)) shownKeys.value.push(key)
}
function removeKey(key: string) {
  props.item.Sitrep[key] = ''
  shownKeys.value = shownKeys.value.filter((x) => x !== key)
}
function setSitrep(sitrep: Sitrep) {
  if (props.item.Sitrep.modified) {
    stagedSitrep.value = sitrep
    confirmDialog.value = true
    return
  }
  _setSitrep(sitrep)
}
function confirm() {
  confirmDialog.value = false
  _setSitrep(stagedSitrep.value)
  stagedSitrep.value = null
}
function _setSitrep(sitrep: any) {
  props.item.Sitrep = new SitrepInstance(props.item as Encounter, sitrep)
  shownKeys.value = keys.filter((x) => props.item.Sitrep[x].length)
}
function loadUserPreset(preset: ISitrepData) {
  setSitrep(new Sitrep(preset))
}
async function savePreset() {
  const base = props.item.Sitrep.Name.replace(/ \(\d+\)$/, '')
  const existing = [
    ...sitreps.value.map((s: any) => s.Name),
    ...userPresets.value.map((p) => p.name),
  ]
  let name = base
  if (existing.includes(name)) {
    let i = 2
    while (existing.includes(`${base} (${i})`)) i++
    name = `${base} (${i})`
  }
  const preset: ISitrepData = {
    id: uuid(),
    name,
    modified: false,
    description: props.item.Sitrep.Description,
    deployment: props.item.Sitrep.Deployment,
    objective: props.item.Sitrep.Objective,
    controlZone: props.item.Sitrep.ControlZone,
    extraction: props.item.Sitrep.Extraction,
    conditions: [...props.item.Sitrep.Conditions],
  }
  userPresets.value.push(preset)
  await SetValue(STORAGE_KEY, userPresets.value)
}
async function confirmDeletePreset() {
  userPresets.value.splice(stagedDeleteIndex.value, 1)
  await SetValue(STORAGE_KEY, userPresets.value)
  deleteConfirmDialog.value = false
  stagedDeleteIndex.value = -1
}
</script>
