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
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <cc-alert v-if="hasRemainingActions"
            color="error"
            icon="mdi-alert"
            variant="outlined"
            title="You have remaining actions!">
            <v-row class="my-1 mx-4 px-2 text-text bg-panel"
              justify="space-around">
              <v-col cols="auto"
                v-if="controller.CanActivate('protocol')">
                <v-chip color="protocol"
                  class="ml-2"
                  size="large"
                  tile
                  prepend-icon="cc:protocol"
                  variant="flat">
                  Protocol
                </v-chip>
              </v-col>
              <v-col cols="auto"
                v-if="controller.CanActivate('full')">
                <v-chip color="action--full"
                  prepend-icon="mdi-hexagon-slice-6"
                  class="ml-2"
                  size="large"
                  tile
                  variant="flat">
                  Full Action
                </v-chip>
              </v-col>
              <v-col cols="auto"
                v-else-if="controller.CanActivate('quick')">
                <v-chip color="action--quick"
                  prepend-icon="mdi-hexagon-slice-3"
                  class="ml-2"
                  size="large"
                  tile
                  variant="flat">
                  Quick Action
                </v-chip>
              </v-col>
            </v-row>
            <div class="heading text-center">
              Ending the round will forfeit any unused actions.
            </div>
          </cc-alert>

          <div v-if="nextRoundAlerts">
            <v-divider class="my-4" />

            <div class="text-cc-overline mt-2">Next Round:</div>
            <div class="my-1">
              <div class="mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ controller.CombatName }}</b>
                will lose the following statuses:
                <div v-for="s in getTimeoutStatuses()"
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
                    your turn
                  </b>
                </div>
              </div>
              <div v-for="s in getTimeoutStatuses(true)"
                class="my-1 mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ controller.CombatName }}</b>
                will lose the following statuses:
                <div v-for="s in getTimeoutStatuses()"
                  class="my-1 mx-4 px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    {{ s.status.Name }}
                  </b>
                  at the
                  <b class="text-accent">
                    {{ s.expires.EndsOn }} of
                    your turn
                  </b>
                </div>
              </div>
            </div>

            <div v-for="b in braced"
              class="my-1 mx-4 px-2 text-text bg-panel">
              You exit
              <b class="text-accent">BRACED</b>
              and enter
              <b class="text-warning">BRACE COOLDOWN</b>
              state.
            </div>
          </div>

          <v-divider class="my-4" />
          <cc-button color="primary"
            block
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
import * as _ from 'lodash-es';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';

export default {
  name: 'PcEndRoundPanel',
  props: {
    sheet: {
      type: PilotSheet,
      required: true,
    },
  },
  computed: {
    nextRoundAlerts() {
      return this.braced || this.getTimeoutStatuses().length || this.getTimeoutStatuses(true).length;
    },
    controller() {
      return this.sheet.Pilot.CombatController;
    },
    hasRemainingActions() {
      return this.controller.HasRemainingActions;
    },
    hasTimedEffects() {
      return this.controller.TimedEffects.length > 0;
    },
    braced() {
      return this.controller.Braced;
    },
  },
  methods: {
    getTimeoutStatuses(custom = false): any[] {
      return this.controller[custom ? 'CustomStatuses' : 'Statuses'].filter(
        (s) =>
          s.expires.Period === 'turn' ||
          (s.expires.Period === 'round' &&
            s.expires.RoundEndNumber &&
            s.expires.RoundEndNumber === this.sheet.Round + 1)
      );
    },
    endRound(isActive) {
      this.sheet.EndRound();
      isActive.value = false;
    },
  },
};
</script>
