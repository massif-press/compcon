<template>
  <v-list slim
    density="compact">
    <v-list-item v-for="(bonus, index) in bonuses"
      :key="`bonus-${index}`"
      :title="bonus.Detail">
      <div class="text-right text-disabled text-caption">
        <i>{{ $t('ui.combat.fromOrigin', { name: bonus.Source }) }}</i>
      </div>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { Bonus } from '@/classes/components/feature/bonus/Bonus'
defineProps<{
  bonuses: Bonus[]
  tier?: number
}>()
</script>
