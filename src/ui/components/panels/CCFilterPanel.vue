<template>
  <div :style="display.mdAndDown.value ? 'z-index:2; position: fixed; bottom: 28px; right: 28px' : ''">
    <v-badge :value="filterCount"
      overlap
      right
      color="secondary">
      <template #badge>
        <b>{{ filterCount }}</b>
      </template>

      <v-btn icon
        size="small"
        color="primary"
        @click="panel = !panel">
        <v-icon dark>mdi-filter-variant</v-icon>
      </v-btn>
    </v-badge>
  </div>

  <v-navigation-drawer v-model="panel"
    location="bottom"
    temporary>
    <v-sheet>
      <cc-titlebar dark
        icon="mdi-filter-variant">Set Item Filters</cc-titlebar>
      <v-card-text>
        <cc-item-filter ref="controls"
          :item-type="itemType"
          :active-filters="activeFilters"
          @set-filters="applyFilters($event)" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text
          @click="panel = false">dismiss</v-btn>
        <v-spacer />
        <cc-button color="accent"
          class="mr-3"
          @click="clearFilters">clear all</cc-button>
      </v-card-actions>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();

defineProps<{
  itemType: string;
}>();

const emit = defineEmits<{
  'set-filters': [filters: Record<string, unknown>];
}>();

const filterCount = ref(0);
const panel = ref(false);
const activeFilters = ref<Record<string, unknown>>({});
const controls = ref<{ clear(): void } | null>(null);

function clearFilters() {
  controls.value?.clear();
  applyFilters({});
}

function applyFilters(newFilters: Record<string, unknown>) {
  filterCount.value = Object.keys(newFilters).length;
  activeFilters.value = newFilters;
  emit('set-filters', newFilters);
}
</script>
