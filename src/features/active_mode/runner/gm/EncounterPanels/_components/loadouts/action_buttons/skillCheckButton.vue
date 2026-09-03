<template>
  <combat-action-button :action="action">
    <template #default="{ close }">
      <p
        v-html-safe="action.Detail"
        class="text-text mb-4"
      />
      <v-card
        color="panel"
        flat
        tile
        class="px-12 py-3"
      >
        <v-row
          class="mb-3"
          align="center"
        >
          <v-col>
            <div class="text-cc-overline text-disabled">
              {{ $t('active.skillCheck.checkStat') }}
            </div>
            <v-select
              v-model="selectedHase"
              :items="hase"
              density="compact"
              variant="outlined"
              flat
              hide-details
              tile
            />
          </v-col>
          <v-col cols="auto">
            <div class="text-cc-overline text-disabled">
              {{ $t('active.skillCheck.checkType') }}
            </div>
            <v-btn-toggle
              v-model="checkType"
              density="compact"
              flat
              tile
              color="primary"
            >
              <v-btn
                value="standard"
                size="small"
              >
                {{ $t('active.skillCheck.standard') }}
              </v-btn>
              <v-btn
                value="contested"
                size="small"
              >
                {{ $t('active.skillCheck.contested') }}
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col v-if="checkType === 'standard'">
            <div class="text-cc-overline text-disabled">
              {{ $t('active.skillCheck.modifiers') }}
            </div>
            <div class="d-flex">
              <v-btn-toggle
                v-model="modifier"
                density="compact"
                flat
                tile
                color="primary"
              >
                <v-btn
                  value=""
                  size="small"
                >
                  {{ $t('common.none') }}
                </v-btn>
                <v-btn
                  value="risky"
                  size="small"
                >
                  {{ $t('active.skillCheck.risky') }}
                </v-btn>
                <v-btn
                  value="heroic"
                  size="small"
                >
                  {{ $t('active.skillCheck.heroic') }}
                </v-btn>
              </v-btn-toggle>
              <cc-checkbox
                v-model="difficult"
                bg-color="background"
                flat
                tile
                class="ml-6"
              />
              <div class="d-inline ml-2 mt-2 text-cc-overline">
                {{ $t('active.skillCheck.difficult') }}
              </div>
            </div>
          </v-col>
          <v-col v-else>
            <div class="text-cc-overline text-disabled">{{ $t('ui.fields.selectTarget') }}</div>

            <v-select
              v-model="selectedTarget"
              :items="targets"
              density="compact"
              variant="outlined"
              :item-title="targetLabel"
              return-object
              flat
              hide-details
              tile
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <div
              v-if="checkType === 'contested'"
              class="text-center heading"
            >
              {{ controller.CombatName }}
              <v-divider class="mb-2" />
            </div>

            <skill-check-base
              ref="check"
              :controller="controller"
              :selected-hase="selectedHase"
              :difficult="difficult"
            >
              <v-col
                v-if="checkType === 'standard'"
                cols="auto"
                align-self="center"
              >
                <div class="text-center text-cc-overline px-2 mt-n3">
                  <b>{{ $t('ui.combat.vs') }}</b>
                </div>
              </v-col>
              <v-col v-if="checkType === 'standard'">
                <div class="text-cc-overline text-disabled">
                  {{ $t('active.skillCheck.targetValue') }}
                </div>
                <v-text-field
                  v-model.number="targetVal"
                  density="compact"
                  variant="outlined"
                  type="number"
                  hide-spin-buttons
                  flat
                  tile
                  hide-details
                >
                  <template #append>
                    <v-tooltip
                      v-if="check"
                      location="top"
                    >
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          size="x-small"
                          variant="text"
                          flat
                          tile
                          :color="!outcome ? '' : outcome === 'success' ? 'success' : 'error'"
                          class="ml-n2"
                          v-bind="props"
                          @click="check?.overrideRoll(targetVal)"
                        >
                          <v-icon
                            size="25"
                            :icon="
                              !outcome
                                ? 'mdi-circle-outline'
                                : outcome === 'success'
                                  ? 'mdi-check-circle'
                                  : 'mdi-cancel'
                            "
                          />
                        </v-btn>
                      </template>

                      <div class="text-center">
                        {{
                          !outcome
                            ? $t('active.skillCheck.noCheckRolled')
                            : outcome === 'success'
                              ? $t('active.skillCheck.checkSuccess')
                              : $t('active.skillCheck.checkFail')
                        }}

                        <div>
                          <i class="text-caption text-disabled">
                            {{ $t('ui.combat.clickToOverride') }}
                          </i>
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </skill-check-base>
          </v-col>
          <v-col
            v-if="checkType === 'contested'"
            align-self="center"
            cols="auto"
            class="mx-1"
          >
            <v-chip
              size="large"
              class="heading"
            >
              {{ $t('ui.combat.vs') }}
            </v-chip>
          </v-col>
          <v-col v-if="checkType === 'contested' && selectedTarget">
            <div class="text-center heading">
              {{ selectedTarget.Name }}
              <v-divider class="mb-2" />
              <skill-check-base
                ref="contest"
                :controller="selectedTarget.CombatController"
                :selected-hase="selectedHase"
              />
            </div>
          </v-col>
          <v-col
            v-else-if="checkType === 'contested' && !selectedTarget"
            class="text-center text-disabled text-caption"
            align-self="center"
          >
            <i>{{ $t('ui.combat.noTarget') }}</i>
          </v-col>
        </v-row>
      </v-card>
      <cc-alert
        v-if="outcome === 'win' || outcome === 'lose'"
        class="mt-4"
        :color="outcome === 'win' ? 'success' : 'error'"
        outlined
      >
        <div class="text-center heading">
          {{ $t('common.result') }}:
          <span>
            {{ controller.CombatName }}
            {{
              outcome === 'win'
                ? $t('active.skillCheck.wins')
                : $t('active.skillCheck.loses')
            }}
          </span>
        </div>
      </cc-alert>
      <menu-input
        :key="controller.RootActor.ID"
        :owner="owner"
        :encounter-instance="encounterInstance"
        hide-input
        :active-effect="action"
        :close="close"
        @apply="apply"
        @reset="reset"
      />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { combatantLabel } from '@/util/combatantLabel'
  import { useEncounterContext } from '../../../encounterContext'
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import type { Action } from '@/classes/Action'
  import { computed, ref, shallowRef, watch } from 'vue'
  import CombatActionButton from './CombatActionButton.vue'
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
  import SkillCheckBase from './_skillCheckBase.vue'
  import { SkillCheckFlow, skillCheckState } from '@/classes/components/combat/flows/SkillCheckFlow'
  import type { ISkillCheckState, CheckTier } from '@/classes/components/combat/flows/SkillCheckFlow'
  import type { IFlowResult } from '@/classes/components/combat/flows/Flow'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const { owner, encounterInstance } = useEncounterContext()

  function targetLabel(actor: any) {
    const combatant = encounterInstance.value.Combatants.find(
      c => c.actor.CombatController.ActiveActor.ID === actor.ID
    )
    return combatant
      ? combatantLabel(combatant)
      : actor.CombatController.RootActor.CombatController.CombatName
  }

  const props = defineProps<{
    action: Action
  }>()

  const emit = defineEmits<{
    activate: [payload: string]
  }>()

  const check = ref<InstanceType<typeof SkillCheckBase> | null>(null)
  const contest = ref<InstanceType<typeof SkillCheckBase> | null>(null)

  const targetVal = ref(10)
  const selectedHase = ref('hull')
  const checkType = ref('standard')
  const difficult = ref(false)
  const modifier = ref('')
  const selectedTarget = ref<any>(null)
  const hase = ref([
    { title: t('active.titles.hull'), value: 'hull' },
    { title: t('stats.agility'), value: 'agility' },
    { title: t('stats.systems'), value: 'systems' },
    { title: t('stats.engineering'), value: 'engineering' },
    { title: t('common.none'), value: '' },
  ])

  const controller = computed(() => {
    return owner.value.actor.CombatController
  })
  const targets = computed(() => {
    const thisCombatant = encounterInstance.value.Combatants.find(
      c => c.actor.ID === controller.value.RootActor.ID
    )
    if (!thisCombatant) return []
    return encounterInstance.value.Combatants.filter(
      c =>
        c.actor.ID !== controller.value.ActiveActor.ID &&
        c.actor.ID !== controller.value.RootActor.ID
    ).map(x => x.actor.CombatController.ActiveActor)
  })

  function newState(): ISkillCheckState {
    return skillCheckState({
      cc: controller.value,
      stat: selectedHase.value,
      tier: modifier.value as CheckTier,
      difficult: difficult.value,
      contested: checkType.value === 'contested',
      target: selectedTarget.value?.CombatController,
      targetValue: Number(targetVal.value),
    })
  }

  const state = ref<ISkillCheckState>(newState())
  const result = shallowRef<IFlowResult<ISkillCheckState> | null>(null)

  const outcome = computed(() => state.value.outcome)

  // the rolls live on the state, so a re-roll after the check resolved is read, not discarded
  function run() {
    result.value = SkillCheckFlow.Begin(state.value)
  }

  function reseed() {
    state.value = newState()
    result.value = null
  }

  watch([selectedHase, checkType, difficult, modifier, selectedTarget, targetVal], reseed)

  watch(
    () => check.value?.roll,
    value => {
      if (typeof value !== 'number') return
      state.value.roll = value
      run()
    }
  )

  watch(
    () => contest.value?.roll,
    value => {
      if (typeof value !== 'number') return
      state.value.contestRoll = value
      run()
    }
  )

  function apply() {
    emit('activate', props.action.ID)
  }
  function reset() {
    reseed()
    controller.value.UndoActivation(props.action.Activation, { actionId: props.action.ID })
  }
</script>
