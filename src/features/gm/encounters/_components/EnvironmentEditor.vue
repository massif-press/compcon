<template>
  <div class="text-overline">{{ $t('common.environment') }}</div>
  <v-card class="py-2 px-4"
    variant="outlined"
    style="border-color: rgb(var(--v-theme-panel))">
    <v-row dense>
      <v-col>
        <cc-short-string-editor justify="start"
          :readonly="readonly"
          :placeholder="item.Environment.Name"
          @set="item.Environment.Name = $event">
          <span class="heading h3">{{ item.Environment.Name }}</span>
        </cc-short-string-editor>
      </v-col>
      <v-col cols="auto">
        <cc-button color="primary"
          size="small"
          :prepend-icon="showPresets ? 'mdi-chevron-double-down' : 'mdi-chevron-double-right'"
          @click="showPresets = !showPresets">
          {{ $t('gm.sitrep.presets') }}
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
          <v-chip v-for="environment in environments"
            :key="environment.Name"
            size="small"
            class="rounded-0"
            label
            @click="setEnvironment(environment)">
            {{ environment.Name }}
          </v-chip>
        </v-chip-group>
        <template v-if="userPresets.length > 0">
          <v-divider class="my-1" />
          <div class="text-cc-overline text-disabled px-2">{{ $t('gm.sitrep.myPresets') }}</div>
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

    <v-textarea v-model="item.Environment.Description"
      :readonly="readonly"
      :label="$t('common.description')"
      density="compact"
      rows="1"
      variant="outlined"
      auto-grow
      hide-details
      class="mt-2" />

    <cc-dialog v-model="confirmDialog"
      :title="$t('gm.titles.environmentDataModified')"
      icon="mdi-undo-variant"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">{{ $t('gm.environment.modifiedWarning') }}</v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary"
          size="small"
          @click="confirmDialog = false">{{ $t('common.cancel') }}</cc-button>
        <v-spacer />
        <cc-button color="success"
          size="small"
          @click="confirm">{{ $t('common.confirm') }}</cc-button>
      </div>
    </cc-dialog>

    <cc-dialog v-model="deleteConfirmDialog"
      :title="$t('gm.titles.deletePreset')"
      icon="mdi-delete"
      :close-on-click="false"
      color="error">
      <v-card-text class="text-center">
        <i18n-t keypath="gm.sitrep.deletePresetConfirm" tag="span" scope="global">
          <template #name><b>{{ userPresets[stagedDeleteIndex]?.name }}</b></template>
        </i18n-t>
      </v-card-text>
      <div class="d-flex justify-between px-6">
        <cc-button color="primary"
          size="small"
          @click="deleteConfirmDialog = false">{{ $t('common.cancel') }}</cc-button>
        <v-spacer />
        <cc-button color="error"
          size="small"
          @click="confirmDeletePreset">{{ $t('common.delete') }}</cc-button>
      </div>
    </cc-dialog>

    <v-row justify="end">
      <v-col cols="auto">
        <cc-button v-if="!readonly"
          color="accent"
          size="small"
          class="mt-2"
          prepend-icon="mdi-content-save-outline"
          :disabled="!item.Environment.modified"
          @click="savePreset">
          {{ $t('gm.sitrep.savePreset') }}
        </cc-button>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Environment, EnvironmentInstance, type IEnvironmentData } from '@/classes/Environment'
import { Encounter } from '@/classes/encounter/Encounter'
import { CompendiumStore } from '@/stores'
import { GetValue, SetValue } from '@/io/Storage'

const STORAGE_KEY = 'user_environment_presets'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })

const showPresets = ref(false)
const confirmDialog = ref(false)
const stagedEnvironment = ref<EnvironmentInstance | null>(null)
const userPresets = ref<IEnvironmentData[]>([])
const deleteConfirmDialog = ref(false)
const stagedDeleteIndex = ref(-1)

const environments = computed(() => CompendiumStore().Environments)

onMounted(async () => {
  userPresets.value = (await GetValue(STORAGE_KEY)) || []
})

function setEnvironment(environment: any) {
  if (props.item.Environment.modified) {
    stagedEnvironment.value = environment
    confirmDialog.value = true
    return
  }
  _setEnvironment(environment)
}
function confirm() {
  confirmDialog.value = false
  _setEnvironment(stagedEnvironment.value)
  stagedEnvironment.value = null
}
function _setEnvironment(environment: any) {
  props.item.Environment = new EnvironmentInstance(props.item as Encounter, environment)
}
function loadUserPreset(preset: IEnvironmentData) {
  setEnvironment(new Environment(preset))
}
async function savePreset() {
  const base = props.item.Environment.Name.replace(/ \(\d+\)$/, '')
  const existing = [
    ...environments.value.map((e: any) => e.Name),
    ...userPresets.value.map((p) => p.name),
  ]
  let name = base
  if (existing.includes(name)) {
    let i = 2
    while (existing.includes(`${base} (${i})`)) i++
    name = `${base} (${i})`
  }
  const preset: IEnvironmentData = {
    id: crypto.randomUUID(),
    name,
    modified: false,
    description: props.item.Environment.Description,
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
