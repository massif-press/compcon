<template>
  <cc-loadout-panel
    :loadouts="pilot.Loadouts"
    :active-loadout="pilot.ActiveLoadout"
    :readonly="readonly"
    color="pilot"
    @set-active="pilot.ActiveLoadout = $event"
    @add-loadout="pilot.AddLoadout()"
    @clone-loadout="pilot.CloneLoadout()"
    @remove-loadout="pilot.RemoveLoadout()"
  >
    <v-row :dense="readonly">
      <pilot-armor-card
        :item="pilot.ActiveLoadout.Armor[0]"
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
        @equip="$set(pilot.ActiveLoadout.ExtendedGear, i, $event)"
        @remove="$set(pilot.ActiveLoadout.ExtendedGear, i, null)"
      />
    </v-row>
  </cc-loadout-panel>
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
    setArmor(a: PilotArmor | null) {
      this.$set(this.pilot.ActiveLoadout.Armor, 0, a)
      this.pilot.Heal()
    },
    setWeapon(w: PilotWeapon | null, idx: number) {
      this.$set(this.pilot.ActiveLoadout.Weapons, idx, w)
      this.pilot.Heal()
    },
    setGear(g: PilotGear | null, idx: number) {
      this.$set(this.pilot.ActiveLoadout.Gear, idx, g)
      this.pilot.Heal()
    },
  },
})
</script>
