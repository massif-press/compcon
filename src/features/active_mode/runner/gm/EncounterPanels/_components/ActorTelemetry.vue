<template>
  <cc-dialog
    icon="mdi-clipboard-text"
    :title="`${actor.Name} Combat Telemetry`"
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
          icon="mdi-chart-donut-variant"
          start
        />
        {{ $t('active.telemetry.telemetry') }}
      </v-btn>
    </template>
    <template #default>
      <v-row
        dense
        class="mb-1"
      >
        <v-col>
          <v-btn
            flat
            block
            :color="tab === 'encounterInstance' ? 'primary' : 'panel'"
            tile
            size="small"
            @click="tab = 'encounterInstance'"
          >
            {{ $t('active.telemetry.encounterInstance') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            flat
            block
            :color="tab === 'lifetime' ? 'primary' : 'panel'"
            tile
            size="small"
            @click="tab = 'lifetime'"
          >
            {{ $t('active.telemetry.lifetime') }}
          </v-btn>
        </v-col>
      </v-row>

      <div
        v-if="tab === 'lifetime' && !logbook"
        class="text-center text-disabled text-cc-overline pa-4"
      >
        {{ $t('active.telemetry.noLifetimeData') }}
      </div>
      <div v-else>
        <div
          v-if="tab === 'lifetime'"
          class="text-caption text-disabled mb-1"
        >
          {{ $t('active.telemetry.encountersLogged') }}
          <b class="text-accent">{{ logbook?.Encounters ?? 0 }}</b>
        </div>
        <rollup-display :rollup="rollup" />
      </div>

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
            {{ $t('active.telemetry.exportText') }}
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
            {{ $t('active.common.exportAsJson') }}
          </cc-button>
        </v-col>
      </v-row>
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
  import type { ICombatant } from '@/classes/components/combat/ICombatant'
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { computed, ref } from 'vue'
  import {
    reduceEvents,
    formatRollup,
    blankRollup,
  } from '@/classes/components/combat/log/telemetry'
  import { PilotStore } from '@/features/pilot_management/store'
  import RollupDisplay from './_RollupDisplay.vue'

  defineOptions({ name: 'ActorTelemetry' })

  const props = defineProps<{
    actor: ICombatant
    encounterInstance: EncounterInstance
  }>()

  const tab = ref('encounterInstance')

  const logbook = computed(() => {
    const parent = props.actor as any
    return PilotStore().getLogbookByPilotID(parent.OriginId || props.actor.ID)
  })

  const encounterRollup = computed(() => {
    void props.actor.CombatController.CombatLogVersion
    return reduceEvents(props.actor.CombatController.CombatLog.Events, props.actor.ID)
  })

  const rollup = computed(() =>
    tab.value === 'lifetime' ? (logbook.value?.Lifetime ?? blankRollup()) : encounterRollup.value
  )

  const summary = computed(
    () =>
      `${props.actor.CombatController.CombatName} - Round ${props.encounterInstance.Round - 1}\n\n` +
      formatRollup(rollup.value, 40)
  )

  function exportLog(type: 'text' | 'json' = 'text') {
    const out =
      type === 'text'
        ? summary.value
        : JSON.stringify(
            {
              actor: props.actor.Name,
              actor_id: props.actor.ID,
              scope: tab.value,
              data: rollup.value,
            },
            null,
            2
          )

    const blob = new Blob([out], { type: type === 'text' ? 'text/plain' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.actor.Name} ${props.encounterInstance.Name} ${tab.value} telemetry.${type === 'text' ? 'txt' : 'json'}`
    a.click()
    URL.revokeObjectURL(url)
  }
</script>
