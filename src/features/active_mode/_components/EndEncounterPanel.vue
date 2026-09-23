<template>
  <v-dialog v-model="open"
    max-width="1200px"
    scrollable>
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps"
        flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-progress-check">
        {{ $t('active.endEnc.endEncounter') }}
      </v-btn>
    </template>
    <v-card>
      <v-toolbar height="40"
        color="primary"
        class="text-center">
        <div class="heading h3 mt-1">
          <v-icon icon="mdi-clock-end"
            class="mt-n1 ml-2"
            start />
          {{ $t('active.encMgr.afterActionReport') }}
          <span class="text-caption ml-2">
            {{ $t('active.aar.step', { n: step + 1, total: 2 }) }}
          </span>
        </div>
        <v-spacer />
        <v-btn icon
          @click="open = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="0">
            <after-action-report v-if="stream"
              :stream="stream"
              :focus-actor-id="focusActorId"
              :outcomes="outcomes"
              :result="result" />
          </v-window-item>
          <v-window-item :value="1">
            <div class="text-cc-overline text-disabled"><cc-slashes /> {{
              $t('active.aar.outcomeTitle')
              }}</div>
            <cc-panel color="background"
              class="mt-1 mb-4">
              <v-row v-for="c in combatants"
                :key="c.id"
                dense
                align="center">
                <v-col cols="12"
                  md="4">
                  <div class="heading h4">{{ c.Label || c.actor.CombatController.CombatName }}</div>
                  <div class="text-caption text-disabled">{{ summaries[c.id] }}</div>
                </v-col>
                <template v-if="outcomes[c.id]?.status !== undefined">
                  <v-col cols="12"
                    md="4">
                    <v-combobox v-model="outcomes[c.id].status"
                      @update:model-value="edited.add(c.id)"
                      :items="npcStatusTypes"
                      :item-title="(v: string) => enumLabel('npcStatus', v)"
                      :label="$t('common.status')"
                      hide-details
                      density="compact" />
                  </v-col>
                </template>
                <template v-else>
                  <v-col cols="12"
                    md="4">
                    <v-combobox v-model="outcomes[c.id].pilotStatus"
                      @update:model-value="edited.add(c.id)"
                      :items="pilotStatusTypes"
                      :item-title="(v: string) => enumLabel('pilotStatus', v)"
                      :label="$t('active.aar.pilotStatus')"
                      hide-details
                      density="compact" />
                  </v-col>
                  <v-col v-if="outcomes[c.id]?.mechStatus !== undefined"
                    cols="12"
                    md="4">
                    <v-combobox v-model="outcomes[c.id].mechStatus"
                      @update:model-value="edited.add(c.id)"
                      :items="mechStatusTypes"
                      :item-title="(v: string) => enumLabel('mechStatus', v)"
                      :label="$t('active.aar.mechStatus')"
                      hide-details
                      density="compact" />
                  </v-col>
                </template>
              </v-row>
            </cc-panel>

            <div class="text-cc-overline text-disabled"><cc-slashes /> {{ $t('common.result') }}
            </div>
            <v-combobox v-model="result"
              :items="ENCOUNTER_RESULTS"
              :item-title="(v: string) => resultLabel(v)"
              variant="outlined"
              density="compact" />

            <v-slide-y-reverse-transition>
              <cc-alert v-if="confirm"
                color="warning"
                variant="outlined"
                :title="$t('active.endEnc.confirmEndEncounter')"
                icon="mdi-alert-outline"
                class="mb-4">
                <p class="text-text">{{ confirmMessage }}</p>
              </cc-alert>
            </v-slide-y-reverse-transition>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <cc-button v-if="step === 1"
          size="small"
          variant="text"
          @click="back">
          {{ $t('common.back') }}
        </cc-button>
        <v-spacer />
        <cc-button v-if="step === 0"
          size="small"
          color="primary"
          append-icon="mdi-chevron-right"
          @click="step = 1">
          {{ $t('active.aar.next') }}
        </cc-button>
        <cc-button v-else-if="!confirm"
          size="small"
          color="primary"
          @click="confirm = true">
          {{ $t('active.endEnc.endEncounter') }}
        </cc-button>
        <cc-button v-else
          size="small"
          color="warning"
          @click="$emit('end', result, outcomes)">
          {{ $t('active.endEnc.confirmEndEncounter') }}
        </cc-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PilotStatus, NpcStatus, MechStatus } from '@/classes/enums'
import { enumLabel } from '@/i18n/enumLabel'
import { seedOutcomes } from '@/classes/components/combat/log/outcome'
import { reduceEvents } from '@/classes/components/combat/log/telemetry'
import { rowSummaryText } from '@/classes/components/combat/log/aar'
import type { IOutcome } from '@/classes/components/combat/log/outcome'
import type { ILogStream } from '@/classes/components/combat/log/events'
import type { CombatantData } from '@/classes/encounter/Encounter'
import AfterActionReport from './aar/AfterActionReport.vue'
import { ENCOUNTER_RESULTS, resultLabel } from './aar/results'

const props = defineProps<{
  combatants: CombatantData[]
  buildStream: () => ILogStream
  confirmMessage: string
  focusActorId?: string
}>()

defineEmits<{
  end: [result: string, outcomes: Record<string, IOutcome>]
}>()

const { t } = useI18n()

const open = ref(false)
const step = ref(0)
const confirm = ref(false)
const result = ref(ENCOUNTER_RESULTS[0])
const stream = shallowRef<ILogStream | null>(null)
const outcomes = reactive<Record<string, IOutcome>>({})
const edited = new Set<string>()
const pilotStatusTypes = Object.values(PilotStatus)
const npcStatusTypes = Object.values(NpcStatus)
const mechStatusTypes = Object.values(MechStatus)

watch(open, isOpen => {
  if (!isOpen) return
  step.value = 0
  confirm.value = false
  stream.value = props.buildStream()
  seedOutcomes(props.combatants, outcomes, edited)
})

function back() {
  confirm.value = false
  step.value = 0
}

const summaries = computed(() => {
  const s = stream.value
  if (!s) return {} as Record<string, string>
  return Object.fromEntries(
    props.combatants.map(c => [c.id, rowSummaryText(reduceEvents(s.events, c.id), t)])
  )
})
</script>
