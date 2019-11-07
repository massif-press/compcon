<template>
  <div class="pb-3">
    <cc-title small>
      <span class="ml-9">&emsp;</span> Gear Loadout
    </cc-title>
    <cc-loadout-panel
      :loadouts="pilot.Loadouts"
      :active-loadout="pilot.ActiveLoadout"
      @set-active="pilot.ActiveLoadout = $event"
      @add-loadout="pilot.AddLoadout()"
      @clone-loadout="pilot.CloneLoadout()"
      @remove-loadout="pilot.RemoveLoadout()"
    >
      <v-row>
        <pilot-armor-card
          :item="pilot.ActiveLoadout.Armor[0]"
          @equip="$set(pilot.ActiveLoadout.Armor, 0, $event)"
          @remove="$set(pilot.ActiveLoadout.Armor, 0, null)"
        />
        <v-divider vertical class="mx-4 my-3" />
        <pilot-weapon-card
          v-for="(w, i) in weapons()"
          :key="`pgwi_${i}`"
          :item="w"
          @equip="$set(pilot.ActiveLoadout.Weapons, i, $event)"
          @remove="$set(pilot.ActiveLoadout.Weapons, i, null)"
        />
        <pilot-weapon-card
          v-for="(w, i) in extendedWeapons()"
          :key="`pgwi_${i}`"
          :item="w"
          @equip="$set(pilot.ActiveLoadout.ExtendedWeapons, i, $event)"
          @remove="$set(pilot.ActiveLoadout.ExtendedWeapons, i, null)"
        />
      </v-row>
      <v-row dense>
        <pilot-gear-card
          v-for="(g, i) in gear()"
          :key="`pgi_${i}`"
          :item="g"
          @equip="$set(pilot.ActiveLoadout.Gear, i, $event)"
          @remove="$set(pilot.ActiveLoadout.Gear, i, null)"
        />
        <pilot-gear-card
          v-for="(g, i) in extendedGear()"
          :key="`pgi_${i}`"
          :item="g"
          @equip="$set(pilot.ActiveLoadout.ExtendedGear, i, $event)"
          @remove="$set(pilot.ActiveLoadout.ExtendedGear, i, null)"
        />
      </v-row>
    </cc-loadout-panel>
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
  methods: {
    gear() {
      return this.pilot.ActiveLoadout.Gear
    },
    extendedGear() {
      if (this.pilot.has('reserve', 'extendedharness')) return this.pilot.ActiveLoadout.ExtendedGear
      return []
    },
    weapons() {
      return this.pilot.ActiveLoadout.Weapons
    },
    extendedWeapons() {
      if (this.pilot.has('reserve', 'extendedharness'))
        return this.pilot.ActiveLoadout.ExtendedWeapons
      return []
    },
  },
})
</script>