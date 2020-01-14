<template>
  <v-container style="margin-top: 50px; min-height: calc(100vh - 50px)">
    <v-row>
      <v-col>
        <div class="overline">//MISSION</div>
        <div class="heading mech mt-n6">{{ mission.Name }}</div>
        <p v-if="mission.Note" class="flavor-text panel text-center" v-html="mission.Note" />
        <div v-else class="flavor-text grey--text text-center">// NO BRIEFING DATA //</div>
        <v-row justify="center">
          <v-col v-for="(s, i) in mission.Steps" :key="`step_${i}`" :cols="s.Name ? 3 : 1">
            <v-card outlined height="100%">
              <div :class="`caption white--text ${s.Name ? 'primary' : 'secondary'}`">
                &nbsp;//{{ i + 1 }}
              </div>
              <v-card-text class="flavor-text">
                <div v-if="s.Name">
                  <span class="heading h3">{{ s.Name }}</span>
                  <v-divider />
                  <div>PR: {{ s.Power }} // COMBATANTS: {{ s.Npcs.length }}</div>
                  <div>ENV: {{ s.Environment }}</div>
                  <div>SITREP: {{ s.Sitrep.name }}</div>
                </div>
                <div v-else style="margin-top: 25%; margin-bottom: 25%" class="text-center">
                  <v-icon color="secondary" large>mdi-restore</v-icon>
                  <span class="overline">{{ s.IsLong ? 'Full' : 'Short' }} Rest</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-divider class="my-2 " />
        <fieldset style="border-radius: 5px">
          <legend><span class="px-2 heading h3 primary--text">PILOTS</span></legend>
          <v-card v-for="p in pilots" :key="p.ID" cols="12" outlined class="my-1">
            <v-card-text class="pa-1">
              <v-row dense align="center">
                <v-col cols="auto" class="mr-3">
                  <span class="heading h3 primary--text">{{ p.Callsign }}</span>
                  <cc-slashes />
                  <span class="flavor-text">{{ p.Name }} // LL {{ p.Level }}</span>
                </v-col>
                <v-divider vertical class="mx-2" />
                <v-col>
                  <span class="heading h3 primary--text">{{ p.ActiveMech.Name }}</span>
                  <cc-slashes />
                  <span class="flavor-text">
                    {{ p.ActiveMech.Frame.Source }} {{ p.ActiveMech.Frame.Name }}
                  </span>
                </v-col>
                <v-col cols="auto" class="ml-auto mr-2">
                  <v-btn icon color="error" class="fadeSelect" @click="removePilot(p)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div class="my-1 mx-4">
            <v-btn tile outlined color="primary" block @click="$refs.pilotDialog.show()">
              <v-icon left>mdi-plus</v-icon>
              Add Pilot
            </v-btn>
          </div>
        </fieldset>
        <div v-if="pilots.length">
          <div class="overline mt-2 mb-n4">//POWER RATING</div>
          <v-row dense class="flavor-text text-center">
            <v-col>
              TOTAL PILOT:
              <span class="heading h3">{{ pilotPower }}</span>
            </v-col>
            <v-col>
              AVERAGE ENCOUNTER:
              <span class="heading h3">{{ avgPower }}</span>
            </v-col>
            <v-col>
              MAXIMUM ENCOUNTER:
              <span class="heading h3">{{ maxPower }}</span>
            </v-col>
          </v-row>
          <v-row dense class="heading h3 text-center">
            <v-col>
              CALCULATED MISSION RATING:
              <span :class="`${diffColor}--text`">{{ difficulty }}</span>
            </v-col>
          </v-row>
        </div>
        <v-row justify="center">
          <v-col cols="10">
            <v-btn x-large block color="primary" :disabled="!pilots.length" @click="startMission()">
              start
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <cc-solo-dialog ref="pilotDialog" no-confirm title="ADD PILOT" fullscreen no-pad>
      <pilot-selector :selected-pilots="pilots" @select="addPilot($event)" />
    </cc-solo-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotSelector from './PilotSelector.vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'
import { Pilot, ActiveMission } from '@/class'

export default Vue.extend({
  name: 'mission-briefing',
  components: { PilotSelector },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    pilots: [],
  }),
  computed: {
    mission() {
      const store = getModule(MissionStore, this.$store)
      return store.Missions.find(x => x.ID === this.id)
    },
    pilotPower() {
      return this.pilots
        .reduce((a, b) => +a + +b.Power, 0)
        .toString()
        .padStart(4, '0')
    },
    avgPower() {
      return this.mission.averagePower.toString().padStart(4, '0')
    },
    maxPower() {
      return this.mission.maxPower.toString().padStart(4, '0')
    },
    difficulty() {
      const diff = this.maxPower - this.pilotPower
      if (diff < -600) return 'Trivial'
      if (diff < -300) return 'Easy'
      if (diff > -300 && diff < 300) return 'Balanced'
      if (diff < 600) return 'Difficult'
      return 'Impossible'
    },
    diffColor() {
      const diff = this.maxPower - this.pilotPower
      if (diff < -600) return 'green'
      if (diff < -300) return 'teal'
      if (diff > -300 && diff < 300) return 'indigo'
      if (diff < 600) return 'deep-orange'
      return 'error'
    },
  },
  methods: {
    addPilot(pilot: Pilot) {
      this.pilots.push(pilot)
      this.$refs.pilotDialog.hide()
    },
    removePilot(pilot: Pilot) {
      const idx = this.pilots.findIndex(x => x.ID === pilot.ID)
      if (idx > -1) this.pilots.splice(idx, 1)
    },
    startMission() {
      const m = new ActiveMission(this.mission, this.pilots)
      const store = getModule(MissionStore, this.$store)
      store.addActiveMission(m)
      this.$router.push({ name: 'mission-runner', params: { id: m.ID } })
    },
  },
})
</script>
