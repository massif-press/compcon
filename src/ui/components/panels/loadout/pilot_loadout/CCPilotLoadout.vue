<template>
  <div>
    <v-row :dense="readonly">
      <pilot-armor-card
        :item="pilot.Loadout.Armor[0]"
        :readonly="readonly"
        @equip="setArmor($event)"
        @remove="setArmor(null)"
      />
      <v-divider vertical class="mx-4 my-3" />
      <pilot-weapon-card
        v-for="(w, i) in weapons()"
        :key="`pgwi_${i}`"
        :item="w"
        :readonly="readonly"
        @equip="setWeapon($event, i)"
        @remove="setWeapon(null, i)"
      />
      <pilot-weapon-card
        v-for="(w, i) in extendedWeapons()"
        :key="`pgwi_${i}`"
        :item="w"
        :readonly="readonly"
        @equip="setWeapon($event, i)"
        @remove="setWeapon(null, i)"
      />
    </v-row>
    <v-row dense>
      <pilot-gear-card
        v-for="(g, i) in gear()"
        :key="`pgi_${i}`"
        :item="g"
        :readonly="readonly"
        @equip="setGear($event, i)"
        @remove="setGear(null, i)"
      />
      <pilot-gear-card
        v-for="(g, i) in extendedGear()"
        :key="`pgi_${i}`"
        :item="g"
        :readonly="readonly"
        @equip="$set(pilot.Loadout.ExtendedGear, i, $event)"
        @remove="$set(pilot.Loadout.ExtendedGear, i, null)"
      />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PilotArmorCard from './_PLArmorCard.vue'
import PilotWeaponCard from './_PLWeaponCard.vue'
import PilotGearCard from './_PLGearCard.vue'
import { PilotArmor, PilotWeapon, PilotGear } from '@/class'

export default Vue.extend({
  name: 'cc-pilot-loadout',
  components: { PilotArmorCard, PilotWeaponCard, PilotGearCard },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  methods: {
    gear() {
      return this.pilot.Loadout.Gear
    },
    extendedGear() {
      if (this.pilot.has('reserve', 'extendedharness')) return this.pilot.Loadout.ExtendedGear
      return []
    },
    weapons() {
      return this.pilot.Loadout.Weapons
    },
    extendedWeapons() {
      if (this.pilot.has('reserve', 'extendedharness')) return this.pilot.Loadout.ExtendedWeapons
      return []
    },
    setArmor(a: PilotArmor | null) {
      this.$set(this.pilot.Loadout.Armor, 0, a)
      this.pilot.Heal()
    },
    setWeapon(w: PilotWeapon | null, idx: number) {
      this.$set(this.pilot.Loadout.Weapons, idx, w)
      this.pilot.Heal()
    },
    setGear(g: PilotGear | null, idx: number) {
      this.$set(this.pilot.Loadout.Gear, idx, g)
      this.pilot.Heal()
    },
  },
})
</script>
