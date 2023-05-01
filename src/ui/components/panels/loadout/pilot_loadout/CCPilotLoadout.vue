<template>
  <div>
    <v-row :dense="readonly">
      <pilot-armor-card
        :item="pilot.Loadout.Armor[0]"
        :readonly="readonly"
        :exotics="exotics('PilotArmor')"
        :pilot="pilot"
        @equip="setArmor($event)"
        @remove="setArmor(null)"
        @save="pilot.SaveController.save()"
      />
      <v-divider :vertical="$vuetify.breakpoint.mdAndUp" class="mx-4 my-1" />
      <pilot-weapon-card
        v-for="(w, i) in weapons"
        :key="`pgwi_${i}`"
        :item="w"
        :readonly="readonly"
        :pilot="pilot"
        :exotics="exotics('PilotWeapon')"
        @equip="setWeapon($event, i)"
        @remove="setWeapon(null, i)"
        @save="pilot.SaveController.save()"
      />
      <pilot-weapon-card
        v-for="(w, i) in extendedWeapons"
        :key="`pgewi_${i}`"
        :item="w"
        :readonly="readonly"
        :extended="true"
        :pilot="pilot"
        :exotics="exotics('PilotWeapon')"
        @equip="setWeapon($event, i, true)"
        @remove="setWeapon(null, i, true)"
        @save="pilot.SaveController.save()"
      />
    </v-row>
    <v-row dense>
      <pilot-gear-card
        v-for="(g, i) in gear"
        :key="`pgi_${i}`"
        :item="g"
        :readonly="readonly"
        :exotics="exotics('PilotGear')"
        :pilot="pilot"
        @equip="setGear($event, i)"
        @remove="setGear(null, i)"
        @save="pilot.SaveController.save()"
      />
      <pilot-gear-card
        v-for="(g, i) in extendedGear"
        :key="`pegi_${i}`"
        :item="g"
        :readonly="readonly"
        :extended="true"
        :exotics="exotics('PilotGear')"
        :pilot="pilot"
        @equip="setGear($event, i, true)"
        @remove="setGear(null, i, true)"
        @save="pilot.SaveController.save()"
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
  computed: {
    gear() {
      return this.pilot.Loadout.Gear
    },
    extendedGear() {
      if (this.pilot.has('reserve', 'extended_harness')) return this.pilot.Loadout.ExtendedGear
      return []
    },
    weapons() {
      return this.pilot.Loadout.Weapons
    },
    extendedWeapons() {
      if (this.pilot.has('reserve', 'extended_harness')) return this.pilot.Loadout.ExtendedWeapons
      return []
    },
  },
  methods: {
    exotics(type: string) {
      return this.pilot.SpecialEquipment.filter(x => x.ItemType === type)
    },
    setArmor(a: PilotArmor | null) {
      this.$set(this.pilot.Loadout.Armor, 0, a)
      this.pilot.Heal()
    },
    setWeapon(w: PilotWeapon | null, idx: number, extended: boolean) {
      const weaponArray = extended ? this.pilot.Loadout.ExtendedWeapons : this.pilot.Loadout.Weapons
      this.$set(weaponArray, idx, w)
      this.pilot.Heal()
    },
    setGear(g: PilotGear | null, idx: number, extended: boolean) {
      const gearArray = extended ? this.pilot.Loadout.ExtendedGear : this.pilot.Loadout.Gear
      this.$set(gearArray, idx, g)
      this.pilot.Heal()
    },
  },
})
</script>
