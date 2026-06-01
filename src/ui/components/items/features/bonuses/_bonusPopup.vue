<template>
  <v-menu location="top"
    open-on-hover
    max-width="500">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        color="exotic"
        :icon="bonus.Icon" />
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
              {{ bonus.Title }}
            </div>
          </div>
        </v-toolbar>
      </template>
      <bonus-base :bonus="bonus" />
    </cc-panel>
  </v-menu>
</template>

<script setup lang="ts">
import BonusBase from './_bonusBase.vue'
import type { Bonus } from '@/classes/components/feature/bonus/Bonus'

const props = defineProps<{
  bonus: Bonus
  tier?: number
}>()
</script>
