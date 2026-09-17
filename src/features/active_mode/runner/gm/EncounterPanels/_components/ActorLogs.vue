<template>
  <cc-dialog
    icon="mdi-clipboard-text"
    :title="`${actor.Name} Combat Log`"
    :close-on-click="false"
  >
    <template #activator="{ open }">
      <v-btn
        size="x-small"
        flat
        tile
        @click="open"
      >
        <v-icon
          icon="mdi-clipboard-text"
          start
        />
        {{ $t('active.actorLogs.log') }}
      </v-btn>
    </template>
    <template #default>
      <v-row
        v-if="entries.length"
        dense
        class="mb-1"
        align="center"
      >
        <v-col
          cols="12"
          sm="7"
        >
          <v-select
            v-model="kindFilter"
            :items="kindItems"
            :label="$t('active.actorLogs.filterKind')"
            density="compact"
            variant="outlined"
            hide-details
            multiple
            chips
            closable-chips
          />
        </v-col>
        <v-col
          cols="8"
          sm="3"
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
        <v-col
          cols="4"
          sm="2"
          class="text-caption text-disabled text-right"
        >
          {{ $t('active.actorLogs.showing', { shown: summary.length, total: entries.length }) }}
        </v-col>
      </v-row>

      <cc-panel
        v-for="log in summary"
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
        v-else-if="!summary.length"
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
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
  import { titleCase as kindLabel } from '@/classes/components/combat/log/charts'
  import type { ICombatant } from '@/classes/components/combat/ICombatant'
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { renderStream } from '@/classes/components/combat/log/render'
  import { combatantRef } from '@/classes/components/combat/log/refs'
  import { eventsFor } from '@/classes/components/combat/log/CombatLogRecorder'
  import { buildStream } from '@/classes/components/combat/log/stream'

  const props = defineProps<{
    actor: ICombatant
    encounterInstance: EncounterInstance
  }>()

  const { t } = useI18n()

  const kindFilter = ref<string[]>([])
  const roundFilter = ref<number>(-1)

  const stream = computed(() => {
    void props.actor.CombatController.CombatLogVersion
    void (props.actor as any).ActiveMech?.CombatController.CombatLogVersion
    const recorder = props.actor.CombatController.CombatLog
    return buildStream(
      {
        encounterId: recorder.EncounterId,
        campaignId: recorder.CampaignId,
        missionId: recorder.MissionId,
        participants: props.encounterInstance.Combatants.map(combatantRef),
      },
      props.encounterInstance.Combatants.map(combatantRef),
      eventsFor(props.actor),
      recorder.Source
    )
  })

  const entries = computed(() =>
    renderStream(stream.value.events, stream.value, t).map((entry, index) => ({
      ...entry,
      id: entry.id || `${index}`,
      title: `${new Date(entry.ts).toLocaleString()} - ${t('active.actorLogs.round', { n: entry.round })}, ${index + 1}`,
    }))
  )

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

  const summary = computed(() =>
    entries.value.filter(
      e =>
        (!kindFilter.value.length || e.kinds.some(k => kindFilter.value.includes(k))) &&
        (roundFilter.value === -1 || e.round === roundFilter.value)
    )
  )

  function copyContent(entry) {
    if (!entry) return
    navigator.clipboard.writeText(`${entry.title}\n${entry.text}`)
  }

  function exportLog(type: 'text' | 'json' = 'text') {
    const shown = new Set(summary.value.map(e => e.id))
    const out =
      type === 'text'
        ? summary.value.map(entry => `${entry.title}\n${entry.text}`).join('\n')
        : JSON.stringify(
            {
              ...stream.value,
              events: stream.value.events.filter(e => shown.has(e.id)),
              encounterName: props.encounterInstance.Name,
            },
            null,
            2
          )

    const blob = new Blob([out], { type: type === 'text' ? 'text/plain' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.actor.Name} ${props.encounterInstance.Name} round ${props.encounterInstance.Round} combat log.${type === 'text' ? 'txt' : 'json'}`
    a.click()
    URL.revokeObjectURL(url)
  }
</script>
