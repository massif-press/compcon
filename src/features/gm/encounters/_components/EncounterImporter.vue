<template>
  <v-card-text>
    <v-row align="center"
      justify="center">
      <v-col cols="6">
        <v-file-input v-model="fileValue"
          accept="text/json"
          variant="outlined"
          :label="$t('gm.fields.selectEncounterFile')"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>

    <v-alert v-if="notEncounterFile"
      type="error"
      variant="tonal"
      class="mx-4 mb-3">
      {{ $t('gm.encImport.notEncounterFile') }}
    </v-alert>

    <v-container v-if="stagedItems.length">
      <div class="text-caption">{{ $t('gm.encImport.stagedEncounters') }}</div>
      <v-table>
        <thead class="heading">
          <tr>
            <th width="1px">
              <v-btn icon
                flat
                size="small"
                @click="
                  selected.length
                    ? (selected = [])
                    : (selected = stagedItems.map((x: any) => x.id))
                  ">
                <v-icon size="x-large"
                  :icon="selected.length === stagedItems.length
                    ? 'mdi-checkbox-outline'
                    : selected.length > 0
                      ? 'mdi-minus-box-outline'
                      : 'mdi-checkbox-blank-outline'
                    " />
              </v-btn>
            </th>
            <th>{{ $t('common.name') }}</th>
            <th>{{ $t('common.sitrep') }}</th>
            <th class="text-center">{{ $t('gm.combatant.combatants') }}</th>
            <th class="text-center">{{ $t('common.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stagedItems"
            :key="item.id">
            <td>
              <v-checkbox v-model="selected"
                :value="item.id"
                multiple
                hide-details />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.sitrepName }}</td>
            <td class="text-center">{{ item.combatantCount }}</td>
            <td class="text-center">
              <v-tooltip location="top"
                max-width="300px">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    :icon="item.status === 'ok' ? 'mdi-check' : 'mdi-alert'"
                    :color="item.status === 'ok' ? 'success' : 'warning'" />
                </template>
                <span v-if="item.status === 'ok'">{{ $t('gm.encImport.readyForImport') }}</span>
                <span v-else-if="item.status === 'missing_content'">{{ $t('gm.encImport.missingNpcs') }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <cc-alert v-if="missingContent.length"
        class="mx-12 mt-4"
        icon="mdi-alert"
        :title="$t('gm.titles.missingNpcs')">
        <p>{{ $t('gm.encImport.someMissingNpcs') }}</p>
        <v-card-text>
          <p class="heading h4 text-accent">{{ $t('gm.titles.missingNpcs') }}:</p>
          <p v-html-safe="missingContent"
            class="effect-text text-center bg-background pa-1 ma-1" />
        </v-card-text>
      </cc-alert>

      <v-row justify="end"
        class="mt-2 mr-4">
        <v-col cols="auto">
          <v-btn variant="tonal"
            color="accent"
            prepend-icon="mdi-plus"
            :disabled="!selected.length"
            @click="importFile">
            {{ $t('gm.encImport.importCount', { n: selected.length, plural: selected.length !== 1 ? 's' : '' }) }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import logger from '@/user/logger'
import { ImportData } from '@/io/Data'
import { EncounterStore } from '@/stores'
import { Encounter } from '@/classes/encounter/Encounter'
import { isV2Encounter, getV2EncounterMissingNpcs, preprocessEncounterImport } from '@/io/V2Importer'
import { ImportEncounter } from '@/io/Importer'
import { notify } from '@/util/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emit = defineEmits<{ complete: [] }>()

const selected = ref<string[]>([])
const fileValue = ref<any>(null)
const stagedData = ref<any[]>([])
const stagedItems = ref<any[]>([])
const notEncounterFile = ref(false)

const missingContent = computed(() => {
  const missing = new Set<string>()
  stagedItems.value.forEach((item) => {
    if (item.status === 'missing_content') {
      (item.missingInfo as string[]).forEach((m) => missing.add(m))
    }
  })
  return Array.from(missing).join('<br>')
})

function reset() {
  fileValue.value = null
  stagedData.value = []
  stagedItems.value = []
  selected.value = []
  notEncounterFile.value = false
}

async function stageImport(file: any) {
  if (!file) return
  notEncounterFile.value = false
  const data = await ImportData<any>(file.target.files[0])
  if (isV2Encounter(data)) {
    const encounters = Array.isArray(data) ? data : [data]
    stagedData.value = encounters
    stagedItems.value = encounters.map((enc: any) => {
      const missingNpcs = getV2EncounterMissingNpcs(enc)
      return {
        id: enc.id,
        name: (enc.name || 'Unnamed Encounter') + ' (v2)',
        sitrepName: enc.sitrep.name || '—',
        combatantCount: (enc.npcs?.length || 0) + (enc.reinforcements?.length || 0),
        status: missingNpcs.length === 0 ? 'ok' : 'missing_content',
        missingInfo: missingNpcs.map((id: string) => `NPC: ${id}`),
      }
    })
  } else {
    let content: any[]
    if (data.type && data.type.includes('collection')) {
      content = data.data
    } else {
      content = [data]
    }
    const encounters = content.filter((x: any) => x.itemType?.toLowerCase() === 'encounter')
    stagedData.value = encounters
    stagedItems.value = encounters.map((item: any) => ({
      id: item.id,
      name: item.name || 'Unnamed Encounter',
      sitrepName: item.sitrep?.name || '—',
      combatantCount: item.combatants?.length ?? 0,
      status: 'ok',
      missingInfo: [],
    }))
  }
  if (!stagedItems.value.length) {
    notEncounterFile.value = true
    return
  }
  selected.value = stagedItems.value.map((x: any) => x.id)
}

async function importFile() {
  const staged = stagedData.value.filter((x: any) => selected.value.includes(x.id))
  let backedUp = 0
  for (const item of staged) {
    try {
      if (isV2Encounter(item)) {
        const result = await preprocessEncounterImport(item)
        if (result.action === 'import' && result.transformed) {
          const encs = Array.isArray(result.transformed) ? result.transformed : [result.transformed]
          for (const enc of encs) await ImportEncounter(enc)
        } else if (result.action === 'backup') {
          backedUp++
        }
      } else {
        item.id = crypto.randomUUID()
        EncounterStore().AddEncounter(Encounter.Deserialize(item))
      }
    } catch (error) {
      logger.error('Failed to import encounter', null, error)
      notify({ title: t('gm.import.importErrorTitle'), text: t('gm.import.encounterImportErrorText', { error: String(error) }), data: { icon: 'cc:compendium', color: 'error' } })
    }
  }
  if (backedUp > 0) {
    notify({ title: t('gm.import.v2BackupTitle'), text: t('gm.import.v2BackupText', { count: backedUp }, backedUp), data: { icon: 'mdi-information-box-outline', color: 'info' } })
  }
  reset()
  emit('complete')
}
</script>
