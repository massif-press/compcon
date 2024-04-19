<template>
  <v-menu open-on-hover open-delay="800">
    <template #activator="{ props }">
      <v-chip v-bind="props" :size="size" class="mx-1" color="warning">
        {{ environment.Name }}
      </v-chip>
    </template>
    <v-card>
      <v-card-text>
        <cc-environment-display :environment="environment" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'environment-chip',
  props: {
    environment: { type: Object, required: true },
    size: { type: String, default: 'x-small' },
  },
};
</script>
