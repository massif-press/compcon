<template>
  <v-btn-toggle
    v-model="internalValue"
    mandatory
    divided
    variant="plain"
    tile
    border
    color="accent"
    density="compact"
    style="width: 100%; height: 30px"
    class="mb-2">
    <v-tooltip v-for="v in options.views" :key="`view-${v}`" :text="viewTooltip(v)" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :value="v"
          tile
          icon
          size="small"
          :style="`width: ${100 / options.views.length}%`">
          <v-icon size="25" :icon="viewIcon(v)" />
        </v-btn>
      </template>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'browser-view-toggle' })

const props = defineProps<{
  modelValue: string
  options: object
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

function viewIcon(i: string) {
      switch (i) {
        case 'single':
          return 'mdi-card-bulleted-outline';
        case 'list':
          return 'mdi-view-list';
        case 'table':
          return 'mdi-table';
        case 'cards':
          return 'mdi-view-grid';
        case 'scatter':
          return 'mdi-chart-scatter-plot';
        case 'bar':
          return 'mdi-chart-bar';
        case 'compare':
          return 'mdi-compare';
        default:
          return '';
      }
    }
function viewTooltip(i: string) {
      switch (i) {
        case 'single':
          return 'Single View';
        case 'list':
          return 'List View';
        case 'table':
          return 'Table View';
        case 'cards':
          return 'Card View';
        case 'scatter':
          return 'Scatter View';
        case 'bar':
          return 'Chart View';
        case 'compare':
          return 'Comparison View';
        default:
          return '';
      }
    }
</script>
