<template>
  <v-tooltip :open-delay="400"
    location="top"
    max-width="300">
    <template #activator="{ props }">
      <v-card v-bind="props"
        :color="active ? 'primary' : 'panel'"
        class="px-2 py-1 text-center"
        flat
        tile
        @click="$emit('click')">
        <v-icon :icon="status.Icon"
          size="35" />
        <div v-if="mobile"
          class="text-cc-overline">{{ status.Name }}</div>
      </v-card>
    </template>
    <div class="heading h3">{{ status.Name }}</div>
    <v-card v-if="appliedDetail"
      flat
      tile
      class="pa-1 text-center text-cc-overline"
      color="primary">
      {{ appliedDetail }}
    </v-card>
    {{ status.Terse || status.Effects }}
  </v-tooltip>
</template>

<script setup lang="ts">
import type { Status } from '@/classes/Status'
import { useDisplay } from 'vuetify';

defineProps<{
  status: Status;
  active: boolean;
  appliedDetail?: string | null;
}>();

defineEmits<{ click: [] }>();

const { smAndDown: mobile } = useDisplay();
</script>
