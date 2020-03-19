<template>
  <v-window-item class="px-3">
    <v-row>
      <div v-if="mech.Destroyed || mech.ReactorDestroyed">
        <destroyed-alert :mech="mech" />
        <div v-if="mech.ReactorDestroyed">
          <p class="stat-text accent--text text-center pt-4">
            This mech cannot be repaired and must be reprinted.
          </p>
        </div>
        <div v-else class="mx-3">
          <v-col cols="12" class="text-center mt-3 mb-3">
            <span class="subtle--text">
              REPAIR CAPACITY REMAINING:
              <b>{{ mech.CurrentRepairs }}</b>
            </span>
            <br />
            <span>
              <v-icon v-for="n in mech.CurrentRepairs" :key="'rep_' + n" large>
                control_point
              </v-icon>
              <v-icon
                v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
                :key="'repcap_' + n"
                large
                color="grey darken-1"
              >
                mdi-circle-outline
              </v-icon>
            </span>
          </v-col>
          <v-divider dark class="ma-2" />
          <v-card color="panel" class="mb-2">
            <v-card-text class="flavor-text text--text">
              This mech can be repaired to working order by spending 4 repair points. These repairs
              can be spent from this mech’s own pool or the pools of any pilots that wish to
              contribute, in any combination.
            </v-card-text>
          </v-card>
          <span class="heading h3">REPAIR POINTS</span>
          <v-slider
            v-model="selfRepair"
            :max="Math.min(mech.CurrentRepairs, 4)"
            step="1"
            thumb-label
            ticks="always"
            tick-size="6"
            track-color="primary"
            track-fill-color="success"
          />
          <span class="heading h3">ALLY REPAIR POINTS</span>
          <v-slider
            v-model="allyRepair"
            step="1"
            :max="4 - selfRepair"
            ticks="always"
            thumb-label
            tick-size="6"
            track-color="primary"
            track-fill-color="success"
          />
          <v-btn
            block
            tile
            color="success"
            large
            dark
            :disabled="selfRepair + allyRepair < 4"
            @click="repairDestroyed"
          >
            Repair Mech
          </v-btn>
        </div>
      </div>
      <v-row v-else>
        <v-col class="mx-2">
          <p class="overline flavor-text subtle--text pb-0 mb-0">
            //[COMP/CON: COMBAT OPERATIONS COMPLETE
            <br />
            DISCONNECTING PILOT SENSORIUM ... done
            <br />
            UPLOADING BATTLEFIELD TELEMETRY ... done
            <br />
            RUNNING FRAME DIAGNOSTIC SUITE ... done ]
          </p>
          <p class="flavor-text subtle--text">
            //[COMP/CON:
            <span class="text--text">
              Lancer, I have detected
              <b class="accent--text">{{ issues }}</b>
              issue{{ issues === 1 ? '' : 's' }} requiring your attention:
            </span>
            ]
          </p>
          <div class="text-center mt-3 mb-3">
            <span class="heading h3">
              REPAIR CAPACITY REMAINING:
              <b class="accent--text">{{ mech.CurrentRepairs }}</b>
            </span>
            <br />
            <span>
              <v-icon v-for="n in mech.CurrentRepairs" :key="'rep_' + n" large>
                control_point
              </v-icon>
              <v-icon
                v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
                :key="'repcap_' + n"
                large
                color="grey darken-1"
              >
                mdi-circle-outline
              </v-icon>
            </span>
          </div>
          <div class="text-xs-right">
            <span class="overline">
              {{ mech.Frame.Source }} {{ mech.Frame.Name }} DIAGNOSTICS COMPLETE
            </span>
            <v-progress-linear
              class="pa-0 mt-0 mb-2"
              :value="progress()"
              color="blue darken-3"
              background-color="red darken-4"
              height="10"
            />
          </div>
          <div class="text-left flavor-text">
            <span v-if="mech.CurrentHP === mech.MaxHP" class="subtle--text">
              > NO DAMAGE DETECTED
            </span>
            <v-row v-else dense align="center">
              <v-col cols="auto">
                <b class="accent--text">WARNING: DAMAGE DETECTED</b>
              </v-col>
              <v-col cols="auto" class="ml-auto">
                <v-btn
                  small
                  dark
                  tile
                  color="secondary"
                  :disabled="!mech.CurrentRepairs"
                  @click="healHP"
                >
                  Repair
                  <v-icon right>control_point</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div class="text-left flavor-text">
            <span v-if="mech.CurrentStructure === mech.MaxStructure" class="subtle--text">
              > STRUCTURAL INTEGRITY NOMINAL
            </span>
            <v-row v-else dense align="center">
              <v-col cols="auto">
                <b class="accent--text">CRITICAL: STRUCTURE COMPROMISED</b>
              </v-col>
              <v-col cols="auto" class="ml-auto">
                <v-btn
                  small
                  dark
                  tile
                  color="secondary"
                  :disabled="isEverest ? !mech.CurrentRepairs : mech.CurrentRepairs < 2"
                  @click="healStructure"
                >
                  Repair
                  <v-icon right>control_point</v-icon>
                  <v-icon v-if="!isEverest" right>control_point</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div class="text-left flavor-text">
            <span v-if="mech.CurrentStress === mech.MaxStress" class="subtle--text">
              > REACTOR INTEGRITY NOMINAL
            </span>
            <v-row v-else dense align="center">
              <v-col cols="auto">
                <b class="accent--text">CRITICAL: REACTOR COMPROMISED</b>
              </v-col>
              <v-col cols="auto" class="ml-auto">
                <v-btn
                  small
                  dark
                  tile
                  color="secondary"
                  :disabled="mech.CurrentRepairs < 2"
                  @click="healStress"
                >
                  Repair
                  <v-icon right>control_point</v-icon>
                  <v-icon right>control_point</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div class="text-left flavor-text">
            <span v-if="!destroyedWeapons.length" class="subtle--text">
              > ARMAMENT NOMINAL
            </span>
            <div v-else>
              <b class="accent--text">WARNING: ARMAMENT DAMAGED</b>
              <v-row v-for="w in destroyedWeapons" :key="w.ID" dense align="center">
                <v-col cols="auto" class="ml-auto">
                  <v-btn
                    small
                    dark
                    tile
                    block
                    color="secondary"
                    class="my-0"
                    :disabled="!mech.CurrentRepairs"
                    @click="repairSystem(w)"
                  >
                    Repair {{ w.Name }}
                    <v-icon right>control_point</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>

          <div class="text-left flavor-text">
            <span v-if="!destroyedSystems.length" class="subtle--text">
              > SYSTEMS NOMINAL
            </span>
            <div v-else>
              <b class="accent--text">WARNING: SYSTEMS DAMAGED</b>
              <v-row v-for="s in destroyedSystems" :key="s.ID" dense align="center">
                <v-col cols="auto" class="ml-auto">
                  <v-btn
                    small
                    dark
                    tile
                    block
                    class="my-0"
                    color="secondary"
                    :disabled="!mech.CurrentRepairs"
                    @click="repairSystem(s)"
                  >
                    Repair {{ s.Name }}
                    <v-icon right>control_point</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-row>
    <v-divider class="ma-2" />
    <v-row dense justify="center">
      <v-col cols="8">
        <v-btn block color="primary" dark large @click="startCombat()">Resume Combat</v-btn>
      </v-col>
      <v-col cols="9" class="mt-1">
        <v-btn block color="amber darken-4" @click="endMission()">Complete Mission</v-btn>
      </v-col>
    </v-row>
  </v-window-item>
</template>

<script lang="ts">
import Vue from 'vue'
import DestroyedAlert from './components/DestroyedAlert.vue'
import { MechEquipment } from '@/class'

function normalize(current, max): number {
  if (!max) return 1
  return current / max
}

export default Vue.extend({
  name: 'rest-manager',
  components: { DestroyedAlert },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    rest: false,
    diagNumber: 0,
    selfRepair: 0,
    allyRepair: 0,
  }),
  computed: {
    mech() {
      return this.pilot.ActiveMech
    },
    loadout() {
      return this.mech.ActiveLoadout
    },
    destroyedWeapons() {
      return this.loadout.Weapons.filter(x => x.Destroyed)
    },
    destroyedSystems() {
      return this.loadout.Systems.filter(x => x.Destroyed)
    },
    isEverest() {
      return this.mech.Frame.ID === 'mf_standard_pattern_i_everest'
    },
    issues() {
      return (
        (this.mech.CurrentHP === this.mech.MaxHP ? 0 : 1) +
        (this.mech.CurrentStructure === this.mech.MaxStructure ? 0 : 1) +
        (this.mech.CurrentStress === this.mech.MaxStress ? 0 : 1) +
        this.destroyedWeapons.length +
        this.destroyedSystems.length
      )
    },
  },
  methods: {
    progress(): number {
      return (
        ((normalize(this.mech.CurrentHP, this.mech.MaxHP) +
          normalize(
            this.loadout.Weapons.length - this.destroyedWeapons.length,
            this.loadout.Weapons.length
          ) *
            3 +
          normalize(
            this.loadout.Systems.length - this.destroyedSystems.length,
            this.loadout.Systems.length
          ) *
            3 +
          normalize(this.mech.CurrentStructure, this.mech.MaxStructure) * 10 +
          normalize(this.mech.CurrentStress, this.mech.MaxStress) * 8) /
          24) *
        100
      )
    },
    startRest() {
      this.rest = true
      this.pilot.CurrentHP += Math.ceil(this.pilot.MaxHP / 2)
      this.mech.CurrentHeat = 0
      this.mech.Conditions.splice(0, this.mech.Conditions.length)
      this.mech.Statuses.splice(0, this.mech.Statuses.length)
    },
    healHP() {
      this.mech.CurrentHP = this.mech.MaxHP
      this.mech.CurrentRepairs -= 1
    },
    healStructure() {
      this.mech.CurrentStructure += 1
      this.mech.CurrentRepairs -= this.isEverest ? 1 : 2
    },
    healStress() {
      this.mech.CurrentStress = this.mech.MaxStress
      this.mech.CurrentRepairs -= 2
    },
    repairSystem(w: MechEquipment) {
      w.Repair()
      this.mech.CurrentRepairs -= 1
    },
    repairDestroyed() {
      this.mech.CurrentRepairs -= this.selfRepair
      this.mech.Repair()
    },
    startCombat() {
      this.rest = false
      this.$emit('restart')
    },
    endMission() {
      this.rest = false
      this.$emit('end')
    },
  },
})
</script>
