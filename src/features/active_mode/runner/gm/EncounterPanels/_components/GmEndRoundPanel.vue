<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn
        flat
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
        <v-toolbar height="40" color="primary" class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end" class="mt-n1 ml-2" start />
            Confirm End Round
          </div>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">unused actions:</div>
          <div v-if="hasRemainingActions.length">
            <v-row
              v-for="c in hasRemainingActions"
              :key="c.Parent.ID"
              dense
              class="my-1 mx-4 px-2 text-text bg-panel">
              <v-col>
                <span class="heading h4">
                  {{ c.CombatName }}
                </span>
              </v-col>
              <v-col cols="auto" v-if="c.CanActivate('protocol')">
                <v-chip
                  color="protocol"
                  class="ml-2"
                  size="small"
                  prepend-icon="cc:protocol"
                  variant="flat">
                  Protocol
                </v-chip>
              </v-col>
              <v-col cols="auto" v-if="c.CanActivate('full')">
                <v-chip
                  color="action--full"
                  prepend-icon="mdi-hexagon-slice-6"
                  class="ml-2"
                  size="small"
                  variant="flat">
                  Full Action
                </v-chip>
              </v-col>
              <v-col cols="auto" v-else-if="c.CanActivate('quick')">
                <v-chip
                  color="action--quick"
                  prepend-icon="mdi-hexagon-slice-3"
                  class="ml-2"
                  size="small"
                  variant="flat">
                  Quick Action
                </v-chip>
              </v-col>
            </v-row>
          </div>
          <i v-else class="text-disabled">None</i>
          <v-divider class="my-4" />

          <div class="text-cc-overline mt-2">Next Round:</div>
          <div v-for="a in activeActors" class="my-1">
            <div v-for="s in getTimeoutStatuses(a)" class="mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ a.CombatName }}</b>
              will lose the following statuses:
              <div v-for="s in getTimeoutStatuses(a)" class="px-2 text-text bg-panel">
                <b class="text-accent text-uppercase">
                  <v-icon :icon="s.status.Icon" size="small" class="mt-n1" />
                  {{ s.status.Name }}
                </b>
                at the
                <b class="text-accent">
                  {{ s.expires.EndsOn }} of
                  {{ getStatusTarget(s.expires.ExpirationActorID, a.CombatName) }} turn
                </b>
              </div>
            </div>
            <div v-for="s in getTimeoutStatuses(a, true)" class="my-1 mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ a.CombatName }}</b>
              will lose the following statuses:
              <div v-for="s in getTimeoutStatuses(a)" class="my-1 mx-4 px-2 text-text bg-panel">
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
          <div>- meltdown/self destruct/etc [x] apply</div>
          <div v-for="b in braced" class="my-1 mx-4 px-2 text-text bg-panel">
            <b class="text-secondary">{{ b.CombatName }}</b>
            exits
            <b class="text-accent">BRACED</b>
            and enters
            <b class="text-warning">BRACE COOLDOWN</b>
            state.
          </div>
          <v-divider class="my-4" />

          <div class="text-cc-overline mt-2">reinforcements ready next round:</div>
          <div v-if="reinforcements.length">
            <div v-for="r in reinforcements" class="my-1 mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ r.CombatName }}</b>
              will be ready to deploy.
            </div>
          </div>
          <i v-else class="text-disabled">None</i>
          <v-divider class="my-4" />
          <cc-button color="primary" block prepend-icon="mdi-check-all" @click="endRound(isActive)">
            End Round
          </cc-button>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { Statblock } from '@/class';
import { getTime } from 'vuetify/lib/labs/VCalendar/util/timestamp';

export default {
  name: 'GmEndRoundPanel',
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    activeActors() {
      return this.encounterInstance.Combatants.filter((x) => x.type !== 'doodad').map(
        (x) => x.actor.CombatController.ActiveActor.CombatController
      );
    },
    hasRemainingActions() {
      return this.activeActors.filter((c) => c.HasRemainingActions);
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
          s.expires.Period === 'turn' ||
          (s.expires.Period === 'round' &&
            s.expires.RoundEndNumber &&
            s.expires.RoundEndNumber === this.encounterInstance.Round + 1)
      );
    },
    getStatusTarget(actorID, testName) {
      const target = this.activeActors.find((c) => c.Parent.ID === actorID);
      let name = target.CombatName || 'Unknown';
      if (testName && target.CombatName === testName) {
        name = 'their';
      }
      return name;
    },
    endRound(isActive) {
      this.encounterInstance.EndRound();
      isActive.value = false;
    },
  },
};
</script>
