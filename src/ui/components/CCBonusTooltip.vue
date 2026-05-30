<template>
  <div v-if="bonuses.length">
    <div v-for="(bonus, bi) in bonuses"
      :key="`bonus-${bi}`"
      class="text-right">
      <v-menu open-on-hover>
        <template #activator="{ props }">
          <v-icon v-bind="props"
            :icon="bonus.Icon"
            color="exotic"
            :style="`position: absolute; bottom: 0; right: ${rightOffset}px`" />
        </template>
        <v-card>
          <v-toolbar density="compact"
            color="exotic"
            height="46">
            <div class="heading h4 px-2">
              <v-icon start
                :icon="bonus.Icon" />
              {{ bonus.Title }}
            </div>
          </v-toolbar>
          <v-card-text class="pt-1 pb-3">
            <div>
              {{ bonus.Detail }}
            </div>
            <div class="text-right text-disabled">
              <i>From {{ bonus.Source }}</i>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bonus } from '@/classes/components/feature/bonus/Bonus';

const props = withDefaults(defineProps<{
  bonuses: Array<Bonus>
  rightOffset?: number
}>(), {
  rightOffset: 3
})
</script>