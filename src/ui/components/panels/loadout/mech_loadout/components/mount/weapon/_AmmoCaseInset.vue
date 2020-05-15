<template>
  <div v-show="level > 0" class="light-panel clipped" @click.stop>
    <div class="caption stark--text px-2 py-1">
      WALKING ARMORY//
      <b>SELECTED AMMUNITION</b>
    </div>
    <v-row no-gutters class="px-2 mr-4">
      <v-col cols="3">
        <v-select
          v-model="selected"
          color="accent"
          outlined
          dense
          hide-details
          :items="ammoItems"
          item-text="name"
          return-object
          class="mb-1"
        />
      </v-col>
      <v-col v-if="selected.cost" class="ml-auto pl-4 pr-3 text-left">
        <div class="overline">COST::AMMO CASE</div>
        <div>
          <v-icon v-for="n in selected.cost" :key="selected.name + '_ammo_' + n">
            mdi-hexagon-slice-6
          </v-icon>
        </div>
      </v-col>
    </v-row>
    <div v-if="selected.effect" class="mt-1">
      <div class="caption px-2 font-weight-bold">EFFECT</div>
      <div class="body-text px-4">{{ selected.effect }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ammo-case-inset',
  props: {
    level: { type: Number, required: true, default: 0 },
  },
  data: () => ({
    selected: null,
    allAmmo: [
      {
        name: 'Standard',
        cost: 0,
        effect: '',
      },
      {
        name: 'Thumper',
        cost: 1,
        effect: 'This weapon gains Knockback 1 and deals Explosive damage.',
      },
      {
        name: 'Shock',
        cost: 1,
        effect:
          'This weapon deals Energy damage. Choose one character targeted by your attack; adjacent characters take 1 Energy AP, whether the result is a hit or miss.',
      },
      {
        name: 'Mag',
        cost: 1,
        effect: 'This weapon gains Arcing and deals Kinetic damage.',
      },
      {
        name: 'Hellfire',
        cost: 2,
        effect: 'This weapon deals Energy damage and deals any bonus damage as Burn.',
      },
      {
        name: 'Jager',
        cost: 2,
        effect:
          'This weapon gains Knockback 2, deals Explosive damage, and one character hit by this weapon – your choice – must succeed on a Hull save or be knocked Prone.',
      },
      {
        name: 'Sabot',
        cost: 2,
        effect: 'This weapon gains AP and deals Kinetic damage.',
      },
    ],
  }),
  computed: {
    ammoItems() {
      if (this.level < 2) return this.allAmmo.slice(0, 4)
      return this.allAmmo
    },
  },
  created() {
    this.selected = this.allAmmo[0]
  },
})
</script>
