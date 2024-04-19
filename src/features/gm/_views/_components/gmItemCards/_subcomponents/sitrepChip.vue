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

<script lang="ts">
export default {
  name: 'sitrep-chip',
  props: {
    sitrep: { type: Object, required: true },
    size: { type: String, default: 'x-small' },
  },
};
</script>
