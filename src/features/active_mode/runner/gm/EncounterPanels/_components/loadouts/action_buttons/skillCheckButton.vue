<template>
  <combat-action-button
    :action="action">
    <template #default="{ close }">
      <p v-html-safe="action.Detail"
        class="text-text mb-4" />
      <v-card color="panel"
        flat
        tile
        class="px-12 py-3">
        <v-row class="mb-3"
          align="center">
          <v-col>
            <div class="text-cc-overline text-disabled">{{ $t('active.skillCheck.checkStat') }}</div>
            <v-select v-model="selectedHase"
              :items="hase"
              density="compact"
              variant="outlined"
              flat
              hide-details
              tile />
          </v-col>
          <v-col cols="auto">
            <div class="text-cc-overline text-disabled">{{ $t('active.skillCheck.checkType') }}</div>
            <v-btn-toggle v-model="checkType"
              density="compact"
              flat
              tile
              color="primary">
              <v-btn value="standard"
                size="small">{{ $t('active.skillCheck.standard') }}</v-btn>
              <v-btn value="contested"
                size="small">{{ $t('active.skillCheck.contested') }}</v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col v-if="checkType === 'standard'">
            <div class="text-cc-overline text-disabled">{{ $t('active.skillCheck.modifiers') }}</div>
            <div class="d-flex">
              <v-btn-toggle v-model="modifier"
                density="compact"
                flat
                tile
                color="primary">
                <v-btn value=""
                  size="small">{{ $t('common.none') }}</v-btn>
                <v-btn value="risky"
                  size="small">{{ $t('active.skillCheck.risky') }}</v-btn>
                <v-btn value="heroic"
                  size="small">{{ $t('active.skillCheck.heroic') }}</v-btn>
              </v-btn-toggle>
              <cc-checkbox v-model="difficult"
                bg-color="background"
                flat
                tile
                class="ml-6" />
              <div class="d-inline ml-2 mt-2 text-cc-overline">{{ $t('active.skillCheck.difficult') }}</div>
            </div>
          </v-col>
          <v-col v-else>
            <div class="text-cc-overline text-disabled">{{ $t('ui.fields.selectTarget') }}</div>

            <v-select v-model="selectedTarget"
              :items="targets"
              density="compact"
              variant="outlined"
              item-title="CombatController.RootActor.CombatController.CombatName"
              return-object
              flat
              hide-details
              tile />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <div v-if="checkType === 'contested'"
              class="text-center heading">
              {{ controller.CombatName }}
              <v-divider class="mb-2" />
            </div>

            <skill-check-base ref="check"
              :controller="controller"
              :selected-hase="selectedHase"
              :difficult="difficult">
              <v-col v-if="checkType === 'standard'"
                cols="auto"
                align-self="center">
                <div class="text-center text-cc-overline px-2 mt-n3"><b>{{ $t('ui.combat.vs') }}</b></div>
              </v-col>
              <v-col v-if="checkType === 'standard'">
                <div class="text-cc-overline text-disabled">{{ $t('active.skillCheck.targetValue') }}</div>
                <v-text-field v-model="targetVal"
                  density="compact"
                  variant="outlined"
                  type="number"
                  hide-spin-buttons
                  flat
                  tile
                  hide-details>
                  <template #append>
                    <v-tooltip v-if="$refs.check"
                      location="top">
                      <template #activator="{ props }">
                        <v-btn icon
                          size="x-small"
                          variant="text"
                          flat
                          tile
                          :color="!$refs.check.roll
                            ? ''
                            : $refs.check.roll >= targetVal
                              ? 'success'
                              : 'error'
                            "
                          class="ml-n2"
                          v-bind="props"
                          @click="overrideSave()">
                          <v-icon size="25"
                            :icon="!$refs.check.roll
                              ? 'mdi-circle-outline'
                              : $refs.check.roll >= targetVal
                                ? 'mdi-check-circle'
                                : 'mdi-cancel'
                              " />
                        </v-btn>
                      </template>

                      <div class="text-center">
                        {{
                          !$refs.check.roll ? $t('active.skillCheck.noCheckRolled') : $refs.check.roll >= targetVal ? $t('active.skillCheck.checkSuccess') : $t('active.skillCheck.checkFail')
                        }}

                        <div>
                          <i class="text-caption text-disabled">{{ $t('ui.combat.clickToOverride') }}</i>
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </skill-check-base>
          </v-col>
          <v-col v-if="checkType === 'contested'"
            align-self="center"
            cols="auto"
            class="mx-1">
            <v-chip size="large"
              class="heading">{{ $t('ui.combat.vs') }}</v-chip>
          </v-col>
          <v-col v-if="checkType === 'contested' && selectedTarget">
            <div class="text-center heading">
              {{ selectedTarget.Name }}
              <v-divider class="mb-2" />
              <skill-check-base ref="contest"
                :controller="selectedTarget.CombatController"
                :selected-hase="selectedHase" />
            </div>
          </v-col>
          <v-col v-else-if="checkType === 'contested' && !selectedTarget"
            class="text-center text-disabled text-caption"
            align-self="center">
            <i>{{ $t('ui.combat.noTarget') }}</i>
          </v-col>
        </v-row>
      </v-card>
      <cc-alert v-if="
        checkType === 'contested' &&
        selectedTarget &&
        $refs.check.roll &&
        $refs.contest.roll
      "
        class="mt-4"
        :color="$refs.check.roll >= $refs.contest.roll ? 'success' : 'error'"
        outlined>
        <div class="text-center heading">
          {{ $t('common.result') }}:
          <span>
            {{ controller.CombatName }}
            {{ $refs.check.roll >= $refs.contest.roll ? $t('active.skillCheck.wins') : $t('active.skillCheck.loses') }}
          </span>
        </div>
      </cc-alert>
      <menu-input :owner="owner" :encounter-instance="encounterInstance" hide-input
        :key="controller.ID"
        :active-effect="action"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Action } from '@/classes/Action'
import { computed, ref, watch } from 'vue'
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import SkillCheckBase from './_skillCheckBase.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
}>()

const emit = defineEmits<{
  'activate': []
}>()

const check = ref<any>(null)
const contest = ref<any>(null)

const roll = ref(null)
const bonus = ref(0)
const accDiff = ref(0)
const targetVal = ref(10)
const rollResults = ref([])
const selectedHase = ref('hull')
const checkType = ref('standard')
const difficult = ref(false)
const modifier = ref('')
const selectedTarget = ref(null)
const hase = ref([
      { title: 'Hull', value: 'hull' },
      { title: 'Agility', value: 'agility' },
      { title: 'Systems', value: 'systems' },
      { title: 'Engineering', value: 'engineering' },
      { title: 'None', value: '' },
    ])

const controller = computed(() => {
      return owner.value.actor.CombatController;
    })
const targets = computed(() => {
      const thisCombatant = encounterInstance.value.Combatants.find(
        (c) => c.actor.ID === controller.value.RootActor.ID
      );
      if (!thisCombatant) return [];
      return encounterInstance.value.Combatants.filter(
        (c) =>
          c.actor.ID !== controller.value.ActiveActor.ID &&
          c.actor.ID !== controller.value.RootActor.ID
      ).map((x) => x.actor.CombatController.ActiveActor);
    })
const applicableBonuses = computed(() => {
      let bonuses = [];
      bonuses = controller.value.ActiveActor.FeatureController?.Bonuses?.filter(
        (b) => b.ID === selectedHase.value || b.ID === 'check'
      );
      const result = {
        bonuses: bonuses.filter((b) => !!b.Value) || [],
        accDiff: bonuses.filter((b) => !!b.Accuracy) || [],
      };
      if (selectedHase.value) {
        const statBonus = controller.value.ActiveActor.CombatController.StatController.getStat(
          selectedHase.value
        );
        if (statBonus) {
          result.bonuses.push({
            Source: `${selectedHase.value.charAt(0).toUpperCase() + selectedHase.value.slice(1)} Stat`,
            Value: statBonus,
          });
        }
      }
      return result;
    })

function apply(close) {
      emit('activate', props.action.ID);
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
function rollCheck(idx) {
      rollResults.value = [];
      const results = [];
      const count = 1 + Math.abs(accDiff.value);

      for (let i = 1; i <= count; i++) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const val = roll + bonus.value;
        results.push({ val, text: `${roll} + ${bonus.value} (${val})` });
      }

      if (accDiff.value < 0) {
        results.sort((a, b) => a.val - b.val);
      } else {
        results.sort((a, b) => b.val - a.val);
      }

      rollResults.value = results;
      roll.value = results[0].val;
    }
function overrideCheck(idx) {
      if (roll.value < targetVal.value) {
        roll.value = 20;
      } else {
        roll.value = 1;
      }
    }
</script>
