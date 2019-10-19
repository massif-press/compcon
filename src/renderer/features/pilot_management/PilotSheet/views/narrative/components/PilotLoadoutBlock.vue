<template>
  <div>
    <cc-title small>
      <span class="ml-9">&emsp;</span> Gear Loadout
    </cc-title>
    <div class="py-2" />
    <v-toolbar id="toolbar" color="primary" dark flat dense class="sliced" max-height="30px">
      <v-toolbar-title style="max-height: 30px" class="mt-n3">
        <v-menu offset-y top>
          <template v-slot:activator="{ on }">
            <v-icon left class="fadeSelect mt-n2" v-on="on">mdi-chevron-up-circle</v-icon>
          </template>
          <v-list class="px-2 py-3">
            <v-list-item-subtitle class="overline">Available Pilot Loadouts</v-list-item-subtitle>
            <v-list-item
              v-for="(l, i) in pilot.Loadouts"
              :key="`pl_${i}`"
              @click="pilot.ActiveLoadout = l"
            >
              <v-list-item-title class="stat-text">{{ l.Name }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="pilot.AddLoadout()">
              <v-list-item-title class="primary--text font-weight-bold">
                <v-icon color="primary" left>add</v-icon>Add New Loadout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <span class="l-title">
          <cc-short-string-editor
            inline
            @set="pilot.ActiveLoadout.Name = $event"
          >{{ pilot.ActiveLoadout.Name }}</cc-short-string-editor>
        </span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="mr-6 mt-n4">
        <v-btn small icon class="fadeSelect" @click="pilot.CloneLoadout()">
          <v-icon>mdi-content-duplicate</v-icon>
        </v-btn>
        <v-menu offset-y top>
          <template v-slot:activator="{ on }">
            <v-btn small icon class="fadeSelect" :disabled="pilot.Loadouts.length === 1" v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="text-center flavor-text">
              <span class="overline">// PROCESS INTERRUPT: AUTHORIZATION REQUIRED //</span>
              <br />//[COMP/CON:
              <b class="black--text">
                Lancer, please confirm deletion of
                <span
                  class="primary--text"
                >{{ pilot.ActiveLoadout.Name }}</span> Pilot Loadout
              </b>]
              <v-divider class="my-2" />
              <v-row dense>
                <v-btn small text>DENY</v-btn>
                <cc-btn small color="error" class="ml-auto" @click="pilot.RemoveLoadout()">CONFIRM</cc-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-card flat outlined tile color="primary">
      <v-card-text class="pa-2 white">
        <v-row>
          <pilot-armor-card :item="pilot.ActiveLoadout.Armor[0]" />
          <v-divider vertical class="mx-4 my-3" />
          <pilot-weapon-card :item="pilot.ActiveLoadout.Weapons[0]" />
          <pilot-weapon-card :item="pilot.ActiveLoadout.Weapons[1]" />
          <pilot-weapon-card
            v-if="pilot.has('reserve', 'extendedharness')"
            extended
            :item="pilot.ActiveLoadout.ExtendedWeapons[0]"
          />
        </v-row>
        <v-row dense>
          <pilot-gear-card :item="pilot.ActiveLoadout.Gear[0]" />
          <pilot-gear-card :item="pilot.ActiveLoadout.Gear[1]" />
          <pilot-gear-card :item="pilot.ActiveLoadout.Gear[2]" />
          <pilot-gear-card
            v-if="pilot.has('reserve', 'extendedharness')"
            extended
            :item="pilot.ActiveLoadout.ExtendedGear[0]"
          />
          <pilot-gear-card
            v-if="pilot.has('reserve', 'extendedharness')"
            extended
            :item="pilot.ActiveLoadout.ExtendedGear[1]"
          />
        </v-row>
        {{ pilot.ActiveLoadout }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotArmorCard from './loadout/PLArmorCard.vue'
import PilotWeaponCard from './loadout/PLWeaponCard.vue'
import PilotGearCard from './loadout/PLGearCard.vue'

export default Vue.extend({
  name: 'pilot-loadout-block',
  components: { PilotArmorCard, PilotWeaponCard, PilotGearCard },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
.l-title {
  font-family: 'Helvetica Bold', sans-serif;
  font-weight: 900;
  font-size: 18pt;
  line-height: 14pt;
  color: white;
  text-transform: uppercase;
}
</style>