<template>
  <div v-show="level > 0"
    class="light-panel clipped"
    @click.stop>
    <div class="caption text-stark px-2 py-1">
      WALKING ARMORY//
      <b>SELECTED AMMUNITION</b>
    </div>
    <v-row no-gutters
      class="px-2 mr-4">
      <v-col cols="3">
        <v-select v-model="selected"
          color="accent"
          item-color="accent"
          :item-disabled="(item) => !readonly && item.cost > uses"
          variant="outlined"
          density="compact"
          hide-details
          :items="ammoItems"
          item-text="name"
          return-object
          class="mb-1"
          @change="setSelection($event)" />
      </v-col>
      <v-col v-if="selected.cost"
        class="ml-auto pl-4 pr-3 text-left">
        <div class="text-overline my-n2">COST::AMMO CASE</div>
        <div>
          <v-icon v-for="(n, index) in selected.cost"
            :key="`ammo-${index}`">mdi-hexagon-slice-6</v-icon>
        </div>
      </v-col>
    </v-row>
    <div v-if="selected.effect"
      class="mb-1 py-1">
      <div class="caption px-2 font-weight-bold">EFFECT</div>
      <div class="body-text px-4">{{ selected.effect }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  level: number
  uses?: number
  readonly?: boolean
}>(), {
  level: 0,
  uses: 0
})

const emit = defineEmits<{
  'set-cost': []
  'set-damage': []
}>()

const selected = ref(null)
const allAmmo = ref([
      {
        name: 'Standard',
        cost: 0,
        damage: '',
        effect: '',
      },
      {
        name: 'Thumper',
        cost: 1,
        damage: 'explosive',
        effect: 'This weapon gains Knockback 1 and deals Explosive damage.',
      },
      {
        name: 'Shock',
        cost: 1,
        damage: 'energy',
        effect:
          'This weapon deals Energy damage. Choose one character targeted by your attack; adjacent characters take 1 Energy AP, whether the result is a hit or miss.',
      },
      {
        name: 'Mag',
        cost: 1,
        damage: 'kinetic',
        effect: 'This weapon gains Arcing and deals Kinetic damage.',
      },
      {
        name: 'Hellfire',
        cost: 2,
        damage: 'energy',
        effect: 'This weapon deals Energy damage and deals any bonus damage as Burn.',
      },
      {
        name: 'Jager',
        cost: 2,
        damage: 'explosive',
        effect:
          'This weapon gains Knockback 2, deals Explosive damage, and one character hit by this weapon – your choice – must succeed on a Hull save or be knocked Prone.',
      },
      {
        name: 'Sabot',
        cost: 2,
        damage: 'kinetic',
        effect: 'This weapon gains AP and deals Kinetic damage.',
      },
    ])

selected.value = allAmmo.value[0];

const ammoItems = computed(() => {
      if (props.level < 2) return allAmmo.value.slice(0, 4);
      return allAmmo.value;
    })

function setSelection(ammo) {
      emit('set-cost', ammo.cost);
      emit('set-damage', ammo.damage);
    }
</script>
