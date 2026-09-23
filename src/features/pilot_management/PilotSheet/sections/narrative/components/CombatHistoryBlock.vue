<template>
  <cc-dialog
    :title="$t('pm.print.pilotCombatHistory')"
    icon="mdi-chart-box"
    full-height
    major
    no-gutters
    min-width="90vw"
    :close-on-click="false"
  >
    <template #activator="{ open }">
      <cc-button
        size="small"
        block
        color="primary"
        prepend-icon="mdi-chart-box"
        class="mt-2"
        @click="open"
      >
        {{ $t('pm.print.openLogbook') }}
      </cc-button>
    </template>

    <template #default>
      <div
        v-if="!logbook"
        class="text-center text-disabled text-cc-overline pa-8"
      >
        {{ $t('pm.logbook.empty') }}
      </div>
      <cc-tabs
        v-else
        modal
      >
        <template #tabs>
          <v-tab>
            <v-icon
              start
              icon="mdi-chart-box"
            />
            {{ $t('active.telemetry.telemetry') }}
          </v-tab>
          <v-tab>
            <v-icon
              start
              icon="mdi-clipboard-text"
            />
            {{ $t('pm.logbook.encounterLogs') }}
          </v-tab>
        </template>
        <v-window-item>
          <pilot-logbook-view
            :preset-pilot="pilot.ID"
            embedded
          />
        </v-window-item>
        <v-window-item>
          <div class="pa-4">
            <logbook-log-reader :logbook="logbook" />
          </div>
        </v-window-item>
      </cc-tabs>
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Pilot } from '@/classes/pilot/Pilot'
  import { PilotStore } from '@/features/pilot_management/store'
  import LogbookLogReader from '@/features/pilot_management/_components/logbook/LogbookLogReader.vue'
  import PilotLogbookView from '@/features/pilot_management/_components/logbook/PilotLogbookView.vue'

  const props = defineProps<{ pilot: Pilot }>()

  const logbook = computed(() => PilotStore().getLogbookByPilotID(props.pilot.ID))
</script>
