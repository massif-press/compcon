<template>
  <v-footer fixed style="padding-bottom: 2px; border-top: 2px solid var(--v-primary-base)">
    <v-dialog v-model="rcDialog" width="80vw">
      <template v-slot:activator="{ on }">
        <v-btn outlined small class="mr-5" style="border-color: var(--v-warning-base)" v-on="on">
          NEXT ENCOUNTER
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dense flat tile color="warning darken-3 heading h2">
          NEXT ENCOUNTER
        </v-toolbar>
        <v-card-text>
          <p class="flavor-text stark--text mt-2 mb-0 mx-6">
            >//[
            <span class="accent--text">COMP/CON</span>
            :
            <span class="stark-text--text">Confirmation Required</span>
            Continue?
          </p>
          <v-row justify="center" class="mt-2">
            <v-col cols="auto">
              <v-btn
                x-large
                tile
                color="warning darken-3"
                @click="
                  rcDialog = false
                  pilot.State.StartCombat()
                "
              >
                &nbsp;Reactivate Combat Mode
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="emDialog" width="80vw">
      <template v-slot:activator="{ on }">
        <v-btn outlined small class="mr-5" style="border-color: var(--v-error-base)" v-on="on">
          END MISSION
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dense flat tile color="warning darken-3 heading h2">
          END MISSION
        </v-toolbar>
        <v-card-text>
          <p class="flavor-text stark--text mt-2 mb-0 mx-6">
            >//[
            <span class="accent--text">COMP/CON</span>
            :
            <span class="stark-text--text">Confirmation Required</span>
            ] Pilot, proceeding will end the current mission and write all combat telemetry data to
            your record. This cannot be undone. Continue?
          </p>
          <v-row justify="center" no-gutters class="mt-n2"></v-row>
          <v-alert dense outlined :color="pilot.ActiveMech.Frame.Manufacturer.Color" class="mt-4">
            <span class="text--text">
              The following mission data will be added to the Pilot Combat Telemetry Record:
            </span>
            <div class="pl-2 pr-4 flavor-text">
              <div>
                MOVES:
                <b class="stark--text">{{ pilot.State.Stats.moves }}</b>
              </div>
              <div>
                DAMAGE DEALT:
                <b class="stark--text">{{ pilot.State.Stats.damage }}</b>
              </div>
              <div>
                ENEMIES DESTROYED:
                <b class="stark--text">{{ pilot.State.Stats.kills }}</b>
              </div>
              <div>
                DAMAGE TAKEN:
                <b class="stark--text">{{ pilot.State.Stats.hp_damage }}</b>
              </div>
              <div>
                STRUCTURE LOST:
                <b class="stark--text">{{ pilot.State.Stats.structure_damage }}</b>
              </div>
              <div>
                HEAT TAKEN:
                <b class="stark--text">{{ pilot.State.Stats.heat_damage }}</b>
              </div>
              <div>
                REACTOR STRESS:
                <b class="stark--text">{{ pilot.State.Stats.reactor_damage }}</b>
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
                  emDialog = false
                  pilot.State.EndMission()
                "
              >
                &nbsp;Complete Mission
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <span class="flavor-text">
      >//[
      <span class="accent--text">COMP/CON</span>
      :
      <span class="stark-text--text">Field Repair Protocols Active</span>
      ]
    </span>

    <v-spacer />

    <div class="mt-n1">
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
    </div>
  </v-footer>
</template>

<script lang="ts">
import ActionMenuButton from '../../components/ActionMenuButton.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'turn-footer',
  components: { ActionMenuButton },
  data: () => ({
    emDialog: false,
    rcDialog: false,
  }),
  methods: {
    openMenu(idx: number) {
      console.log(idx)
    },
  },
})
</script>
