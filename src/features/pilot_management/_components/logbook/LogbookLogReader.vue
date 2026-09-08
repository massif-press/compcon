<template>
  <div>
    <v-row
      dense
      align="center"
      class="mb-1"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="encounterId"
          :items="encounterItems"
          :label="$t('active.charts.selectEncounter')"
          density="compact"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="kindFilter"
          :items="kindItems"
          :label="$t('active.actorLogs.filterKind')"
          density="compact"
          variant="outlined"
          multiple
          chips
          closable-chips
          hide-details
        />
      </v-col>
      <v-col
        cols="8"
        md="2"
      >
        <v-select
          v-model="roundFilter"
          :items="roundItems"
          :label="$t('active.actorLogs.filterRound')"
          density="compact"
          variant="outlined"
          hide-details
        />
      </v-col>
    </v-row>

    <div
      v-if="!stream"
      class="text-center text-disabled text-cc-overline pa-8"
    >
      {{ $t('active.charts.noStream') }}
    </div>

    <div v-else>
      <div class="text-caption text-disabled text-right mb-1">
        {{ $t('active.actorLogs.showing', { shown: shown.length, total: entries.length }) }}
      </div>

      <cc-panel
        v-for="log in shown"
        :key="log.id"
        color="background"
        class="mb-2"
        style="position: relative"
        :title="log.title"
      >
        <div style="font-family: 'Consolas'; font-size: 14px; white-space: pre-wrap">
          {{ log.text }}
        </div>
        <v-btn
          icon="mdi-content-copy"
          size="x-small"
          flat
          tile
          class="fade-select"
          style="position: absolute; bottom: 0; right: 0"
          @click.stop="copyContent(log)"
        />
      </cc-panel>

      <div
        v-if="!entries.length"
        class="text-center text-disabled text-cc-overline pa-4"
      >
        {{ $t('active.actorLogs.noEntries') }}
      </div>
      <div
        v-else-if="!shown.length"
        class="text-center text-disabled text-cc-overline pa-4"
      >
        {{ $t('active.actorLogs.noMatches') }}
      </div>

      <div v-if="entries.length">
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <cc-button
              size="small"
              block
              color="primary"
              prepend-icon="mdi-export"
              :tooltip="$t('active.tooltips.exportsAPlainTextVersion')"
              @click.stop="exportLog('text')"
            >
              {{ $t('active.actorLogs.exportText') }}
            </cc-button>
          </v-col>
          <v-col>
            <cc-button
              size="small"
              block
              color="info"
              prepend-icon="mdi-export"
              :tooltip="$t('active.tooltips.exportsAStructuredJsonVersion')"
              @click.stop="exportLog('json')"
            >
              {{ $t('active.actorLogs.exportJson') }}
            </cc-button>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { titleCase as kindLabel } from '@/classes/components/combat/log/charts'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { renderStream } from '@/classes/components/combat/log/render'
  import type { PilotLogbook } from '@/classes/pilot/PilotLogbook'

  const props = defineProps<{ logbook?: PilotLogbook }>()

  const { t } = useI18n()

  const encounterId = ref('')
  const kindFilter = ref<string[]>([])
  const roundFilter = ref<number>(-1)

  const encounterItems = computed(() =>
    [...(props.logbook?.Records ?? [])]
      .sort((a, b) => b.start - a.start)
      .filter(r => !!props.logbook?.StreamFor(r.encounterId))
      .map(r => ({
        value: r.encounterId,
        title: `${r.encounterName || t('pm.logbook.unnamed')} (${new Date(r.start).toLocaleDateString()})`,
      }))
  )

  const stream = computed(() => {
    const id = encounterId.value || encounterItems.value[0]?.value
    return id ? props.logbook?.StreamFor(id) : undefined
  })

  const entries = computed(() => {
    const s = stream.value
    if (!s) return []
    return renderStream(s.events, s, t, props.logbook?.PilotID).map((entry, index) => ({
      ...entry,
      id: entry.id || `${index}`,
      title: `${new Date(entry.ts).toLocaleString()} - ${t('active.actorLogs.round', { n: entry.round })}, ${index + 1}`,
    }))
  })

  const kindItems = computed(() =>
    [...new Set(entries.value.flatMap(e => e.kinds))]
      .sort()
      .map(kind => ({ title: kindLabel(kind), value: kind }))
  )

  const roundItems = computed(() => [
    { title: t('active.actorLogs.allRounds'), value: -1 },
    ...[...new Set(entries.value.map(e => e.round))]
      .sort((a, b) => a - b)
      .map(n => ({ title: t('active.actorLogs.round', { n }), value: n })),
  ])

  const shown = computed(() =>
    entries.value.filter(
      e =>
        (!kindFilter.value.length || e.kinds.some(k => kindFilter.value.includes(k))) &&
        (roundFilter.value === -1 || e.round === roundFilter.value)
    )
  )

  watch(stream, () => {
    kindFilter.value = []
    roundFilter.value = -1
  })

  function copyContent(entry: { title: string; text: string }) {
    if (!entry) return
    navigator.clipboard.writeText(`${entry.title}\n${entry.text}`)
  }

  function exportLog(type: 'text' | 'json' = 'text') {
    const s = stream.value
    if (!s) return
    const visible = new Set(shown.value.map(e => e.id))
    const out =
      type === 'text'
        ? shown.value.map(entry => `${entry.title}\n${entry.text}`).join('\n')
        : JSON.stringify({ ...s, events: s.events.filter(e => visible.has(e.id)) }, null, 2)

    const blob = new Blob([out], { type: type === 'text' ? 'text/plain' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${s.encounterName || 'encounter'} combat log.${type === 'text' ? 'txt' : 'json'}`
    a.click()
    URL.revokeObjectURL(url)
  }
</script>
