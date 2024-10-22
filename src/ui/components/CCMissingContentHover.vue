<template>
  <v-menu v-if="controller && controller.IsUnableToLoad" open-on-hover>
    <template #activator="{ props }">
      <v-icon v-bind="props" color="accent" icon="mdi-alert-rhombus" class="fade-select" />
    </template>
    <v-card>
      <v-alert density="compact" color="error" class="rounded-b-0">
        Missing Content Detected
      </v-alert>
      <cc-missing-content-list :controller="controller" :width="width" />
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cc-brew-info',
  props: {
    controller: {
      type: Object,
    },
    width: {
      type: String,
      default: '100%',
    },
  },
};
</script>
