<template>
  <div ref="rootEl"
    :class="embedded ? 'cc-fill' : 'cc-fill cc-fill-root'"
    :style="embedded ? `height: ${embedHeight}` : ''">
    <div class="cc-fill"
      style="overflow: hidden">
      <v-layout style="height: 100%; flex: 1 1 auto; min-height: 0">
        <cc-panel-toggle v-model="showNav"
          side="left"
          :open-offset="mobile ? 322 : 349"
          :closed-offset="0" />

        <v-navigation-drawer v-model="showNav"
          :width="mobile ? 320 : 350">
          <div class="pa-3">
            <v-select v-if="!embedded"
              v-model="pilotIds"
              :items="pilotItems"
              :label="$t('pm.logbook.pilot')"
              density="compact"
              variant="outlined"
              class="mb-2"
              multiple
              clearable
              chips
              closable-chips
              hide-details />
            <v-select v-model="campaign"
              :items="campaignItems"
              :label="$t('pm.logbook.campaign')"
              density="compact"
              variant="outlined"
              hide-details />

            <v-divider v-if="!embedded"
              class="my-3" />

            <div class="text-cc-overline mb-2">{{ $t('active.charts.dataSet') }}</div>
            <v-select v-model="encounterIds"
              :items="encounterItems"
              :label="$t('active.charts.selectEncounter')"
              density="compact"
              variant="outlined"
              multiple
              clearable
              chips
              closable-chips
              hide-details />
            <div v-if="!focusStream"
              class="text-caption text-disabled mt-1">
              {{ $t('active.charts.noStream') }}
            </div>

            <cc-dialog :close-on-click="false"
              icon="mdi-database-cog"
              :title="$t('pm.logbook.manageData')">
              <template #activator="{ open }">
                <v-btn block
                  size="small"
                  variant="tonal"
                  color="primary"
                  class="mt-2"
                  prepend-icon="mdi-database-cog"
                  @click="open()">
                  {{ $t('pm.logbook.manageData') }}
                </v-btn>
              </template>
              <template #default="{ close }">
                <div v-if="importTarget">
                  <div class="text-cc-overline mt-2">{{ $t('pm.logbook.importTitle') }}</div>
                  <v-divider class="mb-2" />
                  <logbook-import :logbook="importTarget as PilotLogbook"
                    :pilot-id="importTarget.PilotID"
                    @imported="bump++" />
                </div>

                <div class="text-cc-overline mt-4">{{ $t('pm.logbook.deleteTitle') }}</div>
                <v-divider class="mb-2" />
                <div v-if="!deletable.length"
                  class="text-disabled text-center pa-4">
                  {{ $t('pm.logbook.empty') }}
                </div>
                <v-checkbox v-for="d in deletable"
                  :key="d.key"
                  v-model="deleteKeys"
                  :value="d.key"
                  :label="d.title"
                  density="compact"
                  hide-details />
                <div v-if="deletable.length"
                  class="text-right mt-2">
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ props: menu }">
                      <v-btn color="error"
                        variant="tonal"
                        :disabled="!deleteKeys.length"
                        v-bind="menu">
                        {{ $t('pm.logbook.deleteSelected', { count: deleteKeys.length }) }}
                      </v-btn>
                    </template>
                    <cc-confirmation cancellable
                      :content="$t('pm.logbook.deleteConfirm', { count: deleteKeys.length })"
                      @confirm="deleteSelected(close)" />
                  </v-menu>
                </div>
              </template>
            </cc-dialog>
          </div>

          <template v-if="!embedded"
            #append>
            <v-divider />
            <div class="pa-2">
              <v-btn block
                tile
                flat
                size="small"
                color="primary"
                prepend-icon="mdi-arrow-left"
                to="/active-mode">
                {{ $t('common.back') }}
              </v-btn>
            </div>
          </template>
        </v-navigation-drawer>

        <v-main style="overflow-y: auto">
          <v-container fluid>
            <div class="heading h2 mb-3">
              {{ heading }}
              <span class="text-disabled">
                <cc-slashes />
                {{ scopeHeading }}
              </span>
            </div>

            <div v-if="!records.length"
              class="text-center text-disabled text-cc-overline pa-8">
              {{ $t('pm.logbook.empty') }}
            </div>

            <div v-else>
              <v-row dense
                class="mb-1">
                <v-col v-for="stat in headline"
                  :key="stat.label"
                  cols="6"
                  md="3">
                  <cc-panel color="background">
                    <div class="text-center py-1">
                      <div class="heading h1">{{ stat.value }}</div>
                      <div class="text-caption text-disabled">{{ stat.label }}</div>
                    </div>
                  </cc-panel>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col v-for="spec in charts"
                  :key="spec.id"
                  class="chart-col"
                  cols="12"
                  :md="expanded.has(spec.id) ? 12 : 6"
                  :xl="expanded.has(spec.id) ? 12 : 4">
                  <cc-chart :title="spec.title"
                    :subtitle="spec.subtitle"
                    :type="spec.type"
                    :data="spec.data"
                    :options="spec.options"
                    :table="spec.table"
                    :height="expanded.has(spec.id) ? (spec.height ?? 260) * 1.5 : (spec.height ?? 260)
                      "
                    expandable
                    :expanded="expanded.has(spec.id)"
                    @toggle-expand="toggleExpand(spec.id)" />
                </v-col>
              </v-row>

              <rollup-display :rollup="rollup" />

              <cc-panel color="background"
                class="mt-2"
                :title="$t('pm.logbook.encounterHistory')">
                <v-data-table :items="rows"
                  :headers="tableHeaders"
                  density="compact"
                  items-per-page="25"
                  class="bg-background">
                  <template #[`item.actions`]="{ item }">
                    <v-btn icon="mdi-download"
                      size="x-small"
                      flat
                      tile
                      :disabled="!item.hasStream"
                      :title="$t('pm.logbook.exportStream')"
                      @click="exportStream(item.pilotId, item.encounterId)" />
                  </template>
                </v-data-table>
                <div class="text-caption text-disabled mt-1">
                  {{ $t('pm.logbook.retentionNote', { n: STREAM_RETENTION }) }}
                </div>
              </cc-panel>
            </div>
          </v-container>
        </v-main>
      </v-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { PilotStore } from '@/features/pilot_management/store'
import { STREAM_RETENTION } from '@/classes/pilot/PilotLogbook'
import type { PilotLogbook } from '@/classes/pilot/PilotLogbook'
import { mergeRollups, blankRollup } from '@/classes/components/combat/log/telemetry'
import RollupDisplay from '@/features/active_mode/runner/gm/EncounterPanels/_components/_RollupDisplay.vue'
import LogbookImport from './LogbookImport.vue'
import CcChart from '@/features/active_mode/_components/charts/CcChart.vue'
import CcPanelToggle from '@/ui/components/buttons/CCPanelToggle.vue'
import { useChartTheme } from '@/features/active_mode/_components/charts/chartBase'
import { pilotCharts } from '@/features/active_mode/_components/charts/pilotCharts'

const props = defineProps<{ presetPilot?: string; embedded?: boolean }>()

const { t } = useI18n()
const { smAndDown: mobile } = useDisplay()

const rootEl = ref<HTMLElement>()
const embedHeight = ref('100%')

onMounted(() => {
  if (!props.embedded || !rootEl.value) return
  let top = 0
  let node: HTMLElement | null = rootEl.value
  while (node?.offsetParent) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement
  }
  embedHeight.value = `calc(100dvh - ${Math.round(top)}px)`
})

const showNav = ref(true)
const bump = ref(0)
const pilotIds = ref<string[]>(props.presetPilot ? [props.presetPilot] : [])
const encounterIds = ref<string[]>([])
const campaign = ref('')

const pilotItems = computed(() =>
  PilotStore().PilotLogbooks.map(l => ({
    value: l.PilotID,
    title: callsign(l.PilotID),
  }))
)

const logbooks = computed(() => {
  void bump.value
  const all = PilotStore().PilotLogbooks
  if (props.embedded) return all.filter(l => l.PilotID === props.presetPilot)
  if (!pilotIds.value.length) return all
  return all.filter(l => pilotIds.value.includes(l.PilotID))
})

const importTarget = computed(() => (logbooks.value.length === 1 ? logbooks.value[0] : undefined))

function callsign(pilotId: string): string {
  return PilotStore().getPilotByID(pilotId)?.Callsign ?? pilotId
}

const scopeHeading = computed(() => {
  if (!encounterIds.value.length) return t('pm.logbook.acrossAll')
  if (encounterIds.value.length === 1) {
    const one = encounterItems.value.find(i => i.value === encounterIds.value[0])
    if (one) return one.title
  }
  return t('pm.logbook.acrossN', { n: encounterIds.value.length })
})

const heading = computed(() => {
  if (!logbooks.value.length) return t('pm.logbook.allPilots')
  if (logbooks.value.length === 1) return callsign(logbooks.value[0].PilotID)
  if (!pilotIds.value.length) return t('pm.logbook.allPilots')
  return t('pm.logbook.nPilots', { n: logbooks.value.length })
})

const campaignItems = computed(() => [
  { value: '', title: t('pm.logbook.allCampaigns') },
  ...[
    ...new Set(logbooks.value.flatMap(l => l.Records.map(r => r.campaignId)).filter(Boolean)),
  ].map(c => ({ value: c as string, title: c as string })),
])

const entries = computed(() =>
  logbooks.value.flatMap(l =>
    l.Records.filter(r => !campaign.value || r.campaignId === campaign.value).map(r => ({
      logbook: l,
      record: r,
    }))
  )
)

const scoped = computed(() =>
  entries.value.filter(
    e => !encounterIds.value.length || encounterIds.value.includes(e.record.encounterId)
  )
)

const records = computed(() => scoped.value.map(e => e.record))

const encounterItems = computed(() => {
  const seen = new Map<string, { title: string; start: number }>()
  for (const { record: r } of entries.value) {
    if (seen.has(r.encounterId)) continue
    seen.set(r.encounterId, {
      title: `${r.encounterName || t('pm.logbook.unnamed')} (${new Date(r.start).toLocaleDateString()})`,
      start: r.start,
    })
  }
  return [...seen.entries()]
    .sort((a, b) => b[1].start - a[1].start)
    .map(([value, { title }]) => ({ value, title }))
})

const rollup = computed(() =>
  records.value.length ? mergeRollups(records.value.map(r => r.rollup)) : blankRollup()
)

const headline = computed(() => {
  const lost = records.value.filter(r => r.rollup.destroyed).length
  return [
    { label: t('common.encounters'), value: records.value.length },
    {
      label: t('pm.logbook.survived'),
      value: `${records.value.length - lost}/${records.value.length}`,
    },
    { label: t('pm.logbook.totalDealt'), value: rollup.value.totalDealt },
    {
      label: t('pm.logbook.totalKills'),
      value: rollup.value.killsConfirmed + rollup.value.killsSelfReported,
    },
  ]
})

const tableHeaders = computed(() => [
  ...(logbooks.value.length > 1 ? [{ title: t('pm.logbook.pilot'), key: 'pilot' }] : []),
  { title: t('pm.logbook.colEncounter'), key: 'name' },
  { title: t('pm.logbook.colDate'), key: 'date' },
  { title: t('pm.logbook.colRounds'), key: 'rounds' },
  { title: t('pm.logbook.colDealt'), key: 'dealt' },
  { title: t('pm.logbook.colTaken'), key: 'taken' },
  { title: t('pm.logbook.colKills'), key: 'kills' },
  { title: t('common.result'), key: 'result' },
  { title: '', key: 'actions', sortable: false },
])

const rows = computed(() =>
  [...scoped.value]
    .sort((a, b) => b.record.start - a.record.start)
    .map(({ logbook, record: r }) => ({
      encounterId: r.encounterId,
      pilotId: logbook.PilotID,
      pilot: callsign(logbook.PilotID),
      name: r.encounterName || t('pm.logbook.unnamed'),
      date: new Date(r.start).toLocaleDateString(),
      rounds: r.rounds,
      dealt: r.rollup.totalDealt,
      taken: r.rollup.totalTaken,
      kills: r.rollup.killsConfirmed + r.rollup.killsSelfReported,
      result: r.rollup.destroyed ? t('pm.logbook.destroyed') : r.result || '-',
      hasStream: !!logbook.StreamFor(r.encounterId),
    }))
)

watch(encounterItems, items => {
  const available = items.map(i => i.value)
  const kept = encounterIds.value.filter(id => available.includes(id))
  if (kept.length !== encounterIds.value.length) encounterIds.value = kept
})

const chartTheme = useChartTheme()

const focusEntry = computed(() =>
  [...scoped.value]
    .sort((a, b) => b.record.start - a.record.start)
    .find(e => !!e.logbook.StreamFor(e.record.encounterId))
)

const focusStream = computed(() =>
  focusEntry.value
    ? focusEntry.value.logbook.StreamFor(focusEntry.value.record.encounterId)
    : undefined
)

const charts = computed(() =>
  pilotCharts(
    chartTheme.value,
    t,
    rollup.value,
    records.value,
    focusStream.value,
    focusEntry.value?.logbook.PilotID
  )
)

const expanded = ref(new Set<string>())

function toggleExpand(id: string) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

const deleteKeys = ref<string[]>([])

const deletable = computed(() =>
  logbooks.value
    .flatMap(l =>
      l.Records.map(r => ({
        key: `${l.PilotID}:${r.encounterId}`,
        start: r.start,
        title:
          (logbooks.value.length > 1 ? `${callsign(l.PilotID)} - ` : '') +
          `${r.encounterName || t('pm.logbook.unnamed')} (${new Date(r.start).toLocaleDateString()})`,
      }))
    )
    .sort((a, b) => b.start - a.start)
)

async function deleteSelected(close: () => void) {
  for (const logbook of logbooks.value) {
    const prefix = `${logbook.PilotID}:`
    const ids = deleteKeys.value
      .filter(k => k.startsWith(prefix))
      .map(k => k.slice(prefix.length))
    if (!ids.length) continue
    ids.forEach(id => logbook.Remove(id))
    await PilotStore().SaveLogbook(logbook as PilotLogbook)
  }
  deleteKeys.value = []
  close()
}

function exportStream(pilotId: string, encounterId: string) {
  const stream = logbooks.value.find(l => l.PilotID === pilotId)?.StreamFor(encounterId)
  if (!stream) return
  const blob = new Blob([JSON.stringify(stream, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${stream.encounterName || 'encounter'}_log.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.chart-col {
  transition:
    flex-basis 0.3s ease,
    max-width 0.3s ease;
}
</style>
