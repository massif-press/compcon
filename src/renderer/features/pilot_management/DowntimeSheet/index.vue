<template>
  <div class="roster-content" style="background-color: #424242; height:94vh; padding-right: 20px">
    <downtime-sidebar :mech="mech" :loadout="loadout" :pilot="pilot" />
    <v-container fluid dark>
      <v-layout row wrap>
        <v-flex class="major-title white--text pt-1">
          <span>{{ pilot.Callsign }}</span>
          <span class="caption grey--text">{{ pilot.Name }}</span>
        </v-flex>
        <v-flex>
          <tick-bar
            small
            label="HP"
            :key="pilot.CurrentHP"
            :current="pilot.CurrentHP"
            :max="pilot.MaxHP"
            :color="color.hp.dark"
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
          <span class="minor-title white--text">{{ pilot.ActiveLoadout.Name }}</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn small relative class="ma-0 ml-2" dark outline v-on="on">Change Loadout</v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(loadout, index) in pilot.Loadouts"
                :key="index"
                @click="pilot.ActiveLoadout = loadout"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-right font-weight-bold">{{ loadout.Name }}</v-list-tile-title>
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
      <v-divider dark class="ma-2" />
      <span class="minor-title white--text pb-2">Pilot Skills</span>
      <v-layout wrap justify-center>
        <pilot-skill-card v-for="(s, i) in pilot.Skills" :key="`p_skill_${i}`" :pSkill="s" />
      </v-layout>
      <v-divider dark class="ma-2" />
      <span class="minor-title white--text pb-2">Reserves</span>
      <v-layout row wrap fill-height>
        <v-flex xs4 v-for="(r, i) in pilot.Reserves.filter(x => !x.Used)" :key="`res_${i}`">
          <div class="ma-1">
            <active-card :color="reserveColor(r)" :header="`${r.Name}`" subheader="RESERVE">
              <span v-if="!r.resourceName && !r.Note">{{ r.Description }}</span>
              <div v-else>
                <p v-if="r.ResourceName" class="font-weight-bold pa-1 ma-1">{{ r.ResourceName }}</p>
                <p v-if="r.Note" class="ml-2">{{ r.Note }}</p>
              </div>
            </active-card>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

</<script lang="ts">
import Vue from 'vue'
import { Pilot, Mech, MechLoadout, Reserve, ReserveType } from '@/class'
import DowntimeSidebar from './DowntimeSidebar.vue'
import TickBar from '../components/UI/TickBar.vue'
import PilotEquipmentCard from '../ActiveSheet/components/PilotEquipmentCard.vue'
import PilotSkillCard from './components/PilotSkillCard.vue'
import ActiveCard from '../ActiveSheet//components/UI/ActiveCard.vue'
import colors from '@/features/_shared/UI/CCColors'

export default Vue.extend({
  name: 'downtime-sheet',
  components: {TickBar, PilotEquipmentCard, PilotSkillCard, DowntimeSidebar, ActiveCard},
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
  }, methods: {
    reserveColor(r: Reserve): string {
      if (r.Type === ReserveType.Narrative) return '#00695C'
      return r.Type === ReserveType.Tactical ? '#827717' : '#BF360C'
    },
  }
})
</script>
