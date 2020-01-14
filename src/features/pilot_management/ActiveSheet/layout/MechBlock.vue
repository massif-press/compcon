<template>
  <div>
    <cc-stress-table ref="stressTable" :mech="mech" />
    <cc-structure-table ref="structureTable" :mech="mech" />

    <div v-if="!mech" class="ma-5">
      <div v-if="!pilot.Mechs.length">
        <v-alert type="error" prominent>
          <span class="heading h3">No Saved Mech Configurations</span>
          <br />
        </v-alert>
      </div>
      <div v-else class="ma-5">
        <v-alert value="visible" type="warning" class="mb-3 effect-text">
          <span class="heading h3">No Active Mech Detected</span>
        </v-alert>
        <mech-select-button big :mechs="pilot.Mechs" @select="pilot.ActiveMech = $event" />
      </div>
    </div>
    <div v-else>
      <v-row dense>
        <v-col>
          <span class="heading mech" style="line-height: 15px">{{ mech.Name }}</span>
          <div class="flavor-text grey--text">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>
        </v-col>
        <v-col cols="auto" class="ml-auto mr-2">
          <mech-select-button :mechs="pilot.Mechs" @select="pilot.ActiveMech = $event" />
        </v-col>
      </v-row>

      <cc-mech-status-alert
        v-for="s in mech.StatusString"
        :key="`status-${s}`"
        :type="s"
        critical-only
        @clear-ejected="mech.Ejected = false"
        @clear-status="mech.Repair()"
      />

      <v-row justify="space-between" dense>
        <v-col cols="3">
          <cc-status-select
            label="Statuses"
            :items="statuses"
            :model="mech.Statuses"
            dark
            color="deep-orange darken-1"
            @set="mech.Statuses = $event"
          />
        </v-col>
        <v-col cols="3">
          <cc-status-select
            label="Conditions"
            :items="conditions"
            :model="mech.Conditions"
            dark
            color="red darken-2"
            @set="mech.Conditions = $event"
          />
        </v-col>
        <v-col cols="3">
          <cc-status-select
            label="Resistances"
            :items="resistances"
            :model="mech.Resistances"
            dark
            color="blue darken-2"
            @set="mech.Resistances = $event"
          />
        </v-col>

        <v-col cols="auto" class="ml-auto mr-3">
          <v-text-field
            v-model="mech.Burn"
            type="number"
            append-outer-icon="add"
            append-icon="mdi-fire"
            prepend-icon="remove"
            style="width: 115px"
            class="hide-input-spinners"
            hint="BURN"
            persistent-hint
            dense
            @click:append-outer="mech.Burn += 1"
            @click:prepend="mech.Burn -= 1"
            @change="mech.Burn = parseInt($event)"
          />
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-n3">
        <v-col cols="2" class="mr-n6">
          <cc-tick-bar
            :key="mech.CurrentStructure"
            :current="mech.CurrentStructure"
            :max="mech.MaxStructure"
            large
            color="structure"
            full-icon="cci-structure"
            :class="{ rolledOver: structRolledOver }"
            @update="mech.CurrentStructure = $event"
          >
            <span class="heading h3">
              Structure: {{ mech.CurrentStructure }}/{{ mech.MaxStructure }}
            </span>
          </cc-tick-bar>
        </v-col>
        <v-col v-if="mech.Armor" cols="auto" class="mx-1">
          <cc-tick-bar
            :key="mech.Armor"
            :current="mech.Armor"
            :max="mech.Armor"
            large
            color="armor"
            full-icon="mdi-shield"
            readonly
          >
            <span class="heading h3">Armor: {{ mech.Armor }}</span>
          </cc-tick-bar>
        </v-col>
        <v-col cols="auto" class="ml-1">
          <cc-tick-bar
            :key="mech.CurrentHP"
            :current="mech.CurrentHP"
            :max="mech.MaxHP"
            large
            color="hp"
            :full-icon="hpResistance ? 'mdi-octagram' : 'mdi-hexagon'"
            rollover
            @update="mech.CurrentHP = $event"
            @rollover="onHpRollover"
          >
            <span class="heading h3">HP: {{ mech.CurrentHP }}/{{ mech.MaxHP }}</span>
          </cc-tick-bar>
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-menu offset-y offset-x top nudge-left="30px">
            <template v-slot:activator="{ on }">
              <v-btn large icon class="fadeSelect" v-on="on">
                <v-icon x-large>cci-repair</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="text-center flavor-text">
                <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
                <br />
                //[COMP/CON:
                <b class="black--text">
                  Lancer, this will
                  <span class="primary--text">fully repair and recharge this mech.</span>
                  Do you want to continue?
                </b>
                ]
                <v-divider class="my-2" />
                <v-row dense>
                  <v-btn small text>DENY</v-btn>
                  <cc-btn small color="error" class="ml-auto" @click="mech.FullRepair()">
                    CONFIRM
                  </cc-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="2" class="mr-n6">
          <cc-tick-bar
            :key="mech.CurrentStress"
            :current="mech.CurrentStress"
            :max="mech.MaxStress"
            large
            color="stress"
            full-icon="cci-reactor"
            :class="{ rolledOver: stressRolledOver }"
            @update="mech.CurrentStress = $event"
          >
            <span class="heading h3">Reactor: {{ mech.CurrentStress }}/{{ mech.MaxStress }}</span>
          </cc-tick-bar>
        </v-col>
        <v-col class="mr-4">
          <cc-tick-bar
            :key="mech.CurrentHeat"
            :current="mech.CurrentHeat"
            :max="mech.HeatCapacity"
            large
            :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
            :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
            rollover-negative
            clearable
            @update="mech.CurrentHeat = $event"
            @rollover="onHeatRollover"
          >
            <span v-if="mech.IsInDangerZone" class="dangerzone--text heading h3">
              HEAT: {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
            </span>
            <span v-else class="heading h3">
              HEAT: {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
            </span>
          </cc-tick-bar>
          <div
            v-if="mech.IsInDangerZone"
            class="caption font-weight-bold dangerzone--text text-center"
          >
            // ALERT::HEAT LEVELS CRITICAL //
          </div>
          <div v-else class="caption grey--text text-center">
            HEAT LEVELS NOMINAL
          </div>
        </v-col>
        <v-col>
          <cc-tick-bar
            :key="mech.CurrentRepairs"
            :current="mech.CurrentRepairs"
            :max="mech.RepairCapacity"
            large
            color="repcap"
            full-icon="control_point"
            @update="mech.CurrentRepairs = $event"
          >
            <span class="heading h3">
              REPAIR CAPACITY: {{ mech.CurrentRepairs }}/{{ mech.RepairCapacity }}
            </span>
          </cc-tick-bar>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <cc-tick-bar
            :key="mech.CurrentCoreEnergy"
            :current="mech.CurrentCoreEnergy"
            :max="1"
            large
            no-input
            clearable
            color="corepower"
            class="text-center"
            empty-icon="mdi-battery-10"
            full-icon="mdi-battery"
            @update="mech.CurrentCoreEnergy = $event"
          >
            <span class="heading h3">CORE POWER</span>
          </cc-tick-bar>
          <div
            v-if="mech.CurrentCoreEnergy"
            class="text-center caption font-weight-bold corepower--text"
          >
            AVAILABLE
          </div>
          <div v-else class="text-center caption grey--text">
            EXHAUSTED
          </div>
        </v-col>
        <v-col cols="auto">
          <cc-tick-bar
            :key="mech.CurrentOvercharge"
            :current="mech.CurrentOvercharge"
            :max="3"
            large
            no-input
            clearable
            color="overcharge"
            full-icon="mdi-alert-decagram"
            class="text-center"
            @update="mech.CurrentOvercharge = $event"
          >
            <span class="heading h3">
              Overcharge
            </span>
          </cc-tick-bar>
          <div class="text-center caption overcharge--text font-weight-bold">
            {{ overcharge[mech.CurrentOvercharge] }}
          </div>
        </v-col>
      </v-row>

      <v-row dense align="center">
        <v-col cols="auto" class="flavor-text mr-2 ml-2 mt-n2">
          <span class="heading h2">{{ pilot.MechSkills.Hull }}</span>
          <span>//HULL</span>
          <br />
          <span class="heading h2">{{ pilot.MechSkills.Agi }}</span>
          <span>//AGI</span>
          <br />
          <span class="heading h2">{{ pilot.MechSkills.Sys }}</span>
          <span>//SYS</span>
          <br />
          <span class="heading h2">{{ pilot.MechSkills.Eng }}</span>
          <span>//ENG</span>
          <br />
        </v-col>
        <v-col>
          <v-row>
            <cc-active-card color="frame" header="Speed" :content="mech.Speed" />
            <cc-active-card color="frame" header="Attack Bonus" :content="`+${mech.AttackBonus}`" />
            <cc-active-card color="frame" header="Tech Attack" :content="`+${mech.TechAttack}`" />
          </v-row>
          <v-row>
            <cc-active-card
              color="frame"
              header="Evasion"
              :content="mech.IsStunned ? 5 : mech.Evasion"
            />
            <cc-active-card color="frame" header="E-Defense" :content="mech.EDefense" />
            <cc-active-card color="frame" header="Save Target" :content="mech.SaveTarget" />
            <cc-active-card color="frame" header="Sensor Range" :content="mech.SensorRange" />
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-icon size="120" color="frame">cci-size-{{ mech.Size }}</v-icon>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="4">
          <cc-active-card
            v-for="(trait, i) in mech.Frame.Traits"
            :key="`tr_${i}`"
            color="frame"
            :header="trait.name"
            subheader="FRAME TRAIT"
          >
            <span v-html="trait.description" />
          </cc-active-card>
        </v-col>
        <v-col cols="8">
          <cc-active-card
            color="corepower"
            :header="mech.Frame.CoreSystem.Name"
            subheader="CORE SYSTEM"
            style="height: 100%"
          >
            <div v-if="mech.Frame.CoreSystem.PassiveName">
              <span class="heading h2">
                {{ mech.Frame.CoreSystem.PassiveName }}
                <span class="pt-2 ml-2 caption grey--text">(PASSIVE)</span>
              </span>
              <p class="mb-1" v-html="mech.Frame.CoreSystem.PassiveEffect" />
              <br><br>
            </div>
            <span class="heading h2">
              {{ mech.Frame.CoreSystem.ActiveName }}
              <span class="pt-2 ml-2 caption grey--text">(ACTIVE)</span>
            </span>
            <p class="mb-1" v-html="mech.Frame.CoreSystem.ActiveEffect" />
            <cc-tags :tags="mech.Frame.CoreSystem.Tags" color="corepower" />
          </cc-active-card>
        </v-col>
      </v-row>

      <cc-mech-loadout :mech="mech" readonly />
    </div>
  </div>
</template>

<script lang="ts">
import { Mech, MechLoadout } from '@/class'
import MechSelectButton from '../components/MechSelectButton.vue'

import Vue from 'vue'
export default Vue.extend({
  name: 'mech-block',
  components: { MechSelectButton },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tabs: 0,
    burn: 0,
    overcharge: [' +1 ', ' +1d3 ', ' +1d6 ', '+1d6+4'],
    resistances: [
      { name: 'Kinetic', color: 'kinetic' },
      { name: 'Energy', color: 'energy' },
      { name: 'Explosive', color: 'explosive' },
      { name: 'Heat', color: 'heat' },
      { name: 'Burn', color: 'burn' },
      { name: 'All', color: 'variable' },
      { name: 'Next Attack', color: 'overcharge' },
    ],
    structRolledOver: false,
    stressRolledOver: false,
  }),
  computed: {
    mech(): Mech {
      return this.pilot.ActiveMech || null
    },
    loadout(): MechLoadout {
      return this.mech.ActiveLoadout
    },
    statuses(): string[] {
      return this.$store.getters.getItemCollection('Statuses').filter(x => x.type === 'Status')
    },
    conditions(): string[] {
      return this.$store.getters.getItemCollection('Statuses').filter(x => x.type === 'Condition')
    },
    hpResistance(): boolean {
      if (this.mech.Resistances.length === 1 && this.mech.Resistances[0] === 'Heat') return false
      return this.mech.Resistances.length
    },
    hpColor(): string {
      if (this.mech.Resistances.length) {
        if (this.mech.Resistances.length === 1) {
          const c = this.resistances
            .find(x => x.name === this.mech.Resistances[0])
            .name.toLowerCase()
          if (c === 'heat') return 'heat'
          return 'overcharge'
        }
        return 'variable--damage'
      }
      return 'hp'
    },
  },
  methods: {
    onHpRollover() {
      if (this.mech.CurrentStructure <= 1) {
        this.$nextTick(() => {
          this.mech.CurrentHP = 0
        })
      }
      this.mech.CurrentStructure = this.mech.CurrentStructure - 1
      if (this.mech.CurrentStructure < 0) this.mech.CurrentStructure = 0
      this.structRolledOver = true
      setTimeout(() => {
        this.structRolledOver = false
        this.$refs.structureTable.show()
      }, 500)
    },
    onHeatRollover() {
      if (this.mech.CurrentStress <= 1) {
        this.$nextTick(() => {
          this.mech.CurrentHeat = this.mech.MaxHeat
        })
      }
      this.mech.CurrentStress = this.mech.CurrentStress - 1
      if (this.mech.CurrentStress < 0) this.mech.CurrentStress = 0
      this.stressRolledOver = true
      setTimeout(() => {
        this.stressRolledOver = false
        this.$refs.stressTable.show()
      }, 500)
    },
  },
})
</script>

<style>
.rolledOver * {
  animation-name: rollover;
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}

@keyframes rollover {
  0% {
    color: red;
  }
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
  100% {
    color: inherit;
  }
}
</style>
