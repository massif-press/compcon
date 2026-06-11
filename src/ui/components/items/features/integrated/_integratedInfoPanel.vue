<template>
  <cc-alert density="compact"
    class="py-1">
    <v-row v-if="item.ItemType === 'MechWeapon'"
      class="text-stark mb-n3"
      no-gutters
      align="center">
      <v-col>
        <v-icon large
          left
          class="mt-n2">cc:weapon</v-icon>
        <span class="heading h3">{{ item.Name }}</span>
      </v-col>
      <v-col cols="auto"
        class="ml-auto">
        <span class="text-overline">{{ $t('ui.widget.integratedMechWeapon') }}</span>
      </v-col>
    </v-row>
    <integrated-info-base :item="item" />
  </cc-alert>
</template>

<script setup lang="ts">
import IntegratedInfoBase from './_integratedInfoBase.vue'
import { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';

const props = defineProps<{
  item: MechEquipment
}>()
</script>
