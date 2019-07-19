<template>
  <div class="roster-content" style="background-color: #424242; height:94vh; padding-right: 20px">
    <turn-sidebar :mech="mech" :loadout="loadout" :pilot="pilot" />
    <v-container fluid dark>
      <v-layout row wrap>
        <v-flex class="major-title white--text pt-1">
          <span>{{ pilot.Callsign }}</span>
          <span class="caption grey--text">{{ pilot.Name }}</span>
        </v-flex>
        <v-flex>
          <span class="grey--text">
            HP
            <b :style="`color: ${color.hp.dark}`">{{ pilot.CurrentHP }}/{{ pilot.MaxHP }}</b>
          </span>
          <tick-bar
            small
            :key="pilot.CurrentHP"
            :current="pilot.CurrentHP"
            :max="pilot.MaxHP"
            :color="color.hp.dark"
            no-clear
            @update="pilot.CurrentHP = $event"
          />
        </v-flex>
        <v-flex>
          <span class="grey--text">ARMOR</span>
          <br />
          <span class="minor-title white--text">{{ pilot.Armor }}</span>
        </v-flex>
        <v-flex>
          <span class="grey--text">E-DEFENSE</span>
          <br />
          <span class="minor-title white--text">{{ pilot.EDefense }}</span>
        </v-flex>
        <v-flex>
          <span class="grey--text">EVASION</span>
          <br />
          <span class="minor-title white--text">{{ pilot.Evasion }}</span>
        </v-flex>
      </v-layout>
      <div v-if="!pilot.ActiveLoadout" class="ma-3">
        <v-alert value="visible" type="warning" class="mb-3 effect-text">
          <span class="minor-title">No Pilot Loadouts Available</span>
          <br />
        </v-alert>
        <v-btn block large color="primary" dark to="/pilot">Edit {{ pilot.Callsign }}</v-btn>
      </div>
      <div v-else class="mt-2">
        <v-layout>
          <span class="minor-title white--text">
            {{ pilot.ActiveLoadout.Name }}
          </span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn small relative class="ma-0 ml-2" dark outline v-on="on">
                Change Loadout
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(loadout, index) in pilot.Loadouts"
                :key="index"
                @click="pilot.ActiveLoadout = loadout"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-right font-weight-bold">
                    {{ loadout.Name }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-layout>
        <v-layout wrap justify-center>
          <pilot-equipment-card
            v-for="(a, i) in pilot.ActiveLoadout.Armor"
            :key="`p_armor_${i}`"
            :item="a"
            show
          />
          <pilot-equipment-card
            v-for="(w, i) in pilot.ActiveLoadout.Weapons"
            :key="`p_weapon_${i}`"
            :item="w"
            show
          />
          <pilot-equipment-card
            v-for="(g, i) in pilot.ActiveLoadout.Gear"
            :key="`p_gear_${i}`"
            :item="g"
            show
          />
          <pilot-equipment-card
            v-for="(w, i) in pilot.ActiveLoadout.ExtendedWeapons"
            :key="`p_e_weapon_${i}`"
            :item="w"
            :show="pilot.has('reserve', 'extendedharness')"
            extended
          />
          <pilot-equipment-card
            v-for="(g, i) in pilot.ActiveLoadout.ExtendedGear"
            :key="`p_e_gear_${i}`"
            :item="g"
            :show="pilot.has('reserve', 'extendedharness')"
            extended
          />
        </v-layout>
      </div>
      <v-expansion-panel expand dark class="mt-2">
        <v-expansion-panel-content
          expand-icon="keyboard_arrow_down"
          ripple
          style="background-color: #616161"
        >
          <span slot="header" class="minor-title">Reserves</span>
          <v-layout row wrap fill-height>
            <v-flex xs4 v-for="(r, i) in pilot.Reserves.filter(x => !x.Used)" :key="`res_${i}`">
              <div class="ma-1">
                <active-card :color="reserveColor(r)" :header="`${r.Name}`" subheader="RESERVE">
                  <span v-if="!r.resourceName && !r.Note">
                    {{ r.Description }}
                  </span>
                  <div v-else>
                    <p v-if="r.ResourceName" class="font-weight-bold pa-1 ma-1">
                      {{ r.ResourceName }}
                    </p>
                    <p v-if="r.Note" class="ml-2">{{ r.Note }}</p>
                  </div>
                </active-card>
              </div>
            </v-flex>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel expand dark class="mt-2">
        <v-expansion-panel-content
          expand-icon="keyboard_arrow_down"
          ripple
          style="background-color: #616161"
        >
          <span slot="header" class="minor-title">Pilot Traits</span>
          <v-layout row wrap>
            <v-flex xs12 v-for="(talent, i) in pilot.Talents" :key="`tal_${i}`">
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
            </v-flex>
          </v-layout>
          <v-divider dark class="ma-2" />
          <v-layout row>
            <v-flex v-for="(bonus, i) in pilot.CoreBonuses" :key="`cb_${i}`">
              <active-card color="#616161" :header="bonus.Name" subheader="CORE BONUS">
                <span v-html="bonus.effect" />
              </active-card>
            </v-flex>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-divider dark class="ma-3" />
      <div v-if="!mech" class="ma-5">
        <div v-if="!pilot.Mechs.length">
          <v-alert value="visible" type="error" class="mb-3 effect-text">
            <span class="minor-title">No Saved Mech Configurations</span>
            <br />
          </v-alert>
          <v-btn block large color="primary" dark to="/hangar">
            To Mech Hangar
          </v-btn>
        </div>
        <div v-else class="ma-5">
          <v-alert value="visible" type="warning" class="mb-3 effect-text">
            <span class="minor-title">No Active Mech Detected</span>
          </v-alert>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn block large color="primary" dark v-on="on">
                Select Active Mech
              </v-btn>
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
        <v-layout justify-space-between>
          <v-flex class="major-title white--text pt-1">
            <span>{{ mech.Name }}</span>
            <span class="caption grey--text">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</span>
          </v-flex>
          <v-spacer />
          <v-flex shrink>
            <v-menu offset-y nudge-left="85px">
              <template v-slot:activator="{ on }">
                <v-btn outline small dark v-on="on">Change Mech</v-btn>
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
          </v-flex>
        </v-layout>
        <v-layout justify-space-between class="ml-4 mr-4">
          <v-flex xs3>
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
          </v-flex>
          <v-spacer />
          <v-flex xs3>
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
          </v-flex>
          <v-spacer />
          <v-flex xs3>
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
                <v-chip v-if="index < 2" small slot="activator" :color="color[item.color].light">
                  <b>{{ item.name }}</b>
                </v-chip>
                <span v-if="index === 2" class="grey--text caption">
                  (+{{ mech.Resistances.length - 1 }} others)
                </span>
              </template>
            </v-select>
          </v-flex>
          <v-spacer />
          <v-flex shrink>
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
                  <v-icon slot="activator" :color="color.burn.dark">
                    mdi-fire
                  </v-icon>
                  <span>Current Burn</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs1 class="mr-3 white--text">
            <v-layout column justify-center fill-height class="text-xs-center">
              <v-flex>
                <div class="subheader">
                  <span class="caption">HULL</span>
                </div>
                <div class="hase">
                  <span>{{ pilot.MechSkills.Hull }}</span>
                </div>
              </v-flex>
              <v-flex>
                <div class="subheader">
                  <span class="caption">AGILITY</span>
                </div>
                <div class="hase">
                  <span>{{ pilot.MechSkills.Agi }}</span>
                </div>
              </v-flex>
              <v-flex>
                <div class="subheader">
                  <span class="caption">SYSTEMS</span>
                </div>
                <div class="hase">
                  <span>{{ pilot.MechSkills.Sys }}</span>
                </div>
              </v-flex>
              <v-flex>
                <div class="subheader">
                  <span class="caption">ENGINEERING</span>
                </div>
                <div class="hase">
                  <span>{{ pilot.MechSkills.Eng }}</span>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout>
              <v-flex xs2 class="mr-2" style="min-width: 200px">
                <span class="grey--text">
                  STRUCTURE
                  <b :style="`color: ${color.structure.dark}`">
                    {{ mech.CurrentStructure }} /{{ mech.MaxStructure }}
                  </b>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentStructure"
                  :current="mech.CurrentStructure"
                  :max="mech.MaxStructure"
                  large
                  :color="color.structure.dark"
                  bg-color="pink darken-4"
                  full-icon="cc-structure"
                  mech
                  @update="mech.CurrentStructure = $event"
                />
              </v-flex>
              <v-flex>
                <span class="grey--text">
                  &nbsp; HP
                  <b :style="`color: ${color.hp.dark}`">
                    {{ mech.CurrentHP }}
                    <span>/{{ mech.MaxHP }}</span>
                  </b>
                  &emsp; ARMOR
                  <b :style="`color: ${color.armor.dark}`">{{ mech.Armor }}</b>
                </span>
                <v-layout>
                  <tick-bar
                    :key="'tb' + mech.CurrentHP"
                    :current="mech.CurrentHP"
                    :max="mech.MaxHP"
                    large
                    :color="hpColor"
                    :full-icon="hpResistance ? 'mdi-octagram' : ''"
                    @update="mech.CurrentHP = $event"
                  />
                  <v-flex shrink>
                    <v-rating
                      class="d-inline-flex"
                      v-model="mech.Armor"
                      :length="mech.Armor"
                      readonly
                      large
                      dense
                      full-icon="mdi-shield"
                      :color="color.armor.dark"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs2 class="text-xs-right ml-4">
                <span class="grey--text">FULL REPAIR&nbsp;</span>
                <v-layout justify-end>
                  <v-tooltip left>
                    <v-btn
                      slot="activator"
                      dark
                      fab
                      flat
                      class="ma-0 mr-3"
                      @click="mech.FullRepair()"
                    >
                      <v-icon large color="green accent-3">mdi-restore</v-icon>
                    </v-btn>
                    <span>Fully repair and recharge this mech.</span>
                  </v-tooltip>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-divider dark class="mt-2 mb-2" />
            <v-layout class="mb-4">
              <v-flex shrink class="mr-2" style="min-width: 200px">
                <span class="grey--text">
                  REACTOR STRESS
                  <b :style="`color: ${color.stress.dark}`">
                    {{ mech.CurrentStress }}
                    <span>/{{ mech.MaxStress }}</span>
                  </b>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentStress"
                  :current="mech.CurrentStress"
                  :max="mech.MaxStress"
                  large
                  :color="color.stress.dark"
                  bg-color="deep-orange darken-4"
                  empty-icon="mdi-circle-outline"
                  full-icon="cc-reactor-stress"
                  @update="mech.CurrentStress = $event"
                />
              </v-flex>
              <v-flex>
                <span class="grey--text">
                  <span>
                    &nbsp;HEAT:
                    <b
                      :style="
                        `color: ${mech.IsInDangerZone ? color.dangerzone.dark : color.heatcap.dark}`
                      "
                    >
                      {{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}
                    </b>
                    <v-fade-transition>
                      <span v-if="mech.IsInDangerZone">
                        <b :style="`color: ${color.dangerzone.dark}`">
                          &nbsp; // DANGER ZONE //
                        </b>
                      </span>
                    </v-fade-transition>
                    &emsp; &nbsp;
                  </span>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentHeat"
                  :current="mech.CurrentHeat"
                  :max="mech.HeatCapacity"
                  large
                  :color="mech.IsInDangerZone ? color.dangerzone.dark : color.heatcap.dark"
                  bg-color="red darken-4"
                  :empty-icon="
                    mech.Resistances.includes('Heat')
                      ? 'mdi-octagram-outline'
                      : 'mdi-circle-outline'
                  "
                  :full-icon="mech.IsInDangerZone ? 'mdi-fire' : 'mdi-circle'"
                  @update="mech.CurrentHeat = $event"
                />
              </v-flex>
              <v-flex>
                <span class="grey--text">
                  &nbsp; REPAIR CAPACITY
                  <b :style="`color: ${color.repcap.dark}`">
                    {{ mech.CurrentRepairs }}
                    <span>/{{ mech.RepairCapacity }}</span>
                  </b>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentRepairs"
                  :current="mech.CurrentRepairs"
                  :max="mech.RepairCapacity"
                  large
                  :color="color.repcap.dark"
                  bg-color="grey darken-2"
                  empty-icon="mdi-circle-outline"
                  full-icon="control_point"
                  @update="mech.CurrentRepairs = $event"
                />
              </v-flex>
              <v-flex grow>
                <span class="grey--text">
                  &nbsp;CORE POWER
                  <b :style="`color: ${color.corepower.dark}`">
                    {{ mech.CurrentCoreEnergy || 1 }}
                  </b>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentCoreEnergy"
                  :mech_id="mech.id"
                  :current="mech.CurrentCoreEnergy"
                  :max="1"
                  large
                  :color="color.corepower.dark"
                  bg-color="grey darken-2"
                  empty-icon="mdi-battery-10"
                  full-icon="mdi-battery"
                  @update="mech.CurrentCoreEnergy = $event"
                />
              </v-flex>
              <v-flex grow class="ml-2">
                <span class="grey--text">
                  &nbsp;OVERCHARGE
                  <b :style="`color: ${color.overcharge.dark}`">
                    {{ overcharge[mech.CurrentOvercharge || 0] }}
                  </b>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentOvercharge"
                  :mech_id="mech.id"
                  :current="mech.CurrentOvercharge"
                  :max="3"
                  large
                  :color="color.overcharge.dark"
                  bg-color="grey darken-2"
                  empty-icon="mdi-circle-outline"
                  full-icon="mdi-alert-decagram"
                  @update="mech.CurrentOvercharge = $event"
                />
              </v-flex>
            </v-layout>

            <v-layout justify-space-between>
              <mech-attribute-item attr="Attack Bonus" signed :val="mech.AttackBonus" />
              <mech-attribute-item attr="Tech Attack" signed :val="mech.TechAttack" />
              <mech-attribute-item attr="Limited System Bonus" signed :val="mech.LimitedBonus" />
            </v-layout>
            <v-layout justify-space-between>
              <mech-attribute-item attr="Speed" :val="mech.Speed" />
              <mech-attribute-item attr="Evasion" :val="mech.IsStunned ? 5 : mech.Evasion" />
              <mech-attribute-item attr="E-Defense" :val="mech.EDefense" />
              <mech-attribute-item attr="Sensor Range" :val="mech.SensorRange" />
              <mech-attribute-item attr="Save Target" :val="mech.SaveTarget" />
              <mech-attribute-item attr="Size" :val="mech.Size" />
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs4>
            <v-layout fill-height row wrap>
              <v-flex xs12 v-for="(trait, i) in mech.Frame.Traits" :key="`tr_${i}`">
                <active-card
                  :color="color.frame.light"
                  :header="trait.name"
                  subheader="FRAME TRAIT"
                >
                  <span v-html="trait.description" />
                </active-card>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer />
          <v-flex xs8>
            <active-card
              color="#00897B"
              :header="mech.Frame.CoreSystem.Name"
              subheader="CORE SYSTEM"
            >
              <div v-if="mech.Frame.CoreSystem.Passive">
                <v-card-title class="ma-0 pa-0 subheading">
                  Passive
                </v-card-title>
                <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                  <p class="mb-1" v-html="mech.Frame.CoreSystem.Passive" />
                </v-card-text>
              </div>
              <v-card-title class="minor-title pa-0 ma-0">
                {{ mech.Frame.CoreSystem.Active }}
                <span class="pt-2 ml-2 caption grey--text">(ACTIVE)</span>
              </v-card-title>
              <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                <p class="mb-1" v-html="mech.Frame.CoreSystem.Effect" />
                <item-tag v-for="t in mech.Frame.CoreSystem.Tags" :key="t.id" :tag-obj="t" />
              </v-card-text>
            </active-card>
          </v-flex>
        </v-layout>

        <v-divider dark class="ma-2 mb-3" />
        <div v-if="!loadout">
          <div v-if="!mech.Loadouts.length" class="ma-3">
            <v-alert value="visible" type="warning" class="mb-3 effect-text">
              <span class="minor-title">No Mech Loadouts Available</span>
              <br />
            </v-alert>
            <v-btn block large color="primary" dark @click="editMech(mech)">
              Edit {{ mech.Name }}
            </v-btn>
          </div>
        </div>

        <div v-else>
          <v-layout>
            <span class="minor-title white--text">{{ loadout.Name }}</span>
            <v-menu offset-y nudge-left="20px">
              <template v-slot:activator="{ on }">
                <v-btn small relative class="ma-0 ml-2" dark outline v-on="on">
                  Change Loadout
                </v-btn>
              </template>
              <v-list>
                <v-list-tile
                  v-for="(loadout, index) in mech.Loadouts"
                  :key="index"
                  @click="mech.ActiveLoadout = loadout"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-xs-right font-weight-bold">
                      {{ loadout.Name }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-layout>
          <v-layout row wrap>
            <mount-card
              v-for="(mount, i) in loadout.AllMounts(
                pilot.has('CoreBonus', 'imparm'),
                pilot.has('CoreBonus', 'intweapon')
              )"
              :key="`mount_${i}`"
              :mount="mount"
            />
            <v-flex xs12>
              <v-card class="ma-0 pa-0" flat dark>
                <span class="mount-title-dark pl-3 pr-3 text-uppercase">
                  SYSTEMS
                </span>
                <v-card-text class="bordered-dark ml-3 pt-4">
                  <v-layout row wrap>
                    <mech-system-card
                      v-for="(system, i) in mech.IntegratedSystems.concat(loadout.Systems)"
                      :key="`system${i}`"
                      :system="system"
                    />
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, Mech, MechLoadout, Reserve, ReserveType } from '@/class'
import TickBar from '../components/UI/TickBar.vue'
import PilotEquipmentCard from './components/PilotEquipmentCard.vue'
import MechAttributeItem from './components/MechAttributeItem.vue'
import MountCard from './components/Mount/index.vue'
import TurnSidebar from './components/Turn/index.vue'
import MechSystemCard from './components/MechSystemCard.vue'
import ActiveCard from './components/UI/ActiveCard.vue'
import colors from '@/features/_shared/UI/CCColors'
import {
  DamageElement,
  RangeElement,
  LimitedBar,
  ItemNote,
  ItemTag,
} from '@/features/pilot_management/components/UI'

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
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
    mech(): Mech {
      return this.pilot.ActiveMech || null
    },
    loadout(): MechLoadout | null {
      if (this.mech && this.mech.Loadouts.length) {
        return this.mech.ActiveLoadout ? this.mech.ActiveLoadout : this.mech.Loadouts[0]
      }
      return null
    },
    color(): any {
      return colors
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
    editMech(mech: Mech) {
      this.pilot.LoadedMech = this.mech
      this.$router.push('./config')
    },
    reserveColor(r: Reserve): string {
      if (r.Type === ReserveType.Narrative) return '#00695C'
      return r.Type === ReserveType.Tactical ? '#827717' : '#BF360C'
    },
  },
})
</script>
