<template>
  <div class="pa-2 mt-n3">
    <div class="text-overline text-primary">EQUIPMENT TAG DETAIL</div>
    <div v-for="t in tags"
      :key="t.ID"
      style="border: 1px solid grey; border-radius: 3px"
      class="px-2 mb-1 no-print-break">
      <div class="text-caption font-weight-bold text-uppercase mb-n1">
        {{ t.Name }}
      </div>
      <div class="caption text-black">
        {{ t.Description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sortBy } from 'lodash-es'
import { CompendiumStore } from '@/stores'

const tags = computed(() =>
  sortBy(CompendiumStore().Tags.filter((x: any) => !x.IsHidden), (obj: any) => obj.Name)
)
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
