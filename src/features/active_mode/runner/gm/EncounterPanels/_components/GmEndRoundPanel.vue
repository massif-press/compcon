<template>
  <end-round-dialog :loading="loading">
    <template #default="{ isActive }">
      <v-card-text>
          <div class="text-cc-overline">unused actions:</div>
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
              <v-col v-if="c.CanActivate('protocol')"
                cols="auto">
                <v-chip color="protocol"
                  class="ml-2"
                  size="small"
                  prepend-icon="cc:protocol"
                  variant="flat">
                  Protocol
                </v-chip>
              </v-col>
              <v-col v-if="c.CanActivate('full')"
                cols="auto">
                <v-chip color="action--full"
                  prepend-icon="mdi-hexagon-slice-6"
                  class="ml-2"
                  size="small"
                  variant="flat">
                  Full Action
                </v-chip>
              </v-col>
              <v-col v-else-if="c.CanActivate('quick')"
                cols="auto">
                <v-chip color="action--quick"
                  prepend-icon="mdi-hexagon-slice-3"
                  class="ml-2"
                  size="small"
                  variant="flat">
                  Quick Action
                </v-chip>
              </v-col>
            </v-row>
          </div>
          <i v-else
            class="text-disabled">None</i>


          <div v-if="nextRoundAlerts">
            <v-divider class="my-4" />

            <div class="text-cc-overline mt-2">Next Round:</div>
            <div v-for="a in activeActors"
              :key="a.Parent.ID"
              class="my-1">
              <div v-for="(s, index) in getTimeoutStatuses(a)"
                :key="`timeout-${index}`"
                class="mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ a.CombatName }}</b>
                will lose the following statuses:
                <div v-for="(s, sIdx) in getTimeoutStatuses(a)"
                  :key="`timeout-inner-${sIdx}`"
                  class="px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    <v-icon :icon="s.status.Icon"
                      size="small"
                      class="mt-n1" />
                    {{ s.status.Name }}
                  </b>
                  at the
                  <b class="text-accent">
                    {{ s.expires.EndsOn }} of
                    {{ getStatusTarget(s.expires.ExpirationActorID, a.CombatName) }} turn
                  </b>
                </div>
              </div>
              <div v-for="(s, index) in getTimeoutStatuses(a, true)"
                :key="`timeout-custom-${index}`"
                class="my-1 mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ a.CombatName }}</b>
                will lose the following statuses:
                <div v-for="(s, sIdx) in getTimeoutStatuses(a)"
                  :key="`timeout-custom-inner-${sIdx}`"
                  class="my-1 mx-4 px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    {{ s.status.Name }}
                  </b>
                  at the
                  <b class="text-accent">
                    {{ s.expires.EndsOn }} of
                    {{ getStatusTarget(s.expires.ExpirationActorID, a.CombatName) }} turn
                  </b>
                </div>
              </div>
            </div>

            <div v-for="b in braced"
              :key="b.Parent.ID"
              class="my-1 mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ b.CombatName }}</b>
              exits
              <b class="text-accent">BRACED</b>
              and enters
              <b class="text-warning">BRACE COOLDOWN</b>
              state.
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="text-cc-overline mt-2">reinforcements ready next round:</div>
          <div v-if="reinforcements.length">
            <div v-for="r in reinforcements"
              :key="r.actor.ID"
              class="my-1 mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ r.CombatName }}</b>
              will be ready to deploy.
            </div>
          </div>
          <i v-else
            class="text-disabled">None</i>
          <v-divider class="my-4" />
          <cc-button color="primary"
            block
            :loading="loading"
            :disabled="loading"
            prepend-icon="mdi-check-all"
            @click="endRound(isActive)">
            End Round
          </cc-button>
        </v-card-text>
    </template>
  </end-round-dialog>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import EndRoundDialog from '../../../_shared/_EndRoundDialog.vue';

const props = defineProps<{
  encounterInstance: object
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
