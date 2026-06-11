<template>
  <equipment-card-base :item="item">
    <v-row align="center">
      <v-col cols="auto"
        class="text-center">
        <v-icon size="36"
          color="stark"
          icon="cc:weaponmod" />
        <div class="text-cc-overline mt-1">
          {{ $t('ui.card.weapon') }}
          <br />
          {{ $t('ui.card.modification') }}
        </div>
      </v-col>
      <v-col v-if="item.AddedRange && item.AddedRange.length"
        cols="auto"
        align-self="center">
        <cc-range-element :range="item.AddedRange"
          added />
      </v-col>
      <v-divider v-if="item.AddedRange && item.AddedRange.length"
        vertical
        class="mx-4" />
      <v-col v-if="item.AddedDamage && item.AddedDamage.length"
        cols="auto"
        align-self="center">
        <cc-damage-element :damage="item.AddedDamage"
          added />
      </v-col>
      <v-divider v-if="item.AddedDamage && item.AddedDamage.length"
        vertical
        class="mx-4" />
      <v-col v-if="item.SP"
        cols="auto"
        class="text-center">
        <div class="heading"
          style="font-size: 24pt">
          {{ item.SP }}
          <v-icon size="32"
            class="mt-n1 ml-n1"
            icon="cc:system_point" />
        </div>
        <span class="text-overline">{{ $t('ui.card.systemPoints', { plural: item.SP > 1 ? 'S' : '' }) }}</span>
      </v-col>
      <v-col cols="auto"
        class="ml-auto text-right">
        <div v-if="item.Source"
          class="flavor-text text-disabled">{{ item.LicenseString }}</div>
      </v-col>
    </v-row>

    <template #statblock>
      <div class="text-overline mb-n3">{{ $t('ui.card.canBeAppliedTo') }}</div>
      <v-chip-group column>
        <v-chip v-for="a in item.AllowedTypes"
          :key="a"
          size="small"
          tile
          variant="outlined"
          class="text-uppercase">
          {{ a }}
        </v-chip>
        <v-chip v-for="a in item.AllowedSizes"
          :key="a"
          size="small"
          tile
          class="text-uppercase">
          {{ a }}
        </v-chip>
      </v-chip-group>
    </template>
  </equipment-card-base>
</template>

<script setup lang="ts">
import { WeaponMod } from '@/classes/mech/components/equipment/WeaponMod';
import EquipmentCardBase from './_EquipmentCardBase.vue'

defineProps<{
  item: WeaponMod
}>()
</script>
