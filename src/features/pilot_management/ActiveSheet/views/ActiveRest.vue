<template>
  <div>
    <v-row align="start" class="mb-n3">
      <v-col>
        <span class="heading mech" style="line-height: 5px">{{ pilot.Callsign }}</span>
        <div class="flavor-text subtle--text">{{ pilot.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-right mr-2 mt-n2">
        <span class="heading h3 accent--text">HP</span>
        <b>
          <cc-tick-bar
            small
            no-pips
            flip-input
            :current="pilot.CurrentHP"
            :max="pilot.MaxHP"
            @update="pilot.CurrentHP = $event"
          ></cc-tick-bar>
        </b>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Armor</div>
        <div class="font-weight-bold">{{ pilot.Armor }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">E-Defense</div>
        <div class="font-weight-bold">{{ pilot.EDefense }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Evasion</div>
        <div class="font-weight-bold">{{ pilot.Evasion }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Grit</div>
        <div class="font-weight-bold">+{{ pilot.Grit }}</div>
      </v-col>
    </v-row>

    <div v-if="mech.Destroyed || mech.ReactorDestroyed">
      <destroyed-alert :mech="mech" />
      <div v-if="mech.ReactorDestroyed">
        <p class="heading h3 accent--text text-center pt-4">
          This mech cannot be repaired and must be reprinted.
        </p>
      </div>
      <div v-else class="ma-3 panel clipped pt-3 px-6 text-center ">
        <v-alert color="warning" outlined border="top" class="mb-2">
          <div class="body-text text--text">
            This mech can be repaired to working order by spending
            <b class="accent--text">4</b>
            repair points. These repairs can be spent from this mech’s own pool or the pools of any
            pilots that wish to contribute, in any combination.
          </div>
        </v-alert>
        <div class="subtle--text mt-2">
          REPAIR CAPACITY REMAINING:
          <b class="accent--text">{{ mech.CurrentRepairs }}</b>
        </div>
        <div>
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
        </div>
        <div class="heading h3 mt-2 text-left">REPAIR POINTS</div>
        <v-slider
          v-model="selfRepair"
          :max="Math.min(mech.CurrentRepairs, 4)"
          step="1"
          thumb-label
          ticks="always"
          tick-size="6"
          track-color="active"
          track-fill-color="success"
        />
        <div class="heading h3 mt-2 text-left">ALLY REPAIR POINTS</div>
        <v-slider
          v-model="allyRepair"
          step="1"
          :max="4 - selfRepair"
          ticks="always"
          thumb-label
          tick-size="6"
          track-color="active"
          track-fill-color="success"
        />
        <v-btn
          tile
          color="success darken-1"
          x-large
          dark
          class="mb-4 mt-n1"
          :disabled="selfRepair + allyRepair < 4"
          @click="pilot.State.RepairDestroyed(selfRepair)"
        >
          <v-icon x-large left>cci-repair</v-icon>
          &nbsp; Repair Mech
        </v-btn>
      </div>
    </div>
    <v-divider class="my-4" />
    <span v-if="!mech.Destroyed && !mech.ReactorDestroyed" class="overline">
      FIELD REPAIR INTERFACE
      <v-btn small right icon class="fadeSelect" @click="showRepair = !showRepair">
        <v-icon small v-html="showRepair ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
      </v-btn>
    </span>
    <v-container
      v-if="!mech.Destroyed && !mech.ReactorDestroyed && showRepair"
      class="panel clipped mb-6 mt-n1"
    >
      <v-row dense class="px-3">
        <v-col>
          <p class="caption flavor-text subtle--text pb-0 mb-0">
            //[COMP/CON: COMBAT OPERATIONS COMPLETE
            <br />
            DISCONNECTING PILOT SENSORIUM ... done
            <br />
            UPLOADING BATTLEFIELD TELEMETRY ... done
            <br />
            RUNNING FRAME DIAGNOSTIC SUITE ... done ]
            <br />
            <span class="overline stark--text">
              {{ mech.Frame.Source }} {{ mech.Frame.Name }} DIAGNOSTICS COMPLETE
            </span>
          </p>
          <p class="flavor-text subtle--text mb-0">
            >//[
            <span class="accent--text">COMP/CON</span>
            <span class="text--text">
              Lancer, I have detected
              <b class="accent--text">{{ issues }}</b>
              issue{{ issues === 1 ? '' : 's' }} requiring your attention:
            </span>
            ]
          </p>
        </v-col>
        <v-col>
          <div class="text-center mb-1">
            <span class="heading h3">
              REPAIR CAPACITY REMAINING:
              <b class="accent--text heading h2">{{ mech.CurrentRepairs }}</b>
            </span>
            <br />
            <span>
              <v-icon v-for="n in mech.CurrentRepairs" :key="'rep_' + n" large>cci-repair</v-icon>
              <v-icon
                v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
                :key="'repcap_' + n"
                large
                color="grey"
                style="opacity: 0.4"
              >
                mdi-hexagon-outline
              </v-icon>
            </span>
          </div>
          <div>
            <span class="overline">
              <cc-slashes />
              {{ mech.Frame.Source }} {{ mech.Frame.Name }} "{{ mech.Name }}"
            </span>
            <v-progress-linear
              class="pa-0 mt-0 mb-2"
              :value="progress"
              color="blue darken-3"
              background-color="red darken-4"
              height="10"
            />
          </div>
        </v-col>
      </v-row>

      <v-row dense class="px-3">
        <v-col class="text-center flavor-text background">
          <span v-if="mech.CurrentHP === mech.MaxHP" class="stark--text">
            > NO DAMAGE DETECTED
          </span>
          <b v-else class="warning--text">WARNING: DAMAGE DETECTED</b>
          <br />
          <v-btn
            small
            dark
            tile
            outlined
            color="secondary"
            :disabled="!mech.CurrentRepairs"
            @click="pilot.State.RepairHP()"
          >
            Repair
            <v-icon right>control_point</v-icon>
          </v-btn>
        </v-col>

        <v-col class="text-center flavor-text background">
          <span v-if="mech.CurrentStructure === mech.MaxStructure" class="stark--text">
            > STRUCTURAL INTEGRITY NOMINAL
          </span>
          <b v-else class="error--text">CRITICAL: STRUCTURE COMPROMISED</b>
          <br />
          <v-btn
            small
            dark
            tile
            outlined
            color="secondary"
            :disabled="isEverest ? !mech.CurrentRepairs : mech.CurrentRepairs < 2"
            @click="pilot.State.RepairStructure()"
          >
            Repair
            <v-icon right>control_point</v-icon>
            <v-icon v-if="!isEverest" right>control_point</v-icon>
          </v-btn>
        </v-col>

        <v-col class="text-center flavor-text background">
          <span v-if="mech.CurrentStress === mech.MaxStress" class="stark--text">
            > REACTOR INTEGRITY NOMINAL
          </span>
          <b v-else class="error--text">CRITICAL: REACTOR COMPROMISED</b>
          <br />
          <v-btn
            small
            dark
            tile
            outlined
            color="secondary"
            :disabled="mech.CurrentRepairs < 2"
            @click="pilot.State.RepairStress()"
          >
            Repair
            <v-icon right>control_point</v-icon>
            <v-icon right>control_point</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="px-5">
        <v-col class="text-center flavor-text background">
          <span v-if="!destroyedWeapons.length" class="stark--text">
            > ARMAMENT NOMINAL
          </span>
          <b v-else class="warning--text">WARNING: ARMAMENT DAMAGED</b>
          <br />
          <v-btn
            v-for="w in destroyedWeapons"
            :key="w.ID"
            small
            dark
            tile
            outlined
            color="secondary"
            class="my-0"
            :disabled="!mech.CurrentRepairs"
            @click="pilot.State.RepairSystem(w)"
          >
            Repair {{ w.Name }}
            <v-icon right>control_point</v-icon>
          </v-btn>
        </v-col>

        <v-col class="text-center flavor-text background">
          <span v-if="!destroyedSystems.length" class="stark--text">
            > SYSTEMS NOMINAL
          </span>
          <b v-else class="warning--text">WARNING: SYSTEMS DAMAGED</b>
          <br />
          <v-btn
            v-for="s in destroyedSystems"
            :key="s.ID"
            small
            dark
            tile
            outlined
            class="my-0"
            color="secondary"
            :disabled="!mech.CurrentRepairs"
            @click="pilot.State.RepairSystem(s)"
          >
            Repair {{ s.Name }}
            <v-icon right>control_point</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <div class="mt-2">
      <v-row dense align="center" justify="space-between" class="mt-n3 mx-4">
        <v-col cols="auto">
          <cc-tick-bar
            :key="mech.CurrentStructure"
            :current="mech.CurrentStructure"
            :max="mech.MaxStructure"
            large
            color="structure"
            full-icon="cci-structure"
            :class="{ rolledOver: structRollover }"
            @update="mech.CurrentStructure = $event"
          >
            <span class="heading h3">
              Structure
            </span>
          </cc-tick-bar>
        </v-col>
        <v-col cols="auto">
          <cc-tick-bar
            :key="mech.CurrentStress"
            :current="mech.CurrentStress"
            :max="mech.MaxStress"
            large
            color="stress"
            full-icon="cci-reactor"
            :class="{ rolledOver: stressRollover }"
            @update="mech.CurrentStress = $event"
          >
            <span class="heading h3">Reactor</span>
          </cc-tick-bar>
        </v-col>
        <v-col cols="auto">
          <cc-tick-bar
            :key="mech.CurrentHP"
            :current="mech.CurrentHP"
            :max="mech.MaxHP"
            large
            color="hp"
            :full-icon="hpResistance ? 'mdi-octagram' : 'mdi-hexagon'"
            max-length="25"
            @update="mech.CurrentHP = $event"
          >
            <span class="heading h3">HP</span>
          </cc-tick-bar>
        </v-col>
        <v-col cols="auto">
          <cc-tick-bar
            :key="mech.CurrentRepairs"
            :current="mech.CurrentRepairs"
            :max="mech.RepairCapacity"
            large
            color="repcap"
            full-icon="cci-repair"
            @update="mech.CurrentRepairs = $event"
          >
            <span class="heading h3">
              REPAIR CAPACITY
            </span>
          </cc-tick-bar>
        </v-col>
      </v-row>
    </div>

    <active-mode-loadout :mech="mech" />
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import ActiveModeLoadout from '../layout/ActiveModeLoadout.vue'

function normalize(current, max): number {
  if (!max) return 1
  return current / max
}

export default vueMixins(activePilot).extend({
  name: 'active-rest',
  components: { ActiveModeLoadout },
  data: () => ({
    rest: false,
    diagNumber: 0,
    selfRepair: 0,
    allyRepair: 0,
    showRepair: true,
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
  },
})
</script>
