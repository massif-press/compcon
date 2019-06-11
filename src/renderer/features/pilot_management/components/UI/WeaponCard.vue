<template>
  <v-card flat :color="tableItem ? '' : '#373737'">
    <v-card-text class="pb-0 pt-0">
      <div class="pt-2">
        <em v-if="!item.License">
          {{ item.Source }}
          <br />
        </em>
        <em v-else>
          {{ item.Source }} {{ item.License }}, RANK
          <span v-for="n in item.LicenseLevel" :key="n">I</span>
          <br />
        </em>
      </div>
      <b>
        {{ item.Size }} {{ item.Type }}
        <span v-if="item.SP">({{ item.SP }} SP)</span>
      </b>
      <p v-if="item.Description" v-html="item.Description" class="fluff-text" />
      <damage-element dark :dmg="getDamage()" />
      <range-element :range="getRange()" />
      <p
        v-if="item.Effect"
        v-html="item.Effect"
        class="pl-1 ml-1 pb-1 mb-1 effect-text"
      />
      <v-layout class="pb-2">
        <item-tag
          v-for="(t, index) in item.Tags"
          :key="t.id + index"
          :tagObj="t"
          :pilot="!tableItem ? pilot : null"
        />
        <div v-if="mod && mod.AddedTags" style="display: inline-flex;">
          <item-tag
            v-for="t in mod.AddedTags"
            :key="t.id"
            :tagObj="t"
            :pilot="!tableItem ? pilot : null"
          />
        </div>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement } from './'
import ItemTag from './ItemTag.vue'
import {
  MechWeapon,
  WeaponMod,
  Range,
  Damage,
  RangeType,
  DamageType,
  MechLoadout,
  Tag,
  Pilot,
} from '@/class'

export default Vue.extend({
  name: 'weapon-card',
  props: {
    item: MechWeapon,
    tableItem: Boolean,
    mod: WeaponMod,
    loadout: MechLoadout,
  },
  components: { ItemTag, RangeElement, DamageElement },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
  },
  methods: {
    //TODO: should not be hardcoded
    getRange(): Range[] {
      if (this.tableItem) return this.item.Range
      const w = this.item
      let bonuses = [] as { type: RangeType; val: number }[]
      if (w.Mod && w.Mod.AddedRange)
        bonuses.push({
          type: RangeType.Range,
          val: w.Mod.AddedRange,
        })
      if (this.pilot.has('CoreBonus', 'neurolinked'))
        bonuses.push({
          type: RangeType.Range,
          val: 3,
        })
      if (this.pilot.has('CoreBonus', 'gyges'))
        bonuses.push({
          type: RangeType.Threat,
          val: 1,
        })
      if (
        this.loadout.HasSystem('externalbatteries') &&
        w.Damage[0].Type === DamageType.Energy
      )
        bonuses.push({
          type: RangeType.Range,
          val: 5,
        })
      return Range.AddBonuses(w.Range, bonuses)
    },
    getDamage() {
      if (this.tableItem) return this.item.Damage
      if (this.item.Damage && this.mod && this.mod.AddedDamage)
        return this.item.Damage.concat(this.mod.AddedDamage)
      return this.item.Damage || null
    },
  },
})
</script>
