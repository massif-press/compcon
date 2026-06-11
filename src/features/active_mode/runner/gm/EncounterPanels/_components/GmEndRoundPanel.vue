<template>
  <end-round-dialog :loading="loading">
    <template #default="{ isActive }">
      <v-card-text>
          <div class="text-cc-overline">{{ $t('active.gmEndRound.unusedActions') }}</div>
          <div v-if="hasRemainingActions.length">
            <v-row v-for="c in hasRemainingActions"
              :key="c.Parent.ID"
              dense
              class="my-1 mx-4 px-2 text-text bg-panel">
              <v-col>
                <span class="heading h4">
                  {{ c.CombatName }}
                </span>
              </v-col>
              <end-round-action-chips :controller="c" />
            </v-row>
          </div>
          <i v-else
            class="text-disabled">{{ $t('active.common.none') }}</i>


          <div v-if="nextRoundAlerts">
            <v-divider class="my-4" />

            <div class="text-cc-overline mt-2">{{ $t('active.pcEndRound.nextRound') }}</div>
            <div v-for="a in activeActors"
              :key="a.Parent.ID"
              class="my-1">
              <div v-for="(s, index) in getTimeoutStatuses(a)"
                :key="`timeout-${index}`"
                class="mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ a.CombatName }}</b>
                {{ $t('active.pcEndRound.willLoseStatuses') }}
                <div v-for="(s, sIdx) in getTimeoutStatuses(a)"
                  :key="`timeout-inner-${sIdx}`"
                  class="px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    <v-icon :icon="s.status.Icon"
                      size="small"
                      class="mt-n1" />
                    {{ s.status.Name }}
                  </b>
                  {{ $t('active.pcEndRound.atThe') }}
                  <b class="text-accent">
                    {{ $t('active.gmEndRound.endsOnTargetTurn', { when: s.expires.EndsOn, target: getStatusTarget(s.expires.ExpirationActorID, a.CombatName) }) }}
                  </b>
                </div>
              </div>
              <div v-for="(s, index) in getTimeoutStatuses(a, true)"
                :key="`timeout-custom-${index}`"
                class="my-1 mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ a.CombatName }}</b>
                {{ $t('active.pcEndRound.willLoseStatuses') }}
                <div v-for="(s, sIdx) in getTimeoutStatuses(a)"
                  :key="`timeout-custom-inner-${sIdx}`"
                  class="my-1 mx-4 px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    {{ s.status.Name }}
                  </b>
                  {{ $t('active.pcEndRound.atThe') }}
                  <b class="text-accent">
                    {{ $t('active.gmEndRound.endsOnTargetTurn', { when: s.expires.EndsOn, target: getStatusTarget(s.expires.ExpirationActorID, a.CombatName) }) }}
                  </b>
                </div>
              </div>
            </div>

            <div v-for="b in braced"
              :key="b.Parent.ID"
              class="my-1 mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ b.CombatName }}</b>
              <i18n-t keypath="active.gmEndRound.braceExit" tag="span" scope="global">
                <template #braced><b class="text-accent">{{ $t('active.pcEndRound.braced') }}</b></template>
                <template #cooldown><b class="text-warning">{{ $t('active.pcEndRound.braceCooldown') }}</b></template>
              </i18n-t>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="text-cc-overline mt-2">{{ $t('active.gmEndRound.reinforcementsReady') }}</div>
          <div v-if="reinforcements.length">
            <div v-for="r in reinforcements"
              :key="r.actor.ID"
              class="my-1 mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ r.CombatName }}</b>
              {{ $t('active.gmEndRound.willBeReady') }}
            </div>
          </div>
          <i v-else
            class="text-disabled">{{ $t('active.common.none') }}</i>
          <v-divider class="my-4" />
          <cc-button color="primary"
            block
            :loading="loading"
            :disabled="loading"
            prepend-icon="mdi-check-all"
            @click="endRound(isActive)">
            {{ $t('active.endRound.endRound') }}
          </cc-button>
        </v-card-text>
    </template>
  </end-round-dialog>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, ref, nextTick } from 'vue'
import EndRoundDialog from '../../../_shared/_EndRoundDialog.vue';
import EndRoundActionChips from '../../../_components/EndRoundActionChips.vue';

const props = defineProps<{
  encounterInstance: EncounterInstance
}>()

const loading = ref(false)

const nextRoundAlerts = computed(() => {
      return braced.value.length || activeActors.value.some(c => getTimeoutStatuses(c).length || getTimeoutStatuses(c, true).length);
    })
const activeActors = computed(() => {
      return props.encounterInstance.Combatants.filter((x) => x.type !== 'doodad' && !x.actor.CombatController.IsDestroyed && !x.reinforcement).map(
        (x) => x.actor.CombatController.ActiveActor.CombatController
      )
    })
const hasRemainingActions = computed(() => {
      return activeActors.value.filter((c) => c.HasRemainingActions);
    })
const hasTimedEffects = computed(() => {
      return activeActors.value.filter((c) => c.TimedEffects.length > 0);
    })
const reinforcements = computed(() => {
      return props.encounterInstance.Combatants.filter(
        (c) => c.reinforcement && c.reinforcementTurn === props.encounterInstance.Round + 1
      );
    })
const braced = computed(() => {
      return activeActors.value.filter((c) => c.Braced);
    })

function getTimeoutStatuses(combatant, custom = false) {
      return combatant[custom ? 'CustomStatuses' : 'Statuses'].filter(
        (s) =>
          s.expires &&
          (s.expires.Period === 'turn' ||
          (s.expires.Period === 'round' &&
            s.expires.RoundEndNumber &&
            s.expires.RoundEndNumber === props.encounterInstance.Round + 1))
      );
    }
function getStatusTarget(actorID, testName) {
      const target = activeActors.value.find((c) => c.Parent.ID === actorID);
      if (!target) return 'Unknown';
      let name = target.CombatName || 'Unknown';
      if (testName && target.CombatName === testName) {
        name = 'their';
      }
      return name;
    }
async function endRound(isActive) {
      loading.value = true;
      await nextTick();
      await props.encounterInstance.EndRound();
      loading.value = false;
      isActive.value = false;
    }
</script>
