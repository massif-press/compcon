<template>
  <v-menu open-on-hover>
    <template #activator="{ props }">
      <v-avatar v-if="icon"
        v-bind="props"
        size="18"
        color="exotic"
        class="mx-1"
        flat
        style="corner-shape: bevel; border-radius: 0; border-bottom-right-radius: 4px">
        <v-icon size="15"
          :icon="bonuses[0].Icon" />
      </v-avatar>
      <cc-chip v-else
        v-bind="props"
        size="small"
        color="exotic"
        class="mx-1"
        :icon="bonuses[0].Icon"
        :label="bonuses[0].Title" />
    </template>
    <cc-panel tile
      color="surface">
      <template #toolbar>
        <v-toolbar density="compact"
          color="exotic"
          height="54">
          <div class="px-3 pt-1">
            <div class="text-cc-overline text-disabled">
              bonus
              <cc-slashes />
            </div>
            <div class="heading h4 mt-n1">
              {{ bonuses[0].Title }}
            </div>
          </div>
        </v-toolbar>
      </template>
      <bonus-base :bonuses="bonuses" />
    </cc-panel>
  </v-menu>
</template>

<script setup lang="ts">
import BonusBase from './_bonusBase.vue'
import type { Bonus } from '@/classes/components/feature/bonus/Bonus'

withDefaults(defineProps<{
  bonuses: Bonus[]
  icon?: boolean
}>(), {
  icon: false,
})
</script>
