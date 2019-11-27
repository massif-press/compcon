<template>
  <v-container fluid>
    <!-- <turn-sidebar
      :mech="mech"
      :loadout="loadout"
      :pilot="pilot"
      @downtime="setDtPanels()"
      @combat="setCombatPanels()"
    /> -->
    <div style="height: 40px" />
    <v-row>
      <v-col class="major-title  pt-1">
        <span>{{ pilot.Callsign }}</span>
        <span class="caption grey--text">{{ pilot.Name }}</span>
      </v-col>
      <v-col>
        <tick-bar
          small
          label="HP"
          :key="pilot.CurrentHP"
          :current="pilot.CurrentHP"
          :max="pilot.MaxHP"
          color="hp"
          @update="pilot.CurrentHP = $event"
        />
      </v-col>
      <v-col>
        <span class="grey--text">ARMOR</span>
        <br />
        <span class="minor-title ">{{ pilot.Armor }}</span>
      </v-col>
      <v-col>
        <span class="grey--text">E-DEFENSE</span>
        <br />
        <span class="minor-title ">{{ pilot.EDefense }}</span>
      </v-col>
      <v-col>
        <span class="grey--text">EVASION</span>
        <br />
        <span class="minor-title ">{{ pilot.Evasion }}</span>
      </v-col>
    </v-row>
    <cc-pilot-loadout :pilot="pilot" readonly />

    <v-divider class="ma-2" />

    <!-- <v-expansion-panel expand dark class="mt-2" v-model="skillsPanel">
        <v-expansion-panel-content
          expand-icon="keyboard_arrow_down"
          ripple
          style="background-color: #616161"
        >
          <span slot="header" class="minor-title">Pilot Skills</span>
          <v-row wrap justify="center">
            <pilot-skill-card v-for="(s, i) in pilot.Skills" :key="`p_skill_${i}`" :pSkill="s" />
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel
        expand
        dark
        class="mt-2"
        :disabled="!pilot.Reserves.length"
        v-model="reservesPanel"
      >
        <v-expansion-panel-content
          expand-icon="keyboard_arrow_down"
          ripple
          style="background-color: #616161"
        >
          <span slot="header" class="minor-title">
            Reserves {{ pilot.Reserves.length + pilot.Organizations.length > 0 ? '' : ' (NONE) ' }}
          </span>
          <v-row wrap fill-height>
            <v-col cols="6" v-for="(r, i) in pilot.Reserves.filter(x => !x.Used)" :key="`res_${i}`">
              <div class="mr-1" style="height: 95%">
                <active-card :color="reserveColor(r)" :header="`${r.Name}`" subheader="RESERVE">
                  <p v-if="r.ResourceName" class="font-weight-bold pa-1 ma-1">
                    {{ r.ResourceName }}
                  </p>
                  <p v-if="r.Note" class="ml-2">{{ r.Note }}</p>
                  <span v-if="!r.ResourceName || !r.Note">{{ r.Description }}</span>
                  <v-alert type="warning" :value="r.ResourceCost" outlined>
                    <span v-html="r.ResourceCost" />
                  </v-alert>
                </active-card>
              </div>
            </v-col>

            <v-col cols="6" v-for="(o, i) in pilot.Organizations" :key="`org_${i}`">
              <div class="mr-1" style="height: 95%">
                <active-card color="#673AB7" :header="`${o.Name}`" subheader="ORGANIZATION">
                  <b class="ml-2">{{ o.Purpose }}</b>
                  <p v-if="o.Description" class="font-weight-bold pa-1 ma-1">{{ o.Description }}</p>
                  <p class="minor-title text-center">
                    {{ o.Efficiency }} Efficiency &emsp;&emsp; {{ o.Influence }} Influence
                  </p>
                  <v-alert type="warning" :value="o.Actions" outlined>
                    <span>This organization must take the following action: {{ o.Actions }}</span>
                  </v-alert>
                </active-card>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel> -->

    <!-- <v-expansion-panel expand dark class="mt-2">
        <v-expansion-panel-content
          expand-icon="keyboard_arrow_down"
          ripple
          style="background-color: #616161"
        >
          <span slot="header" class="minor-title">Pilot Traits</span>
          <v-row wrap>
            <v-col cols="12" v-for="(talent, i) in pilot.Talents" :key="`tal_${i}`">
              <active-card
                color="#616161"
                :header="`${talent.Talent.Name} ${'I'.repeat(talent.Rank)}`"
                subheader="PILOT TALENT"
              >
                <ul v-for="n in 3" :key="'talent_' + n">
                  <li v-if="talent.Rank >= n">
                    <span v-html="talent.Talent.Ranks[n - 1].description" />
                  </li>
                </ul>
              </active-card>
            </v-col>
          </v-row>
          <v-divider dark class="ma-2" />
          <v-row>
            <v-col cols="4" v-for="(bonus, i) in pilot.CoreBonuses" :key="`cb_${i}`">
              <active-card color="#616161" :header="bonus.Name" subheader="CORE BONUS">
                <span v-html="bonus.effect" />
              </active-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel> -->

    <div v-if="!mech" class="ma-5">
      <div v-if="!pilot.Mechs.length">
        <v-alert value="value" type="error" class="mb-3 effect-text">
          <span class="minor-title">No Saved Mech Configurations</span>
          <br />
        </v-alert>
        <v-btn block large color="primary" dark to="/hangar">To Mech Hangar</v-btn>
      </div>
      <div v-else class="ma-5">
        <v-alert value="visible" type="warning" class="mb-3 effect-text">
          <span class="minor-title">No Active Mech Detected</span>
        </v-alert>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn block large color="primary" dark v-on="on">Select Active Mech</v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="(mech, index) in pilot.Mechs"
              :key="index"
              @click="pilot.ActiveMech = mech"
            >
              <v-list-tile-content>
                <v-list-tile-title class="text-xs-right font-weight-bold">
                  {{ mech.Name }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="text-xs-right">
                  {{ mech.Frame.Source }} {{ mech.Frame.Name }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div v-else>
      <v-row justify-space-between>
        <v-col class="major-title  pt-1">
          <span>{{ mech.Name }}</span>
          <span class="caption grey--text">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</span>
        </v-col>
        <v-spacer />
        <v-col shrink>
          <v-menu offset-y nudge-left="85px">
            <template v-slot:activator="{ on }">
              <v-btn outlined small dark v-on="on">Change Mech</v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(mech, index) in pilot.Mechs"
                :key="index"
                @click="pilot.ActiveMech = mech"
              >
                {{ mech.Name }}
                {{ mech.Frame.Source }} {{ mech.Frame.Name }}
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <div v-if="mech.IsEjected">
        <v-card-text class="text-center">
          <p class="major-title deep-orange--text pa-3 ma-5" style="background-color:black;">
            PILOT EJECTED
            <v-btn
              small
              absolute
              right
              color="warning"
              outlined
              style="right: 120px"
              @click="mech.IsEjected = false"
            >
              Force Remount
            </v-btn>
          </p>
        </v-card-text>
      </div>
      <div v-else-if="mech.IsDestroyed">
        <v-card-text class="text-center destroyed-bg">
          <p class="major-title red--text pa-3 ma-5" style="background-color:black;">
            MECH DESTROYED
            <span
              v-if="mech.ReactorDestroyed"
              class="title red--text text--accent-3 pa-0 ma-0"
              style="background-color:black;"
            >
              <br />
              REACTOR DESTROYED
            </span>
          </p>
        </v-card-text>
      </div>
      <div v-else>
        <v-row justify-space-between class="ml-4 mr-4">
          <v-col cols="3">
            <v-select
              v-model="mech.Statuses"
              label="Statuses"
              :items="statuses"
              item-text="name"
              multiple
              color="deep-orange darken-1"
              dark
            >
              <template v-slot:selection="{ item, index }">
                <v-tooltip top>
                  <v-chip small slot="activator" color="deep-orange darken-1">
                    <b>{{ item.name }}</b>
                  </v-chip>
                  <div>
                    <ul>
                      <li v-for="e in item.effects" :key="e" v-html="e" />
                    </ul>
                  </div>
                </v-tooltip>
              </template>
            </v-select>
          </v-col>
          <v-spacer />
          <v-col cols="3">
            <v-select
              v-model="mech.Conditions"
              label="Conditions"
              :items="conditions"
              item-text="name"
              color="red darken-2"
              multiple
              dark
            >
              <template v-slot:selection="{ item, index }">
                <v-tooltip top>
                  <v-chip small slot="activator" color="red darken-2">
                    <b>{{ item.name }}</b>
                  </v-chip>
                  <div>
                    <ul>
                      <li v-for="e in item.effects" :key="e" v-html="e" />
                    </ul>
                  </div>
                </v-tooltip>
              </template>
            </v-select>
          </v-col>
          <v-spacer />
          <v-col cols="3">
            <v-select
              v-model="mech.Resistances"
              label="Resistances"
              :items="resistances"
              item-text="name"
              color="blue accent-1"
              multiple
              dark
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2" small slot="activator" :color="item.color">
                  <b>{{ item.name }}</b>
                </v-chip>
                <span v-if="index === 2" class="grey--text caption">
                  (+{{ mech.Resistances.length - 1 }} others)
                </span>
              </template>
            </v-select>
          </v-col>
          <v-spacer />
          <v-col shrink>
            <v-text-field
              v-model="mech.Burn"
              type="number"
              append-outer-icon="add"
              @click:append-outer="mech.Burn += 1"
              prepend-icon="remove"
              @click:prepend="mech.Burn -= 1"
              dark
              style="width: 125px"
              @change="mech.Burn = parseInt($event)"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <v-icon slot="activator" color="damage--burn">mdi-fire</v-icon>
                  <span>Current Burn</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="2" class="mr-2" style="min-width: 200px">
                <tick-bar
                  label="STRUCTURE"
                  :key="'tb' + mech.CurrentStructure"
                  :current="mech.CurrentStructure"
                  :max="mech.MaxStructure"
                  large
                  color="structure"
                  bg-color="pink darken-4"
                  full-icon="cci-structure"
                  mech
                  @update="mech.CurrentStructure = $event"
                  :class="{ rolledOver: structRolledOver }"
                />
                <v-dialog width="60vw" persistent v-model="structureDialog">
                  <structure-table
                    @dismiss="structureDialog = false"
                    :mech="mech"
                    :loadout="loadout"
                    :pilot="pilot"
                  />
                </v-dialog>
              </v-col>
              <v-col>
                <v-row>
                  <tick-bar
                    label="HP"
                    :key="'tb' + mech.CurrentHP"
                    :current="mech.CurrentHP"
                    :max="mech.MaxHP"
                    large
                    color="hp"
                    :full-icon="hpResistance ? 'mdi-octagram' : ''"
                    @update="mech.CurrentHP = $event"
                    rollover
                    @rollover="onHpRollover"
                  />
                  <v-col shrink>
                    <v-rating
                      label="ARMOR"
                      class="d-inline-flex"
                      v-model="mech.Armor"
                      :length="mech.Armor"
                      readonly
                      large
                      dense
                      full-icon="mdi-shield"
                      color="armor"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2" class="text-xs-right ml-4">
                <span class="grey--text">FULL REPAIR&nbsp;</span>
                <v-row justify-end>
                  <v-tooltip left>
                    <v-btn
                      slot="activator"
                      dark
                      fab
                      text
                      class="ma-0 mr-3"
                      @click="mech.FullRepair()"
                    >
                      <v-icon large color="green accent-3">mdi-restore</v-icon>
                    </v-btn>
                    <span>Fully repair and recharge this mech.</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
            <v-divider dark class="mt-2 mb-2" />
            <v-row class="mb-4">
              <v-col shrink class="mr-2" style="min-width: 200px">
                <tick-bar
                  label="REACTOR STRESS"
                  :key="'tb' + mech.CurrentStress"
                  :current="mech.CurrentStress"
                  :max="mech.MaxStress"
                  large
                  color="stress"
                  bg-color="deep-orange darken-4"
                  empty-icon="mdi-circle-outlined"
                  full-icon="cci-reactor-stress"
                  @update="mech.CurrentStress = $event"
                  :class="{ rolledOver: stressRolledOver }"
                />
                <v-dialog width="60vw" persistent v-model="stressDialog">
                  <stress-table
                    @dismiss="stressDialog = false"
                    :mech="mech"
                    :loadout="loadout"
                    :pilot="pilot"
                  />
                </v-dialog>
              </v-col>
              <v-col>
                <tick-bar
                  :label="mech.IsInDangerZone ? 'HEAT // DANGER //' : 'HEAT'"
                  :key="'tb' + mech.CurrentHeat"
                  :current="mech.CurrentHeat"
                  :max="mech.HeatCapacity"
                  large
                  :color="mech.IsInDangerZone ? 'dangerzone' : 'heatcap'"
                  bg-color="red darken-4"
                  :empty-icon="
                    mech.Resistances.includes('Heat')
                      ? 'mdi-octagram-outlined'
                      : 'mdi-circle-outlined'
                  "
                  :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
                  @update="mech.CurrentHeat = $event"
                  rollover
                  rollover-negative
                  @rollover="onHeatRollover"
                />
              </v-col>
              <v-col>
                <tick-bar
                  label="REPAIR CAPACITY"
                  :key="'tb' + mech.CurrentRepairs"
                  :current="mech.CurrentRepairs"
                  :max="mech.RepairCapacity"
                  large
                  color="repcap"
                  bg-color="grey darken-2"
                  empty-icon="mdi-circle-outlined"
                  full-icon="control_point"
                  @update="mech.CurrentRepairs = $event"
                />
              </v-col>
              <v-col grow>
                <tick-bar
                  label="CORE POWER"
                  :key="'tb' + mech.CurrentCoreEnergy"
                  :mech_id="mech.id"
                  :current="mech.CurrentCoreEnergy"
                  :max="1"
                  large
                  no-input
                  clearable
                  color="corepower"
                  bg-color="grey darken-2"
                  empty-icon="mdi-battery-10"
                  full-icon="mdi-battery"
                  @update="mech.CurrentCoreEnergy = $event"
                />
              </v-col>
              <v-col grow class="ml-2">
                <tick-bar
                  label="OVERCHARGE"
                  :key="'tb' + mech.CurrentOvercharge"
                  :mech_id="mech.id"
                  :current="mech.CurrentOvercharge"
                  :max="3"
                  large
                  no-input
                  clearable
                  :label-array="overcharge"
                  color="overcharge"
                  bg-color="grey darken-2"
                  empty-icon="mdi-circle-outlined"
                  full-icon="mdi-alert-decagram"
                  @update="mech.CurrentOvercharge = $event"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row dense align="center">
          <v-col cols="auto" class="flavor-text mr-2 ml-2">
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
              <active-card color="frame" header="Speed" :content="mech.Speed" />
              <active-card color="frame" header="Attack Bonus" :content="`+${mech.AttackBonus}`" />
              <active-card color="frame" header="Tech Attack" :content="`+${mech.TechAttack}`" />
            </v-row>
            <v-row>
              <active-card
                color="frame"
                header="Evasion"
                :content="mech.IsStunned ? 5 : mech.Evasion"
              />
              <active-card color="frame" header="E-Defense" :content="mech.EDefense" />
              <active-card color="frame" header="Save Target" :content="mech.SaveTarget" />
              <active-card color="frame" header="Sensor Range" :content="mech.SensorRange" />
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-icon size="120" color="frame">cci-size-{{ mech.Size }}</v-icon>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="4">
            <active-card
              v-for="(trait, i) in mech.Frame.Traits"
              :key="`tr_${i}`"
              color="frame"
              :header="trait.name"
              subheader="FRAME TRAIT"
            >
              <span v-html="trait.description" />
            </active-card>
          </v-col>
          <v-col cols="8">
            <active-card
              color="corepower"
              :header="mech.Frame.CoreSystem.Name"
              subheader="CORE SYSTEM"
              style="height: 100%"
            >
              <div v-if="mech.Frame.CoreSystem.Passive">
                <span class="heading h2">Passive</span>
                <p class="mb-1" v-html="mech.Frame.CoreSystem.Passive" />
              </div>
              <span class="heading h2">
                {{ mech.Frame.CoreSystem.Active }}
                <span class="pt-2 ml-2 caption grey--text">(ACTIVE)</span>
              </span>
              <p class="mb-1" v-html="mech.Frame.CoreSystem.Effect" />
              <cc-tags :tags="mech.Frame.CoreSystem.Tags" color="corepower" />
            </active-card>
          </v-col>
        </v-row>

        <cc-mech-loadout :mech="mech" readonly />
      </div>
    </div>
  </v-container>
  <!-- </div> -->
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, Mech, MechLoadout, Reserve, ReserveType, Organization } from '@/class'
import TickBar from '../components/UI/TickBar.vue'
import PilotEquipmentCard from './components/PilotEquipmentCard.vue'
import MechAttributeItem from './components/MechAttributeItem.vue'
import MountCard from './components/Mount/index.vue'
import TurnSidebar from './components/Turn/index.vue'
import MechSystemCard from './components/MechSystemCard.vue'
import StructureTable from './components/StructureTable.vue'
import StressTable from './components/StressTable.vue'
import ActiveCard from './components/UI/ActiveCard.vue'
import PilotSkillCard from './components/UI/PilotSkillCard.vue'
import colors from '@/features/_shared/UI/CCColors'
import {
  DamageElement,
  RangeElement,
  LimitedBar,
  ItemNote,
  ItemTag,
} from '@/features/pilot_management/components/UI'

import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'active-sheet',
  components: {
    TickBar,
    PilotEquipmentCard,
    MechAttributeItem,
    DamageElement,
    RangeElement,
    LimitedBar,
    ItemNote,
    MountCard,
    ItemTag,
    MechSystemCard,
    ActiveCard,
    TurnSidebar,
    StructureTable,
    StressTable,
    PilotSkillCard,
  },
  data: () => ({
    tabs: 0,
    burn: 0,
    overcharge: ['+1', '+1d3', '+1d6', '+1d6+4'],
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
    structureDialog: false,
    stressDialog: false,
    reservesPanel: [true],
    skillsPanel: [true],
  }),
  computed: {
    pilot(): Pilot {
      const store = getModule(PilotManagementStore, this.$store)
      return store.ActivePilot
      // return this.$store.getters.getPilot
    },
    mech(): Mech {
      return this.pilot.ActiveMech || null
    },
    loadout(): MechLoadout | null {
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
          if (c === 'heat') return colors.hp.dark
          return colors[c] ? colors[c].dark : colors.overcharge.dark
        }
        return colors.variable.dark
      }
      return colors.hp.dark
    },
  },
  methods: {
    setDtPanels() {
      this.skillsPanel = [true]
      this.reservesPanel = [true]
    },
    setCombatPanels() {
      this.skillsPanel = [false]
      this.reservesPanel = [false]
    },
    editMech(mech: Mech) {
      this.pilot.LoadedMech = this.mech
      this.$router.push('./config')
    },
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
        this.structureDialog = true
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
        this.stressDialog = true
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
