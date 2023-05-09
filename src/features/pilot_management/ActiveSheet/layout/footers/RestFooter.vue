<template>
  <v-footer fixed style="padding-bottom: 2px; border-top: 2px solid rgb(var(--v-theme-primary))">
    <v-row no-gutters :justify="$vuetify.display.smAndDown ? 'space-around' : ''">
      <v-col cols="auto">
        <v-dialog v-model="rcDialog" :fullscreen="$vuetify.display.smAndDown" width="80vw">
          <template #activator="{ props }">
            <v-btn small class="mr-5" color="warning darken-2" v-bind="props">NEXT ENCOUNTER</v-btn>
          </template>
          <v-card>
            <v-toolbar density="compact" dark flat tile color="warning darken-3 heading h2">
              NEXT ENCOUNTER
              <v-spacer />
              <v-btn icon @click="rcDialog = false"><v-icon icon="mdi-close" /></v-btn>
            </v-toolbar>
            <v-card-text>
              <p class="flavor-text text-stark mt-2 mb-0 mx-6">
                >//[
                <span class="text-accent">COMP/CON</span>
                :
                <span class="stark-text-text">Confirmation Required.</span>
                Continue?
              </p>
              <v-row justify="center" class="mt-2">
                <v-col cols="auto">
                  <v-btn
                    x-large
                    tile
                    color="warning darken-3"
                    @click="
                      rcDialog = false;
                      pilot.State.StartCombat();
                    "
                  >
                    &nbsp;Reactivate Combat Mode
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="auto">
        <v-dialog v-model="emDialog" :fullscreen="$vuetify.display.smAndDown" width="80vw">
          <template #activator="{ props }">
            <v-btn small class="mr-5" color="error darken-2" v-bind="props">END MISSION</v-btn>
          </template>
          <v-card>
            <v-toolbar density="compact" dark flat tile color="warning darken-3 heading h2">
              END MISSION
              <v-spacer />
              <v-btn icon @click="emDialog = false"><v-icon icon="mdi-close" /></v-btn>
            </v-toolbar>
            <v-card-text>
              <div>
                <v-checkbox
                  v-model="saveCheckbox"
                  density="compact"
                  hide-details
                  label="Save Mission Data"
                />
              </div>
              <p v-show="saveCheckbox" class="flavor-text text-stark mt-2 mb-0 mx-6">
                >//[
                <span class="text-accent">COMP/CON</span>
                :
                <span class="stark-text-text">Confirmation Required</span>
                ] Pilot, proceeding will end the current mission and write all combat telemetry data
                to your record. This cannot be undone. Continue?
              </p>
              <v-row justify="center" no-gutters class="mt-n2"></v-row>
              <v-alert
                density="compact"
                variant="outlined"
                :color="pilot.ActiveMech.Frame.Manufacturer.Color"
                class="mt-4"
              >
                <span v-show="saveCheckbox" class="text-text">
                  The following mission data will be added to the Pilot Combat Telemetry Record:
                </span>
                <div class="pl-2 pr-4 flavor-text">
                  <div>
                    MOVES:
                    <b class="text-stark">{{ pilot.State.Stats.moves }}</b>
                  </div>
                  <div>
                    DAMAGE DEALT:
                    <b class="text-stark">{{ pilot.State.Stats.damage }}</b>
                  </div>
                  <div>
                    ENEMIES DESTROYED:
                    <b class="text-stark">{{ pilot.State.Stats.kills }}</b>
                  </div>
                  <div>
                    DAMAGE TAKEN:
                    <b class="text-stark">{{ pilot.State.Stats.hp_damage }}</b>
                  </div>
                  <div>
                    STRUCTURE LOST:
                    <b class="text-stark">{{ pilot.State.Stats.structure_damage }}</b>
                  </div>
                  <div>
                    HEAT TAKEN:
                    <b class="text-stark">{{ pilot.State.Stats.heat_damage }}</b>
                  </div>
                  <div>
                    REACTOR STRESS:
                    <b class="text-stark">{{ pilot.State.Stats.reactor_damage }}</b>
                  </div>
                </div>
              </v-alert>
              <v-row justify="center" class="mt-2">
                <v-col cols="auto">
                  <v-btn
                    x-large
                    tile
                    color="warning darken-3"
                    @click="
                      emDialog = false;
                      pilot.State.EndMission(!saveCheckbox);
                    "
                  >
                    &nbsp;Complete Mission
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col v-if="$vuetify.display.mdAndUp">
        <span class="flavor-text">
          >//[
          <span class="text-accent">COMP/CON</span>
          :
          <span class="stark-text-text">Field Repair Protocols Active</span>
          ]
        </span>
      </v-col>
    </v-row>
    <!-- <div class="mt-n1">
      <cc-tooltip inline content="Combat Log" delayed>
        <v-btn class="mx-1" small fab elevation="0" color="primary" @click="openMenu(0)">
          <v-icon color="white" size="25">mdi-notebook</v-icon>
        </v-btn>
      </cc-tooltip>

      <cc-tooltip inline content="Other" delayed>
        <v-btn class="mx-1" small fab elevation="0" color="primary" @click="openMenu(1)">
          <v-icon color="white" size="25">mdi-dots-vertical</v-icon>
        </v-btn>
      </cc-tooltip>
    </div> -->
  </v-footer>
</template>

<script lang="ts">
import ActionMenuButton from '../../components/ActionMenuButton.vue';

export default {
  name: 'turn-footer',
  components: { ActionMenuButton },
  data: () => ({
    emDialog: false,
    rcDialog: false,
    saveCheckbox: true,
  }),
  methods: {
    openMenu(idx: number) {
      console.log(idx);
    },
  },
};
</script>
