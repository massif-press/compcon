<template>
  <div class="roster-content" style="background-color: #424242">
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
            :current="pilot.CurrentHP"
            :max="pilot.MaxHP"
            :color="color.hp.dark"
            bg-color="grey darken-1"
            empty-icon="mdi-hexagon-outline"
            full-icon="mdi-hexagon"
            no-clear
            @update="pilot.CurrentHP = $event"
          />
        </v-flex>
        <v-flex>
          <span class="grey--text">ARMOR</span>
          <br>
          <span class="minor-title white--text">{{ pilot.Armor }}</span>
        </v-flex>
        <v-flex>
          <span class="grey--text">E-DEFENSE</span>
          <br>
          <span class="minor-title white--text">{{ pilot.EDefense }}</span>
        </v-flex>
        <v-flex>
          <span class="grey--text">EVASION</span>
          <br>
          <span class="minor-title white--text">{{ pilot.Evasion }}</span>
        </v-flex>
      </v-layout>
      <div v-if="pilot.ActiveLoadout" class="mt-2">
        <v-layout wrap justify-center>
          <pilot-equipment-card
            v-for="(a, i) in pilot.ActiveLoadout.Armor"
            :key="`p_armor_${i}`"
            :item="a"
          />
          <pilot-equipment-card
            v-for="(w, i) in pilot.ActiveLoadout.Weapons"
            :key="`p_weapon_${i}`"
            :item="w"
          />
          <pilot-equipment-card
            v-for="(g,i) in pilot.ActiveLoadout.Gear"
            :key="`p_gear_${i}`"
            :item="g"
          />
        </v-layout>
      </div>
      <v-expansion-panel expand dark class="mt-2">
        <v-expansion-panel-content
          expand-icon="keyboard_arrow_down"
          ripple
          style="background-color: #616161"
        >
          <span slot="header" class="minor-title">Pilot Traits</span>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card dark class="ma-1" v-for="(talent, i) in pilot.Talents" :key="`tal_${i}`">
                <v-card-title class="pa-0 minor-title" style="background-color: #616161">
                  <span class="ml-2">{{ talent.Talent.Name }} {{'I'.repeat(talent.Rank)}}</span>
                  <v-spacer/>
                  <span class="caption grey--text">TALENT&nbsp;</span>
                </v-card-title>
                <v-card-text class="pa-1">
                  <ul v-for="n in 3" :key="'talent_' + n">
                    <li v-if="talent.Rank >= n">
                      <span v-html="talent.Talent.Ranks[n - 1].description"/>
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-divider dark class="ma-2"/>
          <v-layout row>
            <v-flex v-for="(bonus, i) in pilot.CoreBonuses" :key="`cb_${i}`">
              <v-card dark class="ma-1">
                <v-card-title class="pa-0 minor-title" style="background-color: #616161">
                  <span class="ml-2">{{ bonus.Name }}</span>
                  <v-spacer/>
                  <span class="caption grey--text">CORE BONUS&nbsp;</span>
                </v-card-title>
                <v-card-text class="pa-1">
                  <span v-html="bonus.effect"/>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-divider dark class="ma-3"/>
      <div v-if="!mech" class="ma-5">
        <div v-if="!pilot.Mechs.length">
          <v-alert value="visible" type="error" class="mb-3 effect-text">
            <span class="minor-title">No Saved Mech Configurations</span>
            <br>
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
                @click="selectMech(mech)"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-right font-weight-bold">{{ mech.Name }}</v-list-tile-title>
                  <v-list-tile-sub-title
                    class="text-xs-right"
                  >{{ mech.Frame.Source }} {{ mech.Frame.Name }}</v-list-tile-sub-title>
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
          <v-spacer/>
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
                      <li v-for="e in item.effects" :key="e" v-html="e"/>
                    </ul>
                  </div>
                </v-tooltip>
              </template>
            </v-select>
          </v-flex>
          <v-spacer/>
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
                      <li v-for="e in item.effects" :key="e" v-html="e"/>
                    </ul>
                  </div>
                </v-tooltip>
              </template>
            </v-select>
          </v-flex>
          <v-spacer/>
          <v-flex shrink>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark v-on="on">Change Mech</v-btn>
              </template>
              <v-list>
                <v-list-tile
                  v-for="(mech, index) in pilot.Mechs"
                  :key="index"
                  @click="pilot.ActiveMech = mech"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-xs-right font-weight-bold">{{ mech.Name }}</v-list-tile-title>
                    <v-list-tile-sub-title
                      class="text-xs-right"
                    >{{ mech.Frame.Source }} {{ mech.Frame.Name }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
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
              <v-flex xs2 class="mr-2">
                <span class="grey--text">
                  STRUCTURE
                  <b
                    :style="`color: ${color.structure.dark}`"
                  >{{ mech.CurrentStructure }} /{{ mech.MaxStructure }}</b>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentStructure"
                  :current="mech.CurrentStructure"
                  :max="mech.MaxStructure"
                  large
                  :color="color.structure.dark"
                  bg-color="pink darken-4"
                  empty-icon="mdi-hexagon-outline"
                  full-icon="cc-structure"
                  mech
                  @update="mech.CurrentStructure = $event"
                />
              </v-flex>
              <v-flex xs9 style="max-width: 625px">
                <span class="grey--text">
                  &nbsp; HP
                  <b :style="`color: ${color.hp.dark}`">
                    {{ mech.CurrentHP }}
                    <span>/{{ mech.MaxHP }}</span>
                  </b>
                  &emsp; ARMOR
                  <b
                    :style="`color: ${color.armor.dark}`"
                  >{{ mech.Armor }}</b>
                </span>
                <v-layout>
                  <tick-bar
                    :key="'tb' + mech.CurrentHP"
                    :current="mech.CurrentHP"
                    :max="mech.MaxHP"
                    large
                    :color="color.hp.dark"
                    bg-color="grey darken-1"
                    empty-icon="mdi-hexagon-outline"
                    full-icon="mdi-hexagon"
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
              <v-flex class="text-xs-right ml-4">
                <span class="grey--text">FULL REPAIR&nbsp;</span>
                <v-layout justify-end>
                  <v-tooltip left>
                    <v-btn
                      slot="activator"
                      color="green darken-3"
                      dark
                      class="ma-0"
                      @click="mech.FullRepair()"
                    >
                      <v-icon large>mdi-restore</v-icon>
                    </v-btn>
                    <span>Fully repair and recharge this mech.</span>
                  </v-tooltip>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-divider dark/>
            <v-layout class="mb-4">
              <v-flex shrink class="mr-2">
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
                      `color: ${
                        mech.IsInDangerZone
                          ? color.dangerzone.dark
                          : color.heatcap.dark
                      }`
                    "
                    >{{ mech.CurrentHeat }}/{{ mech.HeatCapacity }}</b>
                    <v-fade-transition>
                      <span v-if="mech.IsInDangerZone">
                        <b :style="`color: ${color.dangerzone.dark}`">&nbsp; // DANGER ZONE //</b>
                      </span>
                    </v-fade-transition>&emsp; &nbsp;
                  </span>
                </span>
                <tick-bar
                  :key="'tb' + mech.CurrentHeat"
                  :current="mech.CurrentHeat"
                  :max="mech.HeatCapacity"
                  large
                  :color="
                  mech.IsInDangerZone
                    ? color.dangerzone.dark
                    : color.heatcap.dark
                "
                  bg-color="red darken-4"
                  empty-icon="mdi-circle-outline"
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
                  <b
                    :style="`color: ${color.corepower.dark}`"
                  >{{ mech.CurrentCoreEnergy || 1 }}</b>
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
                  <b
                    :style="`color: ${color.overcharge.dark}`"
                  >{{ overcharge[mech.CurrentOvercharge || 0] }}</b>
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
              <mech-attribute-item attr="Attack Bonus" signed :val="mech.AttackBonus"/>
              <mech-attribute-item attr="Tech Attack" signed :val="mech.TechAttack"/>
              <mech-attribute-item attr="Limited System Bonus" signed :val="mech.LimitedBonus"/>
            </v-layout>
            <v-layout justify-space-between>
              <mech-attribute-item attr="Speed" :val="mech.Speed"/>
              <mech-attribute-item attr="Evasion" :val="mech.Evasion"/>
              <mech-attribute-item attr="E-Defense" :val="mech.EDefense"/>
              <mech-attribute-item attr="Sensor Range" :val="mech.SensorRange"/>
              <mech-attribute-item attr="Save Target" :val="mech.SaveTarget"/>
              <mech-attribute-item attr="Size" :val="mech.Size"/>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs4>
            <v-layout fill-height row wrap>
              <v-flex xs12 v-for="(trait, i) in mech.Frame.Traits" :key="`tr_${i}`">
                <v-card dark class="ma-1">
                  <v-card-title class="pa-0 minor-title" style="background-color: #673AB7">
                    <span class="ml-2">{{ trait.name }}</span>
                    <v-spacer/>
                    <span class="caption">FRAME TRAIT&nbsp;</span>
                  </v-card-title>
                  <v-card-text class="pa-1">
                    <span v-html="trait.description"/>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs8>
            <v-card dark class="ma-1" height="97%">
              <v-card-title class="pa-0 minor-title" style="background-color: #00897B">
                <span class="ml-2">{{ mech.Frame.CoreSystem.Name }}</span>
                <v-spacer/>
                <span class="caption">CORE SYSTEM&nbsp;</span>
              </v-card-title>
              <v-card-text class="pa-1">
                <div v-if="mech.Frame.CoreSystem.Passive">
                  <v-card-title class="ma-0 pa-0 subheading">Passive</v-card-title>
                  <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                    <p class="mb-1" v-html="mech.Frame.CoreSystem.Passive"/>
                  </v-card-text>
                </div>
                <v-card-title class="minor-title pa-0 ma-0">
                  {{ mech.Frame.CoreSystem.Active }}
                  <span
                    class="pt-2 ml-2 caption grey--text"
                  >(ACTIVE)</span>
                </v-card-title>
                <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                  <p class="mb-1" v-html="mech.Frame.CoreSystem.Effect"/>
                  <item-tag v-for="t in mech.Frame.CoreSystem.Tags" :key="t.id" :tag-obj="t"/>
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <v-divider dark class="ma-2 mb-3"/>
        <div v-if="!loadout">
          <div v-if="!mech.Loadouts.length" class="ma-3">
            <v-alert value="visible" type="error" class="mb-3 effect-text">
              <span class="minor-title">No Mech Loadouts Available</span>
              <br>
            </v-alert>
            <v-btn block large color="primary" dark to="/config">Edit {{mech.Name}}</v-btn>
          </div>
        </div>

        <div v-else>
          <v-layout>
            <v-flex grow>
              <span class="major-title white--text">{{loadout.Name}}</span>
            </v-flex>
            <v-spacer/>
            <v-flex shrink>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn absolute right color="primary" dark v-on="on">Change Loadout</v-btn>
                </template>
                <v-list>
                  <v-list-tile
                    v-for="(loadout, index) in mech.Loadouts"
                    :key="index"
                    @click="mech.ActiveLoadout = loadout"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title class="text-xs-right font-weight-bold">{{ loadout.Name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <mount-card v-for="(mount, i) in loadout.Mounts" :key="`mount_${i}`" :mount="mount"/>
            <v-flex xs12>
              <v-card class="ma-0 pa-0" flat dark>
                <span class="mount-title-dark pl-3 pr-3 text-uppercase">SYSTEMS</span>
                <v-card-text class="bordered-dark ml-3 pt-4">
                  <v-layout row wrap>
                    <mech-system-card
                      v-for="(system, i) in loadout.Systems"
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
import { Pilot, Mech, MechLoadout } from '@/class'
import TickBar from '../components/UI/TickBar.vue'
import PilotEquipmentCard from './components/PilotEquipmentCard.vue'
import MechAttributeItem from './components/MechAttributeItem.vue'
import MountCard from './components/Mount/index.vue'
import MechSystemCard from './components/MechSystemCard.vue'
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
  },
  data: () => ({
    tabs: 0,
    overcharge: ['+1', '+1d3', '+1d6', '+1d6+4'],
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
        return this.mech.ActiveLoadout
          ? this.mech.ActiveLoadout
          : this.mech.Loadouts[0]
      }
      return null
    },
    color(): any {
      return colors
    },
    statuses(): string[] {
      return this.$store.getters
        .getItemCollection('Statuses')
        .filter(x => x.type === 'Status')
    },
    conditions(): string[] {
      return this.$store.getters
        .getItemCollection('Statuses')
        .filter(x => x.type === 'Condition')
    },
  },
})
</script>
