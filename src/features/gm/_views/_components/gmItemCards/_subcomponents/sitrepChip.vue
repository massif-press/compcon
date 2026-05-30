<template>
  <v-menu open-on-hover open-delay="800">
    <template #activator="{ props }">
      <v-chip v-bind="props" :size="size" class="mx-1">{{ sitrep.Name }}</v-chip>
    </template>
    <v-card>
      <v-card-text>
        <cc-sitrep-display :sitrep="sitrep" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import CCSitrepDisplay from '@/ui/components/CCSitrepDisplay.vue'
defineOptions({ name: 'sitrep-chip' })

const props = withDefaults(defineProps<{
  sitrep: object
  size?: string
}>(), {
  size: 'x-small'
})
</script>
