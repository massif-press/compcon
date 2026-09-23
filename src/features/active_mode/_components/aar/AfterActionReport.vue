<template>
  <div>
    <cc-panel color="background"
      class="mb-3">
      <v-row dense
        align="center">
        <v-col cols="12"
          md="auto">
          <div class="heading h2">{{ stream.encounterName }}</div>
          <div v-if="shownResult"
            class="text-cc-overline text-disabled text-accent">
            {{ resultLabel(shownResult) }}
          </div>
        </v-col>
        <v-spacer />
        <v-col v-for="stat in headline"
          :key="stat.label"
          cols="4"
          md="auto"
          class="text-center px-3">
          <div class="heading h3">{{ stat.value }}</div>
          <div class="text-caption text-disabled">{{ stat.label }}</div>
        </v-col>
      </v-row>
      <div v-if="sitrepText"
        class="text-caption text-disabled mt-1">
        {{ $t('common.sitrep') }}: {{ sitrepText }}
      </div>
    </cc-panel>

    <div class="text-cc-overline text-disabled"><cc-slashes /> {{ $t('gm.combatant.combatants') }}
    </div>
    <v-expansion-panels variant="accordion"
      class="mb-4">
      <v-expansion-panel v-for="row in summaries"
        :key="row.ref.id">
        <v-expansion-panel-title>
          <v-row dense
            align="center"
            no-gutters>
            <v-col cols="12"
              sm="4">
              <span class="heading h4">{{ row.ref.name }}</span>
              <span v-if="row.ref.side"
                class="text-caption text-disabled ml-2">
                {{ $t(`active.log.side.${row.ref.side}`) }}
              </span>
            </v-col>
            <v-col cols="12"
              sm="3"
              class="text-caption"
              :class="statusColor(row)">
              {{ statusText(row) }}
            </v-col>
            <v-col cols="12"
              sm="5"
              class="text-caption text-disabled">
              {{ rowSummaryText(row.rollup, t) }}
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <rollup-display :rollup="row.rollup" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <template v-if="notable.length">
      <div class="text-cc-overline text-disabled"><cc-slashes /> {{ $t('active.aar.highlightsTitle')
        }}</div>
      <cc-panel color="background"
        class="mb-4">
        <v-row dense>
          <v-col v-for="h in notable"
            :key="h.key"
            cols="12"
            sm="6"
            md="4">
            <div class="text-caption text-disabled">{{ $t(`active.aar.highlights.${h.key}`) }}</div>
            <div>
              <span class="heading h4">{{ h.name }}</span>
              <span class="text-accent ml-2">{{ highlightValue(h, t) }}</span>
            </div>
          </v-col>
        </v-row>
      </cc-panel>
    </template>

    <template v-if="lost.length">
      <div class="text-cc-overline text-disabled"><cc-slashes /> {{ $t('active.aar.casualtiesTitle')
        }}</div>
      <cc-panel color="background"
        class="mb-4">
        <div v-for="e in lost"
          :key="e.id"
          class="text-body-2">
          <span class="text-disabled mr-2">{{ $t('active.aar.roundTag', { n: e.round }) }}</span>
          {{ renderEvent(e, stream, t, focusActorId) }}
        </div>
      </cc-panel>
    </template>

    <template v-if="charts.length">
      <div class="text-cc-overline text-disabled"><cc-slashes /> {{ $t('active.aar.chartsTitle') }}
      </div>
      <v-row dense>
        <v-col v-for="spec in charts"
          :key="spec.id"
          cols="12"
          md="6">
          <cc-chart :title="spec.title"
            :subtitle="spec.subtitle"
            :type="spec.type"
            :data="spec.data"
            :options="spec.options"
            :table="spec.table"
            :height="spec.height ?? 240" />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderEvent, statusLabel } from '@/classes/components/combat/log/render'
import {
  casualties,
  highlights,
  highlightValue,
  outcomeText,
  rowSummaryText,
  sitrep,
  summarize,
} from '@/classes/components/combat/log/aar'
import { reduceEvents } from '@/classes/components/combat/log/telemetry'
import { toEventStatus } from '@/classes/components/combat/log/outcome'
import type { IOutcome } from '@/classes/components/combat/log/outcome'
import type { IParticipantSummary } from '@/classes/components/combat/log/aar'
import type { ILogStream } from '@/classes/components/combat/log/events'
import type { IEncounterRollup } from '@/classes/components/combat/log/telemetry'
import { useChartTheme } from '@/features/active_mode/_components/charts/chartBase'
import { encounterCharts } from '@/features/active_mode/_components/charts/gmCharts'
import { pilotCharts } from '@/features/active_mode/_components/charts/pilotCharts'
import RollupDisplay from '@/features/active_mode/runner/gm/EncounterPanels/_components/_RollupDisplay.vue'
import { resultLabel } from './results'
import CcChart from '../charts/CcChart.vue'

defineOptions({ name: 'AfterActionReport' })

const props = defineProps<{
  stream: ILogStream
  focusActorId?: string
  outcomes?: Record<string, IOutcome>
  result?: string
}>()

const { t } = useI18n()
const chartTheme = useChartTheme()

const PILOT_STREAM_CHARTS = new Set(['P1', 'P9', 'P10', 'P11'])

const summaries = computed(() => summarize(props.stream))
const notable = computed(() => highlights(props.stream, summaries.value))
const lost = computed(() => casualties(props.stream))
const sitrepText = computed(() => sitrep(props.stream))
const shownResult = computed(() => props.result ?? props.stream.result)

const headline = computed(() => [
  { label: t('active.telemetry.rounds'), value: props.stream.rounds },
  { label: t('gm.combatant.combatants'), value: props.stream.participants.length },
])

const charts = computed(() => {
  if (!props.stream.events.length) return []
  if (!props.focusActorId) return encounterCharts(chartTheme.value, t, props.stream)
  const rollup = reduceEvents(props.stream.events, props.focusActorId)
  return pilotCharts(chartTheme.value, t, rollup, [], props.stream, props.focusActorId).filter(
    spec => PILOT_STREAM_CHARTS.has(spec.id)
  )
})

function chosen(row: IParticipantSummary): IEncounterRollup {
  const live = props.outcomes?.[row.ref.id]
  if (!live) return row.rollup
  return {
    ...row.rollup,
    outcome: {
      pilot: live.pilotStatus && toEventStatus('pilot.status', live.pilotStatus),
      mech: live.mechStatus && toEventStatus('mech.status', live.mechStatus),
      npc: live.status && toEventStatus('npc.status', live.status),
    },
  }
}

function statusText(row: IParticipantSummary): string {
  const fallback =
    row.ref.type === 'pilot'
      ? statusLabel('pilot.status', 'active', t)
      : statusLabel('npc.status', 'operational', t)
  return outcomeText(chosen(row), t) || fallback
}

function statusColor(row: IParticipantSummary): string {
  const o = chosen(row).outcome ?? {}
  const values = [o.pilot, o.mech, o.npc].filter(Boolean) as string[]
  if (values.some(v => ['kia', 'mia', 'destroyed', 'reactor_destroyed'].includes(v)))
    return 'text-error'
  if (values.some(v => !['active', 'operational'].includes(v))) return 'text-warning'
  return 'text-success'
}
</script>
