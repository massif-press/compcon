<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter-instance="encounterInstance">
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
            <div class="text-cc-overline text-disabled">Check Stat</div>
            <v-select v-model="selectedHase"
              :items="hase"
              density="compact"
              variant="outlined"
              flat
              hide-details
              tile />
          </v-col>
          <v-col cols="auto">
            <div class="text-cc-overline text-disabled">Check Type</div>
            <v-btn-toggle v-model="checkType"
              density="compact"
              flat
              tile
              color="primary">
              <v-btn value="standard"
                size="small">Standard</v-btn>
              <v-btn value="contested"
                size="small">Contested</v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col v-if="checkType === 'standard'">
            <div class="text-cc-overline text-disabled">Modifiers</div>
            <div class="d-flex">
              <v-btn-toggle v-model="modifier"
                density="compact"
                flat
                tile
                color="primary">
                <v-btn value=""
                  size="small">None</v-btn>
                <v-btn value="risky"
                  size="small">Risky</v-btn>
                <v-btn value="heroic"
                  size="small">Heroic</v-btn>
              </v-btn-toggle>
              <cc-checkbox v-model="difficult"
                bg-color="background"
                flat
                tile
                class="ml-6" />
              <div class="d-inline ml-2 mt-2 text-cc-overline">Difficult</div>
            </div>
          </v-col>
          <v-col v-else>
            <div class="text-cc-overline text-disabled">Select Target</div>

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
                <div class="text-center text-cc-overline px-2 mt-n3"><b>VS</b></div>
              </v-col>
              <v-col v-if="checkType === 'standard'">
                <div class="text-cc-overline text-disabled">Target Value</div>
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
                          !$refs.check.roll
                            ? 'No Check Rolled'
                            : $refs.check.roll >= targetVal
                              ? 'Check Successful'
                              : 'Check Failed'
                        }}

                        <div>
                          <i class="text-caption text-disabled">Click to override</i>
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
              class="heading">VS</v-chip>
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
            <i>No Target Selected</i>
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
          Result:
          <span>
            {{ controller.CombatName }}
            {{ $refs.check.roll >= $refs.contest.roll ? 'Wins' : 'Loses' }}
          </span>
        </div>
      </cc-alert>
      <menu-input hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter-instance="encounterInstance"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Action } from '@/classes/Action'
import { computed, ref, watch } from 'vue'
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import SkillCheckBase from './_skillCheckBase.vue';

const props = defineProps<{
  action: Action
  owner: CombatantData
  encounterInstance: EncounterInstance
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
      return props.owner.actor.CombatController;
    })
const targets = computed(() => {
      const thisCombatant = props.encounterInstance.Combatants.find(
        (c) => c.actor.ID === controller.value.RootActor.ID
      );
      if (!thisCombatant) return [];
      return props.encounterInstance.Combatants.filter(
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
