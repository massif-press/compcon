<template>
  <equipment-card-base :item="item"
    :notes="notes">
    <v-row align="center"
      no-gutters>
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
        <div class="text-cc-overline mt-n1">{{ $t('ui.card.systemPoints', { plural: item.SP > 1 ? 'S' : '' }) }}</div>
      </v-col>
      <v-col v-if="item.LicenseString"
        cols="auto"
        class="ml-auto text-right">
        <div class="heading h3">
          {{ item.Type }}
          <div v-if="item.Source"
            class="flavor-text text-disabled">{{ item.LicenseString }}</div>
        </div>
      </v-col>
    </v-row>
  </equipment-card-base>
</template>

<script setup lang="ts">
import { MechSystem } from '@/classes/mech/components/equipment/MechSystem';
import EquipmentCardBase from './_EquipmentCardBase.vue'

defineProps<{
  item: MechSystem
  notes?: boolean
}>()
</script>
