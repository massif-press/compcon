<template>
  <v-card-text>
    <v-row align="center"
      justify="center">
      <v-col cols="6">
        <v-file-input v-model="fileValue"
          accept=".json, text/json"
          variant="outlined"
          :label="$t('pm.fields.selectPilotDataFile')"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>
    <v-container v-if="stagedData"
      flat
      tile>
      <v-card flat
        tile
        max-width="900px"
        class="mx-auto"
        border>
        <cc-alert v-if="isV2"
          icon="mdi-alert-circle-outline"
          :title="$t('pm.titles.v2Data')">
          <p class="text-text">
            {{ $t('pm.roster.thisAppearsToBePilotData') }}
          </p>
        </cc-alert>
        <v-card-text>
          <div class="heading h2">
            {{ stagedData.name }}
            <cc-slashes />
            <span class="text-accent pl-2">{{ stagedData.callsign }}</span>
          </div>
          <div class="text-cc-overline mb-2">
            {{ $t('ui.fields.licenseLevel') }}
            <span class="heading h3">{{ stagedData.level }}</span>
          </div>
          <div v-if="stagedData.mechs.length">
            <div class="text-cc-overline">{{ $t('pm.sheet.hangar') }}</div>
            <cc-chip v-for="mech in stagedData.mechs"
              :key="mech.id"
              class="mr-1 mb-1">
              {{ mech.name }}
              <cc-slashes />
              {{ getFrame(mech.frame) }}
            </cc-chip>
          </div>
          <div v-if="stagedData.brews.length"
            class="text-cc-overline my-1">
            {{ $t('pm.roster.includesDATAFROMTHEFOLLOWINGCONTENT') }}
            <div>
              <cc-chip v-for="brew in stagedData.brews"
                :key="brew.LcpId"
                class="ma-1">
                {{ brew.LcpName }}
              </cc-chip>
            </div>
          </div>
          <div v-if="stagedData.save">
            <v-divider class="my-2" />
            <div class="text-cc-overline mb-2">
              {{ $t('common.created') }} {{ new Date(stagedData.save.created).toLocaleString() }}
              <cc-slashes />
              {{ $t('pm.roster.lastModified') }}
              {{ new Date(stagedData.save.lastModified).toLocaleString() }}
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card v-if="missingContent.length"
        flat
        tile
        max-width="900px"
        class="mx-auto"
        border>
        <v-card-text class="text-center">
          <p class="heading h4 text-accent">
            {{ $t('pm.roster.thisPilotContainsContentFromThe') }}
          </p>
          <p v-html-safe="missingContent"
            class="effect-text text-center" />
          <p v-if="isV2"
            class="text-text">
            {{ $t('pm.roster.thisPilotWillBeSavedTo') }}
          </p>
          <p v-else
            class="text-text">
            {{ $t('pm.roster.thisPilotMayBeImportedBut') }}
          </p>
        </v-card-text>
      </v-card>
    </v-container>

    <div class="mt-2">
      <div v-if="alreadyPresent"
        class="text-center mb-1 text-caption text-text"
        v-text="alreadyPresent" />
      <v-slide-x-reverse-transition>
        <cc-button v-if="stagedData"
          color="primary"
          block
          prepend-icon="mdi-plus"
          @click="importFile()">
          {{ $t('common.import') }} {{ (stagedData as any).callsign }} ({{ (stagedData as any).name }})
        </cc-button>
      </v-slide-x-reverse-transition>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref, computed, watch } from 'vue'
import { Pilot, PilotData } from '@/classes/pilot/Pilot'
import { ImportData } from '@/io/Data';
import { CompendiumStore, PilotStore } from '@/stores';
import * as _ from 'lodash-es';
import logger from '@/user/logger';
import { notify } from '@/util/notify';
import {
  isV2Pilot,
  getV2PilotMissingLcps,
  preprocessPilotImport,
} from '@/io/V2Importer';

const props = withDefaults(defineProps<{
  groupId?: string | null;
  skipRosterSave?: boolean;
}>(), {
  groupId: null,
  skipRosterSave: false,
})

const emit = defineEmits<{ done: []; 'import-complete': [pilot: Pilot] }>()

const fileValue = ref<any>(null)
const missingContent = ref('')
const stagedData = ref<PilotData | null>(null)
const alreadyPresent = ref('')

const isV2 = computed(() => isV2Pilot(stagedData.value))

watch(stagedData, (newVal) => {
  if (!newVal) {
    reset()
  }
})

function reset() {
  fileValue.value = null
  missingContent.value = ''
  stagedData.value = null
  alreadyPresent.value = ''
}

function getFrame(frame) {
  const frameData = CompendiumStore().Frames.find((x) => x.ID === frame)
  if (frameData) return frameData.Name
  return `UNKNOWN FRAME (${frame})`
}

async function stageImport(file) {
  if (!file) return
  const pilotData = await ImportData<PilotData>(file.target.files[0])

  if (!pilotData.brews) pilotData.brews = []

  if (isV2Pilot(pilotData)) {
    const { missingNames } = getV2PilotMissingLcps(pilotData)
    if (missingNames.length) missingContent.value = missingNames.join('<br />')
  } else if (pilotData.brews.length && !(pilotData.brews[0] as any).LcpId) {
    const installedPacks = CompendiumStore()
      .ContentPacks.filter((x) => x.Active)
      .map((x) => `${x.Name} @ ${x.Version}`)
    const missingPacks = _.pullAll(pilotData.brews, installedPacks as any)
    if (missingPacks.length) missingContent.value = missingPacks.join('<br />')
  } else {
    const installedPacks = CompendiumStore()
      .ContentPacks.filter((x) => x.Active)
      .map((x) => x.ID)
    const missing = [] as string[]
    pilotData.brews.forEach((b) => {
      if (!installedPacks.includes((b as any).LcpId)) {
        missing.push(`${(b as any).LcpName} @ ${(b as any).LcpVersion}`)
      }
    })
    if (missing.length) missingContent.value = missing.join('<br />')
  }

  const exists = PilotStore().Pilots.find((x) => x.ID === pilotData.id)
  if (exists && !exists.SaveController.IsDeleted) {
    alreadyPresent.value =
      'A Pilot with this ID already exists in the roster. Importing will create a unique copy of this pilot.'
    const num = PilotStore().Pilots.filter((x) => x.Name === pilotData.name).length
    pilotData.name += ` (${num})`
  }
  stagedData.value = pilotData
}

async function importFile() {
  try {
    const result = await preprocessPilotImport(stagedData.value)

    if (result.action === 'backup') {
      notify({
        title: t('notify.gm.v2BackupTitle'),
        text: t('pm.import.v2BackupText', { callsign: (stagedData.value as any).callsign }),
        icon: 'mdi-information-box-outline', color: 'info',
      })
      reset()
      emit('done')
      return
    }

    const importPilot = new Pilot(result.transformed as PilotData)
    importPilot.RenewID()

    if (!props.skipRosterSave) {
      await PilotStore().AddPilot(importPilot, props.groupId)
      reset()
      notify({
        title: t('pm.import.importSuccessTitle'),
        text: t('pm.import.importSuccessText', { name: importPilot.Name, callsign: importPilot.Callsign }),
        icon: 'cc:pilot',
      })
      emit('done')
    } else {
      emit('import-complete', importPilot)
      emit('done')
    }
  } catch (error) {
    logger.error(`Pilot import error: ${error}`, error)
    notify({
      title: t('notify.gm.importErrorTitle'),
      text: t('pm.import.importPilotErrorText', { error: String(error) }),
      icon: 'cc:pilot', color: 'error',
    })
  }
}

function cancelImport() {
  reset()
}
</script>

<style scoped>
#panel {
  border: 5px double rgb(var(--v-theme-panel-border)) !important;
  border-radius: 2px !important;
}
</style>
