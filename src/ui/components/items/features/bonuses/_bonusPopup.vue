<template>
  <v-menu location="top"
    open-on-hover
    max-width="500">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        color="exotic"
        :icon="bonuses[0].Icon" />
    </template>
    <cc-panel tile
      color="surface"
      density="no-gutters">
      <template #toolbar>
        <v-toolbar density="compact"
          color="exotic"
          height="54">
          <div class="px-3 pt-1">
            <div class="text-cc-overline text-disabled">
              {{ $t('ui.widget.bonus') }}
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

defineProps<{
  bonuses: Bonus[]
  tier?: number
}>()
</script>
