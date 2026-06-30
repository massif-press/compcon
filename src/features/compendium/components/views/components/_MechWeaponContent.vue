<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <v-row no-gutters justify="space-around" align="center" class="text-text">
        <v-col v-if="item.Damage && item.Damage[0]" cols="auto">
          <cc-damage-element :damage="item.Damage" />
        </v-col>
        <v-col v-if="item.Range" cols="auto">
          <cc-range-element :range="item.Range" />
        </v-col>
      </v-row>
    </template>
    <template #overline>{{ $enum('weaponSize', item.Size) }} {{ item.WeaponTypes.map(t => $enum('weaponType', t)).join('/') }}</template>
  </c-card-base>
</template>

<script setup lang="ts">
import type { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'weapon-card-content' })

const props = defineProps<{
  item: MechWeapon
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()
</script>
