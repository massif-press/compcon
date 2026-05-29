<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-clock-end"
        @click="props.onClick($event)">
        End Round
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end"
              class="mt-n1 ml-2"
              start />
            Confirm End Round
          </div>
          <v-spacer />
          <v-btn icon
            :disabled="loading"
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-progress-linear v-if="loading"
          indeterminate
          color="accent"
          height="4" />
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
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">

export default {
  name: 'GmEndRoundPanel',
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    nextRoundAlerts() {
      return this.braced.length || this.activeActors.some(c => this.getTimeoutStatuses(c).length || this.getTimeoutStatuses(c, true).length);
    },
    activeActors() {
      return this.encounterInstance.Combatants.filter((x) => x.type !== 'doodad' && !x.actor.CombatController.IsDestroyed && !x.reinforcement).map(
        (x) => x.actor.CombatController.ActiveActor.CombatController
      )
    },
    hasRemainingActions() {
      return this.activeActors.filter((c) => c.HasRemainingActions);
    },
    hasTimedEffects() {
      return this.activeActors.filter((c) => c.TimedEffects.length > 0);
    },
    reinforcements() {
      return this.encounterInstance.Combatants.filter(
        (c) => c.reinforcement && c.reinforcementTurn === this.encounterInstance.Round + 1
      );
    },
    braced() {
      return this.activeActors.filter((c) => c.Braced);
    },
  },
  methods: {
    getTimeoutStatuses(combatant, custom = false) {
      return combatant[custom ? 'CustomStatuses' : 'Statuses'].filter(
        (s) =>
          s.expires &&
          (s.expires.Period === 'turn' ||
          (s.expires.Period === 'round' &&
            s.expires.RoundEndNumber &&
            s.expires.RoundEndNumber === this.encounterInstance.Round + 1))
      );
    },
    getStatusTarget(actorID, testName) {
      const target = this.activeActors.find((c) => c.Parent.ID === actorID);
      if (!target) return 'Unknown';
      let name = target.CombatName || 'Unknown';
      if (testName && target.CombatName === testName) {
        name = 'their';
      }
      return name;
    },
    async endRound(isActive) {
      this.loading = true;
      await this.$nextTick();
      await this.encounterInstance.EndRound();
      this.loading = false;
      isActive.value = false;
    },
  },
};
</script>
