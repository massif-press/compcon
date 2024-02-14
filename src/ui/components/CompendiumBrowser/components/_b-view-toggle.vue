<template>
  <v-btn-toggle
    :value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    mandatory
    divided
    variant="plain"
    border
    color="accent"
    density="compact"
    style="width: 100%; height: 30px"
    class="mb-2">
    <v-tooltip v-for="v in options.views" :text="viewTooltip(v)" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :value="v"
          icon
          size="small"
          :style="`width: ${100 / options.views.length}%`"
          ><v-icon size="25" :icon="viewIcon(v)"
        /></v-btn>
      </template>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script lang="ts">
export default {
  name: 'browser-view-toggle',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    viewIcon(i: string) {
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
    },
    viewTooltip(i: string) {
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
    },
  },
};
</script>
