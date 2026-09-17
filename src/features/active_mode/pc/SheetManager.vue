<template>
  <v-container>
    <div class="heading h2">{{ $t('active.titles.characterSheets') }}</div>
    <active-mode-sort-bar
      :sort="sort"
      :asc="asc"
      :items="activeSheets"
      :archived-items="archived"
      :columns="sheetOrganizerColumns"
      noun="sheet"
      :title="$t('active.titles.characterSheets')"
      @update:sort="sort = $event"
      @update:asc="asc = $event"
      @archive="organizeArchive"
      @restore="organizeRestore"
      @delete="organizeDelete"
    />

    <sheet-item
      v-for="sheet in activeSheets"
      :key="sheet.ID"
      :sheet="<PilotSheet>sheet"
      @launch="launch(sheet)"
      @archive="sheet.Archive()"
      @export="exportSheet(sheet)"
      @delete="sheet.SaveController.Delete()"
    />

    <v-divider class="my-5" />
    <v-row dense>
      <v-col>
        <cc-button
          prepend-icon="mdi-plus"
          block
          color="primary"
          to="/active-mode/new-sheet"
          class="mb-2"
        >
          {{ $t('active.sheet.newCharacterSheet') }}
        </cc-button>
      </v-col>
      <v-col
        cols="12"
        md="auto"
      >
        <cc-button
          prepend-icon="mdi-file-import"
          block
          :size="mobile ? 'x-small' : ''"
          color="primary"
          class="mb-2"
          @click="importSelect()"
        >
          {{ $t('common.import') }}
        </cc-button>
      </v-col>
    </v-row>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          {{ $t('active.sheetMgr.archivedSheets', { n: archived.length }) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div
            class="mb-4"
            style="max-width: 400px"
          >
            <cc-text-field
              v-model="search"
              icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-4"
            />
          </div>
          <div
            v-if="archived.length === 0"
            class="text-center text-cc-overline text-disabled"
          >
            <i>
              {{
                search
                  ? $t('active.sheetMgr.noArchivedFoundFiltered', { search })
                  : $t('active.sheetMgr.noArchivedFound')
              }}.
            </i>
          </div>
          <v-row
            v-for="e in archived"
            :key="e.ID"
            class="text-cc-overline bg-background my-1"
            align="center"
          >
            <v-col
              cols="auto"
              style="height: 100%"
            >
              {{ e.Name }}
              <br />
              <v-card
                v-if="e.Combatant.actor.CombatController.IsDead"
                class="px-1 bg-error text-center"
              >
                {{ $t('active.sheetMgr.kia') }}
              </v-card>
              <v-card
                v-else
                class="px-1 bg-success text-center"
              >
                {{ $t('ui.widget.active') }}
              </v-card>
            </v-col>
            <v-col cols="auto">
              <div>
                <span class="text-disabled mr-1">{{ $t('common.created') }}</span>
                <b>{{ new Date(e.Created).toLocaleDateString() }}</b>
              </div>
              <div>
                <span class="text-disabled mr-1">{{ $t('active.labels.archived') }}</span>
                <b>{{ new Date(e.Updated).toLocaleDateString() }}</b>
              </div>
            </v-col>
            <v-col cols="auto">
              <combat-statblock-export
                :actor="e.Pilot"
                :encounter-instance="e.EncounterInstance"
              >
                <template #activator="{ open }">
                  <cc-button
                    size="small"
                    color="primary"
                    block
                    :disabled="!canViewSheet(e)"
                    :tooltip="
                      canViewSheet(e)
                        ? $t('active.sheetMgr.viewSheetTooltip')
                        : $t('active.sheetMgr.viewSheetUnavailable')
                    "
                    @click="open()"
                  >
                    {{ $t('active.sheetMgr.viewSheet') }}
                  </cc-button>
                </template>
              </combat-statblock-export>
            </v-col>
            <v-col class="text-center">
              <cc-dialog
                :close-on-click="false"
                :title="`${e.Name} - LOGS AND TELEMETRY`"
              >
                <template #activator="{ open }">
                  <cc-button
                    size="small"
                    color="primary"
                    block
                    :tooltip="$t('active.tooltips.reviewTheCombatLogAnd')"
                    @click="open()"
                  >
                    {{ $t('active.sheetMgr.savePilotHistory') }}
                  </cc-button>
                </template>
                <v-card
                  flat
                  tile
                >
                  <v-card-text>
                    <div
                      v-if="!sheetEvents(e).length"
                      class="text-center text-cc-overline text-disabled pa-8"
                    >
                      <i>{{ $t('active.sheetMgr.noEvents') }}</i>
                    </div>
                    <div
                      v-else
                      class="d-block text-left bg-background pa-2"
                    >
                      <v-row dense>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <div class="heading h3 text-accent">
                            {{ $t('active.encMgr.battlefieldTelemetry') }}
                          </div>
                          <v-divider class="my-2" />
                          <div style="height: 50vh; overflow-y: auto">
                            <code style="white-space: pre-wrap; word-break: break-word">
                              {{ formatTelemetry(e) }}
                            </code>
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <div class="heading h3 text-accent">
                            {{ $t('active.encMgr.combatLogs') }}
                          </div>
                          <v-divider class="my-2" />

                          <div style="height: 50vh; overflow-y: auto">
                            <div
                              v-for="(log, logIndex) in sheetEntries(e)"
                              :key="`log-entry-${logIndex}`"
                              class="mb-2"
                            >
                              <code>
                                {{ formatLogEntry(log) }}
                              </code>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <cc-button
                      color="primary"
                      :disabled="!sheetEvents(e).length"
                      :tooltip="$t('active.sheetMgr.saveToLogbookTooltip')"
                      @click="saveHistory(e)"
                    >
                      {{ $t('active.sheetMgr.saveToLogbook') }}
                    </cc-button>
                    <cc-button
                      color="primary"
                      :disabled="!sheetEvents(e).length"
                      @click="exportHistory(e)"
                    >
                      {{ $t('active.common.exportAsJson') }}
                    </cc-button>
                  </v-card-actions>
                </v-card>
              </cc-dialog>
            </v-col>

            <v-col
              cols="auto"
              class="ml-auto"
            >
              <v-menu max-width="350">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    flat
                    tile
                    v-bind="props"
                    variant="text"
                  >
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <b>{{ $t('active.encMgr.deleteArchivePrompt') }}</b>
                    <br />
                    <p class="text-caption text--text mb-2">
                      {{ $t('active.encMgr.deleteArchiveDetail') }}
                    </p>
                    <cc-button
                      size="small"
                      block
                      color="primary"
                      @click="e.SaveController.Delete()"
                    >
                      {{ $t('common.delete') }}
                    </cc-button>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { PilotSheetStore, PilotStore } from '@/stores'
  import SheetItem from './_components/SheetItem.vue'
  import PilotSheet from '@/features/pilot_management/store/PilotSheet'
  import { useDisplay } from 'vuetify'
  import ActiveModeSortBar from '@/features/active_mode/_components/ActiveModeSortBar.vue'
  import CombatStatblockExport from '@/features/active_mode/runner/gm/EncounterPanels/_components/CombatStatblockExport.vue'
  import { reduceEvents, formatRollup } from '@/classes/components/combat/log/telemetry'
  import { renderStream } from '@/classes/components/combat/log/render'
  import type { ILogEntry } from '@/classes/components/combat/log/render'
  import type { ILogStream } from '@/classes/components/combat/log/events'
  import logger from '@/user/logger.js'
  import { notify } from '@/util/notify.js'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const router = useRouter()
  const sheetOrganizerColumns = [
    { key: 'Name', title: 'Name', sortable: true, value: (s: PilotSheet) => s.Name },
    { key: 'Pilot', title: t('active.titles.pilot'), value: (s: PilotSheet) => s.Pilot.Callsign },
    {
      key: 'Created',
      title: 'Created',
      sortable: true,
      value: (s: PilotSheet) => new Date(s.Created).toLocaleDateString(),
    },
    {
      key: 'Updated',
      title: 'Updated',
      sortable: true,
      value: (s: PilotSheet) => new Date(s.Updated).toLocaleDateString(),
    },
  ]

  const { smAndDown: mobile } = useDisplay()

  const sort = ref('Updated')
  const asc = ref(true)
  const search = ref('')

  const activeSheets = computed(() => {
    let sheets = PilotSheetStore().PilotSheets.filter(
      x => !x.Archived && !x.SaveController.IsDeleted
    )

    switch (sort.value) {
      case 'Name':
        if (asc.value) sheets = sheets.sort((a, b) => a.Name.localeCompare(b.Name))
        else sheets = sheets.sort((a, b) => b.Name.localeCompare(a.Name))
        break
      case 'Created':
        if (asc.value) sheets = sheets.sort((a, b) => a.Created - b.Created)
        else sheets = sheets.sort((a, b) => b.Created - a.Created)
        break
      case 'Updated':
        if (asc.value) sheets = sheets.sort((a, b) => a.Updated - b.Updated)
        else sheets = sheets.sort((a, b) => b.Updated - a.Updated)
        break
    }
    return sheets
  })
  const archived = computed<PilotSheet[]>(() => {
    let archives = PilotSheetStore().PilotSheets.filter(
      x => x.Archived && !x.SaveController.IsDeleted
    ) as unknown as PilotSheet[]

    if (search.value) {
      const searchLower = search.value.toLowerCase()
      archives = archives.filter(x => x.Name.toLowerCase().includes(searchLower))
    }

    return archives.sort((a, b) => b.Updated - a.Updated)
  })

  function launch(sheet) {
    PilotSheetStore().SetActiveSheet(sheet.ID)
    router.push(`pilot-runner/${sheet.ID}`)
  }
  function exportSheet(sheet) {
    const out = JSON.stringify(PilotSheet.Serialize(sheet), null, 2)

    const blob = new Blob([out], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sheet.Name}_sheet.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  function canViewSheet(sheet: PilotSheet): boolean {
    return !!sheet.Pilot.ActiveMech || !sheet.Pilot.CombatController.Mounted
  }

  const streamCache = new Map<string, ILogStream>()

  function streamFor(sheet: PilotSheet): ILogStream {
    const key = `${sheet.ID}:${sheet.Updated}`
    const cached = streamCache.get(key)
    if (cached) return cached
    const stream = sheet.Stream
    streamCache.set(key, stream)
    return stream
  }

  function sheetEvents(sheet: PilotSheet) {
    return streamFor(sheet).events
  }

  function sheetEntries(sheet: PilotSheet) {
    const stream = streamFor(sheet)
    return renderStream(stream.events, stream, t)
  }

  function formatTelemetry(sheet: PilotSheet) {
    return formatRollup(reduceEvents(streamFor(sheet).events, sheet.PilotID), t, 40)
  }

  function formatLogEntry(entry: ILogEntry) {
    return `${t('active.telemetry.rollup.logEntryHeader', {
      n: entry.round,
      time: new Date(entry.ts).toLocaleTimeString(),
    })}\n${entry.text}`
  }

  async function saveHistory(sheet: PilotSheet) {
    try {
      await PilotStore().RecordStream(streamFor(sheet), sheet.PilotID, sheet.PilotID)
      notify({
        type: 'success',
        title: t('active.common.saveSuccessful'),
        text: t('active.sheetMgr.historySaved', { name: sheet.Name }),
      })
    } catch (error) {
      logger.error('Failed to record sheet log to pilot logbook', sheet, error)
      notify({
        type: 'error',
        title: t('active.common.saveFailed'),
        text: t('active.sheetMgr.historySaveFailed'),
      })
    }
  }

  function exportHistory(sheet: PilotSheet) {
    const out = JSON.stringify(streamFor(sheet), null, 2)

    const blob = new Blob([out], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sheet.Name}_encounter_${new Date(sheet.Updated).toLocaleDateString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function organizeArchive(ids: string[]) {
    const targets = activeSheets.value.filter(s => ids.includes(s.ID))
    targets.forEach(s => s.Archive())
  }
  async function organizeDelete(ids: string[]) {
    const targets = activeSheets.value.filter(s => ids.includes(s.ID))
    for (const s of targets) await PilotSheetStore().RemovePilotSheet(s as PilotSheet)
  }
  function organizeRestore(ids: string[]) {
    const targets = archived.value.filter(s => ids.includes(s.ID))
    targets.forEach(s => s.Unarchive())
  }
  function importSelect() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = event => {
        try {
          const json = JSON.parse(event.target?.result as string)
          const sheet = PilotSheet.Deserialize(json)
          PilotSheetStore().PilotSheets.push(sheet)
          PilotSheetStore().SetActiveSheet(sheet.ID)
          router.push(`pilot-runner/${sheet.ID}`)
        } catch (error) {
          logger.error('Failed to import sheet:', error)
          notify({ type: 'error', text: t('active.tooltips.failedToImportSheetPleaseEnsure') })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }
</script>
