<template>
  <div class="light-panel clipped" @click.stop>
    <div class="caption stark--text px-2 py-1">
      WALKING ARMORY//
      <b>SELECTED AMMUNITION</b>
    </div>
    <v-row no-gutters class="px-2">
      <v-col>
        <v-select color="accent" outlined dense hide-details :items="ammoItems" />
      </v-col>
      <v-col cols="auto" class="ml-auto pl-8 pr-3">
        <div class="caption">COST</div>
      </v-col>
    </v-row>
    <div class="caption px-2 font-weight-bold">EFFECT</div>
    <div class="body-text px-4">None</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ammo-case-inset',
  data: () => ({
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
      let ammo = ['Standard']
      ammo = ammo.concat(['Thumper', 'Shock', 'Mag'])
      ammo = ammo.concat(['Hellfire', 'Jager'])
      return ammo
    },
  },
})
</script>
