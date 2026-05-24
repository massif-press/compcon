<template>
  <info-card-base :item="item"
    :notes="notes"
    :charts="charts">
    <v-row justify="center"
      align="center"
      class="mt-n5">
      <v-col v-for="n in item.MaxRank"
        :key="`rank-${n}`"
        v-show="item.Unlocks[n - 1].length"
        cols="4">
        <div class="text-center">
          <p class="pt-1 mb-1">
            <span class="stat-text text-disabled text--darken-1"> RANK {{ 'I'.repeat(n) }} </span>
          </p>
          <div v-for="i in item.Unlocks[n - 1]"
            :key="i.ID">
            <cc-item-modal :item="i"
              class="ma-1" />
          </div>
        </div>
      </v-col>
    </v-row>
  </info-card-base>
</template>

<script setup lang="ts">
import { License } from '@/classes/pilot/components';
import InfoCardBase from './_InfoCardBase.vue'

defineProps<{
  item: License
  notes?: boolean
  smallTags?: boolean
  dense?: boolean
  charts?: boolean
  collapseActions?: boolean
  tier?: number
}>()
</script>
