<template>
  <v-row dense>
    <v-col>
      <div class="my-1 d-flex align-center">
        <v-tooltip location="top"
          open-delay="300">
          <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps"
              color="panel"
              flat
              tile
              size="small"
              @click="setSort('Updated')">
              <v-icon icon="mdi-clock-outline"
                size="20"
                color="accent" />
              <v-icon v-if="sort === 'Updated'"
                color="accent"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
                class="mb-n1" />
            </v-btn>
          </template>
          <span>{{ $t('active.sortBar.sortByRecent') }}</span>
        </v-tooltip>

        <v-tooltip location="top"
          open-delay="300">
          <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps"
              color="panel"
              flat
              tile
              size="small"
              @click="setSort('Name')">
              <v-icon icon="mdi-format-text-variant"
                size="24"
                color="accent" />
              <v-icon v-if="sort === 'Name'"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
                class="mb-n1"
                color="accent" />
            </v-btn>
          </template>
          <span>{{ $t('pm.sheet.sortByName') }}</span>
        </v-tooltip>

        <v-tooltip location="top"
          open-delay="300">
          <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps"
              color="panel"
              flat
              tile
              size="small"
              @click="setSort('Created')">
              <v-icon icon="mdi-calendar"
                size="21"
                color="accent" />
              <v-icon v-if="sort === 'Created'"
                color="accent"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
                class="mb-n1" />
            </v-btn>
          </template>
          <span>{{ $t('active.sortBar.sortByCreated') }}</span>
        </v-tooltip>
      </div>
    </v-col>
    <v-col cols="auto">
      <active-mode-organizer :items="items"
        :archived-items="archivedItems"
        :columns="columns"
        :noun="noun"
        :title="title"
        @archive="$emit('archive', $event)"
        @delete="$emit('delete', $event)" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ActiveModeOrganizer from './ActiveModeOrganizer.vue';

const props = defineProps<{
  sort: string;
  asc: boolean;
  items: any[];
  archivedItems?: any[];
  columns: any[];
  noun: string;
  title: string;
}>();

const emit = defineEmits<{
  'update:sort': [value: string];
  'update:asc': [value: boolean];
  archive: [ids: string[]];
  delete: [ids: string[]];
}>();

function setSort(key: string) {
  if (props.sort === key) {
    emit('update:asc', !props.asc);
  } else {
    emit('update:sort', key);
    emit('update:asc', true);
  }
}
</script>
