<template>
  <div>
    <v-row column fill-height>
      <div v-if="mech.IsDestroyed">
        <destroyed-alert :mech="mech" />
        <div v-if="mech.ReactorDestroyed">
          <p class="effect-text text-center pt-4">
            This mech cannot be repaired and must be reprinted.
          </p>
        </div>
        <div v-else>
          <v-col cols="12" class="text-center mt-3 mb-3">
            <span class="grey--text">
              REPAIR CAPACITY REMAINING:
              <b :style="`color: ${color.repcap.dark}`">{{ mech.CurrentRepairs }}</b>
            </span>
            <br />
            <span>
              <v-icon large v-for="n in mech.CurrentRepairs" :key="'rep_' + n">
                control_point
              </v-icon>
              <v-icon
                large
                color="grey darken-1"
                v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
                :key="'repcap_' + n"
              >
                mdi-circle-outline
              </v-icon>
            </span>
          </v-col>
          <v-divider dark class="ma-2" />
          <v-card color="grey darken-2" class="mb-2">
            <v-card-text>
              This mech can be repaired to working order by spending 4 repair points. These repairs
              can be spent from this mech’s own pool or the pools of any pilots that wish to
              contribute, in any combination.
            </v-card-text>
          </v-card>
          <span class="grey--text">REPAIR POINTS</span>
          <v-slider
            v-model="selfRepair"
            :max="mech.CurrentRepairs > 4 ? 4 : mech.CurrentRepairs"
            step="1"
            thumb-label
            ticks="always"
            tick-size="6"
          ></v-slider>
          <span class="grey--text">ALLY REPAIR POINTS</span>
          <v-slider
            v-model="allyRepair"
            step="1"
            :max="4 - selfRepair"
            ticks="always"
            thumb-label
            tick-size="6"
          ></v-slider>
          <br />
          <v-btn
            block
            color="success"
            large
            dark
            @click="repairDestroyed"
            :disabled="selfRepair + allyRepair < 4"
          >
            Repair Mech
          </v-btn>
        </div>
      </div>
      <div v-else>
        <v-col cols="12" class="heading h2 text-center" style="background: #33691E">
          <span>RESTING</span>
        </v-col>
        <v-col cols="12" class="text-center mt-3 mb-3">
          <span class="grey--text">
            REPAIR CAPACITY REMAINING:
            <b :style="`color: ${color.repcap.dark}`">{{ mech.CurrentRepairs }}</b>
          </span>
          <br />
          <span>
            <v-icon large v-for="n in mech.CurrentRepairs" :key="'rep_' + n">control_point</v-icon>
            <v-icon
              large
              color="grey darken-1"
              v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
              :key="'repcap_' + n"
            >
              mdi-circle-outline
            </v-icon>
          </span>
        </v-col>
        <v-col cols="12" class="text-xs-right">
          <span class="caption">
            {{ mech.Frame.Source }} {{ mech.Frame.Name }} DIAGNOSTICS COMPLETE
          </span>
          <v-progress-linear
            class="pa-0 mt-0 mb-2"
            :value="progress()"
            color="blue darken-3"
            background-color="red darken-4"
            height="10"
          />
        </v-col>
        <v-col cols="12" class="text-xs-left">
          <span v-if="mech.CurrentHP === mech.MaxHP" class="heading h3 grey--text">
            >:// HP NOMINAL
          </span>
          <v-row v-elsewrap>
            <span class="heading h3 orange--text">>:// WARNING: DAMAGE DETECTED</span>
            <v-col class="mr-4 ml-2">
              <v-btn
                block
                light
                :color="color.hp.dark"
                @click="healHP"
                :disabled="!this.mech.CurrentRepairs"
              >
                Recover HP
              </v-btn>
            </v-col>
            <v-col class="text-center" cols="2">
              <v-icon large class="mt-2">control_point</v-icon>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="text-xs-left">
          <span v-if="mech.CurrentStructure === mech.MaxStructure" class="heading h3 grey--text">
            >:// STRUCTURAL INTEGRITY NOMINAL
          </span>
          <v-row v-elsewrap>
            <span class="heading h3 red--text">>:// CRITICAL: STRUCTURE COMPROMISED</span>
            <v-col class="mr-4 ml-2">
              <v-btn
                block
                :color="color.structure.dark"
                @click="healStructure"
                :disabled="
                  mech.Frame.Name.toLowerCase() === 'everest'
                    ? !mech.CurrentRepairs
                    : mech.CurrentRepairs < 2
                "
              >
                Repair Structure
              </v-btn>
            </v-col>
            <v-col cols="2" class="text-center" v-if="mech.Frame.Name.toLowerCase() === 'everest'">
              <v-icon large class="mt-2">control_point</v-icon>
            </v-col>
            <v-col cols="2" class="text-center" v-else>
              <v-icon large class="mt-2">control_point</v-icon>
              <v-icon large class="mt-2">control_point</v-icon>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="text-xs-left">
          <span v-if="mech.CurrentStress === mech.MaxStress" class="heading h3 grey--text">
            >:// REACTOR STRESS NOMINAL
          </span>
          <v-row v-elsewrap>
            <span class="heading h3 red--text">>:// CRITICAL: REACTOR DAMAGED</span>
            <v-col grow class="mr-4 ml-2">
              <v-btn
                block
                :color="color.stress.dark"
                @click="healStress"
                :disabled="this.mech.CurrentRepairs < 2"
              >
                Repair Reactor
              </v-btn>
            </v-col>
            <v-col cols="2" class="text-center">
              <v-icon large class="mt-2">control_point</v-icon>
              <v-icon large class="mt-2">control_point</v-icon>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="text-xs-left">
          <span v-if="!destroyedWeapons.length" class="heading h3 grey--text">
            >:// ARMAMENT NOMINAL
          </span>
          <div v-else>
            <v-row>
              <span class="heading h3 red--text">>:// WARNING: ARMAMENT DAMAGED</span>
            </v-row>
            <v-row v-for="w in destroyedWeapons" :key="w.ID">
              <v-col class="mr-4">
                <v-btn
                  block
                  :color="color.weapon.dark"
                  @click="repairSystem(w)"
                  :disabled="!mech.CurrentRepairs"
                >
                  Repair {{ w.Name }}
                </v-btn>
              </v-col>
              <v-col cols="2" class="text-center">
                <v-icon large class="mt-2">control_point</v-icon>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" class="text-xs-left">
          <span v-if="!destroyedSystems.length" class="heading h3 grey--text">
            >:// SYSTEMS NOMINAL
          </span>
          <div v-else>
            <v-row>
              <span class="heading h3 red--text">>:// WARNING: EQUIPMENT DAMAGED</span>
            </v-row>
            <v-row v-for="s in destroyedSystems" :key="s.ID">
              <v-col class="mr-4">
                <v-btn
                  block
                  color="teal darken-3"
                  @click="repairSystem(s)"
                  :disabled="!mech.CurrentRepairs"
                >
                  Repair {{ s.Name }}
                </v-btn>
              </v-col>
              <v-col cols="2" class="text-center">
                <v-icon large class="mt-2">control_point</v-icon>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </div>
    </v-row>
    <v-divider class="ma-2" />
    <v-row wrap>
      <v-col cols="12">
        <v-btn block color="amber darken-4" dark @click="startCombat">Enter Combat</v-btn>
      </v-col>
      <v-col cols="12">
        <v-btn large block color="green darken-4" dark @click="endMission">Complete Mission</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import TickBar from '../../../components/UI/TickBar.vue'
import colors from '@/features/_shared/UI/CCColors'
import { MechEquipment } from '@/class'

function normalize(current, max): number {
  return current / max
}

export default Vue.extend({
  name: 'rest-manager',
  // components: { TickBar },
  props: {
    mech: Object,
    loadout: Object,
  },
  data: () => ({
    rest: false,
    selfRepair: 0,
    allyRepair: 0,
  }),
  computed: {
    color() {
      return colors
    },
    destroyedWeapons() {
      return this.loadout.Weapons.filter(x => x.IsDestroyed)
    },
    destroyedSystems() {
      return this.loadout.Systems.filter(x => x.IsDestroyed)
    },
  },
  methods: {
    progress(): number {
      return (
        ((normalize(this.mech.CurrentHP, this.mech.MaxHP) +
          normalize(
            this.loadout.Weapons.length - this.destroyedWeapons.length,
            this.loadout.Weapons.length
          ) +
          normalize(
            this.loadout.Systems.length - this.destroyedSystems.length,
            this.loadout.Systems.length
          ) +
          normalize(this.mech.CurrentStructure, this.mech.MaxStructure) +
          normalize(this.mech.CurrentStress, this.mech.MaxStress)) /
          5) *
        100
      )
    },
    startRest() {
      this.rest = true
      const pilot = this.$store.getters.getPilot
      pilot.CurrentHP += Math.ceil(pilot.MaxHP / 2)
      this.mech.CurrentHeat = 0
      this.mech.Conditions.splice(0, this.mech.Conditions.length)
      this.mech.Statuses.splice(0, this.mech.Statuses.length)
    },
    healHP() {
      this.mech.CurrentHP = this.mech.MaxHP
      this.mech.CurrentRepairs -= 1
    },
    healStructure() {
      this.mech.CurrentStructure = this.mech.MaxStructure
      this.mech.CurrentRepairs -= this.mech.Frame.Name.toLowerCase() === 'everest' ? 1 : 2
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
