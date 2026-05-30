<template>
  <v-card-text>
    <v-row align="center"
      justify="center">
      <v-col cols="6">
        <v-file-input v-model="fileValue"
          accept=".json, text/json"
          variant="outlined"
          label="Select Pilot Data File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>
    <v-container v-if="stagedPilots.length">

      <v-card flat
        tile
        color="primary"
        class="pa-1 heading h2 text-center">{{ stagedData.name }}</v-card>

      <v-card flat
        tile
        variant="outlined"
        color="panel"
        :disabled="!importPilots"
        class="pa-2">
        <v-row v-for="p in stagedPilots"
          :key="p.id"
          dense>
          <v-col cols="auto">
            <v-avatar size="100"
              flat
              tile>
              <v-img :src="p.img.portrait || p.img.cloud_portrait || '/img/pilot/nodata.png'" />
            </v-avatar>
          </v-col>
          <v-col class="text-text">
            <div class="heading h3">
              {{ p.name }}
              <cc-slashes />
              {{ p.callsign }}
            </div>
            <div class="text-caption">
              {{ p.background || 'Unknown Background' }}, LL {{ p.level }} <span v-if=p.player_name>
                ({{ p.player_name
                }})</span>
            </div>
            <cc-panel v-for="m in p.mechs"
              :key="m.id"
              density="compact"
              class="text-caption">
              <div>
                {{ m.name }} ({{ m.frameData.source }} {{ m.frameData.name }})
              </div>
            </cc-panel>
          </v-col>
        </v-row>
      </v-card>

      <v-row justify="end">
        <v-col cols="auto">
          <cc-checkbox v-model="importPilots"
            color="accent"
            :label="`Import Pilots (${stagedPilots.length})`"
            density="compact"
            hide-details />
        </v-col>
      </v-row>

      <div class="mt-2">
        <cc-alert v-if="alreadyPresent"
          color="warning"
          icon="mdi-alert"
          title="Group Already Exists"
          class="my-2">
          <p class="text-center"
            v-text="alreadyPresent" />
        </cc-alert>
        <v-slide-x-reverse-transition>
          <v-row v-if="stagedData"
            align="center"
            justify="center">
            <v-col cols="auto">
              <cc-button color="accent"
                block
                prepend-icon="mdi-plus"
                @click="importFile()">
                Import {{ (stagedData as any).name }}
                <span v-if="stagedPilots.length && importPilots">
                  &nbsp;and {{ stagedPilots.length }} Pilot{{
                    stagedPilots.length > 1 ? 's' : ''
                  }}</span>
              </cc-button>
            </v-col>
          </v-row>
        </v-slide-x-reverse-transition>
      </div>
    </v-container>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pilot, PilotData } from '@/classes/pilot/Pilot'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { ImportData } from '@/io/Data';
import { PilotStore, PilotGroupStore } from '@/stores';
import { logger } from '@sentry/vue';
import { notify } from '@/util/notify';

const emit = defineEmits<{ 'toggle-import': [val: boolean]; done: [] }>()

const fileValue = ref<any>(null)
const stagedData = ref<any>(null)
const stagedPilots = ref<PilotData[]>([])
const importPilots = ref(true)
const alreadyPresent = ref('')

function reset() {
  fileValue.value = null
  stagedData.value = null
  stagedPilots.value = []
  importPilots.value = true
  alreadyPresent.value = ''
  emit('toggle-import', false)
}

async function stageImport(file) {
  if (!file) return
  emit('toggle-import', true)
  let data
  let pilotData
  try {
    let importedData = await ImportData<any>(file.target.files[0])
    importedData = JSON.parse(importedData)
    data = importedData.groupData
    pilotData = importedData.pilotData
  } catch (error) {
    notify({
      title: 'Import Error',
      text: `Unable to read file: ${error}`,
      data: { icon: 'mdi-account-multiple', color: 'error' },
    })
    logger.error('File Import Error', { error, fileName: file.target.files[0].name })
    reset()
    return
  }

  const exists = PilotGroupStore().PilotGroups.find(
    (x) => x.Name === data.name
  )

  if (exists && !exists.SaveController.IsDeleted) {
    alreadyPresent.value =
      'A pilot group with this name already exists in the roster. Importing will create a unique copy of this group.'
    const num = PilotGroupStore().PilotGroups.filter(
      (x) => x.Name === data.name
    ).length
    data.name += ` (${num})`
  }

  stagedData.value = data
  stagedPilots.value = pilotData || []
}

function importFile() {
  let newID = ''
  try {
    const importGroup = PilotGroup.Deserialize(stagedData.value)
    newID = importGroup.RenewID()
    importGroup.Pilots = []
    PilotGroupStore().AddGroup(importGroup)
    notify({
      title: 'Import Successful',
      text: `${importGroup.Name} successfully added.`,
      data: { icon: 'mdi-account-multiple' },
    })
  } catch (error) {
    notify({
      title: 'Import Error',
      text: `Unable to import pilot group: ${error}`,
      data: { icon: 'mdi-account-multiple', color: 'error' },
    })
  }

  stagedPilots.value.forEach((stagedPilot) => {
    try {
      if (PilotStore().Pilots.some((x) => x.ID === (stagedPilot as any).id)) return
      const importPilot = Pilot.Deserialize(stagedPilot as PilotData)
      importPilot.RenewID()
      if (PilotStore().Pilots.some((x) => x.Name === importPilot.Name)) {
        const num = PilotStore().Pilots.filter((x) => x.Name === importPilot.Name).length
        importPilot.Name += ` (${num})`
      }
      PilotStore().AddPilot(importPilot, newID)
      reset()
      notify({
        title: 'Import Successful',
        text: `${importPilot.Name} // ${importPilot.Callsign} successfully added to roster.`,
        data: { icon: 'cc:pilot' },
      })
    } catch (error) {
      notify({
        title: 'Import Error',
        text: `Unable to import Pilot: ${error}`,
        data: { icon: 'cc:pilot', color: 'error' },
      })
    }
  })

  reset()
  emit('done')
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
